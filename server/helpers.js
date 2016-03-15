module.exports = {
    listenToRoutes(resources) {
        var that = this;
        resources.app.engine('handlebars', resources.handlebars({defaultLayout: 'main'}));
        resources.app.set('view engine', 'handlebars');

        resources.app.get('/', (req, res) => {
            res.render('home', {
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

        resources.app.post("/project", (req, res) => {
            that.dbConnect(resources, (db) => {
                that.addProject(db, res, req.body);
            });
        });

		resources.app.put("/project", (req, res) => {
			that.dbConnect(resources, (db) => {
				that.updateProject(db, res, req.body);
			});
		});

		resources.app.get("/project", (req, res) => {
			that.dbConnect(resources, (db) => {
				that.getProject(db, res, req.body);
			});
		});

		resources.app.get("/projects", (req, res) => {
			that.dbConnect(resources, (db) => {
				that.getProjects(db, res, req.body);
			});
		});

		resources.app.delete("/project", (req, res) => {
			that.dbConnect(resources, (db) => {
				that.removeProject(db, res, req.body);
			});
		});

		resources.app.post("/issue", (req, res) => {
			that.dbConnect(resources, (db) => {
				that.addIssue(db, res, req.body);
			});
		});

		resources.app.put("/issue", (req, res) => {
			that.dbConnect(resources, (db) => {
				that.updateIssue(db, res, req.body);
			});
		});

		resources.app.get("/issue", (req, res) => {
			that.dbConnect(resources, (db) => {
				that.getIssue(db, res, req.body);
			});
		});

		resources.app.get("/issues", (req, res) => {
			that.dbConnect(resources, (db) => {
				that.getIssues(db, res, req.body);
			});
		});

		resources.app.delete("/issue", (req, res) => {
			that.dbConnect(resources, (db) => {
				that.removeIssue(db, res, req.body);
			});
		});

		resources.app.post("/comment", (req, res) => {
            that.dbConnect(resources, (db) => {
                that.addComment(db, res, req.body);
            });
        });

		resources.app.put("/comment", (req, res) => {
            that.dbConnect(resources, (db) => {
                that.updateComment(db, res, req.body);
            });
        });

		resources.app.get("/comment", (req, res) => {
            that.dbConnect(resources, (db) => {
                that.getComment(db, res, req.body);
            });
        });

		resources.app.get("/comments", (req, res) => {
			that.dbConnect(resources, (db) => {
				that.getComments(db, res, req.body);
			});
		});

		resources.app.delete("/comment", (req, res) => {
            that.dbConnect(resources, (db) => {
                that.removeComment(db, res, req.body);
            });
        });

		resources.app.post("/log", (req, res) => {
            that.dbConnect(resources, (db) => {
                that.addLog(db, res, req.body);
            });
        });

		resources.app.put("/log", (req, res) => {
            that.dbConnect(resources, (db) => {
                that.updateLog(db, res, req.body);
            });
        });

		resources.app.get("/logs", (req, res) => {
            that.dbConnect(resources, (db) => {
                that.getLogs(db, res, req.body);
            });
        });

		resources.app.delete("/log", (req, res) => {
            that.dbConnect(resources, (db) => {
                that.removeLog(db, res, req.body);
            });
        });
    },

    dbConnect(resources, callback) {
        resources.MongoClient.connect(resources.mongoConnectionURL, function(err, db) {
            console.log("Connected correctly to server");
            callback(db);
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
