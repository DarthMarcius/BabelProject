(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IssueTracker = (function () {
    function IssueTracker() {
        _classCallCheck(this, IssueTracker);

        var ioPath = 'http://localhost:' + window.resources.port;
        this.socket = io(ioPath);
        this.initCache();
        this.setListeners();
    }

    _createClass(IssueTracker, [{
        key: "initCache",
        value: function initCache() {
            this.createProjectButton = $(".add-project").length ? $(".add-project") : false;
            this.createProjectModal = $("#addProjectModal").length ? $("#addProjectModal") : false;
            this.loginForm = $(".login-form").length ? $(".login-form") : false;
            this.loginErrorModal = $("#LoginErrorModal");
            this.registerForm = $(".register-form").length ? $(".register-form") : false;
            this.registerErrorModal = $("#RegistrationErrorModal");
            this.addNewProjectForm = $("#addNewProject").length ? $("#addNewProject") : false;
            this.projectsPage = $(".projects-page").length ? $(".projects-page") : false;
            this.projectsSection = $(".projects-section");
            this.projectEditSelector = ".project-edit";
            this.projectDeleteSelector = ".project-delete";
            this.deleteProjectFormSelector = "#deleteProject";
            this.updateProjectFormSelector = "#updateProject";
            this.projectPage = $(".project-page").length ? $(".project-page") : false;
            this.addIssue = $(".add-issue");
            this.addIssueForm = $("#addNewIssue").length ? $("#addNewIssue") : false;
        }
    }, {
        key: "login",
        value: function login($target) {
            var _this = this;

            var data = $target.serialize();
            /*let name = data[0].value;
            let password = data[1].value;*/
            var loginPromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/login",
                    method: "POST",
                    data: data
                });

                request.done(function (data) {
                    resolve(data);
                });

                request.fail(function (jqXHR, textStatus) {
                    reject(jqXHR, textStatus);
                });
            });

            loginPromise.then(function (data) {
                window.location = data.redirectTo;
            }).catch(function (jqXHR, textStatus) {
                _this.loginErrorModal.modal();
            });
        }
    }, {
        key: "register",
        value: function register($target) {
            var _this2 = this;

            var data = $target.serialize();
            /*let name = data[0].value;
            let password = data[1].value;*/
            var registerPromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/register",
                    method: "POST",
                    data: data
                });

                request.done(function (data) {
                    resolve(data);
                });

                request.fail(function (jqXHR, textStatus) {
                    reject(jqXHR, textStatus);
                });
            });

            registerPromise.then(function (data) {
                console.log("success reg:", data);
                window.location = data.redirectTo;
            }).catch(function (jqXHR, textStatus) {
                console.log("login error", jqXHR, textStatus);
                _this2.registerErrorModal.modal();
            });
        }
    }, {
        key: "setListeners",
        value: function setListeners() {
            var _this3 = this;

            this.loginAndRegisterListeners();
            this.projectsListeners();

            $(window).load(function () {
                if (_this3.projectsPage) {
                    _this3.populateProjectsPage();
                }

                if (_this3.projectPage) {
                    _this3.populateProjectPage();
                }
            });
        }
    }, {
        key: "projectsListeners",
        value: function projectsListeners() {
            var _this4 = this;

            if (this.createProjectButton) {
                this.createProjectButton.on("click", function (ev) {
                    ev.preventDefault();
                    _this4.createProjectModal.modal();
                });
            }

            if (this.addNewProjectForm) {
                this.addNewProjectForm.on('submit', function (ev) {
                    ev.preventDefault();
                    _this4.createProject($(ev.target));
                });
            }

            $("body").on("click", this.projectEditSelector, function (ev) {
                ev.stopPropagation();
                var $parent = $(ev.target).closest("tr");
                var projectId = $parent.attr("data-project-id");
                var projectName = $parent.find(".pr-name").html();
                var projectDescription = $parent.find(".pr-description").html();

                $("#editProjectModal").modal();
                $("#updatee-project-id").val(projectId);
                $("#new-project-name").val(projectName);
                $("#new-description").val(projectDescription);
            });

            $("body").on("click", this.projectDeleteSelector, function (ev) {
                ev.stopPropagation();
                var projectId = $(ev.target).closest("tr").attr("data-project-id");
                $("#deleteProjectModal").modal();
                $("#delete-project-id").val(projectId);
            });

            $("body").on("submit", this.deleteProjectFormSelector, function (ev) {
                ev.preventDefault();
                _this4.removeProject($(ev.target).serialize());
            });

            $("body").on("submit", this.updateProjectFormSelector, function (ev) {
                ev.preventDefault();
                _this4.updateProject($(ev.target).serialize());
            });

            $("body").on("click", ".project-item", function (ev) {
                var $target = $(ev.target).closest(".project-item");
                window.location.href = "project/" + $target.attr("data-project-id");
            });

            this.socket.on("updateProjects", function () {
                _this4.populateProjectsPage();
            });

            this.addIssue.on("click", function (ev) {
                ev.stopPropagation();
                ev.preventDefault();
                console.log($("#addIssueModal"));
                $("#addIssueModal").modal();
            });

            if (this.addIssueForm) {
                this.addIssueForm.on("submit", function (ev) {
                    ev.preventDefault();
                    var serialized = $(ev.target).serialize();
                    var deserializedData = _this4.deserializeForm(serialized);
                    var estimatedMinutes = _this4.convertEstimate(deserializedData.originalEstimate);
                    console.log(estimatedMinutes);
                });
            }
        }
    }, {
        key: "removeProject",
        value: function removeProject(data) {
            var deleteProjectPromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/project",
                    method: "DELETE",
                    data: data
                });

                request.done(function (data) {
                    console.log("success, ", data);
                    resolve(data);
                });

                request.fail(function (jqXHR, textStatus) {
                    reject(jqXHR, textStatus);
                });
            });

            deleteProjectPromise.then(function (data) {
                $("#deleteProjectModal").modal("hide");
            }).catch(function (jqXHR, textStatus) {
                console.log("error removing project", jqXHR, textStatus);
                alert("Error fetching projects");
            });
        }
    }, {
        key: "deserializeForm",
        value: function deserializeForm(serializedFormData) {
            var serializedDataArray = serializedFormData.split("&");
            var deserializeddData = new Object();
            var itemSplit = undefined;

            for (var length = serializedDataArray.length, i = 0; i < length; i++) {
                itemSplit = serializedDataArray[i].split("=");
                deserializeddData[itemSplit[0]] = itemSplit[1];
            }
            return deserializeddData;
        }
    }, {
        key: "convertEstimate",
        value: function convertEstimate(estimateString) {
            estimateString = estimateString.replace("+", " ");

            var regexp = /(^\d*h \d*m$)|(^\d*(\.\d+)?h$)|(^\d*m$)/; /*e.g 1h 30m or 30m or 1.5h*/
            var match = estimateString.match(regexp);
            var matchSplit = undefined;
            var splitLength = undefined;
            var hours = undefined;
            var minutes = 0;
            var additionalMinutes = 0;

            if (!match) {
                return false;
            }

            match = match[0];
            matchSplit = match.split(" ");
            splitLength = matchSplit.length;

            if (splitLength == 1) {
                var indexOfM = matchSplit[0].indexOf("m");
                var indexOfH = matchSplit[0].indexOf("h");

                if (indexOfM != -1) {
                    minutes = matchSplit[0].slice(0, indexOfM);
                }

                if (indexOfH != -1) {
                    hours = matchSplit[0].slice(0, indexOfH);
                }
            } else {
                var indexOfH = matchSplit[0].indexOf("h");
                var indexOfM = matchSplit[1].indexOf("m");

                if (indexOfH != -1) {
                    hours = matchSplit[0].slice(0, indexOfH);
                }

                if (indexOfM != -1) {
                    minutes = matchSplit[1].slice(0, indexOfM);
                }
            }

            if (hours) {
                additionalMinutes = parseInt(60 * hours);
            }

            minutes = parseInt(minutes);
            minutes += additionalMinutes;

            return minutes;
        }
    }, {
        key: "updateProject",
        value: function updateProject(data) {
            var updateProjectPromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/project",
                    method: "PUT",
                    data: data
                });

                request.done(function (data) {
                    console.log("success, ", data);
                    $("#editProjectModal").modal("hide");
                    resolve(data);
                });

                request.fail(function (jqXHR, textStatus) {
                    reject(jqXHR, textStatus);
                });
            });

            updateProjectPromise.then(function (data) {
                $("#deleteProjectModal").modal("hide");
            }).catch(function (jqXHR, textStatus) {
                console.log("error removing project", jqXHR, textStatus);
                alert("Error fetching projects");
            });
        }
    }, {
        key: "populateProjectsPage",
        value: function populateProjectsPage() {
            var projectsPromise = this.getProjects();
            var projects = undefined;
            var that = this;

            projectsPromise.then(function (data) {
                console.log("success:", data);
                populateProjectsTemplate(data);
            }).catch(function (jqXHR, textStatus) {
                console.log("error fetching projects", jqXHR, textStatus);
                alert("Error fetching projects");
            });

            function populateProjectsTemplate(projectsList) {
                console.log(projectsList);
                var getProjectsPromise = new Promise(function (resolve, reject) {
                    var request = $.ajax({
                        url: "templates/templates.html",
                        method: "GET",
                        dataType: 'html'
                    });

                    request.done(function (data) {
                        resolve(data);
                    });

                    request.fail(function (jqXHR, textStatus) {
                        reject(jqXHR, textStatus);
                    });
                });

                getProjectsPromise.then(function (data) {
                    var source = $(data).find("#projects-template").html();
                    var template = Handlebars.compile(source);
                    var context = {
                        projectsList: projectsList
                    };
                    var html = template(context);
                    that.projectsSection.html(html);
                }).catch(function (jqXHR, textStatus) {
                    console.log("error during projects template fetch", jqXHR, textStatus);
                    alert("Error during project creation");
                });
            }
        }
    }, {
        key: "populateProjectPage",
        value: function populateProjectPage() {
            var $issueSection = $(".project-page .issues-section");
        }
    }, {
        key: "createProject",
        value: function createProject($target) {
            var data = $target.serialize();

            var createProjectPromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/project",
                    method: "POST",
                    data: data
                });

                request.done(function (data) {
                    console.log("success, ", data);
                    $("#addProjectModal").modal("hide");
                    resolve(data);
                });

                request.fail(function (jqXHR, textStatus) {
                    reject(jqXHR, textStatus);
                });
            });

            createProjectPromise.then(function (data) {
                console.log("success reg:", data);
            }).catch(function (jqXHR, textStatus) {
                console.log("error during project creation", jqXHR, textStatus);
                alert("Error during project creation");
            });
        }
    }, {
        key: "getProjects",
        value: function getProjects(callback) {
            var getProjectsPromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/projectsItems",
                    method: "GET"
                });

                request.done(function (data) {
                    resolve(data);
                });

                request.fail(function (jqXHR, textStatus) {
                    reject(jqXHR, textStatus);
                });
            });
            return getProjectsPromise;
        }
    }, {
        key: "loginAndRegisterListeners",
        value: function loginAndRegisterListeners() {
            var _this5 = this;

            if (this.loginForm) {
                this.loginForm.on("submit", function (ev) {
                    ev.preventDefault();
                    _this5.login($(ev.target));
                });
            }

            if (this.registerForm) {
                this.registerForm.on("submit", function (ev) {
                    ev.preventDefault();

                    if ($("#password1").val() != $("#password2").val()) {
                        $(".form-group").addClass("has-error");
                        alert("passwords you entered are not identical");
                        return false;
                    }
                    _this5.register($(ev.target));
                });
            }
        }
    }]);

    return IssueTracker;
})();

exports.default = IssueTracker;

},{}],2:[function(require,module,exports){
'use strict';

var _IssueTracker = require('./IssueTracker');

var _IssueTracker2 = _interopRequireDefault(_IssueTracker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var issueTracker = new _IssueTracker2.default();
//console.log(IssueTracker);
//var [a, b, c] = [1 , 2, 3];

},{"./IssueTracker":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRcXElzc3VlVHJhY2tlci5qcyIsInNjcmlwdFxcYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztJQ0FxQixZQUFZO0FBQzdCLGFBRGlCLFlBQVksR0FDZjs4QkFERyxZQUFZOztBQUV6QixZQUFJLE1BQU0sR0FBRyxtQkFBbUIsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztBQUN6RCxZQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN6QixZQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDakIsWUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0tBQ3ZCOztpQkFOZ0IsWUFBWTs7b0NBUWpCO0FBQ1IsZ0JBQUksQ0FBQyxtQkFBbUIsR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDaEYsZ0JBQUksQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ3ZGLGdCQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUNwRSxnQkFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUM3QyxnQkFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQzdFLGdCQUFJLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDdkQsZ0JBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ2xGLGdCQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDN0UsZ0JBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDOUMsZ0JBQUksQ0FBQyxtQkFBbUIsR0FBRyxlQUFlLENBQUM7QUFDM0MsZ0JBQUksQ0FBQyxxQkFBcUIsR0FBRyxpQkFBaUIsQ0FBQztBQUMvQyxnQkFBSSxDQUFDLHlCQUF5QixHQUFHLGdCQUFnQixDQUFDO0FBQ2xELGdCQUFJLENBQUMseUJBQXlCLEdBQUcsZ0JBQWdCLENBQUM7QUFDbEQsZ0JBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQzFFLGdCQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNoQyxnQkFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsR0FBRyxLQUFLLENBQUM7U0FDNUU7Ozs4QkFFSyxPQUFPLEVBQUU7OztBQUNYLGdCQUFJLElBQUksR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFOzs7QUFBQyxBQUcvQixnQkFBSSxZQUFZLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ2hELG9CQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ2xCLHVCQUFHLEVBQUUsUUFBUTtBQUNiLDBCQUFNLEVBQUUsTUFBTTtBQUNkLHdCQUFJLEVBQUUsSUFBSTtpQkFDWixDQUFDLENBQUM7O0FBRUgsdUJBQU8sQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDbkIsMkJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDakIsQ0FBQyxDQUFDOztBQUVILHVCQUFPLENBQUMsSUFBSSxDQUFDLFVBQUMsS0FBSyxFQUFFLFVBQVUsRUFBSztBQUNoQywwQkFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztpQkFDN0IsQ0FBQyxDQUFDO2FBQ04sQ0FBQyxDQUFDOztBQUVILHdCQUFZLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ3hCLHNCQUFNLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7YUFDckMsQ0FBQyxDQUNELEtBQUssQ0FBQyxVQUFDLEtBQUssRUFBRSxVQUFVLEVBQUs7QUFDMUIsc0JBQUssZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ2hDLENBQUMsQ0FBQztTQUNOOzs7aUNBRVEsT0FBTyxFQUFFOzs7QUFDZCxnQkFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRTs7O0FBQUMsQUFHL0IsZ0JBQUksZUFBZSxHQUFHLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUNuRCxvQkFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUNsQix1QkFBRyxFQUFFLFdBQVc7QUFDaEIsMEJBQU0sRUFBRSxNQUFNO0FBQ2Qsd0JBQUksRUFBRSxJQUFJO2lCQUNaLENBQUMsQ0FBQzs7QUFFSCx1QkFBTyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksRUFBSztBQUNuQiwyQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNqQixDQUFDLENBQUM7O0FBRUgsdUJBQU8sQ0FBQyxJQUFJLENBQUMsVUFBQyxLQUFLLEVBQUUsVUFBVSxFQUFLO0FBQ2hDLDBCQUFNLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2lCQUM3QixDQUFDLENBQUM7YUFDTixDQUFDLENBQUM7O0FBRUgsMkJBQWUsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDM0IsdUJBQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2xDLHNCQUFNLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7YUFDckMsQ0FBQyxDQUNELEtBQUssQ0FBQyxVQUFDLEtBQUssRUFBRSxVQUFVLEVBQUs7QUFDMUIsdUJBQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztBQUM5Qyx1QkFBSyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUNuQyxDQUFDLENBQUM7U0FDTjs7O3VDQUVjOzs7QUFDWCxnQkFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7QUFDakMsZ0JBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDOztBQUV6QixhQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQU07QUFDakIsb0JBQUcsT0FBSyxZQUFZLEVBQUU7QUFDbEIsMkJBQUssb0JBQW9CLEVBQUUsQ0FBQztpQkFDL0I7O0FBRUQsb0JBQUcsT0FBSyxXQUFXLEVBQUU7QUFDakIsMkJBQUssbUJBQW1CLEVBQUUsQ0FBQztpQkFDOUI7YUFDSixDQUFDLENBQUM7U0FDTjs7OzRDQUVtQjs7O0FBQ2hCLGdCQUFHLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtBQUN6QixvQkFBSSxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBQyxFQUFFLEVBQUs7QUFDekMsc0JBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNwQiwyQkFBSyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztpQkFDbkMsQ0FBQyxDQUFDO2FBQ047O0FBRUQsZ0JBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFO0FBQ3ZCLG9CQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxVQUFDLEVBQUUsRUFBSztBQUN4QyxzQkFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3BCLDJCQUFLLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7aUJBQ3BDLENBQUMsQ0FBQzthQUNOOztBQUVELGFBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxVQUFDLEVBQUUsRUFBSztBQUNwRCxrQkFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQ3JCLG9CQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QyxvQkFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ2hELG9CQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2xELG9CQUFJLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFaEUsaUJBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQy9CLGlCQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDeEMsaUJBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN4QyxpQkFBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7YUFDakQsQ0FBQyxDQUFDOztBQUVILGFBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxVQUFDLEVBQUUsRUFBSztBQUN0RCxrQkFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQ3JCLG9CQUFJLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUNuRSxpQkFBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDakMsaUJBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUMxQyxDQUFDLENBQUM7O0FBRUgsYUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLHlCQUF5QixFQUFFLFVBQUMsRUFBRSxFQUFLO0FBQzNELGtCQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDcEIsdUJBQUssYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQzthQUNoRCxDQUFDLENBQUM7O0FBRUgsYUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLHlCQUF5QixFQUFFLFVBQUMsRUFBRSxFQUFLO0FBQzNELGtCQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDcEIsdUJBQUssYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQzthQUNoRCxDQUFDLENBQUM7O0FBRUgsYUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLFVBQUMsRUFBRSxFQUFLO0FBQzNDLG9CQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUNwRCxzQkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsVUFBVSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQzthQUN2RSxDQUFDLENBQUM7O0FBRUgsZ0JBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLFlBQU07QUFDbkMsdUJBQUssb0JBQW9CLEVBQUUsQ0FBQzthQUMvQixDQUFDLENBQUM7O0FBRUgsZ0JBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFDLEVBQUUsRUFBSztBQUM5QixrQkFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQ3JCLGtCQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDcEIsdUJBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtBQUNoQyxpQkFBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDL0IsQ0FBQyxDQUFDOztBQUVILGdCQUFHLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDbEIsb0JBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxVQUFDLEVBQUUsRUFBSztBQUNuQyxzQkFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3BCLHdCQUFJLFVBQVUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQzFDLHdCQUFJLGdCQUFnQixHQUFHLE9BQUssZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3hELHdCQUFJLGdCQUFnQixHQUFHLE9BQUssZUFBZSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDL0UsMkJBQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtpQkFDaEMsQ0FBQyxDQUFDO2FBQ047U0FDSjs7O3NDQUVhLElBQUksRUFBRTtBQUNoQixnQkFBSSxvQkFBb0IsR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDeEQsb0JBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDbEIsdUJBQUcsRUFBRSxVQUFVO0FBQ2YsMEJBQU0sRUFBRSxRQUFRO0FBQ2hCLHdCQUFJLEVBQUUsSUFBSTtpQkFDWixDQUFDLENBQUM7O0FBRUgsdUJBQU8sQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDbkIsMkJBQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQy9CLDJCQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ2pCLENBQUMsQ0FBQzs7QUFFSCx1QkFBTyxDQUFDLElBQUksQ0FBQyxVQUFDLEtBQUssRUFBRSxVQUFVLEVBQUs7QUFDaEMsMEJBQU0sQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7aUJBQzdCLENBQUMsQ0FBQzthQUNOLENBQUMsQ0FBQzs7QUFFSCxnQ0FBb0IsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDaEMsaUJBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUMxQyxDQUFDLENBQ0QsS0FBSyxDQUFDLFVBQUMsS0FBSyxFQUFFLFVBQVUsRUFBSztBQUMxQix1QkFBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDekQscUJBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO2FBQ3BDLENBQUMsQ0FBQztTQUNOOzs7d0NBRWUsa0JBQWtCLEVBQUU7QUFDaEMsZ0JBQUksbUJBQW1CLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hELGdCQUFJLGlCQUFpQixHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7QUFDckMsZ0JBQUksU0FBUyxZQUFBLENBQUM7O0FBRWQsaUJBQUksSUFBSSxNQUFNLEdBQUcsbUJBQW1CLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNqRSx5QkFBUyxHQUFHLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM5QyxpQ0FBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbEQ7QUFDRCxtQkFBTyxpQkFBaUIsQ0FBQztTQUM1Qjs7O3dDQUVlLGNBQWMsRUFBRTtBQUM1QiwwQkFBYyxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDOztBQUVsRCxnQkFBSSxNQUFNLEdBQUcseUNBQXlDO0FBQUMsQUFDdkQsZ0JBQUksS0FBSyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDekMsZ0JBQUksVUFBVSxZQUFBLENBQUM7QUFDZixnQkFBSSxXQUFXLFlBQUEsQ0FBQztBQUNoQixnQkFBSSxLQUFLLFlBQUEsQ0FBQztBQUNWLGdCQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDaEIsZ0JBQUksaUJBQWlCLEdBQUcsQ0FBQyxDQUFDOztBQUUxQixnQkFBRyxDQUFDLEtBQUssRUFBRTtBQUNQLHVCQUFPLEtBQUssQ0FBQzthQUNoQjs7QUFFRCxpQkFBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQixzQkFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDOUIsdUJBQVcsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDOztBQUVoQyxnQkFBRyxXQUFXLElBQUksQ0FBQyxFQUFFO0FBQ2pCLG9CQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzFDLG9CQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUUxQyxvQkFBRyxRQUFRLElBQUksQ0FBQyxDQUFDLEVBQUU7QUFDZiwyQkFBTyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2lCQUM5Qzs7QUFFRCxvQkFBRyxRQUFRLElBQUksQ0FBQyxDQUFDLEVBQUU7QUFDZix5QkFBSyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2lCQUM1QzthQUNKLE1BQUs7QUFDRixvQkFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMxQyxvQkFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFMUMsb0JBQUcsUUFBUSxJQUFJLENBQUMsQ0FBQyxFQUFFO0FBQ2YseUJBQUssR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztpQkFDNUM7O0FBRUQsb0JBQUcsUUFBUSxJQUFJLENBQUMsQ0FBQyxFQUFFO0FBQ2YsMkJBQU8sR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztpQkFDOUM7YUFDSjs7QUFFRCxnQkFBRyxLQUFLLEVBQUU7QUFDTixpQ0FBaUIsR0FBRyxRQUFRLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDO2FBQzVDOztBQUVELG1CQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzVCLG1CQUFPLElBQUksaUJBQWlCLENBQUM7O0FBRTdCLG1CQUFPLE9BQU8sQ0FBQztTQUNsQjs7O3NDQUVhLElBQUksRUFBRTtBQUNoQixnQkFBSSxvQkFBb0IsR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDeEQsb0JBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDbEIsdUJBQUcsRUFBRSxVQUFVO0FBQ2YsMEJBQU0sRUFBRSxLQUFLO0FBQ2Isd0JBQUksRUFBRSxJQUFJO2lCQUNaLENBQUMsQ0FBQzs7QUFFSCx1QkFBTyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksRUFBSztBQUNuQiwyQkFBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDL0IscUJBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNyQywyQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNqQixDQUFDLENBQUM7O0FBRUgsdUJBQU8sQ0FBQyxJQUFJLENBQUMsVUFBQyxLQUFLLEVBQUUsVUFBVSxFQUFLO0FBQ2hDLDBCQUFNLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2lCQUM3QixDQUFDLENBQUM7YUFDTixDQUFDLENBQUM7O0FBRUgsZ0NBQW9CLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ2hDLGlCQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDMUMsQ0FBQyxDQUNELEtBQUssQ0FBQyxVQUFDLEtBQUssRUFBRSxVQUFVLEVBQUs7QUFDMUIsdUJBQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3pELHFCQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQzthQUNwQyxDQUFDLENBQUM7U0FDTjs7OytDQUVzQjtBQUNuQixnQkFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ3pDLGdCQUFJLFFBQVEsWUFBQSxDQUFDO0FBQ2IsZ0JBQUksSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFaEIsMkJBQWUsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDM0IsdUJBQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzlCLHdDQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2xDLENBQUMsQ0FDRCxLQUFLLENBQUMsVUFBQyxLQUFLLEVBQUUsVUFBVSxFQUFLO0FBQzFCLHVCQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMxRCxxQkFBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7YUFDcEMsQ0FBQyxDQUFDOztBQUVILHFCQUFTLHdCQUF3QixDQUFDLFlBQVksRUFBRTtBQUM1Qyx1QkFBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUN6QixvQkFBSSxrQkFBa0IsR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDdEQsd0JBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDbEIsMkJBQUcsRUFBRSwwQkFBMEI7QUFDL0IsOEJBQU0sRUFBRSxLQUFLO0FBQ2IsZ0NBQVEsRUFBRSxNQUFNO3FCQUNsQixDQUFDLENBQUM7O0FBRUgsMkJBQU8sQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDbkIsK0JBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDakIsQ0FBQyxDQUFDOztBQUVILDJCQUFPLENBQUMsSUFBSSxDQUFDLFVBQUMsS0FBSyxFQUFFLFVBQVUsRUFBSztBQUNoQyw4QkFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztxQkFDN0IsQ0FBQyxDQUFDO2lCQUNOLENBQUMsQ0FBQzs7QUFFSCxrQ0FBa0IsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDOUIsd0JBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN2RCx3QkFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxQyx3QkFBSSxPQUFPLEdBQUc7QUFDVixvQ0FBWSxFQUFFLFlBQVk7cUJBQzdCLENBQUM7QUFDRix3QkFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLHdCQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFFbkMsQ0FBQyxDQUNELEtBQUssQ0FBQyxVQUFDLEtBQUssRUFBRSxVQUFVLEVBQUs7QUFDMUIsMkJBQU8sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZFLHlCQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQztpQkFDMUMsQ0FBQyxDQUFDO2FBQ047U0FDSjs7OzhDQUVxQjtBQUNsQixnQkFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDLCtCQUErQixDQUFDLENBQUM7U0FDMUQ7OztzQ0FFYSxPQUFPLEVBQUU7QUFDbkIsZ0JBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFL0IsZ0JBQUksb0JBQW9CLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ3hELG9CQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ2xCLHVCQUFHLEVBQUUsVUFBVTtBQUNmLDBCQUFNLEVBQUUsTUFBTTtBQUNkLHdCQUFJLEVBQUUsSUFBSTtpQkFDWixDQUFDLENBQUM7O0FBRUgsdUJBQU8sQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDbkIsMkJBQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQy9CLHFCQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDcEMsMkJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDakIsQ0FBQyxDQUFDOztBQUVILHVCQUFPLENBQUMsSUFBSSxDQUFDLFVBQUMsS0FBSyxFQUFFLFVBQVUsRUFBSztBQUNoQywwQkFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztpQkFDN0IsQ0FBQyxDQUFDO2FBQ04sQ0FBQyxDQUFDOztBQUVILGdDQUFvQixDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksRUFBSztBQUNoQyx1QkFBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFFckMsQ0FBQyxDQUNELEtBQUssQ0FBQyxVQUFDLEtBQUssRUFBRSxVQUFVLEVBQUs7QUFDMUIsdUJBQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ2hFLHFCQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQzthQUMxQyxDQUFDLENBQUM7U0FDTjs7O29DQUVXLFFBQVEsRUFBRTtBQUNsQixnQkFBSSxrQkFBa0IsR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDdEQsb0JBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDbEIsdUJBQUcsRUFBRSxnQkFBZ0I7QUFDckIsMEJBQU0sRUFBRSxLQUFLO2lCQUNmLENBQUMsQ0FBQzs7QUFFSCx1QkFBTyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksRUFBSztBQUNuQiwyQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNqQixDQUFDLENBQUM7O0FBRUgsdUJBQU8sQ0FBQyxJQUFJLENBQUMsVUFBQyxLQUFLLEVBQUUsVUFBVSxFQUFLO0FBQ2hDLDBCQUFNLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2lCQUM3QixDQUFDLENBQUM7YUFDTixDQUFDLENBQUM7QUFDSCxtQkFBTyxrQkFBa0IsQ0FBQztTQUM3Qjs7O29EQUUyQjs7O0FBQ3hCLGdCQUFHLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDZixvQkFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFVBQUMsRUFBRSxFQUFLO0FBQ2hDLHNCQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDcEIsMkJBQUssS0FBSyxDQUFDLENBQUMsQ0FBRSxFQUFFLENBQUMsTUFBTSxDQUFFLENBQUMsQ0FBQztpQkFDOUIsQ0FBQyxDQUFDO2FBQ047O0FBRUQsZ0JBQUcsSUFBSSxDQUFDLFlBQVksRUFBRTtBQUNsQixvQkFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFVBQUMsRUFBRSxFQUFLO0FBQ25DLHNCQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7O0FBRXBCLHdCQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7QUFDL0MseUJBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDdkMsNkJBQUssQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO0FBQ2pELCtCQUFPLEtBQUssQ0FBQztxQkFDaEI7QUFDRCwyQkFBSyxRQUFRLENBQUMsQ0FBQyxDQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUUsQ0FBQyxDQUFDO2lCQUNqQyxDQUFDLENBQUM7YUFDTjtTQUNKOzs7V0E5WmdCLFlBQVk7OztrQkFBWixZQUFZOzs7Ozs7Ozs7OztBQ0VqQyxJQUFJLFlBQVksR0FBRyw0QkFBa0I7OztBQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIElzc3VlVHJhY2tlciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBsZXQgaW9QYXRoID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6JyArIHdpbmRvdy5yZXNvdXJjZXMucG9ydDtcclxuICAgICAgICB0aGlzLnNvY2tldCA9IGlvKGlvUGF0aCk7XHJcbiAgICAgICAgdGhpcy5pbml0Q2FjaGUoKTtcclxuICAgICAgICB0aGlzLnNldExpc3RlbmVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRDYWNoZSgpIHtcclxuICAgICAgICB0aGlzLmNyZWF0ZVByb2plY3RCdXR0b24gPSAkKFwiLmFkZC1wcm9qZWN0XCIpLmxlbmd0aCA/ICQoXCIuYWRkLXByb2plY3RcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmNyZWF0ZVByb2plY3RNb2RhbCA9ICQoXCIjYWRkUHJvamVjdE1vZGFsXCIpLmxlbmd0aCA/ICQoXCIjYWRkUHJvamVjdE1vZGFsXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5sb2dpbkZvcm0gPSAkKFwiLmxvZ2luLWZvcm1cIikubGVuZ3RoID8gJChcIi5sb2dpbi1mb3JtXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5sb2dpbkVycm9yTW9kYWwgPSAkKFwiI0xvZ2luRXJyb3JNb2RhbFwiKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyRm9ybSA9ICQoXCIucmVnaXN0ZXItZm9ybVwiKS5sZW5ndGggPyAkKFwiLnJlZ2lzdGVyLWZvcm1cIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXJyb3JNb2RhbCA9ICQoXCIjUmVnaXN0cmF0aW9uRXJyb3JNb2RhbFwiKTtcclxuICAgICAgICB0aGlzLmFkZE5ld1Byb2plY3RGb3JtID0gJChcIiNhZGROZXdQcm9qZWN0XCIpLmxlbmd0aCA/ICQoXCIjYWRkTmV3UHJvamVjdFwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucHJvamVjdHNQYWdlID0gJChcIi5wcm9qZWN0cy1wYWdlXCIpLmxlbmd0aCA/ICQoXCIucHJvamVjdHMtcGFnZVwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucHJvamVjdHNTZWN0aW9uID0gJChcIi5wcm9qZWN0cy1zZWN0aW9uXCIpO1xyXG4gICAgICAgIHRoaXMucHJvamVjdEVkaXRTZWxlY3RvciA9IFwiLnByb2plY3QtZWRpdFwiO1xyXG4gICAgICAgIHRoaXMucHJvamVjdERlbGV0ZVNlbGVjdG9yID0gXCIucHJvamVjdC1kZWxldGVcIjtcclxuICAgICAgICB0aGlzLmRlbGV0ZVByb2plY3RGb3JtU2VsZWN0b3IgPSBcIiNkZWxldGVQcm9qZWN0XCI7XHJcbiAgICAgICAgdGhpcy51cGRhdGVQcm9qZWN0Rm9ybVNlbGVjdG9yID0gXCIjdXBkYXRlUHJvamVjdFwiO1xyXG4gICAgICAgIHRoaXMucHJvamVjdFBhZ2UgPSAkKFwiLnByb2plY3QtcGFnZVwiKS5sZW5ndGggPyAkKFwiLnByb2plY3QtcGFnZVwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYWRkSXNzdWUgPSAkKFwiLmFkZC1pc3N1ZVwiKTtcclxuICAgICAgICB0aGlzLmFkZElzc3VlRm9ybSA9ICQoXCIjYWRkTmV3SXNzdWVcIikubGVuZ3RoID8gJChcIiNhZGROZXdJc3N1ZVwiKSA6IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ2luKCR0YXJnZXQpIHtcclxuICAgICAgICBsZXQgZGF0YSA9ICR0YXJnZXQuc2VyaWFsaXplKCk7XHJcbiAgICAgICAgLypsZXQgbmFtZSA9IGRhdGFbMF0udmFsdWU7XHJcbiAgICAgICAgbGV0IHBhc3N3b3JkID0gZGF0YVsxXS52YWx1ZTsqL1xyXG4gICAgICAgIGxldCBsb2dpblByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9sb2dpblwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsb2dpblByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBkYXRhLnJlZGlyZWN0VG87XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubG9naW5FcnJvck1vZGFsLm1vZGFsKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVnaXN0ZXIoJHRhcmdldCkge1xyXG4gICAgICAgIGxldCBkYXRhID0gJHRhcmdldC5zZXJpYWxpemUoKTtcclxuICAgICAgICAvKmxldCBuYW1lID0gZGF0YVswXS52YWx1ZTtcclxuICAgICAgICBsZXQgcGFzc3dvcmQgPSBkYXRhWzFdLnZhbHVlOyovXHJcbiAgICAgICAgbGV0IHJlZ2lzdGVyUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL3JlZ2lzdGVyXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJlZ2lzdGVyUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcyByZWc6XCIsIGRhdGEpO1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBkYXRhLnJlZGlyZWN0VG87XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9naW4gZXJyb3JcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyRXJyb3JNb2RhbC5tb2RhbCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNldExpc3RlbmVycygpIHtcclxuICAgICAgICB0aGlzLmxvZ2luQW5kUmVnaXN0ZXJMaXN0ZW5lcnMoKTtcclxuICAgICAgICB0aGlzLnByb2plY3RzTGlzdGVuZXJzKCk7XHJcblxyXG4gICAgICAgICQod2luZG93KS5sb2FkKCgpID0+IHtcclxuICAgICAgICAgICAgaWYodGhpcy5wcm9qZWN0c1BhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9wdWxhdGVQcm9qZWN0c1BhZ2UoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYodGhpcy5wcm9qZWN0UGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZVByb2plY3RQYWdlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm9qZWN0c0xpc3RlbmVycygpIHtcclxuICAgICAgICBpZih0aGlzLmNyZWF0ZVByb2plY3RCdXR0b24pIHtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVQcm9qZWN0QnV0dG9uLm9uKFwiY2xpY2tcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVQcm9qZWN0TW9kYWwubW9kYWwoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLmFkZE5ld1Byb2plY3RGb3JtKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkTmV3UHJvamVjdEZvcm0ub24oJ3N1Ym1pdCcsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUHJvamVjdCgkKGV2LnRhcmdldCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgdGhpcy5wcm9qZWN0RWRpdFNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGxldCAkcGFyZW50ID0gJChldi50YXJnZXQpLmNsb3Nlc3QoXCJ0clwiKTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3RJZCA9ICRwYXJlbnQuYXR0cihcImRhdGEtcHJvamVjdC1pZFwiKTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3ROYW1lID0gJHBhcmVudC5maW5kKFwiLnByLW5hbWVcIikuaHRtbCgpO1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdERlc2NyaXB0aW9uID0gJHBhcmVudC5maW5kKFwiLnByLWRlc2NyaXB0aW9uXCIpLmh0bWwoKTtcclxuXHJcbiAgICAgICAgICAgICQoXCIjZWRpdFByb2plY3RNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgICAgICAkKFwiI3VwZGF0ZWUtcHJvamVjdC1pZFwiKS52YWwocHJvamVjdElkKTtcclxuICAgICAgICAgICAgJChcIiNuZXctcHJvamVjdC1uYW1lXCIpLnZhbChwcm9qZWN0TmFtZSk7XHJcbiAgICAgICAgICAgICQoXCIjbmV3LWRlc2NyaXB0aW9uXCIpLnZhbChwcm9qZWN0RGVzY3JpcHRpb24pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIHRoaXMucHJvamVjdERlbGV0ZVNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0SWQgPSAkKGV2LnRhcmdldCkuY2xvc2VzdChcInRyXCIpLmF0dHIoXCJkYXRhLXByb2plY3QtaWRcIik7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlUHJvamVjdE1vZGFsXCIpLm1vZGFsKCk7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlLXByb2plY3QtaWRcIikudmFsKHByb2plY3RJZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwic3VibWl0XCIsIHRoaXMuZGVsZXRlUHJvamVjdEZvcm1TZWxlY3RvciwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlUHJvamVjdCgkKGV2LnRhcmdldCkuc2VyaWFsaXplKCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcInN1Ym1pdFwiLCB0aGlzLnVwZGF0ZVByb2plY3RGb3JtU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVByb2plY3QoJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5wcm9qZWN0LWl0ZW1cIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCAkdGFyZ2V0ID0gJChldi50YXJnZXQpLmNsb3Nlc3QoXCIucHJvamVjdC1pdGVtXCIpO1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwicHJvamVjdC9cIiArICR0YXJnZXQuYXR0cihcImRhdGEtcHJvamVjdC1pZFwiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJ1cGRhdGVQcm9qZWN0c1wiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVQcm9qZWN0c1BhZ2UoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRJc3N1ZS5vbihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJChcIiNhZGRJc3N1ZU1vZGFsXCIpKVxyXG4gICAgICAgICAgICAkKFwiI2FkZElzc3VlTW9kYWxcIikubW9kYWwoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5hZGRJc3N1ZUZvcm0pIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRJc3N1ZUZvcm0ub24oXCJzdWJtaXRcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlcmlhbGl6ZWQgPSAkKGV2LnRhcmdldCkuc2VyaWFsaXplKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGVzZXJpYWxpemVkRGF0YSA9IHRoaXMuZGVzZXJpYWxpemVGb3JtKHNlcmlhbGl6ZWQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGVzdGltYXRlZE1pbnV0ZXMgPSB0aGlzLmNvbnZlcnRFc3RpbWF0ZShkZXNlcmlhbGl6ZWREYXRhLm9yaWdpbmFsRXN0aW1hdGUpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXN0aW1hdGVkTWludXRlcylcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZVByb2plY3QoZGF0YSkge1xyXG4gICAgICAgIGxldCBkZWxldGVQcm9qZWN0UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL3Byb2plY3RcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MsIFwiLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlbGV0ZVByb2plY3RQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgJChcIiNkZWxldGVQcm9qZWN0TW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHJlbW92aW5nIHByb2plY3RcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIGZldGNoaW5nIHByb2plY3RzXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc2VyaWFsaXplRm9ybShzZXJpYWxpemVkRm9ybURhdGEpIHtcclxuICAgICAgICBsZXQgc2VyaWFsaXplZERhdGFBcnJheSA9IHNlcmlhbGl6ZWRGb3JtRGF0YS5zcGxpdChcIiZcIik7XHJcbiAgICAgICAgbGV0IGRlc2VyaWFsaXplZGREYXRhID0gbmV3IE9iamVjdCgpO1xyXG4gICAgICAgIGxldCBpdGVtU3BsaXQ7XHJcblxyXG4gICAgICAgIGZvcihsZXQgbGVuZ3RoID0gc2VyaWFsaXplZERhdGFBcnJheS5sZW5ndGgsIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaXRlbVNwbGl0ID0gc2VyaWFsaXplZERhdGFBcnJheVtpXS5zcGxpdChcIj1cIik7XHJcbiAgICAgICAgICAgIGRlc2VyaWFsaXplZGREYXRhW2l0ZW1TcGxpdFswXV0gPSBpdGVtU3BsaXRbMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkZXNlcmlhbGl6ZWRkRGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBjb252ZXJ0RXN0aW1hdGUoZXN0aW1hdGVTdHJpbmcpIHtcclxuICAgICAgICBlc3RpbWF0ZVN0cmluZyA9IGVzdGltYXRlU3RyaW5nLnJlcGxhY2UoXCIrXCIsIFwiIFwiKTtcclxuXHJcbiAgICAgICAgbGV0IHJlZ2V4cCA9IC8oXlxcZCpoIFxcZCptJCl8KF5cXGQqKFxcLlxcZCspP2gkKXwoXlxcZCptJCkvOyAvKmUuZyAxaCAzMG0gb3IgMzBtIG9yIDEuNWgqL1xyXG4gICAgICAgIGxldCBtYXRjaCA9IGVzdGltYXRlU3RyaW5nLm1hdGNoKHJlZ2V4cCk7XHJcbiAgICAgICAgbGV0IG1hdGNoU3BsaXQ7XHJcbiAgICAgICAgbGV0IHNwbGl0TGVuZ3RoO1xyXG4gICAgICAgIGxldCBob3VycztcclxuICAgICAgICBsZXQgbWludXRlcyA9IDA7XHJcbiAgICAgICAgbGV0IGFkZGl0aW9uYWxNaW51dGVzID0gMDtcclxuXHJcbiAgICAgICAgaWYoIW1hdGNoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1hdGNoID0gbWF0Y2hbMF07XHJcbiAgICAgICAgbWF0Y2hTcGxpdCA9IG1hdGNoLnNwbGl0KFwiIFwiKTtcclxuICAgICAgICBzcGxpdExlbmd0aCA9IG1hdGNoU3BsaXQubGVuZ3RoO1xyXG5cclxuICAgICAgICBpZihzcGxpdExlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgIGxldCBpbmRleE9mTSA9IG1hdGNoU3BsaXRbMF0uaW5kZXhPZihcIm1cIik7XHJcbiAgICAgICAgICAgIGxldCBpbmRleE9mSCA9IG1hdGNoU3BsaXRbMF0uaW5kZXhPZihcImhcIik7XHJcblxyXG4gICAgICAgICAgICBpZihpbmRleE9mTSAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgbWludXRlcyA9IG1hdGNoU3BsaXRbMF0uc2xpY2UoMCwgaW5kZXhPZk0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihpbmRleE9mSCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgaG91cnMgPSBtYXRjaFNwbGl0WzBdLnNsaWNlKDAsIGluZGV4T2ZIKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgbGV0IGluZGV4T2ZIID0gbWF0Y2hTcGxpdFswXS5pbmRleE9mKFwiaFwiKTtcclxuICAgICAgICAgICAgbGV0IGluZGV4T2ZNID0gbWF0Y2hTcGxpdFsxXS5pbmRleE9mKFwibVwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGluZGV4T2ZIICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBob3VycyA9IG1hdGNoU3BsaXRbMF0uc2xpY2UoMCwgaW5kZXhPZkgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihpbmRleE9mTSAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgbWludXRlcyA9IG1hdGNoU3BsaXRbMV0uc2xpY2UoMCwgaW5kZXhPZk0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihob3Vycykge1xyXG4gICAgICAgICAgICBhZGRpdGlvbmFsTWludXRlcyA9IHBhcnNlSW50KDYwICogaG91cnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWludXRlcyA9IHBhcnNlSW50KG1pbnV0ZXMpO1xyXG4gICAgICAgIG1pbnV0ZXMgKz0gYWRkaXRpb25hbE1pbnV0ZXM7XHJcblxyXG4gICAgICAgIHJldHVybiBtaW51dGVzO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVByb2plY3QoZGF0YSkge1xyXG4gICAgICAgIGxldCB1cGRhdGVQcm9qZWN0UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL3Byb2plY3RcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MsIFwiLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICQoXCIjZWRpdFByb2plY3RNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB1cGRhdGVQcm9qZWN0UHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlUHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciByZW1vdmluZyBwcm9qZWN0XCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBmZXRjaGluZyBwcm9qZWN0c1wiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwb3B1bGF0ZVByb2plY3RzUGFnZSgpIHtcclxuICAgICAgICBsZXQgcHJvamVjdHNQcm9taXNlID0gdGhpcy5nZXRQcm9qZWN0cygpO1xyXG4gICAgICAgIGxldCBwcm9qZWN0cztcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgICAgIHByb2plY3RzUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzczpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgIHBvcHVsYXRlUHJvamVjdHNUZW1wbGF0ZShkYXRhKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBmZXRjaGluZyBwcm9qZWN0c1wiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZmV0Y2hpbmcgcHJvamVjdHNcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHBvcHVsYXRlUHJvamVjdHNUZW1wbGF0ZShwcm9qZWN0c0xpc3QpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocHJvamVjdHNMaXN0KVxyXG4gICAgICAgICAgICBsZXQgZ2V0UHJvamVjdHNQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgdXJsOiBcInRlbXBsYXRlcy90ZW1wbGF0ZXMuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZ2V0UHJvamVjdHNQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBzb3VyY2UgPSAkKGRhdGEpLmZpbmQoXCIjcHJvamVjdHMtdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gSGFuZGxlYmFycy5jb21waWxlKHNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGV4dCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0c0xpc3Q6IHByb2plY3RzTGlzdFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGxldCBodG1sID0gdGVtcGxhdGUoY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnByb2plY3RzU2VjdGlvbi5odG1sKGh0bWwpO1xyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBkdXJpbmcgcHJvamVjdHMgdGVtcGxhdGUgZmV0Y2hcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgcHJvamVjdCBjcmVhdGlvblwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHBvcHVsYXRlUHJvamVjdFBhZ2UoKSB7XHJcbiAgICAgICAgbGV0ICRpc3N1ZVNlY3Rpb24gPSAkKFwiLnByb2plY3QtcGFnZSAuaXNzdWVzLXNlY3Rpb25cIik7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlUHJvamVjdCgkdGFyZ2V0KSB7XHJcbiAgICAgICAgbGV0IGRhdGEgPSAkdGFyZ2V0LnNlcmlhbGl6ZSgpO1xyXG5cclxuICAgICAgICBsZXQgY3JlYXRlUHJvamVjdFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9qZWN0XCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNhZGRQcm9qZWN0TW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY3JlYXRlUHJvamVjdFByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MgcmVnOlwiLCBkYXRhKTtcclxuXHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZHVyaW5nIHByb2plY3QgY3JlYXRpb25cIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIGR1cmluZyBwcm9qZWN0IGNyZWF0aW9uXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFByb2plY3RzKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgbGV0IGdldFByb2plY3RzUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL3Byb2plY3RzSXRlbXNcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBnZXRQcm9qZWN0c1Byb21pc2U7XHJcbiAgICB9XHJcblxyXG4gICAgbG9naW5BbmRSZWdpc3Rlckxpc3RlbmVycygpIHtcclxuICAgICAgICBpZih0aGlzLmxvZ2luRm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2luRm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2luKCQoIGV2LnRhcmdldCApKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLnJlZ2lzdGVyRm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyRm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJChcIiNwYXNzd29yZDFcIikudmFsKCkgIT0gJChcIiNwYXNzd29yZDJcIikudmFsKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiLmZvcm0tZ3JvdXBcIikuYWRkQ2xhc3MoXCJoYXMtZXJyb3JcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJwYXNzd29yZHMgeW91IGVudGVyZWQgYXJlIG5vdCBpZGVudGljYWxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWdpc3RlcigkKCBldi50YXJnZXQgKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgSXNzdWVUcmFja2VyIGZyb20gJy4vSXNzdWVUcmFja2VyJztcclxuXHJcbmxldCBpc3N1ZVRyYWNrZXIgPSBuZXcgSXNzdWVUcmFja2VyKCk7XHJcbi8vY29uc29sZS5sb2coSXNzdWVUcmFja2VyKTtcclxuLy92YXIgW2EsIGIsIGNdID0gWzEgLCAyLCAzXTtcclxuIl19
