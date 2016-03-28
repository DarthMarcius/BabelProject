"use strict";

module.exports = {
    init(resources) {
        var that = this;

        that.mongoose = resources.mongoose;
        that.models = require(__dirname + '/models').defineModels(that.mongoose);
        that.path = resources.path;
        that.passport = resources.passport;
        that.LocalStrategy = resources.LocalStrategy;
        that.bcrypt = resources.bcrypt;
        that.port= resources.port;

        that.dbConnect(resources, () => {
            that.initLoginStrategies();
            that.listenToRoutes(resources);
            that.ioListeners(resources);
        });
    },

    ioListeners(resources) {
        resources.io.on('connection', (socket) => {

        });
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
                name: "homepage",
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

        resources.app.get('project/:id', that.loggedIn,  (req, res) => {

        });

        resources.app.get('issue/:id', that.loggedIn,  (req, res) => {

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

		resources.app.get("/comment", (req, res) => {
            that.getComment(this.models, req, res);
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
        console.log(req.body);

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
            }

        });

        /**/
    },

	updateProject(models, req, res) {

    },

	getProject(models, req, res) {

	},

	getProjects(models, req, res) {

	},

	removeProject(models, req, res) {

	},

    addIssue(models, req, res) {

    },

	updateIssue(models, req, res) {

    },

	getIssue(models, req, res) {

    },

	getIssues(models, req, res) {

    },

	removeIssue(models, req, res) {

    },

    addComment(models, req, res) {

    },

	updateComment(models, req, res) {

	},

	getComment(models, req, res) {

	},

	getComments(models, req, res) {

	},

	removeComment(models, req, res) {

	},

    addLog(models, req, res) {

    },

	updateLog(models, req, res) {

	},

	getLog(models, req, res) {

	},

	getLogs(models, req, res) {

	},

	removeLog(models, req, res) {

	}
}
