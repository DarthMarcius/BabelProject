"use strict";

module.exports = {
    init(resources) {
        this.mongoose = resources.mongoose;
        this.models = require(__dirname + '/models').defineModels(this.mongoose);
        this.path = resources.path;
        this.passport = resources.passport;
        this.LocalStrategy = resources.LocalStrategy;
        this.bcrypt = resources.bcrypt;
        this.port = resources.port;
        this.io = resources.io;

        this.io.on('connection', (socket) => {
            this.socket = socket;
        });

        this.dbConnect(resources, () => {
            this.initLoginStrategies();
            this.listenToRoutes(resources);
            this.ioListeners(resources);
        });
    },

    ioListeners(resources) {

    },

    initLoginStrategies() {
        let that = this;

        that.passport.use('login', new that.LocalStrategy({
                passReqToCallback : true
            },
            function(req, username, password, done) {
                // check in mongo if a user with username exists or not
                that.models.User.findOne({ 'username' :  username },
                    function(err, user) {
                        // In case of any error, return using the done method
                        if (err)
                            return done(err);
                        // Username does not exist, log error & redirect back
                        if (!user){
                            console.log('User Not Found with username '+username);
                            return done(null, false, { message: 'Incorrect username.' });
                        }
                        // User exists but wrong password, log the error
                        if (!that.isValidPassword(user, password)){
                            console.log('Invalid Password');
                            return done(null, false,
                                { message: 'Incorrect password.' });
                        }
                        // User and password both match, return user from
                        // done method which will be treated like success
                        return done(null, user);
                    }
                );
            })
        );

        that.passport.use('signup', new that.LocalStrategy({
              passReqToCallback : true
            },
            function(req, username, password, done) {
                let findOrCreateUser = function() {
                    // find a user in Mongo with provided username
                    that.models.User.findOne({'username':username}, function(err, user) {
                        // In case of any error return
                        if (err){
                            console.log('Error in SignUp: '+err);
                            return done(err);
                        }
                        // already exists
                        if (user) {
                            console.log('User already exists');
                            return done(null, false, {'message': 'User Already Exists'});
                        } else {
                            // if there is no user with that email
                            // create the user
                            var newUser = new that.models.User();
                            // set the user's local credentials
                            newUser._id = that.mongoose.Types.ObjectId();
                            newUser.username = username;
                            newUser.password = that.createHash(password);

                            // save the user
                            newUser.save(function(err) {
                              if (err){
                                console.log('Error in Saving user: '+err);
                                throw err;
                              }
                              console.log('User Registration succesful');
                              return done(null, newUser);
                            });
                        }
                    });
                };

                // Delay the execution of findOrCreateUser and execute
                // the method in the next tick of the event loop
                process.nextTick(findOrCreateUser);
            })
        );

        that.passport.serializeUser(function(user, done) {
          done(null, user.id);
        });

        that.passport.deserializeUser(function(id, done) {
          that.models.User.findById(id, function(err, user) {
            done(null, user);
          });
        });
    },

    isValidPassword(user, password) {
        return this.bcrypt.compareSync(password, user.password);
    },

    createHash(password){
        return this.bcrypt.hashSync(password, this.bcrypt.genSaltSync(10), null);
    },

    listenToRoutes(resources) {
        var that = this;

        resources.app.engine('handlebars', resources.handlebars({defaultLayout: 'main'}));
        resources.app.set('view engine', 'handlebars');

        resources.app.get('/', (req, res) => {
            res.redirect('/projects');
        });

        resources.app.get('/login', (req, res) => {
            res.render('login', {
                name: "login",
                port: that.port,
                title: "Welcome to issue tracker",
                ifCond(v1, v2, options) {
                    if(v1 === v2) {
                      return options.fn(this);
                    }
                    return options.inverse(this);
                }
            });
        });

        resources.app.get('/logout', function(req, res){
          req.logout();
          res.redirect('/');
        });

        resources.app.get('/register', (req, res) => {
            console.log("rSess", req.session);
            res.render('register', {
                name: "register",
                title: "Register",
                port: that.port,
                ifCond(v1, v2, options) {
                    if(v1 === v2) {
                      return options.fn(this);
                    }
                    return options.inverse(this);
                }
            });
        });

        resources.app.post('/register', this.passport.authenticate('signup'), (req, res) => {
            res.send({
                redirectTo: '/'
            });
        });

        resources.app.post('/login', this.passport.authenticate('login'), (req, res) => {
            res.send({
                redirectTo: '/'
            });
        });

        resources.app.get('/projects', that.loggedIn, (req, res) => {
            res.render('projects', {
                name: "projects-page",
                user: req.user,
                title: "Welcome to issue tracker",
                port: that.port,
                ifCond(v1, v2, options) {
                    if(v1 === v2) {
                      return options.fn(this);
                    }
                    return options.inverse(this);
                }
            });
        });

        resources.app.get('/projectsItems', (req, res) => {
            let projects = this.models.Project.aggregate(
                [
                    {
                        $project: {
                            name: 1,
                            updated: { $dateToString: { format: "%Y-%m-%d", date: "$updated" } },
                            creator: 1,
                            description: 1
                        }
                    }
                ]
            )
            .exec((err, projects) => {
                this.models.Project.populate(projects, {path: "creator"}, (err, projects) => {
                    res.send(projects);
                });
            });
        });

        resources.app.get('/project/:id', that.loggedIn,  (req, res) => {

            this.getProjectItem(req.params.id, (project) => {
                res.render('project', {
                    name: "project-page",
                    user: req.user,
                    title: "Project page",
                    port: that.port,
                    project: project[0],
                    ifCond(v1, v2, options) {
                        if(v1 === v2) {
                          return options.fn(this);
                        }
                        return options.inverse(this);
                    }
                });
            });
        });

        resources.app.get('/issue/:id', that.loggedIn,  (req, res) => {

            this.getIssueItem(req.params.id, (issue) => {

                this.models.Issue.populate(issue, {path: "creator"}, (err, issue) => {
                    res.render('issue', {
                        name: "issue-page",
                        user: req.user,
                        title: "Issue page",
                        port: that.port,
                        issue: issue[0],
                        ifCond(v1, v2, options) {
                            if(v1 === v2) {
                              return options.fn(this);
                            }
                            return options.inverse(this);
                        }
                    });
                });
            });
        });

        resources.app.post("/project", (req, res) => {
            that.addProject(this.models, req, res);
        });

		resources.app.put("/project", (req, res) => {
			that.updateProject(this.models, req, res);
		});

		resources.app.get("/project", (req, res) => {
			that.getProject(this.models, req, res);
		});

		resources.app.get("/projects", (req, res) => {
			that.getProjects(this.models, req, res);
		});

		resources.app.delete("/project", (req, res) => {
			that.removeProject(this.models, req, res);
		});

		resources.app.post("/issue", (req, res) => {
			that.addIssue(this.models, req, res);
		});

		resources.app.put("/issue", (req, res) => {
			that.updateIssue(this.models, req, res);
		});

		resources.app.get("/issue", (req, res) => {
			that.getIssue(this.models, req, res);
		});

		resources.app.get("/issues", (req, res) => {
			that.getIssues(this.models, req, res);
		});

		resources.app.delete("/issue", (req, res) => {
			that.removeIssue(this.models, req, res);
		});

		resources.app.post("/comment", (req, res) => {
            that.addComment(this.models, req, res);
        });

		resources.app.put("/comment", (req, res) => {
            that.updateComment(this.models, req, res);
        });

		resources.app.get("/comments", (req, res) => {
			that.getComments(this.models, req, res);
		});

		resources.app.delete("/comment", (req, res) => {
            that.removeComment(this.models, req, res);
        });

		resources.app.post("/log", (req, res) => {
            that.addLog(this.models, req, res);
        });

		resources.app.put("/log", (req, res) => {
            that.updateLog(this.models, req, res);
        });

		resources.app.get("/logs", (req, res) => {
            that.getLogs(this.models, req, res);
        });

		resources.app.delete("/log", (req, res) => {
            that.removeLog(this.models, req, res);
        });
    },

    getProjectItem(id, callback) {
        let projects = this.models.Project.aggregate(
            [
                {
                    $match : { _id : this.mongoose.Types.ObjectId(id) }
                },

                {
                    $project: {
                        name: 1,
                        updated: { $dateToString: { format: "%Y-%m-%d", date: "$updated" } },
                        creator: 1,
                        description: 1
                    }
                }
            ]
        )
        .exec((err, project) => {
            this.models.Project.populate(project, {path: "creator"}, (err, project) => {
                callback(project);
            });
        });
    },

    getIssueItem(id, callback) {
        let projects = this.models.Issue.aggregate(
            [
                {
                    $match : { _id : this.mongoose.Types.ObjectId(id) }
                },

                /*{
                    $lookup: {from: 'users', localField: 'creator', foreignField: '_id', as: 'creator'}
                },

                {
                    $lookup: {from: 'projects', localField: 'project', foreignField: '_id', as: 'project'}
                },*/

                /*{
                    $lookup: {from: 'comments', localField: '_id', foreignField: 'issue_id', as: 'comments'}
                },

                {
                    $lookup: {from: 'logs', localField: '_id', foreignField: 'issue_id', as: 'logs'}
                },

                { $unwind : "$creator" },

                { $unwind : "$project" },
*/
                {
                    $project: {
                        name: 1,
                        updated: { $dateToString: { format: "%Y-%m-%d", date: "$updated" } },
                        creator: 1,
                        description: 1,
                        project: 1,
                        comments: 1,
                        logs: 1,
                        originalEstimateMinutes: 1,
                        realEstimateMinutes: 1
                    }
                }
            ]
        )
        .exec((err, issue) => {
            callback(issue);
        });
    },

    loggedIn(req, res, next) {
        if (req.user || req.url == '/login') {
            next();
        } else {
            res.redirect('/login');
        }
    },

    dbConnect(resources, callback) {
        var that = this;
        resources.mongoose.connect(resources.mongoConnectionURL);
        var db = resources.mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
          callback(db, that.models);
        });
    },

    addProject(models, req, res) {
        let project = new models.Project({
            name: req.body.name,
            creator: req.body.creator,
            description: req.body.description
        });

        project.save((err, user) => {
            console.log(err)
            if (err) {
                res.status(400).send('Bad Request:' + err);
            }else {
                res.send({
                    status: "ok"
                });
                this.socket.emit('updateProjects', {});
            }
        });
    },

	updateProject(models, req, res) {
        models.Project.findById(req.body.projectId, (err, project) => {
            if (err) {
                res.status(400).send('Error fetching project:' + err);
                return;
            }

            project.name = req.body.name;
            project.description = req.body.description;

            project.save((err) => {
                if (err) {
                    res.status(400).send('Error updating project:' + err);
                }else {
                    res.status(200).send({
                        status: "ok"
                    });
                    this.socket.emit('updateProjects', {});
                }
            });
        });
    },

	getProject(models, req, res) {

	},

	getProjects(models, req, res) {

	},

	removeProject(models, req, res) {
        console.log("md", req.body)
        models.Project.remove({"_id": req.body.projectId}, (err) => {
            if (!err) {
                res.status(200).send({
                    message: "ok"
                });
                this.socket.emit('updateProjects', {});
            }
            else {
                res.status(400).send({
                    message: "Error removing prject"
                });
            }
        });
	},

    addIssue(models, req, res) {
        console.log(req.body)

        let issue = new models.Issue({
            project: req.body.project,
            name: req.body.name,
            creator: req.body.creator,
            description: req.body.description,
            originalEstimateMinutes: req.body.originalEstimate,
            realEstimateMinutes: req.body.originalEstimate
        });

        issue.save((err, user) => {
            console.log(err)
            if (err) {
                res.status(400).send('Bad Request:' + err);
            }else {
                res.send({
                    status: "ok"
                });
                this.socket.emit('updateIssues', {
                    project: req.body.project
                });
            }
        });
    },

	updateIssue(models, req, res) {
        models.Issue.findById(req.body.issueId, (err, issue) => {
            if (err) {
                res.status(400).send('Error fetching issue:' + err);
                return;
            }

            issue.name = req.body.name;
            issue.description = req.body.description;

            issue.save((err) => {
                if (err) {
                    res.status(400).send('Error updating issue:' + err);
                }else {
                    res.status(200).send({
                        status: "ok"
                    });
                    this.socket.emit('updateIssues', {
                        project: req.body.project
                    });
                }
            });
        });
    },

	getIssues(models, req, res) {
        let issues = this.models.Issue.aggregate(
            [
                {
                    $match : { project : this.mongoose.Types.ObjectId(req.query.projectId) }
                },

                /*{
                    $lookup: {from: 'users', localField: 'creator', foreignField: '_id', as: 'creator'}
                },

                { $unwind : "$creator" },*/

                {
                    $project: {
                        name: 1,
                        updated: { $dateToString: { format: "%Y-%m-%d", date: "$updated" } },
                        creator: 1,
                        description: 1
                    }
                }
            ]
        )
        .exec((err, issues) => {
            this.models.Issue.populate(issues, {path: "creator"}, (err, issues) => {
                res.send(issues);
            });
        });
    },

	removeIssue(models, req, res) {
        models.Issue.remove({"_id": req.body.issuetId}, (err) => {
            if (!err) {
                res.status(200).send({
                    message: "ok"
                });
                this.socket.emit('updateIssues', {
                    project: req.body.project
                });
            }
            else {
                res.status(400).send({
                    message: "Error removing issue"
                });
            }
        });
    },

    addComment(models, req, res) {
        console.log(req.body)

        let comment = new models.Comment({
            creator: req.body.creator,
            text: req.body.text,
            issue_id: req.body.issueId
        });

        comment.save((err, user) => {
            console.log(err)
            if (err) {
                res.status(400).send('Bad Request:' + err);
            }else {
                res.send({
                    status: "ok"
                });
                this.socket.emit('updateComments', {
                    issue: req.body.issueId
                });
            }
        });
    },

	updateComment(models, req, res) {
        models.Comment.findById(req.body.commentId, (err, comment) => {
            if (err) {
                res.status(400).send('Error fetching comment:' + err);
                return;
            }

            comment.text = req.body.text;

            comment.save((err) => {
                if (err) {
                    res.status(400).send('Error updating comment:' + err);
                }else {
                    res.status(200).send({
                        status: "ok"
                    });
                    this.socket.emit('updateComments', {
                        issue: req.body.issueId
                    });
                }
            });
        });
	},

	getComments(models, req, res) {
        this.models.Comment.aggregate(
            [
                {
                    $match : { issue_id : this.mongoose.Types.ObjectId(req.query.issueId) }
                },

                {
                    $project: {
                        creator: 1,
                        updated: 1,
                        text: 1
                    }
                }
            ]
        ).exec((err, comments) => {
            this.models.Comment.populate(comments, {path: "creator"}, (err, comments) => {
                res.send(comments);
            });
        });
	},

	removeComment(models, req, res) {
        console.log(req.body)
        models.Comment.remove({"_id": req.body.commentId}, (err) => {
            if (!err) {
                res.status(200).send({
                    message: "ok"
                });
                this.socket.emit('updateComments', {
                    issue: req.body.issueId
                });
            }
            else {
                res.status(400).send({
                    message: "Error removing comment"
                });
            }
        });
	},

    addLog(models, req, res) {
        let log = new models.Log({
            creator: req.body.creator,
            text: req.body.text,
            issue_id: req.body.issueId,
            dateStarted: new Date(req.body.logDateTime),
            timeSpent:  req.body.estimatedMinutes
        });

        log.save((err, user) => {
            console.log(err)
            if (err) {
                res.status(400).send('Bad Request:' + err);
            }else {
                res.send({
                    status: "ok"
                });
                this.socket.emit('updateWorkLogs', {
                    issue: req.body.issueId
                });
            }
        });
    },

	updateLog(models, req, res) {
        console.log(req.body)
        models.Log.findById(req.body.worklogId, (err, worklog) => {
            if (err) {
                res.status(400).send('Error fetching worklog:' + err);
                return;
            }

            worklog.text = req.body.text;
            worklog.dateStarted = new Date(req.body.logDateTime);
            worklog.timeSpent=   req.body.estimatedMinutes;

            worklog.save((err) => {
                if (err) {
                    res.status(400).send('Error updating comment:' + err);
                }else {
                    res.status(200).send({
                        status: "ok"
                    });
                    this.socket.emit('updateWorkLogs', {
                        issue: req.body.issueId
                    });
                }
            });
        });
	},

	getLog(models, req, res) {

	},

	getLogs(models, req, res) {
        this.models.Log.aggregate(
            [
                {
                    $match : { issue_id : this.mongoose.Types.ObjectId(req.query.issueId) }
                },

                {
                    $project: {
                        creator: 1,
                        dateStarted: 1,
                        text: 1,
                        timeSpent: 1
                    }
                }
            ]
        ).exec((err, comments) => {
            this.models.Comment.populate(comments, {path: "creator"}, (err, comments) => {
                res.send(comments);
            });
        });
	},

	removeLog(models, req, res) {
        console.log(req.body)
        models.Log.remove({"_id": req.body.worklogId}, (err) => {
            if (!err) {
                res.status(200).send({
                    message: "ok"
                });
                this.socket.emit('updateWorkLogs', {
                    issue: req.body.issueId
                });
            }
            else {
                res.status(400).send({
                    message: "Error removing worklog"
                });
            }
        });
	}
}
