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
            this.updateIssueForm = $("#updateIssue").length ? $("#updateIssue") : false;
            this.deleteIssueForm = $("#deleteIssue").length ? $("#deleteIssue") : false;
            this.issueEditSelector = ".issue-edit";
            this.issueDeleteSelector = ".issue-delete";
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
                    _this3.populateProjectPage(window.resources.project);
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

            $("body").on("click", this.issueEditSelector, function (ev) {
                ev.stopPropagation();
                var $parent = $(ev.target).closest("tr");
                var issueId = $parent.attr("data-issue-id");
                var issueName = $parent.find(".issue-name").html();
                var issueDescription = $parent.find(".issue-description").html();

                $("#editIssueModal").modal();
                $("#updatee-issue-id").val(issueId);
                $("#new-issue-name").val(issueName);
                $("#new-description").val(issueDescription);
            });

            $("body").on("click", this.issueDeleteSelector, function (ev) {
                ev.stopPropagation();
                console.log("here");
                var issueId = $(ev.target).closest("tr").attr("data-issue-id");
                $("#deleteIssueModal").modal();
                $("#delete-issue-id").val(issueId);
            });

            if (this.deleteIssueForm) {
                this.deleteIssueForm.on("submit", function (ev) {
                    ev.preventDefault();
                    _this4.deleteIssue($(ev.target).serialize());
                });
            }

            if (this.updateIssueForm) {
                this.updateIssueForm.on("submit", function (ev) {
                    ev.preventDefault();
                    _this4.updateIssue($(ev.target).serialize());
                });
            }

            $("body").on("click", ".project-item", function (ev) {
                var $target = $(ev.target).closest(".project-item");
                window.location.href = "/project/" + $target.attr("data-project-id");
            });

            $("body").on("click", ".issue-item", function (ev) {
                var $target = $(ev.target).closest(".issue-item");
                window.location.href = "/issue/" + $target.attr("data-issue-id");
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

                    if (!estimatedMinutes) {
                        $(".original-estimate-group").addClass("has-error");
                        return;
                    }

                    deserializedData.originalEstimate = estimatedMinutes;
                    _this4.createIssue(deserializedData);
                    console.log(deserializedData);
                });
            }

            this.socket.on("updateIssues", function (data) {
                console.log(data);
                if (data.project == resources.project) {
                    _this4.populateProjectPage(resources.project);
                }
            });
        }
    }, {
        key: "deserializeForm",
        value: function deserializeForm(serializedFormData) {
            var serializedDataArray = serializedFormData.split("&");
            var deserializeddData = new Object();
            var itemSplit = undefined;

            for (var length = serializedDataArray.length, i = 0; i < length; i++) {
                serializedDataArray[i] = serializedDataArray[i].replace(/\+/g, " ");

                itemSplit = serializedDataArray[i].split("=");
                deserializeddData[itemSplit[0]] = itemSplit[1];
            }
            return deserializeddData;
        }
    }, {
        key: "convertEstimate",
        value: function convertEstimate(estimateString) {
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
        key: "createIssue",
        value: function createIssue(data) {
            var createIssuePromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/issue",
                    method: "POST",
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

            createIssuePromise.then(function (data) {
                console.log("success reg:", data);
                $("#addIssueModal").modal("hide");
            }).catch(function (jqXHR, textStatus) {
                console.log("error during project creation", jqXHR, textStatus);
                alert("Error during issue creation");
            });
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
                alert("Error while removing project");
            });
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
                alert("Error updating projects");
            });
        }
    }, {
        key: "deleteIssue",
        value: function deleteIssue(data) {
            var deleteIssuePromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/issue",
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

            deleteIssuePromise.then(function (data) {
                $("#deleteIssueModal").modal("hide");
            }).catch(function (jqXHR, textStatus) {
                console.log("error removing issue", jqXHR, textStatus);
                alert("Error removing issue");
            });
        }
    }, {
        key: "updateIssue",
        value: function updateIssue(data) {
            var updateIssuePromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/issue",
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

            updateIssuePromise.then(function (data) {
                $("#deleteProjectModal").modal("hide");
            }).catch(function (jqXHR, textStatus) {
                console.log("error updating issue", jqXHR, textStatus);
                alert("Error while updating issue");
            });
        }
    }, {
        key: "populateProjectPage",
        value: function populateProjectPage(projectId) {
            var issuesPromise = this.getIssues(projectId, populateIssuesTemplate);
            var $issuesSection = $(".project-page .issues-section");

            issuesPromise.then(function (data) {
                console.log("issues collection is::", data);
                populateIssuesTemplate(data);
            });

            function populateIssuesTemplate(issuesList) {
                var getProjectsPromise = new Promise(function (resolve, reject) {
                    var request = $.ajax({
                        url: "/templates/templates.html",
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
                    var source = $(data).find("#project-template").html();
                    var template = Handlebars.compile(source);
                    var context = {
                        issuesList: issuesList
                    };
                    var html = template(context);
                    $issuesSection.html(html);
                    $("#editIssueModal").modal("hide");
                }).catch(function (jqXHR, textStatus) {
                    console.log("error during issues template fetch", jqXHR, textStatus);
                    alert("Error during project creation");
                });
            }
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
                        url: "/templates/templates.html",
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
        key: "getIssues",
        value: function getIssues(projectId, callback) {
            console.log("pri:", projectId);
            var getProjectsPromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/issues",
                    method: "GET",
                    data: {
                        projectId: projectId
                    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRcXElzc3VlVHJhY2tlci5qcyIsInNjcmlwdFxcYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztJQ0FxQixZQUFZO0FBQzdCLGFBRGlCLFlBQVksR0FDZjs4QkFERyxZQUFZOztBQUV6QixZQUFJLE1BQU0sR0FBRyxtQkFBbUIsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztBQUN6RCxZQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN6QixZQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDakIsWUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0tBQ3ZCOztpQkFOZ0IsWUFBWTs7b0NBUWpCO0FBQ1IsZ0JBQUksQ0FBQyxtQkFBbUIsR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDaEYsZ0JBQUksQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ3ZGLGdCQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUNwRSxnQkFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUM3QyxnQkFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQzdFLGdCQUFJLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLENB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S0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2lCQUM3QixDQUFDLENBQUM7YUFDTixDQUFDLENBQUM7QUFDSCxtQkFBTyxrQkFBa0IsQ0FBQztTQUM3Qjs7O29EQUUyQjs7O0FBQ3hCLGdCQUFHLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDZixvQkFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFVBQUMsRUFBRSxFQUFLO0FBQ2hDLHNCQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDcEIsMkJBQUssS0FBSyxDQUFDLENBQUMsQ0FBRSxFQUFFLENBQUMsTUFBTSxDQUFFLENBQUMsQ0FBQztpQkFDOUIsQ0FBQyxDQUFDO2FBQ047O0FBRUQsZ0JBQUcsSUFBSSxDQUFDLFlBQVksRUFBRTtBQUNsQixvQkFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFVBQUMsRUFBRSxFQUFLO0FBQ25DLHNCQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7O0FBRXBCLHdCQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7QUFDL0MseUJBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDdkMsNkJBQUssQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO0FBQ2pELCtCQUFPLEtBQUssQ0FBQztxQkFDaEI7QUFDRCwyQkFBSyxRQUFRLENBQUMsQ0FBQyxDQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUUsQ0FBQyxDQUFDO2lCQUNqQyxDQUFDLENBQUM7YUFDTjtTQUNKOzs7V0F6bUJnQixZQUFZOzs7a0JBQVosWUFBWTs7Ozs7Ozs7Ozs7QUNFakMsSUFBSSxZQUFZLEdBQUcsNEJBQWtCOzs7QUFBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBJc3N1ZVRyYWNrZXIge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgbGV0IGlvUGF0aCA9ICdodHRwOi8vbG9jYWxob3N0OicgKyB3aW5kb3cucmVzb3VyY2VzLnBvcnQ7XHJcbiAgICAgICAgdGhpcy5zb2NrZXQgPSBpbyhpb1BhdGgpO1xyXG4gICAgICAgIHRoaXMuaW5pdENhY2hlKCk7XHJcbiAgICAgICAgdGhpcy5zZXRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0Q2FjaGUoKSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVQcm9qZWN0QnV0dG9uID0gJChcIi5hZGQtcHJvamVjdFwiKS5sZW5ndGggPyAkKFwiLmFkZC1wcm9qZWN0XCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVQcm9qZWN0TW9kYWwgPSAkKFwiI2FkZFByb2plY3RNb2RhbFwiKS5sZW5ndGggPyAkKFwiI2FkZFByb2plY3RNb2RhbFwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubG9naW5Gb3JtID0gJChcIi5sb2dpbi1mb3JtXCIpLmxlbmd0aCA/ICQoXCIubG9naW4tZm9ybVwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubG9naW5FcnJvck1vZGFsID0gJChcIiNMb2dpbkVycm9yTW9kYWxcIik7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckZvcm0gPSAkKFwiLnJlZ2lzdGVyLWZvcm1cIikubGVuZ3RoID8gJChcIi5yZWdpc3Rlci1mb3JtXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckVycm9yTW9kYWwgPSAkKFwiI1JlZ2lzdHJhdGlvbkVycm9yTW9kYWxcIik7XHJcbiAgICAgICAgdGhpcy5hZGROZXdQcm9qZWN0Rm9ybSA9ICQoXCIjYWRkTmV3UHJvamVjdFwiKS5sZW5ndGggPyAkKFwiI2FkZE5ld1Byb2plY3RcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLnByb2plY3RzUGFnZSA9ICQoXCIucHJvamVjdHMtcGFnZVwiKS5sZW5ndGggPyAkKFwiLnByb2plY3RzLXBhZ2VcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLnByb2plY3RzU2VjdGlvbiA9ICQoXCIucHJvamVjdHMtc2VjdGlvblwiKTtcclxuICAgICAgICB0aGlzLnByb2plY3RFZGl0U2VsZWN0b3IgPSBcIi5wcm9qZWN0LWVkaXRcIjtcclxuICAgICAgICB0aGlzLnByb2plY3REZWxldGVTZWxlY3RvciA9IFwiLnByb2plY3QtZGVsZXRlXCI7XHJcbiAgICAgICAgdGhpcy5kZWxldGVQcm9qZWN0Rm9ybVNlbGVjdG9yID0gXCIjZGVsZXRlUHJvamVjdFwiO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUHJvamVjdEZvcm1TZWxlY3RvciA9IFwiI3VwZGF0ZVByb2plY3RcIjtcclxuICAgICAgICB0aGlzLnByb2plY3RQYWdlID0gJChcIi5wcm9qZWN0LXBhZ2VcIikubGVuZ3RoID8gJChcIi5wcm9qZWN0LXBhZ2VcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmFkZElzc3VlID0gJChcIi5hZGQtaXNzdWVcIik7XHJcbiAgICAgICAgdGhpcy5hZGRJc3N1ZUZvcm0gPSAkKFwiI2FkZE5ld0lzc3VlXCIpLmxlbmd0aCA/ICQoXCIjYWRkTmV3SXNzdWVcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUlzc3VlRm9ybSA9ICQoXCIjdXBkYXRlSXNzdWVcIikubGVuZ3RoID8gJChcIiN1cGRhdGVJc3N1ZVwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlSXNzdWVGb3JtID0gJChcIiNkZWxldGVJc3N1ZVwiKS5sZW5ndGggPyAkKFwiI2RlbGV0ZUlzc3VlXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5pc3N1ZUVkaXRTZWxlY3RvciA9IFwiLmlzc3VlLWVkaXRcIjtcclxuICAgICAgICB0aGlzLmlzc3VlRGVsZXRlU2VsZWN0b3IgPSBcIi5pc3N1ZS1kZWxldGVcIjtcclxuICAgIH1cclxuXHJcbiAgICBsb2dpbigkdGFyZ2V0KSB7XHJcbiAgICAgICAgbGV0IGRhdGEgPSAkdGFyZ2V0LnNlcmlhbGl6ZSgpO1xyXG4gICAgICAgIC8qbGV0IG5hbWUgPSBkYXRhWzBdLnZhbHVlO1xyXG4gICAgICAgIGxldCBwYXNzd29yZCA9IGRhdGFbMV0udmFsdWU7Ki9cclxuICAgICAgICBsZXQgbG9naW5Qcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvbG9naW5cIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbG9naW5Qcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gZGF0YS5yZWRpcmVjdFRvO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2luRXJyb3JNb2RhbC5tb2RhbCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlZ2lzdGVyKCR0YXJnZXQpIHtcclxuICAgICAgICBsZXQgZGF0YSA9ICR0YXJnZXQuc2VyaWFsaXplKCk7XHJcbiAgICAgICAgLypsZXQgbmFtZSA9IGRhdGFbMF0udmFsdWU7XHJcbiAgICAgICAgbGV0IHBhc3N3b3JkID0gZGF0YVsxXS52YWx1ZTsqL1xyXG4gICAgICAgIGxldCByZWdpc3RlclByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9yZWdpc3RlclwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZWdpc3RlclByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MgcmVnOlwiLCBkYXRhKTtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gZGF0YS5yZWRpcmVjdFRvO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvZ2luIGVycm9yXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgdGhpcy5yZWdpc3RlckVycm9yTW9kYWwubW9kYWwoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgdGhpcy5sb2dpbkFuZFJlZ2lzdGVyTGlzdGVuZXJzKCk7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0c0xpc3RlbmVycygpO1xyXG5cclxuICAgICAgICAkKHdpbmRvdykubG9hZCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMucHJvamVjdHNQYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvcHVsYXRlUHJvamVjdHNQYWdlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMucHJvamVjdFBhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9wdWxhdGVQcm9qZWN0UGFnZSh3aW5kb3cucmVzb3VyY2VzLnByb2plY3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvamVjdHNMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgaWYodGhpcy5jcmVhdGVQcm9qZWN0QnV0dG9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUHJvamVjdEJ1dHRvbi5vbihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUHJvamVjdE1vZGFsLm1vZGFsKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5hZGROZXdQcm9qZWN0Rm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZE5ld1Byb2plY3RGb3JtLm9uKCdzdWJtaXQnLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVByb2plY3QoJChldi50YXJnZXQpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIHRoaXMucHJvamVjdEVkaXRTZWxlY3RvciwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBsZXQgJHBhcmVudCA9ICQoZXYudGFyZ2V0KS5jbG9zZXN0KFwidHJcIik7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0SWQgPSAkcGFyZW50LmF0dHIoXCJkYXRhLXByb2plY3QtaWRcIik7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0TmFtZSA9ICRwYXJlbnQuZmluZChcIi5wci1uYW1lXCIpLmh0bWwoKTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3REZXNjcmlwdGlvbiA9ICRwYXJlbnQuZmluZChcIi5wci1kZXNjcmlwdGlvblwiKS5odG1sKCk7XHJcblxyXG4gICAgICAgICAgICAkKFwiI2VkaXRQcm9qZWN0TW9kYWxcIikubW9kYWwoKTtcclxuICAgICAgICAgICAgJChcIiN1cGRhdGVlLXByb2plY3QtaWRcIikudmFsKHByb2plY3RJZCk7XHJcbiAgICAgICAgICAgICQoXCIjbmV3LXByb2plY3QtbmFtZVwiKS52YWwocHJvamVjdE5hbWUpO1xyXG4gICAgICAgICAgICAkKFwiI25ldy1kZXNjcmlwdGlvblwiKS52YWwocHJvamVjdERlc2NyaXB0aW9uKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCB0aGlzLnByb2plY3REZWxldGVTZWxlY3RvciwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdElkID0gJChldi50YXJnZXQpLmNsb3Nlc3QoXCJ0clwiKS5hdHRyKFwiZGF0YS1wcm9qZWN0LWlkXCIpO1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZVByb2plY3RNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZS1wcm9qZWN0LWlkXCIpLnZhbChwcm9qZWN0SWQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcInN1Ym1pdFwiLCB0aGlzLmRlbGV0ZVByb2plY3RGb3JtU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZVByb2plY3QoJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJzdWJtaXRcIiwgdGhpcy51cGRhdGVQcm9qZWN0Rm9ybVNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQcm9qZWN0KCQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgdGhpcy5pc3N1ZUVkaXRTZWxlY3RvciwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBsZXQgJHBhcmVudCA9ICQoZXYudGFyZ2V0KS5jbG9zZXN0KFwidHJcIik7XHJcbiAgICAgICAgICAgIGxldCBpc3N1ZUlkID0gJHBhcmVudC5hdHRyKFwiZGF0YS1pc3N1ZS1pZFwiKTtcclxuICAgICAgICAgICAgbGV0IGlzc3VlTmFtZSA9ICRwYXJlbnQuZmluZChcIi5pc3N1ZS1uYW1lXCIpLmh0bWwoKTtcclxuICAgICAgICAgICAgbGV0IGlzc3VlRGVzY3JpcHRpb24gPSAkcGFyZW50LmZpbmQoXCIuaXNzdWUtZGVzY3JpcHRpb25cIikuaHRtbCgpO1xyXG5cclxuICAgICAgICAgICAgJChcIiNlZGl0SXNzdWVNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgICAgICAkKFwiI3VwZGF0ZWUtaXNzdWUtaWRcIikudmFsKGlzc3VlSWQpO1xyXG4gICAgICAgICAgICAkKFwiI25ldy1pc3N1ZS1uYW1lXCIpLnZhbChpc3N1ZU5hbWUpO1xyXG4gICAgICAgICAgICAkKFwiI25ldy1kZXNjcmlwdGlvblwiKS52YWwoaXNzdWVEZXNjcmlwdGlvbik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgdGhpcy5pc3N1ZURlbGV0ZVNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaGVyZVwiKVxyXG4gICAgICAgICAgICBsZXQgaXNzdWVJZCA9ICQoZXYudGFyZ2V0KS5jbG9zZXN0KFwidHJcIikuYXR0cihcImRhdGEtaXNzdWUtaWRcIik7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlSXNzdWVNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZS1pc3N1ZS1pZFwiKS52YWwoaXNzdWVJZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuZGVsZXRlSXNzdWVGb3JtKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlSXNzdWVGb3JtLm9uKFwic3VibWl0XCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlSXNzdWUoJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLnVwZGF0ZUlzc3VlRm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUlzc3VlRm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUlzc3VlKCQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5wcm9qZWN0LWl0ZW1cIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCAkdGFyZ2V0ID0gJChldi50YXJnZXQpLmNsb3Nlc3QoXCIucHJvamVjdC1pdGVtXCIpO1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL3Byb2plY3QvXCIgKyAkdGFyZ2V0LmF0dHIoXCJkYXRhLXByb2plY3QtaWRcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgXCIuaXNzdWUtaXRlbVwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgbGV0ICR0YXJnZXQgPSAkKGV2LnRhcmdldCkuY2xvc2VzdChcIi5pc3N1ZS1pdGVtXCIpO1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL2lzc3VlL1wiICsgJHRhcmdldC5hdHRyKFwiZGF0YS1pc3N1ZS1pZFwiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJ1cGRhdGVQcm9qZWN0c1wiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVQcm9qZWN0c1BhZ2UoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRJc3N1ZS5vbihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJChcIiNhZGRJc3N1ZU1vZGFsXCIpKVxyXG4gICAgICAgICAgICAkKFwiI2FkZElzc3VlTW9kYWxcIikubW9kYWwoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5hZGRJc3N1ZUZvcm0pIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRJc3N1ZUZvcm0ub24oXCJzdWJtaXRcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlcmlhbGl6ZWQgPSAkKGV2LnRhcmdldCkuc2VyaWFsaXplKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGVzZXJpYWxpemVkRGF0YSA9IHRoaXMuZGVzZXJpYWxpemVGb3JtKHNlcmlhbGl6ZWQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGVzdGltYXRlZE1pbnV0ZXMgPSB0aGlzLmNvbnZlcnRFc3RpbWF0ZShkZXNlcmlhbGl6ZWREYXRhLm9yaWdpbmFsRXN0aW1hdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCFlc3RpbWF0ZWRNaW51dGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcIi5vcmlnaW5hbC1lc3RpbWF0ZS1ncm91cFwiKS5hZGRDbGFzcyhcImhhcy1lcnJvclwiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZGVzZXJpYWxpemVkRGF0YS5vcmlnaW5hbEVzdGltYXRlID0gZXN0aW1hdGVkTWludXRlcztcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlSXNzdWUoZGVzZXJpYWxpemVkRGF0YSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkZXNlcmlhbGl6ZWREYXRhKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc29ja2V0Lm9uKFwidXBkYXRlSXNzdWVzXCIsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICBpZihkYXRhLnByb2plY3QgPT0gcmVzb3VyY2VzLnByb2plY3QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9wdWxhdGVQcm9qZWN0UGFnZShyZXNvdXJjZXMucHJvamVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBkZXNlcmlhbGl6ZUZvcm0oc2VyaWFsaXplZEZvcm1EYXRhKSB7XHJcbiAgICAgICAgbGV0IHNlcmlhbGl6ZWREYXRhQXJyYXkgPSBzZXJpYWxpemVkRm9ybURhdGEuc3BsaXQoXCImXCIpO1xyXG4gICAgICAgIGxldCBkZXNlcmlhbGl6ZWRkRGF0YSA9IG5ldyBPYmplY3QoKTtcclxuICAgICAgICBsZXQgaXRlbVNwbGl0O1xyXG5cclxuICAgICAgICBmb3IobGV0IGxlbmd0aCA9IHNlcmlhbGl6ZWREYXRhQXJyYXkubGVuZ3RoLCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHNlcmlhbGl6ZWREYXRhQXJyYXlbaV0gPSBzZXJpYWxpemVkRGF0YUFycmF5W2ldLnJlcGxhY2UoL1xcKy9nLCBcIiBcIik7XHJcblxyXG4gICAgICAgICAgICBpdGVtU3BsaXQgPSBzZXJpYWxpemVkRGF0YUFycmF5W2ldLnNwbGl0KFwiPVwiKTtcclxuICAgICAgICAgICAgZGVzZXJpYWxpemVkZERhdGFbaXRlbVNwbGl0WzBdXSA9IGl0ZW1TcGxpdFsxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlc2VyaWFsaXplZGREYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnZlcnRFc3RpbWF0ZShlc3RpbWF0ZVN0cmluZykge1xyXG4gICAgICAgIGxldCByZWdleHAgPSAvKF5cXGQqaCBcXGQqbSQpfCheXFxkKihcXC5cXGQrKT9oJCl8KF5cXGQqbSQpLzsgLyplLmcgMWggMzBtIG9yIDMwbSBvciAxLjVoKi9cclxuICAgICAgICBsZXQgbWF0Y2ggPSBlc3RpbWF0ZVN0cmluZy5tYXRjaChyZWdleHApO1xyXG4gICAgICAgIGxldCBtYXRjaFNwbGl0O1xyXG4gICAgICAgIGxldCBzcGxpdExlbmd0aDtcclxuICAgICAgICBsZXQgaG91cnM7XHJcbiAgICAgICAgbGV0IG1pbnV0ZXMgPSAwO1xyXG4gICAgICAgIGxldCBhZGRpdGlvbmFsTWludXRlcyA9IDA7XHJcblxyXG4gICAgICAgIGlmKCFtYXRjaCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtYXRjaCA9IG1hdGNoWzBdO1xyXG4gICAgICAgIG1hdGNoU3BsaXQgPSBtYXRjaC5zcGxpdChcIiBcIik7XHJcbiAgICAgICAgc3BsaXRMZW5ndGggPSBtYXRjaFNwbGl0Lmxlbmd0aDtcclxuXHJcbiAgICAgICAgaWYoc3BsaXRMZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICBsZXQgaW5kZXhPZk0gPSBtYXRjaFNwbGl0WzBdLmluZGV4T2YoXCJtXCIpO1xyXG4gICAgICAgICAgICBsZXQgaW5kZXhPZkggPSBtYXRjaFNwbGl0WzBdLmluZGV4T2YoXCJoXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYoaW5kZXhPZk0gIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPSBtYXRjaFNwbGl0WzBdLnNsaWNlKDAsIGluZGV4T2ZNKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoaW5kZXhPZkggIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGhvdXJzID0gbWF0Y2hTcGxpdFswXS5zbGljZSgwLCBpbmRleE9mSCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBpbmRleE9mSCA9IG1hdGNoU3BsaXRbMF0uaW5kZXhPZihcImhcIik7XHJcbiAgICAgICAgICAgIGxldCBpbmRleE9mTSA9IG1hdGNoU3BsaXRbMV0uaW5kZXhPZihcIm1cIik7XHJcblxyXG4gICAgICAgICAgICBpZihpbmRleE9mSCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgaG91cnMgPSBtYXRjaFNwbGl0WzBdLnNsaWNlKDAsIGluZGV4T2ZIKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoaW5kZXhPZk0gIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPSBtYXRjaFNwbGl0WzFdLnNsaWNlKDAsIGluZGV4T2ZNKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoaG91cnMpIHtcclxuICAgICAgICAgICAgYWRkaXRpb25hbE1pbnV0ZXMgPSBwYXJzZUludCg2MCAqIGhvdXJzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1pbnV0ZXMgPSBwYXJzZUludChtaW51dGVzKTtcclxuICAgICAgICBtaW51dGVzICs9IGFkZGl0aW9uYWxNaW51dGVzO1xyXG5cclxuICAgICAgICByZXR1cm4gbWludXRlcztcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVJc3N1ZShkYXRhKSB7XHJcbiAgICAgICAgbGV0IGNyZWF0ZUlzc3VlUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2lzc3VlXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY3JlYXRlSXNzdWVQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzIHJlZzpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICQoXCIjYWRkSXNzdWVNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZHVyaW5nIHByb2plY3QgY3JlYXRpb25cIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIGR1cmluZyBpc3N1ZSBjcmVhdGlvblwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVQcm9qZWN0KGRhdGEpIHtcclxuICAgICAgICBsZXQgZGVsZXRlUHJvamVjdFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9qZWN0XCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZWxldGVQcm9qZWN0UHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlUHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciByZW1vdmluZyBwcm9qZWN0XCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciB3aGlsZSByZW1vdmluZyBwcm9qZWN0XCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVByb2plY3QoZGF0YSkge1xyXG4gICAgICAgIGxldCB1cGRhdGVQcm9qZWN0UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL3Byb2plY3RcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MsIFwiLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICQoXCIjZWRpdFByb2plY3RNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB1cGRhdGVQcm9qZWN0UHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlUHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciByZW1vdmluZyBwcm9qZWN0XCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciB1cGRhdGluZyBwcm9qZWN0c1wiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVJc3N1ZShkYXRhKSB7XHJcbiAgICAgICAgbGV0IGRlbGV0ZUlzc3VlUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2lzc3VlXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZWxldGVJc3N1ZVByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZUlzc3VlTW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHJlbW92aW5nIGlzc3VlXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciByZW1vdmluZyBpc3N1ZVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVJc3N1ZShkYXRhKSB7XHJcbiAgICAgICAgbGV0IHVwZGF0ZUlzc3VlUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2lzc3VlXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2VkaXRQcm9qZWN0TW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdXBkYXRlSXNzdWVQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgJChcIiNkZWxldGVQcm9qZWN0TW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHVwZGF0aW5nIGlzc3VlXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciB3aGlsZSB1cGRhdGluZyBpc3N1ZVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwb3B1bGF0ZVByb2plY3RQYWdlKHByb2plY3RJZCkge1xyXG4gICAgICAgIGxldCBpc3N1ZXNQcm9taXNlID0gdGhpcy5nZXRJc3N1ZXMocHJvamVjdElkLCBwb3B1bGF0ZUlzc3Vlc1RlbXBsYXRlKTtcclxuICAgICAgICBsZXQgJGlzc3Vlc1NlY3Rpb24gPSAkKFwiLnByb2plY3QtcGFnZSAuaXNzdWVzLXNlY3Rpb25cIik7XHJcblxyXG4gICAgICAgIGlzc3Vlc1Byb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImlzc3VlcyBjb2xsZWN0aW9uIGlzOjpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgIHBvcHVsYXRlSXNzdWVzVGVtcGxhdGUoZGF0YSk7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcG9wdWxhdGVJc3N1ZXNUZW1wbGF0ZShpc3N1ZXNMaXN0KSB7XHJcbiAgICAgICAgICAgIGxldCBnZXRQcm9qZWN0c1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3RlbXBsYXRlcy90ZW1wbGF0ZXMuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZ2V0UHJvamVjdHNQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBzb3VyY2UgPSAkKGRhdGEpLmZpbmQoXCIjcHJvamVjdC10ZW1wbGF0ZVwiKS5odG1sKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGUgPSBIYW5kbGViYXJzLmNvbXBpbGUoc291cmNlKTtcclxuICAgICAgICAgICAgICAgIGxldCBjb250ZXh0ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzc3Vlc0xpc3Q6IGlzc3Vlc0xpc3RcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBsZXQgaHRtbCA9IHRlbXBsYXRlKGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgJGlzc3Vlc1NlY3Rpb24uaHRtbChodG1sKTtcclxuICAgICAgICAgICAgICAgICQoXCIjZWRpdElzc3VlTW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGR1cmluZyBpc3N1ZXMgdGVtcGxhdGUgZmV0Y2hcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgcHJvamVjdCBjcmVhdGlvblwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHBvcHVsYXRlUHJvamVjdHNQYWdlKCkge1xyXG4gICAgICAgIGxldCBwcm9qZWN0c1Byb21pc2UgPSB0aGlzLmdldFByb2plY3RzKCk7XHJcbiAgICAgICAgbGV0IHByb2plY3RzO1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgcHJvamVjdHNQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzOlwiLCBkYXRhKTtcclxuICAgICAgICAgICAgcG9wdWxhdGVQcm9qZWN0c1RlbXBsYXRlKGRhdGEpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGZldGNoaW5nIHByb2plY3RzXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBmZXRjaGluZyBwcm9qZWN0c1wiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcG9wdWxhdGVQcm9qZWN0c1RlbXBsYXRlKHByb2plY3RzTGlzdCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwcm9qZWN0c0xpc3QpXHJcbiAgICAgICAgICAgIGxldCBnZXRQcm9qZWN0c1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3RlbXBsYXRlcy90ZW1wbGF0ZXMuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZ2V0UHJvamVjdHNQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBzb3VyY2UgPSAkKGRhdGEpLmZpbmQoXCIjcHJvamVjdHMtdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gSGFuZGxlYmFycy5jb21waWxlKHNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGV4dCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0c0xpc3Q6IHByb2plY3RzTGlzdFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGxldCBodG1sID0gdGVtcGxhdGUoY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnByb2plY3RzU2VjdGlvbi5odG1sKGh0bWwpO1xyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBkdXJpbmcgcHJvamVjdHMgdGVtcGxhdGUgZmV0Y2hcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgcHJvamVjdCBjcmVhdGlvblwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVByb2plY3QoJHRhcmdldCkge1xyXG4gICAgICAgIGxldCBkYXRhID0gJHRhcmdldC5zZXJpYWxpemUoKTtcclxuXHJcbiAgICAgICAgbGV0IGNyZWF0ZVByb2plY3RQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvcHJvamVjdFwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MsIFwiLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICQoXCIjYWRkUHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNyZWF0ZVByb2plY3RQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzIHJlZzpcIiwgZGF0YSk7XHJcblxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGR1cmluZyBwcm9qZWN0IGNyZWF0aW9uXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgcHJvamVjdCBjcmVhdGlvblwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQcm9qZWN0cyhjYWxsYmFjaykge1xyXG4gICAgICAgIGxldCBnZXRQcm9qZWN0c1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9qZWN0c0l0ZW1zXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZ2V0UHJvamVjdHNQcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldElzc3Vlcyhwcm9qZWN0SWQsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJwcmk6XCIsIHByb2plY3RJZCk7XHJcbiAgICAgICAgbGV0IGdldFByb2plY3RzUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2lzc3Vlc1wiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgIHByb2plY3RJZDogcHJvamVjdElkXHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGdldFByb2plY3RzUHJvbWlzZTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dpbkFuZFJlZ2lzdGVyTGlzdGVuZXJzKCkge1xyXG4gICAgICAgIGlmKHRoaXMubG9naW5Gb3JtKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9naW5Gb3JtLm9uKFwic3VibWl0XCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9naW4oJCggZXYudGFyZ2V0ICkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMucmVnaXN0ZXJGb3JtKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJGb3JtLm9uKFwic3VibWl0XCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZigkKFwiI3Bhc3N3b3JkMVwiKS52YWwoKSAhPSAkKFwiI3Bhc3N3b3JkMlwiKS52YWwoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoXCIuZm9ybS1ncm91cFwiKS5hZGRDbGFzcyhcImhhcy1lcnJvclwiKTtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcInBhc3N3b3JkcyB5b3UgZW50ZXJlZCBhcmUgbm90IGlkZW50aWNhbFwiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlZ2lzdGVyKCQoIGV2LnRhcmdldCApKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBJc3N1ZVRyYWNrZXIgZnJvbSAnLi9Jc3N1ZVRyYWNrZXInO1xyXG5cclxubGV0IGlzc3VlVHJhY2tlciA9IG5ldyBJc3N1ZVRyYWNrZXIoKTtcclxuLy9jb25zb2xlLmxvZyhJc3N1ZVRyYWNrZXIpO1xyXG4vL3ZhciBbYSwgYiwgY10gPSBbMSAsIDIsIDNdO1xyXG4iXX0=
