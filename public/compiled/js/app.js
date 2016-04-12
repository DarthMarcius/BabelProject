(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IssueTracker = function () {
    function IssueTracker() {
        _classCallCheck(this, IssueTracker);

        var ioPath = window.location.hostname == "localhost" ? "http://localhost:" + resources.port : "https://" + window.location.hostname;
        this.socket = io(ioPath);
        this.initCache();
        this.initDom();
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
            this.issuePage = $(".issue-page").length ? $(".issue-page") : false;
            this.addIssue = $(".add-issue");
            this.addIssueForm = $("#addNewIssue").length ? $("#addNewIssue") : false;
            this.updateIssueForm = $("#updateIssue").length ? $("#updateIssue") : false;
            this.deleteIssueForm = $("#deleteIssue").length ? $("#deleteIssue") : false;
            this.issueEditSelector = ".issue-edit";
            this.issueDeleteSelector = ".issue-delete";
            this.addComment = $(".new-comment").length ? $(".new-comment") : false;
            this.addWrokLog = $(".new-worklog").length ? $(".new-worklog") : false;
            this.addCommentModal = $("#addCommentModal");
            this.addWorkLogModal = $("#addWorkLogModal");
            this.addNewCommentFormSelector = "#addNewComment";
            this.addNewWorklogFormSelector = "#addNewWorklog";
            this.dateTimePicker = $("#work-log-datetimepicker").length ? $("#work-log-datetimepicker") : false;
        }
    }, {
        key: "initDom",
        value: function initDom() {
            if (this.dateTimePicker) {
                this.dateTimePicker.datetimepicker({
                    defaultDate: new Date()
                });
                $("#date-time-picker-input").focus(function (ev) {
                    $(".input-group-addon").click();
                });
            }
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
            this.issueListeners();

            $(window).load(function () {
                if (_this3.projectsPage) {
                    _this3.populateProjectsPage();
                }

                if (_this3.projectPage) {
                    _this3.populateProjectPage(window.resources.project);
                }

                if (_this3.issuePage) {
                    _this3.populateIssuePage(window.resources.issue);
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
        key: "issueListeners",
        value: function issueListeners() {
            var _this5 = this;

            if (this.addComment) {
                this.addComment.on("click", function (ev) {
                    _this5.addCommentModal.modal();
                });
            }

            if (this.addWrokLog) {
                this.addWrokLog.on("click", function (ev) {
                    _this5.addWorkLogModal.modal();
                });
            }

            $("body").on("submit", this.addNewCommentFormSelector, function (ev) {
                ev.preventDefault();
                _this5.createComment($(ev.target).serialize());
            });

            $("body").on("submit", this.addNewWorklogFormSelector, function (ev) {
                ev.preventDefault();
            });

            this.socket.on("updateComments", function (data) {
                console.log(data);
                if (data.issue == resources.issue) {
                    _this5.populateIssuePage(resources.issue);
                }
            });
        }
    }, {
        key: "deserializeForm",
        value: function deserializeForm(serializedFormData) {
            var serializedDataArray = serializedFormData.split("&");
            var deserializeddData = new Object();
            var itemSplit = void 0;

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
            var matchSplit = void 0;
            var splitLength = void 0;
            var hours = void 0;
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
                var _indexOfH = matchSplit[0].indexOf("h");
                var _indexOfM = matchSplit[1].indexOf("m");

                if (_indexOfH != -1) {
                    hours = matchSplit[0].slice(0, _indexOfH);
                }

                if (_indexOfM != -1) {
                    minutes = matchSplit[1].slice(0, _indexOfM);
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
        key: "createComment",
        value: function createComment(data) {
            console.log(data);
            var createCommentPromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/comment",
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

            createCommentPromise.then(function (data) {
                console.log("success creating comment:", data);
                $("#addCommentModal").modal("hide");
            }).catch(function (jqXHR, textStatus) {
                console.log("Error during comment creation", jqXHR, textStatus);
                alert("Error during comment creation");
            });
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
        key: "populateIssuePage",
        value: function populateIssuePage(issueId) {
            var issuesPromise = this.getComments(issueId);
            var $commentsSection = $(".issue-page .issue-comments");

            issuesPromise.then(function (data) {
                console.log("issues comments is::", data);
                populateIssuesTemplate(data);
            });

            function populateIssuesTemplate(commentsList) {
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
                    var source = $(data).find("#comments-template").html();
                    var template = Handlebars.compile(source);
                    var context = {
                        commentsList: commentsList
                    };
                    var html = template(context);
                    $commentsSection.html(html);
                }).catch(function (jqXHR, textStatus) {
                    console.log("error during comments template fetch", jqXHR, textStatus);
                    alert("Error during project creation");
                });
            }
        }
    }, {
        key: "populateProjectsPage",
        value: function populateProjectsPage() {
            var projectsPromise = this.getProjects();
            var projects = void 0;
            var that = this;

            projectsPromise.then(function (data) {
                console.log("fetched projects:", data);
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
            var getIssuesPromise = new Promise(function (resolve, reject) {
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
            return getIssuesPromise;
        }
    }, {
        key: "getComments",
        value: function getComments(issueId) {
            console.log("issueId:", issueId);
            var getCommentsPromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/comments",
                    method: "GET",
                    data: {
                        issueId: issueId
                    }
                });

                request.done(function (data) {
                    resolve(data);
                });

                request.fail(function (jqXHR, textStatus) {
                    reject(jqXHR, textStatus);
                });
            });
            return getCommentsPromise;
        }
    }, {
        key: "loginAndRegisterListeners",
        value: function loginAndRegisterListeners() {
            var _this6 = this;

            if (this.loginForm) {
                this.loginForm.on("submit", function (ev) {
                    ev.preventDefault();
                    _this6.login($(ev.target));
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
                    _this6.register($(ev.target));
                });
            }
        }
    }]);

    return IssueTracker;
}();

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRcXElzc3VlVHJhY2tlci5qcyIsInNjcmlwdFxcYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztJQ0FxQjtBQUNqQixhQURpQixZQUNqQixHQUFjOzhCQURHLGNBQ0g7O0FBQ1YsWUFBSSxTQUFTLE9BQU8sUUFBUCxDQUFnQixRQUFoQixJQUE0QixXQUE1QixHQUEwQyxzQkFBc0IsVUFBVSxJQUFWLEdBQWlCLGFBQWEsT0FBTyxRQUFQLENBQWdCLFFBQWhCLENBRGpHO0FBRVYsYUFBSyxNQUFMLEdBQWMsR0FBRyxNQUFILENBQWQsQ0FGVTtBQUdWLGFBQUssU0FBTCxHQUhVO0FBSVYsYUFBSyxPQUFMLEdBSlU7QUFLVixhQUFLLFlBQUwsR0FMVTtLQUFkOztpQkFEaUI7O29DQVNMO0FBQ1IsaUJBQUssbUJBQUwsR0FBMkIsRUFBRSxjQUFGLEVBQWtCLE1BQWxCLEdBQTJCLEVBQUUsY0FBRixDQUEzQixHQUErQyxLQUEvQyxDQURuQjtBQUVSLGlCQUFLLGtCQUFMLEdBQTBCLEVBQUUsa0JBQUYsRUFBc0IsTUFBdEIsR0FBK0IsRUFBRSxrQkFBRixDQUEvQixHQUF1RCxLQUF2RCxDQUZsQjtBQUdSLGlCQUFLLFNBQUwsR0FBaUIsRUFBRSxhQUFGLEVBQWlCLE1BQWpCLEdBQTBCLEVBQUUsYUFBRixDQUExQixHQUE2QyxLQUE3QyxDQUhUO0FBSVIsaUJBQUssZUFBTCxHQUF1QixFQUFFLGtCQUFGLENBQXZCLENBSlE7QUFLUixpQkFBSyxZQUFMLEdBQW9CLEVBQUUsZ0JBQUYsRUFBb0IsTUFBcEIsR0FBNkIsRUFBRSxnQkFBRixDQUE3QixHQUFtRCxLQUFuRCxDQUxaO0FBTVIsaUJBQUssa0JBQUwsR0FBMEIsRUFBRSx5QkFBRixDQUExQixDQU5RO0FBT1IsaUJBQUssaUJBQUwsR0FBeUIsRUFBRSxnQkFBRixFQUFvQixNQUFwQixHQUE2QixF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QkFBSyxZQUFMLENBQWtCLEVBQWxCLENBQXFCLFFBQXJCLEVBQStCLFVBQUMsRUFBRCxFQUFRO0FBQ25DLHVCQUFHLGNBQUgsR0FEbUM7O0FBR25DLHdCQUFHLEVBQUUsWUFBRixFQUFnQixHQUFoQixNQUF5QixFQUFFLFlBQUYsRUFBZ0IsR0FBaEIsRUFBekIsRUFBZ0Q7QUFDL0MsMEJBQUUsYUFBRixFQUFpQixRQUFqQixDQUEwQixXQUExQixFQUQrQztBQUUvQyw4QkFBTSx5Q0FBTixFQUYrQztBQUcvQywrQkFBTyxLQUFQLENBSCtDO3FCQUFuRDtBQUtBLDJCQUFLLFFBQUwsQ0FBYyxFQUFHLEdBQUcsTUFBSCxDQUFqQixFQVJtQztpQkFBUixDQUEvQixDQURrQjthQUF0Qjs7OztXQW52QmE7Ozs7Ozs7O0FDQXJCOzs7Ozs7QUFFQSxJQUFJLGVBQWUsNEJBQWYiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgSXNzdWVUcmFja2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGxldCBpb1BhdGggPSB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgPT0gXCJsb2NhbGhvc3RcIiA/IFwiaHR0cDovL2xvY2FsaG9zdDpcIiArIHJlc291cmNlcy5wb3J0IDogXCJodHRwczovL1wiICsgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lO1xyXG4gICAgICAgIHRoaXMuc29ja2V0ID0gaW8oaW9QYXRoKTtcclxuICAgICAgICB0aGlzLmluaXRDYWNoZSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdERvbSgpO1xyXG4gICAgICAgIHRoaXMuc2V0TGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdENhY2hlKCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlUHJvamVjdEJ1dHRvbiA9ICQoXCIuYWRkLXByb2plY3RcIikubGVuZ3RoID8gJChcIi5hZGQtcHJvamVjdFwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlUHJvamVjdE1vZGFsID0gJChcIiNhZGRQcm9qZWN0TW9kYWxcIikubGVuZ3RoID8gJChcIiNhZGRQcm9qZWN0TW9kYWxcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmxvZ2luRm9ybSA9ICQoXCIubG9naW4tZm9ybVwiKS5sZW5ndGggPyAkKFwiLmxvZ2luLWZvcm1cIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmxvZ2luRXJyb3JNb2RhbCA9ICQoXCIjTG9naW5FcnJvck1vZGFsXCIpO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJGb3JtID0gJChcIi5yZWdpc3Rlci1mb3JtXCIpLmxlbmd0aCA/ICQoXCIucmVnaXN0ZXItZm9ybVwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFcnJvck1vZGFsID0gJChcIiNSZWdpc3RyYXRpb25FcnJvck1vZGFsXCIpO1xyXG4gICAgICAgIHRoaXMuYWRkTmV3UHJvamVjdEZvcm0gPSAkKFwiI2FkZE5ld1Byb2plY3RcIikubGVuZ3RoID8gJChcIiNhZGROZXdQcm9qZWN0XCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0c1BhZ2UgPSAkKFwiLnByb2plY3RzLXBhZ2VcIikubGVuZ3RoID8gJChcIi5wcm9qZWN0cy1wYWdlXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0c1NlY3Rpb24gPSAkKFwiLnByb2plY3RzLXNlY3Rpb25cIik7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0RWRpdFNlbGVjdG9yID0gXCIucHJvamVjdC1lZGl0XCI7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0RGVsZXRlU2VsZWN0b3IgPSBcIi5wcm9qZWN0LWRlbGV0ZVwiO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlUHJvamVjdEZvcm1TZWxlY3RvciA9IFwiI2RlbGV0ZVByb2plY3RcIjtcclxuICAgICAgICB0aGlzLnVwZGF0ZVByb2plY3RGb3JtU2VsZWN0b3IgPSBcIiN1cGRhdGVQcm9qZWN0XCI7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0UGFnZSA9ICQoXCIucHJvamVjdC1wYWdlXCIpLmxlbmd0aCA/ICQoXCIucHJvamVjdC1wYWdlXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5pc3N1ZVBhZ2UgPSAkKFwiLmlzc3VlLXBhZ2VcIikubGVuZ3RoID8gJChcIi5pc3N1ZS1wYWdlXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5hZGRJc3N1ZSA9ICQoXCIuYWRkLWlzc3VlXCIpO1xyXG4gICAgICAgIHRoaXMuYWRkSXNzdWVGb3JtID0gJChcIiNhZGROZXdJc3N1ZVwiKS5sZW5ndGggPyAkKFwiI2FkZE5ld0lzc3VlXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy51cGRhdGVJc3N1ZUZvcm0gPSAkKFwiI3VwZGF0ZUlzc3VlXCIpLmxlbmd0aCA/ICQoXCIjdXBkYXRlSXNzdWVcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmRlbGV0ZUlzc3VlRm9ybSA9ICQoXCIjZGVsZXRlSXNzdWVcIikubGVuZ3RoID8gJChcIiNkZWxldGVJc3N1ZVwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuaXNzdWVFZGl0U2VsZWN0b3IgPSBcIi5pc3N1ZS1lZGl0XCI7XHJcbiAgICAgICAgdGhpcy5pc3N1ZURlbGV0ZVNlbGVjdG9yID0gXCIuaXNzdWUtZGVsZXRlXCI7XHJcbiAgICAgICAgdGhpcy5hZGRDb21tZW50ID0gJChcIi5uZXctY29tbWVudFwiKS5sZW5ndGggPyAkKFwiLm5ldy1jb21tZW50XCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5hZGRXcm9rTG9nID0gJChcIi5uZXctd29ya2xvZ1wiKS5sZW5ndGggPyAkKFwiLm5ldy13b3JrbG9nXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5hZGRDb21tZW50TW9kYWwgPSAkKFwiI2FkZENvbW1lbnRNb2RhbFwiKTtcclxuICAgICAgICB0aGlzLmFkZFdvcmtMb2dNb2RhbCA9ICQoXCIjYWRkV29ya0xvZ01vZGFsXCIpO1xyXG4gICAgICAgIHRoaXMuYWRkTmV3Q29tbWVudEZvcm1TZWxlY3RvciA9IFwiI2FkZE5ld0NvbW1lbnRcIjtcclxuICAgICAgICB0aGlzLmFkZE5ld1dvcmtsb2dGb3JtU2VsZWN0b3IgPSBcIiNhZGROZXdXb3JrbG9nXCI7XHJcbiAgICAgICAgdGhpcy5kYXRlVGltZVBpY2tlciA9ICQoXCIjd29yay1sb2ctZGF0ZXRpbWVwaWNrZXJcIikubGVuZ3RoID8gJChcIiN3b3JrLWxvZy1kYXRldGltZXBpY2tlclwiKSA6IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXREb20oKSB7XHJcbiAgICAgICAgaWYodGhpcy5kYXRlVGltZVBpY2tlcikge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGVUaW1lUGlja2VyLmRhdGV0aW1lcGlja2VyKHtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHREYXRlOiBuZXcgRGF0ZSgpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKFwiI2RhdGUtdGltZS1waWNrZXItaW5wdXRcIikuZm9jdXMoKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAkKFwiLmlucHV0LWdyb3VwLWFkZG9uXCIpLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsb2dpbigkdGFyZ2V0KSB7XHJcbiAgICAgICAgbGV0IGRhdGEgPSAkdGFyZ2V0LnNlcmlhbGl6ZSgpO1xyXG4gICAgICAgIC8qbGV0IG5hbWUgPSBkYXRhWzBdLnZhbHVlO1xyXG4gICAgICAgIGxldCBwYXNzd29yZCA9IGRhdGFbMV0udmFsdWU7Ki9cclxuICAgICAgICBsZXQgbG9naW5Qcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvbG9naW5cIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbG9naW5Qcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gZGF0YS5yZWRpcmVjdFRvO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2luRXJyb3JNb2RhbC5tb2RhbCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlZ2lzdGVyKCR0YXJnZXQpIHtcclxuICAgICAgICBsZXQgZGF0YSA9ICR0YXJnZXQuc2VyaWFsaXplKCk7XHJcbiAgICAgICAgLypsZXQgbmFtZSA9IGRhdGFbMF0udmFsdWU7XHJcbiAgICAgICAgbGV0IHBhc3N3b3JkID0gZGF0YVsxXS52YWx1ZTsqL1xyXG4gICAgICAgIGxldCByZWdpc3RlclByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9yZWdpc3RlclwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZWdpc3RlclByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MgcmVnOlwiLCBkYXRhKTtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gZGF0YS5yZWRpcmVjdFRvO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvZ2luIGVycm9yXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgdGhpcy5yZWdpc3RlckVycm9yTW9kYWwubW9kYWwoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgdGhpcy5sb2dpbkFuZFJlZ2lzdGVyTGlzdGVuZXJzKCk7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0c0xpc3RlbmVycygpO1xyXG4gICAgICAgIHRoaXMuaXNzdWVMaXN0ZW5lcnMoKTtcclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLmxvYWQoKCkgPT4ge1xyXG4gICAgICAgICAgICBpZih0aGlzLnByb2plY3RzUGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZVByb2plY3RzUGFnZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLnByb2plY3RQYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvcHVsYXRlUHJvamVjdFBhZ2Uod2luZG93LnJlc291cmNlcy5wcm9qZWN0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYodGhpcy5pc3N1ZVBhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9wdWxhdGVJc3N1ZVBhZ2Uod2luZG93LnJlc291cmNlcy5pc3N1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm9qZWN0c0xpc3RlbmVycygpIHtcclxuICAgICAgICBpZih0aGlzLmNyZWF0ZVByb2plY3RCdXR0b24pIHtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVQcm9qZWN0QnV0dG9uLm9uKFwiY2xpY2tcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVQcm9qZWN0TW9kYWwubW9kYWwoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLmFkZE5ld1Byb2plY3RGb3JtKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkTmV3UHJvamVjdEZvcm0ub24oJ3N1Ym1pdCcsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUHJvamVjdCgkKGV2LnRhcmdldCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgdGhpcy5wcm9qZWN0RWRpdFNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGxldCAkcGFyZW50ID0gJChldi50YXJnZXQpLmNsb3Nlc3QoXCJ0clwiKTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3RJZCA9ICRwYXJlbnQuYXR0cihcImRhdGEtcHJvamVjdC1pZFwiKTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3ROYW1lID0gJHBhcmVudC5maW5kKFwiLnByLW5hbWVcIikuaHRtbCgpO1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdERlc2NyaXB0aW9uID0gJHBhcmVudC5maW5kKFwiLnByLWRlc2NyaXB0aW9uXCIpLmh0bWwoKTtcclxuXHJcbiAgICAgICAgICAgICQoXCIjZWRpdFByb2plY3RNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgICAgICAkKFwiI3VwZGF0ZWUtcHJvamVjdC1pZFwiKS52YWwocHJvamVjdElkKTtcclxuICAgICAgICAgICAgJChcIiNuZXctcHJvamVjdC1uYW1lXCIpLnZhbChwcm9qZWN0TmFtZSk7XHJcbiAgICAgICAgICAgICQoXCIjbmV3LWRlc2NyaXB0aW9uXCIpLnZhbChwcm9qZWN0RGVzY3JpcHRpb24pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIHRoaXMucHJvamVjdERlbGV0ZVNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0SWQgPSAkKGV2LnRhcmdldCkuY2xvc2VzdChcInRyXCIpLmF0dHIoXCJkYXRhLXByb2plY3QtaWRcIik7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlUHJvamVjdE1vZGFsXCIpLm1vZGFsKCk7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlLXByb2plY3QtaWRcIikudmFsKHByb2plY3RJZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwic3VibWl0XCIsIHRoaXMuZGVsZXRlUHJvamVjdEZvcm1TZWxlY3RvciwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlUHJvamVjdCgkKGV2LnRhcmdldCkuc2VyaWFsaXplKCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcInN1Ym1pdFwiLCB0aGlzLnVwZGF0ZVByb2plY3RGb3JtU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVByb2plY3QoJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCB0aGlzLmlzc3VlRWRpdFNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGxldCAkcGFyZW50ID0gJChldi50YXJnZXQpLmNsb3Nlc3QoXCJ0clwiKTtcclxuICAgICAgICAgICAgbGV0IGlzc3VlSWQgPSAkcGFyZW50LmF0dHIoXCJkYXRhLWlzc3VlLWlkXCIpO1xyXG4gICAgICAgICAgICBsZXQgaXNzdWVOYW1lID0gJHBhcmVudC5maW5kKFwiLmlzc3VlLW5hbWVcIikuaHRtbCgpO1xyXG4gICAgICAgICAgICBsZXQgaXNzdWVEZXNjcmlwdGlvbiA9ICRwYXJlbnQuZmluZChcIi5pc3N1ZS1kZXNjcmlwdGlvblwiKS5odG1sKCk7XHJcblxyXG4gICAgICAgICAgICAkKFwiI2VkaXRJc3N1ZU1vZGFsXCIpLm1vZGFsKCk7XHJcbiAgICAgICAgICAgICQoXCIjdXBkYXRlZS1pc3N1ZS1pZFwiKS52YWwoaXNzdWVJZCk7XHJcbiAgICAgICAgICAgICQoXCIjbmV3LWlzc3VlLW5hbWVcIikudmFsKGlzc3VlTmFtZSk7XHJcbiAgICAgICAgICAgICQoXCIjbmV3LWRlc2NyaXB0aW9uXCIpLnZhbChpc3N1ZURlc2NyaXB0aW9uKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCB0aGlzLmlzc3VlRGVsZXRlU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJoZXJlXCIpXHJcbiAgICAgICAgICAgIGxldCBpc3N1ZUlkID0gJChldi50YXJnZXQpLmNsb3Nlc3QoXCJ0clwiKS5hdHRyKFwiZGF0YS1pc3N1ZS1pZFwiKTtcclxuICAgICAgICAgICAgJChcIiNkZWxldGVJc3N1ZU1vZGFsXCIpLm1vZGFsKCk7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlLWlzc3VlLWlkXCIpLnZhbChpc3N1ZUlkKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5kZWxldGVJc3N1ZUZvcm0pIHtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVJc3N1ZUZvcm0ub24oXCJzdWJtaXRcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWxldGVJc3N1ZSgkKGV2LnRhcmdldCkuc2VyaWFsaXplKCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMudXBkYXRlSXNzdWVGb3JtKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSXNzdWVGb3JtLm9uKFwic3VibWl0XCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSXNzdWUoJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIFwiLnByb2plY3QtaXRlbVwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgbGV0ICR0YXJnZXQgPSAkKGV2LnRhcmdldCkuY2xvc2VzdChcIi5wcm9qZWN0LWl0ZW1cIik7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvcHJvamVjdC9cIiArICR0YXJnZXQuYXR0cihcImRhdGEtcHJvamVjdC1pZFwiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5pc3N1ZS1pdGVtXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICBsZXQgJHRhcmdldCA9ICQoZXYudGFyZ2V0KS5jbG9zZXN0KFwiLmlzc3VlLWl0ZW1cIik7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvaXNzdWUvXCIgKyAkdGFyZ2V0LmF0dHIoXCJkYXRhLWlzc3VlLWlkXCIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNvY2tldC5vbihcInVwZGF0ZVByb2plY3RzXCIsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZVByb2plY3RzUGFnZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmFkZElzc3VlLm9uKFwiY2xpY2tcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygkKFwiI2FkZElzc3VlTW9kYWxcIikpXHJcbiAgICAgICAgICAgICQoXCIjYWRkSXNzdWVNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZih0aGlzLmFkZElzc3VlRm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZElzc3VlRm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VyaWFsaXplZCA9ICQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKTtcclxuICAgICAgICAgICAgICAgIGxldCBkZXNlcmlhbGl6ZWREYXRhID0gdGhpcy5kZXNlcmlhbGl6ZUZvcm0oc2VyaWFsaXplZCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZXN0aW1hdGVkTWludXRlcyA9IHRoaXMuY29udmVydEVzdGltYXRlKGRlc2VyaWFsaXplZERhdGEub3JpZ2luYWxFc3RpbWF0ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoIWVzdGltYXRlZE1pbnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiLm9yaWdpbmFsLWVzdGltYXRlLWdyb3VwXCIpLmFkZENsYXNzKFwiaGFzLWVycm9yXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBkZXNlcmlhbGl6ZWREYXRhLm9yaWdpbmFsRXN0aW1hdGUgPSBlc3RpbWF0ZWRNaW51dGVzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVJc3N1ZShkZXNlcmlhbGl6ZWREYXRhKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRlc2VyaWFsaXplZERhdGEpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJ1cGRhdGVJc3N1ZXNcIiwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIGlmKGRhdGEucHJvamVjdCA9PSByZXNvdXJjZXMucHJvamVjdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZVByb2plY3RQYWdlKHJlc291cmNlcy5wcm9qZWN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlzc3VlTGlzdGVuZXJzKCkge1xyXG4gICAgICAgIGlmKHRoaXMuYWRkQ29tbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZENvbW1lbnQub24oXCJjbGlja1wiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ29tbWVudE1vZGFsLm1vZGFsKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5hZGRXcm9rTG9nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkV3Jva0xvZy5vbihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRXb3JrTG9nTW9kYWwubW9kYWwoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcInN1Ym1pdFwiLCB0aGlzLmFkZE5ld0NvbW1lbnRGb3JtU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUNvbW1lbnQoJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJzdWJtaXRcIiwgdGhpcy5hZGROZXdXb3JrbG9nRm9ybVNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJ1cGRhdGVDb21tZW50c1wiLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgaWYoZGF0YS5pc3N1ZSA9PSByZXNvdXJjZXMuaXNzdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9wdWxhdGVJc3N1ZVBhZ2UocmVzb3VyY2VzLmlzc3VlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZGVzZXJpYWxpemVGb3JtKHNlcmlhbGl6ZWRGb3JtRGF0YSkge1xyXG4gICAgICAgIGxldCBzZXJpYWxpemVkRGF0YUFycmF5ID0gc2VyaWFsaXplZEZvcm1EYXRhLnNwbGl0KFwiJlwiKTtcclxuICAgICAgICBsZXQgZGVzZXJpYWxpemVkZERhdGEgPSBuZXcgT2JqZWN0KCk7XHJcbiAgICAgICAgbGV0IGl0ZW1TcGxpdDtcclxuXHJcbiAgICAgICAgZm9yKGxldCBsZW5ndGggPSBzZXJpYWxpemVkRGF0YUFycmF5Lmxlbmd0aCwgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBzZXJpYWxpemVkRGF0YUFycmF5W2ldID0gc2VyaWFsaXplZERhdGFBcnJheVtpXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpO1xyXG5cclxuICAgICAgICAgICAgaXRlbVNwbGl0ID0gc2VyaWFsaXplZERhdGFBcnJheVtpXS5zcGxpdChcIj1cIik7XHJcbiAgICAgICAgICAgIGRlc2VyaWFsaXplZGREYXRhW2l0ZW1TcGxpdFswXV0gPSBpdGVtU3BsaXRbMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkZXNlcmlhbGl6ZWRkRGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBjb252ZXJ0RXN0aW1hdGUoZXN0aW1hdGVTdHJpbmcpIHtcclxuICAgICAgICBsZXQgcmVnZXhwID0gLyheXFxkKmggXFxkKm0kKXwoXlxcZCooXFwuXFxkKyk/aCQpfCheXFxkKm0kKS87IC8qZS5nIDFoIDMwbSBvciAzMG0gb3IgMS41aCovXHJcbiAgICAgICAgbGV0IG1hdGNoID0gZXN0aW1hdGVTdHJpbmcubWF0Y2gocmVnZXhwKTtcclxuICAgICAgICBsZXQgbWF0Y2hTcGxpdDtcclxuICAgICAgICBsZXQgc3BsaXRMZW5ndGg7XHJcbiAgICAgICAgbGV0IGhvdXJzO1xyXG4gICAgICAgIGxldCBtaW51dGVzID0gMDtcclxuICAgICAgICBsZXQgYWRkaXRpb25hbE1pbnV0ZXMgPSAwO1xyXG5cclxuICAgICAgICBpZighbWF0Y2gpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWF0Y2ggPSBtYXRjaFswXTtcclxuICAgICAgICBtYXRjaFNwbGl0ID0gbWF0Y2guc3BsaXQoXCIgXCIpO1xyXG4gICAgICAgIHNwbGl0TGVuZ3RoID0gbWF0Y2hTcGxpdC5sZW5ndGg7XHJcblxyXG4gICAgICAgIGlmKHNwbGl0TGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgbGV0IGluZGV4T2ZNID0gbWF0Y2hTcGxpdFswXS5pbmRleE9mKFwibVwiKTtcclxuICAgICAgICAgICAgbGV0IGluZGV4T2ZIID0gbWF0Y2hTcGxpdFswXS5pbmRleE9mKFwiaFwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGluZGV4T2ZNICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBtaW51dGVzID0gbWF0Y2hTcGxpdFswXS5zbGljZSgwLCBpbmRleE9mTSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKGluZGV4T2ZIICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBob3VycyA9IG1hdGNoU3BsaXRbMF0uc2xpY2UoMCwgaW5kZXhPZkgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgaW5kZXhPZkggPSBtYXRjaFNwbGl0WzBdLmluZGV4T2YoXCJoXCIpO1xyXG4gICAgICAgICAgICBsZXQgaW5kZXhPZk0gPSBtYXRjaFNwbGl0WzFdLmluZGV4T2YoXCJtXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYoaW5kZXhPZkggIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGhvdXJzID0gbWF0Y2hTcGxpdFswXS5zbGljZSgwLCBpbmRleE9mSCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKGluZGV4T2ZNICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBtaW51dGVzID0gbWF0Y2hTcGxpdFsxXS5zbGljZSgwLCBpbmRleE9mTSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKGhvdXJzKSB7XHJcbiAgICAgICAgICAgIGFkZGl0aW9uYWxNaW51dGVzID0gcGFyc2VJbnQoNjAgKiBob3Vycyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtaW51dGVzID0gcGFyc2VJbnQobWludXRlcyk7XHJcbiAgICAgICAgbWludXRlcyArPSBhZGRpdGlvbmFsTWludXRlcztcclxuXHJcbiAgICAgICAgcmV0dXJuIG1pbnV0ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlQ29tbWVudChkYXRhKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSlcclxuICAgICAgICBsZXQgY3JlYXRlQ29tbWVudFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9jb21tZW50XCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY3JlYXRlQ29tbWVudFByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MgY3JlYXRpbmcgY29tbWVudDpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICQoXCIjYWRkQ29tbWVudE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciBkdXJpbmcgY29tbWVudCBjcmVhdGlvblwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZHVyaW5nIGNvbW1lbnQgY3JlYXRpb25cIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlSXNzdWUoZGF0YSkge1xyXG4gICAgICAgIGxldCBjcmVhdGVJc3N1ZVByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9pc3N1ZVwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MsIFwiLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNyZWF0ZUlzc3VlUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcyByZWc6XCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAkKFwiI2FkZElzc3VlTW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGR1cmluZyBwcm9qZWN0IGNyZWF0aW9uXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgaXNzdWUgY3JlYXRpb25cIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlUHJvamVjdChkYXRhKSB7XHJcbiAgICAgICAgbGV0IGRlbGV0ZVByb2plY3RQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvcHJvamVjdFwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVsZXRlUHJvamVjdFByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZVByb2plY3RNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgcmVtb3ZpbmcgcHJvamVjdFwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3Igd2hpbGUgcmVtb3ZpbmcgcHJvamVjdFwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVQcm9qZWN0KGRhdGEpIHtcclxuICAgICAgICBsZXQgdXBkYXRlUHJvamVjdFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9qZWN0XCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2VkaXRQcm9qZWN0TW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdXBkYXRlUHJvamVjdFByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZVByb2plY3RNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgcmVtb3ZpbmcgcHJvamVjdFwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgdXBkYXRpbmcgcHJvamVjdHNcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlSXNzdWUoZGF0YSkge1xyXG4gICAgICAgIGxldCBkZWxldGVJc3N1ZVByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9pc3N1ZVwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVsZXRlSXNzdWVQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgJChcIiNkZWxldGVJc3N1ZU1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciByZW1vdmluZyBpc3N1ZVwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgcmVtb3ZpbmcgaXNzdWVcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlSXNzdWUoZGF0YSkge1xyXG4gICAgICAgIGxldCB1cGRhdGVJc3N1ZVByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9pc3N1ZVwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNlZGl0UHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHVwZGF0ZUlzc3VlUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlUHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZyBpc3N1ZVwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3Igd2hpbGUgdXBkYXRpbmcgaXNzdWVcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcG9wdWxhdGVQcm9qZWN0UGFnZShwcm9qZWN0SWQpIHtcclxuICAgICAgICBsZXQgaXNzdWVzUHJvbWlzZSA9IHRoaXMuZ2V0SXNzdWVzKHByb2plY3RJZCwgcG9wdWxhdGVJc3N1ZXNUZW1wbGF0ZSk7XHJcbiAgICAgICAgbGV0ICRpc3N1ZXNTZWN0aW9uID0gJChcIi5wcm9qZWN0LXBhZ2UgLmlzc3Vlcy1zZWN0aW9uXCIpO1xyXG5cclxuICAgICAgICBpc3N1ZXNQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpc3N1ZXMgY29sbGVjdGlvbiBpczo6XCIsIGRhdGEpO1xyXG4gICAgICAgICAgICBwb3B1bGF0ZUlzc3Vlc1RlbXBsYXRlKGRhdGEpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHBvcHVsYXRlSXNzdWVzVGVtcGxhdGUoaXNzdWVzTGlzdCkge1xyXG4gICAgICAgICAgICBsZXQgZ2V0UHJvamVjdHNQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgdXJsOiBcIi90ZW1wbGF0ZXMvdGVtcGxhdGVzLmh0bWxcIixcclxuICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnaHRtbCdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGdldFByb2plY3RzUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc291cmNlID0gJChkYXRhKS5maW5kKFwiI3Byb2plY3QtdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gSGFuZGxlYmFycy5jb21waWxlKHNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGV4dCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBpc3N1ZXNMaXN0OiBpc3N1ZXNMaXN0XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgbGV0IGh0bWwgPSB0ZW1wbGF0ZShjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgICRpc3N1ZXNTZWN0aW9uLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2VkaXRJc3N1ZU1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBkdXJpbmcgaXNzdWVzIHRlbXBsYXRlIGZldGNoXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZHVyaW5nIHByb2plY3QgY3JlYXRpb25cIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwb3B1bGF0ZUlzc3VlUGFnZShpc3N1ZUlkKSB7XHJcbiAgICAgICAgbGV0IGlzc3Vlc1Byb21pc2UgPSB0aGlzLmdldENvbW1lbnRzKGlzc3VlSWQpO1xyXG4gICAgICAgIGxldCAkY29tbWVudHNTZWN0aW9uID0gJChcIi5pc3N1ZS1wYWdlIC5pc3N1ZS1jb21tZW50c1wiKTtcclxuXHJcbiAgICAgICAgaXNzdWVzUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaXNzdWVzIGNvbW1lbnRzIGlzOjpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgIHBvcHVsYXRlSXNzdWVzVGVtcGxhdGUoZGF0YSk7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcG9wdWxhdGVJc3N1ZXNUZW1wbGF0ZShjb21tZW50c0xpc3QpIHtcclxuICAgICAgICAgICAgbGV0IGdldFByb2plY3RzUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgIHVybDogXCIvdGVtcGxhdGVzL3RlbXBsYXRlcy5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2h0bWwnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBnZXRQcm9qZWN0c1Byb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNvdXJjZSA9ICQoZGF0YSkuZmluZChcIiNjb21tZW50cy10ZW1wbGF0ZVwiKS5odG1sKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGUgPSBIYW5kbGViYXJzLmNvbXBpbGUoc291cmNlKTtcclxuICAgICAgICAgICAgICAgIGxldCBjb250ZXh0ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1lbnRzTGlzdDogY29tbWVudHNMaXN0XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgbGV0IGh0bWwgPSB0ZW1wbGF0ZShjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgICRjb21tZW50c1NlY3Rpb24uaHRtbChodG1sKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBkdXJpbmcgY29tbWVudHMgdGVtcGxhdGUgZmV0Y2hcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgcHJvamVjdCBjcmVhdGlvblwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHBvcHVsYXRlUHJvamVjdHNQYWdlKCkge1xyXG4gICAgICAgIGxldCBwcm9qZWN0c1Byb21pc2UgPSB0aGlzLmdldFByb2plY3RzKCk7XHJcbiAgICAgICAgbGV0IHByb2plY3RzO1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgcHJvamVjdHNQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJmZXRjaGVkIHByb2plY3RzOlwiLCBkYXRhKTtcclxuICAgICAgICAgICAgcG9wdWxhdGVQcm9qZWN0c1RlbXBsYXRlKGRhdGEpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGZldGNoaW5nIHByb2plY3RzXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBmZXRjaGluZyBwcm9qZWN0c1wiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcG9wdWxhdGVQcm9qZWN0c1RlbXBsYXRlKHByb2plY3RzTGlzdCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwcm9qZWN0c0xpc3QpXHJcbiAgICAgICAgICAgIGxldCBnZXRQcm9qZWN0c1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3RlbXBsYXRlcy90ZW1wbGF0ZXMuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZ2V0UHJvamVjdHNQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBzb3VyY2UgPSAkKGRhdGEpLmZpbmQoXCIjcHJvamVjdHMtdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gSGFuZGxlYmFycy5jb21waWxlKHNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGV4dCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0c0xpc3Q6IHByb2plY3RzTGlzdFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGxldCBodG1sID0gdGVtcGxhdGUoY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnByb2plY3RzU2VjdGlvbi5odG1sKGh0bWwpO1xyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBkdXJpbmcgcHJvamVjdHMgdGVtcGxhdGUgZmV0Y2hcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgcHJvamVjdCBjcmVhdGlvblwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVByb2plY3QoJHRhcmdldCkge1xyXG4gICAgICAgIGxldCBkYXRhID0gJHRhcmdldC5zZXJpYWxpemUoKTtcclxuXHJcbiAgICAgICAgbGV0IGNyZWF0ZVByb2plY3RQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvcHJvamVjdFwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MsIFwiLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICQoXCIjYWRkUHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNyZWF0ZVByb2plY3RQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzIHJlZzpcIiwgZGF0YSk7XHJcblxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGR1cmluZyBwcm9qZWN0IGNyZWF0aW9uXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgcHJvamVjdCBjcmVhdGlvblwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQcm9qZWN0cyhjYWxsYmFjaykge1xyXG4gICAgICAgIGxldCBnZXRQcm9qZWN0c1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9qZWN0c0l0ZW1zXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZ2V0UHJvamVjdHNQcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldElzc3Vlcyhwcm9qZWN0SWQsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJwcmk6XCIsIHByb2plY3RJZCk7XHJcbiAgICAgICAgbGV0IGdldElzc3Vlc1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9pc3N1ZXNcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICBwcm9qZWN0SWQ6IHByb2plY3RJZFxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBnZXRJc3N1ZXNQcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENvbW1lbnRzKGlzc3VlSWQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImlzc3VlSWQ6XCIsIGlzc3VlSWQpO1xyXG4gICAgICAgIGxldCBnZXRDb21tZW50c1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9jb21tZW50c1wiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgIGlzc3VlSWQ6IGlzc3VlSWRcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZ2V0Q29tbWVudHNQcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ2luQW5kUmVnaXN0ZXJMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgaWYodGhpcy5sb2dpbkZvcm0pIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dpbkZvcm0ub24oXCJzdWJtaXRcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dpbigkKCBldi50YXJnZXQgKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5yZWdpc3RlckZvcm0pIHtcclxuICAgICAgICAgICAgdGhpcy5yZWdpc3RlckZvcm0ub24oXCJzdWJtaXRcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCQoXCIjcGFzc3dvcmQxXCIpLnZhbCgpICE9ICQoXCIjcGFzc3dvcmQyXCIpLnZhbCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcIi5mb3JtLWdyb3VwXCIpLmFkZENsYXNzKFwiaGFzLWVycm9yXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwicGFzc3dvcmRzIHlvdSBlbnRlcmVkIGFyZSBub3QgaWRlbnRpY2FsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMucmVnaXN0ZXIoJCggZXYudGFyZ2V0ICkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IElzc3VlVHJhY2tlciBmcm9tICcuL0lzc3VlVHJhY2tlcic7XHJcblxyXG5sZXQgaXNzdWVUcmFja2VyID0gbmV3IElzc3VlVHJhY2tlcigpO1xyXG4vL2NvbnNvbGUubG9nKElzc3VlVHJhY2tlcik7XHJcbi8vdmFyIFthLCBiLCBjXSA9IFsxICwgMiwgM107XHJcbiJdfQ==
