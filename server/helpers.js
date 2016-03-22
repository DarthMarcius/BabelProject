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
        that.dbConnect(resources, () => {
            that.initLoginStrategies();
        });

        that.listenToRoutes(resources);
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

        that.passport.serializeUser(function(user, done) {console.log("ser")
          done(null, user.id);
        });

        that.passport.deserializeUser(function(id, done) {
          that.User.findById(id, function(err, user) {
            done(err, user);
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
                title: "Welcome to issue tracker",
                ifCond(v1, v2, options) {
                    if(v1 === v2) {
                      return options.fn(this);
                    }
                    return options.inverse(this);
                }
            });
        });

        resources.app.get('/register', (req, res) => {
            res.render('register', {
                name: "register",
                title: "Register",
                ifCond(v1, v2, options) {
                    if(v1 === v2) {
                      return options.fn(this);
                    }
                    return options.inverse(this);
                }
            });
        });

        resources.app.post('/register', this.passport.authenticate('signup'), (req, res) => {
            console.log("registred");
        });

        resources.app.post('/login', this.passport.authenticate('login'), (req, res) => {
            console.log("lava", req.user);

        });

        resources.app.get('/projects', that.loggedIn, (req, res) => {
            res.render('projects', {
                name: "homepage",
                title: "Welcome to issue tracker",
                ifCond(v1, v2, options) {
                    if(v1 === v2) {
                      return options.fn(this);
                    }
                    return options.inverse(this);
                }
            });
        });

        resources.app.get('issue/:id', that.loggedIn,  (req, res) => {

        });

        resources.app.post("/project", (req, res) => {
            that.dbConnect(resources, (db, models) => {
                that.addProject(db, res, req.body);
            });
        });

		resources.app.put("/project", (req, res) => {
			that.dbConnect(resources, (db, models) => {
				that.updateProject(db, res, req.body);
			});
		});

		resources.app.get("/project", (req, res) => {
			that.dbConnect(resources, (db, models) => {
				that.getProject(db, res, req.body);
			});
		});

		resources.app.get("/projects", (req, res) => {
			that.dbConnect(resources, (db, models) => {
				that.getProjects(db, res, req.body);
			});
		});

		resources.app.delete("/project", (req, res) => {
			that.dbConnect(resources, (db, models) => {
				that.removeProject(db, res, req.body);
			});
		});

		resources.app.post("/issue", (req, res) => {
			that.dbConnect(resources, (db, models) => {
				that.addIssue(db, res, req.body);
			});
		});

		resources.app.put("/issue", (req, res) => {
			that.dbConnect(resources, (db, models) => {
				that.updateIssue(db, res, req.body);
			});
		});

		resources.app.get("/issue", (req, res) => {
			that.dbConnect(resources, (db, models) => {
				that.getIssue(db, res, req.body);
			});
		});

		resources.app.get("/issues", (req, res) => {
			that.dbConnect(resources, (db, models) => {
				that.getIssues(db, res, req.body);
			});
		});

		resources.app.delete("/issue", (req, res) => {
			that.dbConnect(resources, (db, models) => {
				that.removeIssue(db, res, req.body);
			});
		});

		resources.app.post("/comment", (req, res) => {
            that.dbConnect(resources, (db, models) => {
                that.addComment(db, res, req.body);
            });
        });

		resources.app.put("/comment", (req, res) => {
            that.dbConnect(resources, (db, models) => {
                that.updateComment(db, res, req.body);
            });
        });

		resources.app.get("/comment", (req, res) => {
            that.dbConnect(resources, (db, models) => {
                that.getComment(db, res, req.body);
            });
        });

		resources.app.get("/comments", (req, res) => {
			that.dbConnect(resources, (db, models) => {
				that.getComments(db, res, req.body);
			});
		});

		resources.app.delete("/comment", (req, res) => {
            that.dbConnect(resources, (db, models) => {
                that.removeComment(db, res, req.body);
            });
        });

		resources.app.post("/log", (req, res) => {
            that.dbConnect(resources, (db, models) => {
                that.addLog(db, res, req.body);
            });
        });

		resources.app.put("/log", (req, res) => {
            that.dbConnect(resources, (db, models) => {
                that.updateLog(db, res, req.body);
            });
        });

		resources.app.get("/logs", (req, res) => {
            that.dbConnect(resources, (db, models) => {
                that.getLogs(db, res, req.body);
            });
        });

		resources.app.delete("/log", (req, res) => {
            that.dbConnect(resources, (db, models) => {
                that.removeLog(db, res, req.body);
            });
        });
    },

    loggedIn(req, res, next) {
        console.log(req.user)
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

    addProject(db, res, data) {
        console.log(data.projectName)
    },

	updateProject(db, res, data) {

    },

	getProject(db, res, data) {

	},

	getProjects(db, res, data) {

	},

	removeProject(db, res, data) {

	},

    addIssue(db, res, data) {

    },

	updateIssue(db, res, data) {

    },

	getIssue(db, res, data) {

    },

	getIssues(db, res, data) {

    },

	removeIssue(db, res, data) {

    },

    addComment(db, res, data) {

    },

	updateComment(db, res, data) {

	},

	getComment(db, res, data) {

	},

	getComments(db, res, data) {

	},

	removeComment(db, res, data) {

	},

    addLog(db, res, data) {

    },

	updateLog(db, res, data) {

	},

	getLog(db, res, data) {

	},

	getLogs(db, res, data) {

	},

	removeLog(db, res, data) {

	}
}
