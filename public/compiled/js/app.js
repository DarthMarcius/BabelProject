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
            this.editCommentThumbSelector = ".edit-comment";
            this.deleteCommentThumbSelector = ".delete-comment";
            this.deleteCommentForm = $("#deleteComment").length ? $("#deleteComment") : false;
            this.updateCommentForm = $("#updateComment").length ? $("#updateComment") : false;
            this.deleteWorklogButtonSelector = ".delete-work-log";
            this.ediWorklogButtonSelector = ".edit-work-log";
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
                //console.log($("#addIssueModal"))
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
                var serialized = $(ev.target).serialize();
                var deserializedData = _this5.deserializeForm(serialized);
                var estimatedMinutes = _this5.convertEstimate(deserializedData.timeSpent);
                var logDateTime = new Date($("#date-time-picker-input").val());
                var result = new Object();

                if (!logDateTime || logDateTime === "Invalid Date") {
                    $(".log-date-time").addClass("has-error");
                    return;
                }

                if (!estimatedMinutes) {
                    $(".time-spent-group").addClass("has-error");
                    return;
                }

                result.estimatedMinutes = estimatedMinutes;
                result.logDateTime = logDateTime;
                result.text = deserializedData.text;
                result.creator = deserializedData.creator;
                result.issueId = deserializedData.issueId;

                _this5.createWorklog(result);
            });

            this.socket.on("updateComments", function (data) {
                if (data.issue == window.resources.issue) {
                    _this5.populateIssueComments(window.resources.issue);
                }
            });

            this.socket.on("updateWorkLogs", function (data) {
                if (data.issue == window.resources.issue) {
                    _this5.populateIssueWorklogs(window.resources.issue);
                }
            });

            $("body").on("click", this.deleteCommentThumbSelector, function (ev) {
                $("#deleteCommentModal").modal();
                $("#delete-comment-id").val($(ev.target).closest(".comment-item").attr("data-comment-id"));
            });

            $("body").on("click", this.editCommentThumbSelector, function (ev) {
                $("#editCommentModal").modal();
                $("#edit-comment-id").val($(ev.target).closest(".comment-item").attr("data-comment-id"));
                $("#comment-text").val($(ev.target).closest(".comment-item").find(".panel-body").text().trim());
            });

            if (this.deleteCommentForm) {
                this.deleteCommentForm.on("submit", function (ev) {
                    ev.preventDefault();
                    _this5.deleteComment($(ev.target).serialize());
                });
            }

            if (this.updateCommentForm) {
                this.updateCommentForm.on("submit", function (ev) {
                    ev.preventDefault();
                    _this5.updateComment($(ev.target).serialize());
                });
            }

            $("body").on("click", this.deleteWorklogButtonSelector, function (ev) {
                console.log("wha1");
                $("#deleteWorklogModal").modal();
                $("#delete-work-log-id").val($(ev.target).closest(".work-log-item").attr("data-work-log-id"));
            });

            $("body").on("click", this.ediWorklogButtonSelector, function (ev) {
                console.log("wha");
                $("#editWorklogModal").modal();
                $("#edit-work-log-id").val($(ev.target).closest(".work-log-item").attr("data-work-log-id"));
                $("#edit-work-log-text").val($(ev.target).closest(".work-log-item").find(".worklog-text").text().trim());
            });
        }
    }, {
        key: "deserializeForm",
        value: function deserializeForm(serializedFormData) {
            var serializedDataArray = serializedFormData.split("&");
            var deserializedData = new Object();
            var itemSplit = void 0;

            for (var length = serializedDataArray.length, i = 0; i < length; i++) {
                serializedDataArray[i] = serializedDataArray[i].replace(/\+/g, " ");

                itemSplit = serializedDataArray[i].split("=");
                deserializedData[itemSplit[0]] = itemSplit[1];
            }
            return deserializedData;
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
        key: "minutesToString",
        value: function minutesToString(minutes) {
            var hours = minutes / 60;
            var resultString = hours < 1 ? minutes == 1 ? parseInt(minutes) + " minute" : parseInt(minutes) + " minutes" : hours == 1 ? hours + " hour" : hours + " hours";
            resultString = 'Time spent ' + resultString;

            return resultString;
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
            this.populateIssueComments(issueId);
            this.populateIssueWorklogs(issueId);
        }
    }, {
        key: "populateIssueComments",
        value: function populateIssueComments(issueId) {
            var commentsPromise = this.getComments(issueId);
            var $commentsSection = $(".issue-page .issue-comments");

            commentsPromise.then(function (data) {
                console.log("issues comments is::", data);
                populateCommentsTemplate(data);
            });

            function populateCommentsTemplate(commentsList) {
                commentsList.forEach(function (comment) {
                    if (comment.creator._id === window.resources.user.id) {
                        comment.isCommentOwner = true;
                    } else {
                        comment.isCommentOwner = false;
                    }
                });

                var getCommentsPromise = new Promise(function (resolve, reject) {
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

                getCommentsPromise.then(function (data) {
                    var source = $(data).find("#comments-template").html();
                    var template = Handlebars.compile(source);
                    var context = {
                        commentsList: commentsList,
                        currentUser: window.resources.user.id
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
        key: "populateIssueWorklogs",
        value: function populateIssueWorklogs(issueId) {
            var _this6 = this;

            var workLogsPromise = this.getWorklogs(issueId);
            var $workLogsSection = $(".issue-page .issue-worklogs");

            workLogsPromise.then(function (data) {
                console.log("issues logs is:", data);
                data.forEach(function (workLog) {
                    workLog.timeSpent = _this6.minutesToString(workLog.timeSpent);
                });

                populateWorklogsTemplate(data);
            });

            function populateWorklogsTemplate(workLogsList) {
                workLogsList.forEach(function (workLog) {
                    if (workLog.creator._id === window.resources.user.id) {
                        workLog.isWorkLogOwner = true;
                    } else {
                        workLog.isWorkLogOwner = false;
                    }
                });

                var getWorkLogsPromise = new Promise(function (resolve, reject) {
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

                getWorkLogsPromise.then(function (data) {
                    var source = $(data).find("#work-logs-template").html();
                    var template = Handlebars.compile(source);
                    var context = {
                        workLogsList: workLogsList,
                        currentUser: window.resources.user.id
                    };
                    var html = template(context);
                    $workLogsSection.html(html);
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
            console.log("issueIdl:", issueId);
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
        key: "getWorklogs",
        value: function getWorklogs(issueId) {
            var getWorkLogsPromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/logs",
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
            return getWorkLogsPromise;
        }
    }, {
        key: "updateComment",
        value: function updateComment(data) {
            var deserializedData = this.deserializeForm(data);
            deserializedData.issueId = window.resources.issue;
            var updateCommentPromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/comment",
                    method: "PUT",
                    data: deserializedData
                });

                request.done(function (data) {
                    console.log("success, ", data);
                    $("#editCommentModal").modal("hide");
                    resolve(data);
                });

                request.fail(function (jqXHR, textStatus) {
                    reject(jqXHR, textStatus);
                });
            });

            updateCommentPromise.then(function (data) {
                $("#deleteProjectModal").modal("hide");
            }).catch(function (jqXHR, textStatus) {
                console.log("error updating issue", jqXHR, textStatus);
                alert("Error while updating issue");
            });
        }
    }, {
        key: "deleteComment",
        value: function deleteComment(data) {
            console.log(data);
            var deserializedData = this.deserializeForm(data);
            deserializedData.issueId = window.resources.issue;
            var deleteCommentPromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/comment",
                    method: "DELETE",
                    data: deserializedData
                });

                request.done(function (data) {
                    console.log("success, ", data);
                    resolve(data);
                });

                request.fail(function (jqXHR, textStatus) {
                    reject(jqXHR, textStatus);
                });
            });

            deleteCommentPromise.then(function (data) {
                $("#deleteCommentModal").modal("hide");
            }).catch(function (jqXHR, textStatus) {
                console.log("error removing comment", jqXHR, textStatus);
                alert("Error removing comment");
            });
        }
    }, {
        key: "createWorklog",
        value: function createWorklog(data) {
            var createWorklogPromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/log",
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

            createWorklogPromise.then(function (data) {
                console.log("success reg:", data);
                $("#addWorkLogModal").modal("hide");
            }).catch(function (jqXHR, textStatus) {
                console.log("error during log creation", jqXHR, textStatus);
                alert("Error during log creation");
            });
        }
    }, {
        key: "loginAndRegisterListeners",
        value: function loginAndRegisterListeners() {
            var _this7 = this;

            if (this.loginForm) {
                this.loginForm.on("submit", function (ev) {
                    ev.preventDefault();
                    _this7.login($(ev.target));
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
                    _this7.register($(ev.target));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRcXElzc3VlVHJhY2tlci5qcyIsInNjcmlwdFxcYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztJQ0FxQjtBQUNqQixhQURpQixZQUNqQixHQUFjOzhCQURHLGNBQ0g7O0FBQ1YsWUFBSSxTQUFTLE9BQU8sUUFBUCxDQUFnQixRQUFoQixJQUE0QixXQUE1QixHQUEwQyxzQkFBc0IsVUFBVSxJQUFWLEdBQWlCLGFBQWEsT0FBTyxRQUFQLENBQWdCLFFBQWhCLENBRGpHO0FBRVYsYUFBSyxNQUFMLEdBQWMsR0FBRyxNQUFILENBQWQsQ0FGVTtBQUdWLGFBQUssU0FBTCxHQUhVO0FBSVYsYUFBSyxPQUFMLEdBSlU7QUFLVixhQUFLLFlBQUwsR0FMVTtLQUFkOztpQkFEaUI7O29DQVNMO0FBQ1IsaUJBQUssbUJBQUwsR0FBMkIsRUFBRSxjQUFGLEVBQWtCLE1BQWxCLEdBQTJCLEVBQUUsY0FBRixDQUEzQixHQUErQyxLQUEvQyxDQURuQjtBQUVSLGlCQUFLLGtCQUFMLEdBQTBCLEVBQUUsa0JBQUYsRUFBc0IsTUFBdEIsR0FBK0IsRUFBRSxrQkFBRixDQUEvQixHQUF1RCxLQUF2RCxDQUZsQjtBQUdSLGlCQUFLLFNBQUwsR0FBaUIsRUFBRSxhQUFGLEVBQWlCLE1BQWpCLEdBQTBCLEVBQUUsYUFBRixDQUExQixHQUE2QyxLQUE3QyxDQUhUO0FBSVIsaUJBQUssZUFBTCxHQUF1QixFQUFFLGtCQUFGLENBQXZCLENBSlE7QUFLUixpQkFBSyxZQUFMLEdBQW9CLEVBQUUsZ0JBQUYsRUFBb0IsTUFBcEIsR0FBNkIsRUFBRSxnQkFBRixDQUE3QixHQUFtRCxLQUFuRCxDQUxaO0FBTVIsaUJBQUssa0JBQUwsR0FBMEIsRUFBRSx5QkFBRixDQUExQixDQU5RO0FBT1IsaUJBQUssaUJBQUwsR0FBeUIsRUFBRSxnQkFBRixFQUFvQixNQUFwQixHQUE2QixF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bGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBJc3N1ZVRyYWNrZXIge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgbGV0IGlvUGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSA9PSBcImxvY2FsaG9zdFwiID8gXCJodHRwOi8vbG9jYWxob3N0OlwiICsgcmVzb3VyY2VzLnBvcnQgOiBcImh0dHBzOi8vXCIgKyB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWU7XHJcbiAgICAgICAgdGhpcy5zb2NrZXQgPSBpbyhpb1BhdGgpO1xyXG4gICAgICAgIHRoaXMuaW5pdENhY2hlKCk7XHJcbiAgICAgICAgdGhpcy5pbml0RG9tKCk7XHJcbiAgICAgICAgdGhpcy5zZXRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0Q2FjaGUoKSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVQcm9qZWN0QnV0dG9uID0gJChcIi5hZGQtcHJvamVjdFwiKS5sZW5ndGggPyAkKFwiLmFkZC1wcm9qZWN0XCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVQcm9qZWN0TW9kYWwgPSAkKFwiI2FkZFByb2plY3RNb2RhbFwiKS5sZW5ndGggPyAkKFwiI2FkZFByb2plY3RNb2RhbFwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubG9naW5Gb3JtID0gJChcIi5sb2dpbi1mb3JtXCIpLmxlbmd0aCA/ICQoXCIubG9naW4tZm9ybVwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubG9naW5FcnJvck1vZGFsID0gJChcIiNMb2dpbkVycm9yTW9kYWxcIik7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckZvcm0gPSAkKFwiLnJlZ2lzdGVyLWZvcm1cIikubGVuZ3RoID8gJChcIi5yZWdpc3Rlci1mb3JtXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckVycm9yTW9kYWwgPSAkKFwiI1JlZ2lzdHJhdGlvbkVycm9yTW9kYWxcIik7XHJcbiAgICAgICAgdGhpcy5hZGROZXdQcm9qZWN0Rm9ybSA9ICQoXCIjYWRkTmV3UHJvamVjdFwiKS5sZW5ndGggPyAkKFwiI2FkZE5ld1Byb2plY3RcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLnByb2plY3RzUGFnZSA9ICQoXCIucHJvamVjdHMtcGFnZVwiKS5sZW5ndGggPyAkKFwiLnByb2plY3RzLXBhZ2VcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLnByb2plY3RzU2VjdGlvbiA9ICQoXCIucHJvamVjdHMtc2VjdGlvblwiKTtcclxuICAgICAgICB0aGlzLnByb2plY3RFZGl0U2VsZWN0b3IgPSBcIi5wcm9qZWN0LWVkaXRcIjtcclxuICAgICAgICB0aGlzLnByb2plY3REZWxldGVTZWxlY3RvciA9IFwiLnByb2plY3QtZGVsZXRlXCI7XHJcbiAgICAgICAgdGhpcy5kZWxldGVQcm9qZWN0Rm9ybVNlbGVjdG9yID0gXCIjZGVsZXRlUHJvamVjdFwiO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUHJvamVjdEZvcm1TZWxlY3RvciA9IFwiI3VwZGF0ZVByb2plY3RcIjtcclxuICAgICAgICB0aGlzLnByb2plY3RQYWdlID0gJChcIi5wcm9qZWN0LXBhZ2VcIikubGVuZ3RoID8gJChcIi5wcm9qZWN0LXBhZ2VcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmlzc3VlUGFnZSA9ICQoXCIuaXNzdWUtcGFnZVwiKS5sZW5ndGggPyAkKFwiLmlzc3VlLXBhZ2VcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmFkZElzc3VlID0gJChcIi5hZGQtaXNzdWVcIik7XHJcbiAgICAgICAgdGhpcy5hZGRJc3N1ZUZvcm0gPSAkKFwiI2FkZE5ld0lzc3VlXCIpLmxlbmd0aCA/ICQoXCIjYWRkTmV3SXNzdWVcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUlzc3VlRm9ybSA9ICQoXCIjdXBkYXRlSXNzdWVcIikubGVuZ3RoID8gJChcIiN1cGRhdGVJc3N1ZVwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlSXNzdWVGb3JtID0gJChcIiNkZWxldGVJc3N1ZVwiKS5sZW5ndGggPyAkKFwiI2RlbGV0ZUlzc3VlXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5pc3N1ZUVkaXRTZWxlY3RvciA9IFwiLmlzc3VlLWVkaXRcIjtcclxuICAgICAgICB0aGlzLmlzc3VlRGVsZXRlU2VsZWN0b3IgPSBcIi5pc3N1ZS1kZWxldGVcIjtcclxuICAgICAgICB0aGlzLmFkZENvbW1lbnQgPSAkKFwiLm5ldy1jb21tZW50XCIpLmxlbmd0aCA/ICQoXCIubmV3LWNvbW1lbnRcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmFkZFdyb2tMb2cgPSAkKFwiLm5ldy13b3JrbG9nXCIpLmxlbmd0aCA/ICQoXCIubmV3LXdvcmtsb2dcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmFkZENvbW1lbnRNb2RhbCA9ICQoXCIjYWRkQ29tbWVudE1vZGFsXCIpO1xyXG4gICAgICAgIHRoaXMuYWRkV29ya0xvZ01vZGFsID0gJChcIiNhZGRXb3JrTG9nTW9kYWxcIik7XHJcbiAgICAgICAgdGhpcy5hZGROZXdDb21tZW50Rm9ybVNlbGVjdG9yID0gXCIjYWRkTmV3Q29tbWVudFwiO1xyXG4gICAgICAgIHRoaXMuYWRkTmV3V29ya2xvZ0Zvcm1TZWxlY3RvciA9IFwiI2FkZE5ld1dvcmtsb2dcIjtcclxuICAgICAgICB0aGlzLmRhdGVUaW1lUGlja2VyID0gJChcIiN3b3JrLWxvZy1kYXRldGltZXBpY2tlclwiKS5sZW5ndGggPyAkKFwiI3dvcmstbG9nLWRhdGV0aW1lcGlja2VyXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5lZGl0Q29tbWVudFRodW1iU2VsZWN0b3IgPSBcIi5lZGl0LWNvbW1lbnRcIjtcclxuICAgICAgICB0aGlzLmRlbGV0ZUNvbW1lbnRUaHVtYlNlbGVjdG9yID0gXCIuZGVsZXRlLWNvbW1lbnRcIjtcclxuICAgICAgICB0aGlzLmRlbGV0ZUNvbW1lbnRGb3JtID0gJChcIiNkZWxldGVDb21tZW50XCIpLmxlbmd0aCA/ICQoXCIjZGVsZXRlQ29tbWVudFwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ29tbWVudEZvcm0gPSAkKFwiI3VwZGF0ZUNvbW1lbnRcIikubGVuZ3RoID8gJChcIiN1cGRhdGVDb21tZW50XCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5kZWxldGVXb3JrbG9nQnV0dG9uU2VsZWN0b3IgPSBcIi5kZWxldGUtd29yay1sb2dcIjtcclxuICAgICAgICB0aGlzLmVkaVdvcmtsb2dCdXR0b25TZWxlY3RvciA9IFwiLmVkaXQtd29yay1sb2dcIjtcclxuICAgIH1cclxuXHJcbiAgICBpbml0RG9tKCkge1xyXG4gICAgICAgIGlmKHRoaXMuZGF0ZVRpbWVQaWNrZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRlVGltZVBpY2tlci5kYXRldGltZXBpY2tlcih7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0RGF0ZTogbmV3IERhdGUoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJChcIiNkYXRlLXRpbWUtcGlja2VyLWlucHV0XCIpLmZvY3VzKChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgJChcIi5pbnB1dC1ncm91cC1hZGRvblwiKS5jbGljaygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9naW4oJHRhcmdldCkge1xyXG4gICAgICAgIGxldCBkYXRhID0gJHRhcmdldC5zZXJpYWxpemUoKTtcclxuICAgICAgICAvKmxldCBuYW1lID0gZGF0YVswXS52YWx1ZTtcclxuICAgICAgICBsZXQgcGFzc3dvcmQgPSBkYXRhWzFdLnZhbHVlOyovXHJcbiAgICAgICAgbGV0IGxvZ2luUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2xvZ2luXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxvZ2luUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGRhdGEucmVkaXJlY3RUbztcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5sb2dpbkVycm9yTW9kYWwubW9kYWwoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZWdpc3RlcigkdGFyZ2V0KSB7XHJcbiAgICAgICAgbGV0IGRhdGEgPSAkdGFyZ2V0LnNlcmlhbGl6ZSgpO1xyXG4gICAgICAgIC8qbGV0IG5hbWUgPSBkYXRhWzBdLnZhbHVlO1xyXG4gICAgICAgIGxldCBwYXNzd29yZCA9IGRhdGFbMV0udmFsdWU7Ki9cclxuICAgICAgICBsZXQgcmVnaXN0ZXJQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvcmVnaXN0ZXJcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmVnaXN0ZXJQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzIHJlZzpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGRhdGEucmVkaXJlY3RUbztcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2dpbiBlcnJvclwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFcnJvck1vZGFsLm1vZGFsKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0TGlzdGVuZXJzKCkge1xyXG4gICAgICAgIHRoaXMubG9naW5BbmRSZWdpc3Rlckxpc3RlbmVycygpO1xyXG4gICAgICAgIHRoaXMucHJvamVjdHNMaXN0ZW5lcnMoKTtcclxuICAgICAgICB0aGlzLmlzc3VlTGlzdGVuZXJzKCk7XHJcblxyXG4gICAgICAgICQod2luZG93KS5sb2FkKCgpID0+IHtcclxuICAgICAgICAgICAgaWYodGhpcy5wcm9qZWN0c1BhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9wdWxhdGVQcm9qZWN0c1BhZ2UoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYodGhpcy5wcm9qZWN0UGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZVByb2plY3RQYWdlKHdpbmRvdy5yZXNvdXJjZXMucHJvamVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMuaXNzdWVQYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvcHVsYXRlSXNzdWVQYWdlKHdpbmRvdy5yZXNvdXJjZXMuaXNzdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvamVjdHNMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgaWYodGhpcy5jcmVhdGVQcm9qZWN0QnV0dG9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUHJvamVjdEJ1dHRvbi5vbihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUHJvamVjdE1vZGFsLm1vZGFsKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5hZGROZXdQcm9qZWN0Rm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZE5ld1Byb2plY3RGb3JtLm9uKCdzdWJtaXQnLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVByb2plY3QoJChldi50YXJnZXQpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIHRoaXMucHJvamVjdEVkaXRTZWxlY3RvciwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBsZXQgJHBhcmVudCA9ICQoZXYudGFyZ2V0KS5jbG9zZXN0KFwidHJcIik7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0SWQgPSAkcGFyZW50LmF0dHIoXCJkYXRhLXByb2plY3QtaWRcIik7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0TmFtZSA9ICRwYXJlbnQuZmluZChcIi5wci1uYW1lXCIpLmh0bWwoKTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3REZXNjcmlwdGlvbiA9ICRwYXJlbnQuZmluZChcIi5wci1kZXNjcmlwdGlvblwiKS5odG1sKCk7XHJcblxyXG4gICAgICAgICAgICAkKFwiI2VkaXRQcm9qZWN0TW9kYWxcIikubW9kYWwoKTtcclxuICAgICAgICAgICAgJChcIiN1cGRhdGVlLXByb2plY3QtaWRcIikudmFsKHByb2plY3RJZCk7XHJcbiAgICAgICAgICAgICQoXCIjbmV3LXByb2plY3QtbmFtZVwiKS52YWwocHJvamVjdE5hbWUpO1xyXG4gICAgICAgICAgICAkKFwiI25ldy1kZXNjcmlwdGlvblwiKS52YWwocHJvamVjdERlc2NyaXB0aW9uKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCB0aGlzLnByb2plY3REZWxldGVTZWxlY3RvciwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdElkID0gJChldi50YXJnZXQpLmNsb3Nlc3QoXCJ0clwiKS5hdHRyKFwiZGF0YS1wcm9qZWN0LWlkXCIpO1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZVByb2plY3RNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZS1wcm9qZWN0LWlkXCIpLnZhbChwcm9qZWN0SWQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcInN1Ym1pdFwiLCB0aGlzLmRlbGV0ZVByb2plY3RGb3JtU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZVByb2plY3QoJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJzdWJtaXRcIiwgdGhpcy51cGRhdGVQcm9qZWN0Rm9ybVNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQcm9qZWN0KCQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgdGhpcy5pc3N1ZUVkaXRTZWxlY3RvciwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBsZXQgJHBhcmVudCA9ICQoZXYudGFyZ2V0KS5jbG9zZXN0KFwidHJcIik7XHJcbiAgICAgICAgICAgIGxldCBpc3N1ZUlkID0gJHBhcmVudC5hdHRyKFwiZGF0YS1pc3N1ZS1pZFwiKTtcclxuICAgICAgICAgICAgbGV0IGlzc3VlTmFtZSA9ICRwYXJlbnQuZmluZChcIi5pc3N1ZS1uYW1lXCIpLmh0bWwoKTtcclxuICAgICAgICAgICAgbGV0IGlzc3VlRGVzY3JpcHRpb24gPSAkcGFyZW50LmZpbmQoXCIuaXNzdWUtZGVzY3JpcHRpb25cIikuaHRtbCgpO1xyXG5cclxuICAgICAgICAgICAgJChcIiNlZGl0SXNzdWVNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgICAgICAkKFwiI3VwZGF0ZWUtaXNzdWUtaWRcIikudmFsKGlzc3VlSWQpO1xyXG4gICAgICAgICAgICAkKFwiI25ldy1pc3N1ZS1uYW1lXCIpLnZhbChpc3N1ZU5hbWUpO1xyXG4gICAgICAgICAgICAkKFwiI25ldy1kZXNjcmlwdGlvblwiKS52YWwoaXNzdWVEZXNjcmlwdGlvbik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgdGhpcy5pc3N1ZURlbGV0ZVNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaGVyZVwiKVxyXG4gICAgICAgICAgICBsZXQgaXNzdWVJZCA9ICQoZXYudGFyZ2V0KS5jbG9zZXN0KFwidHJcIikuYXR0cihcImRhdGEtaXNzdWUtaWRcIik7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlSXNzdWVNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZS1pc3N1ZS1pZFwiKS52YWwoaXNzdWVJZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuZGVsZXRlSXNzdWVGb3JtKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlSXNzdWVGb3JtLm9uKFwic3VibWl0XCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlSXNzdWUoJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLnVwZGF0ZUlzc3VlRm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUlzc3VlRm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUlzc3VlKCQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5wcm9qZWN0LWl0ZW1cIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCAkdGFyZ2V0ID0gJChldi50YXJnZXQpLmNsb3Nlc3QoXCIucHJvamVjdC1pdGVtXCIpO1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL3Byb2plY3QvXCIgKyAkdGFyZ2V0LmF0dHIoXCJkYXRhLXByb2plY3QtaWRcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgXCIuaXNzdWUtaXRlbVwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgbGV0ICR0YXJnZXQgPSAkKGV2LnRhcmdldCkuY2xvc2VzdChcIi5pc3N1ZS1pdGVtXCIpO1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL2lzc3VlL1wiICsgJHRhcmdldC5hdHRyKFwiZGF0YS1pc3N1ZS1pZFwiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJ1cGRhdGVQcm9qZWN0c1wiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVQcm9qZWN0c1BhZ2UoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRJc3N1ZS5vbihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygkKFwiI2FkZElzc3VlTW9kYWxcIikpXHJcbiAgICAgICAgICAgICQoXCIjYWRkSXNzdWVNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZih0aGlzLmFkZElzc3VlRm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZElzc3VlRm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VyaWFsaXplZCA9ICQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKTtcclxuICAgICAgICAgICAgICAgIGxldCBkZXNlcmlhbGl6ZWREYXRhID0gdGhpcy5kZXNlcmlhbGl6ZUZvcm0oc2VyaWFsaXplZCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZXN0aW1hdGVkTWludXRlcyA9IHRoaXMuY29udmVydEVzdGltYXRlKGRlc2VyaWFsaXplZERhdGEub3JpZ2luYWxFc3RpbWF0ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoIWVzdGltYXRlZE1pbnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiLm9yaWdpbmFsLWVzdGltYXRlLWdyb3VwXCIpLmFkZENsYXNzKFwiaGFzLWVycm9yXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBkZXNlcmlhbGl6ZWREYXRhLm9yaWdpbmFsRXN0aW1hdGUgPSBlc3RpbWF0ZWRNaW51dGVzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVJc3N1ZShkZXNlcmlhbGl6ZWREYXRhKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRlc2VyaWFsaXplZERhdGEpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJ1cGRhdGVJc3N1ZXNcIiwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIGlmKGRhdGEucHJvamVjdCA9PSByZXNvdXJjZXMucHJvamVjdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZVByb2plY3RQYWdlKHJlc291cmNlcy5wcm9qZWN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlzc3VlTGlzdGVuZXJzKCkge1xyXG4gICAgICAgIGlmKHRoaXMuYWRkQ29tbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZENvbW1lbnQub24oXCJjbGlja1wiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ29tbWVudE1vZGFsLm1vZGFsKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5hZGRXcm9rTG9nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkV3Jva0xvZy5vbihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRXb3JrTG9nTW9kYWwubW9kYWwoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcInN1Ym1pdFwiLCB0aGlzLmFkZE5ld0NvbW1lbnRGb3JtU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUNvbW1lbnQoJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJzdWJtaXRcIiwgdGhpcy5hZGROZXdXb3JrbG9nRm9ybVNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgbGV0IHNlcmlhbGl6ZWQgPSAkKGV2LnRhcmdldCkuc2VyaWFsaXplKCk7XHJcbiAgICAgICAgICAgIGxldCBkZXNlcmlhbGl6ZWREYXRhID0gdGhpcy5kZXNlcmlhbGl6ZUZvcm0oc2VyaWFsaXplZCk7XHJcbiAgICAgICAgICAgIGxldCBlc3RpbWF0ZWRNaW51dGVzID0gdGhpcy5jb252ZXJ0RXN0aW1hdGUoZGVzZXJpYWxpemVkRGF0YS50aW1lU3BlbnQpO1xyXG4gICAgICAgICAgICBsZXQgbG9nRGF0ZVRpbWUgPSBuZXcgRGF0ZSgkKFwiI2RhdGUtdGltZS1waWNrZXItaW5wdXRcIikudmFsKCkpO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IE9iamVjdCgpO1xyXG5cclxuICAgICAgICAgICAgaWYoIWxvZ0RhdGVUaW1lIHx8IGxvZ0RhdGVUaW1lID09PSBcIkludmFsaWQgRGF0ZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiLmxvZy1kYXRlLXRpbWVcIikuYWRkQ2xhc3MoXCJoYXMtZXJyb3JcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKCFlc3RpbWF0ZWRNaW51dGVzKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiLnRpbWUtc3BlbnQtZ3JvdXBcIikuYWRkQ2xhc3MoXCJoYXMtZXJyb3JcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlc3VsdC5lc3RpbWF0ZWRNaW51dGVzID0gZXN0aW1hdGVkTWludXRlcztcclxuICAgICAgICAgICAgcmVzdWx0LmxvZ0RhdGVUaW1lID0gbG9nRGF0ZVRpbWU7XHJcbiAgICAgICAgICAgIHJlc3VsdC50ZXh0ID0gZGVzZXJpYWxpemVkRGF0YS50ZXh0O1xyXG4gICAgICAgICAgICByZXN1bHQuY3JlYXRvciA9IGRlc2VyaWFsaXplZERhdGEuY3JlYXRvcjtcclxuICAgICAgICAgICAgcmVzdWx0Lmlzc3VlSWQgPSBkZXNlcmlhbGl6ZWREYXRhLmlzc3VlSWQ7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVdvcmtsb2cocmVzdWx0KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJ1cGRhdGVDb21tZW50c1wiLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBpZihkYXRhLmlzc3VlID09IHdpbmRvdy5yZXNvdXJjZXMuaXNzdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9wdWxhdGVJc3N1ZUNvbW1lbnRzKHdpbmRvdy5yZXNvdXJjZXMuaXNzdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc29ja2V0Lm9uKFwidXBkYXRlV29ya0xvZ3NcIiwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgaWYoZGF0YS5pc3N1ZSA9PSB3aW5kb3cucmVzb3VyY2VzLmlzc3VlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvcHVsYXRlSXNzdWVXb3JrbG9ncyh3aW5kb3cucmVzb3VyY2VzLmlzc3VlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIHRoaXMuZGVsZXRlQ29tbWVudFRodW1iU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZUNvbW1lbnRNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZS1jb21tZW50LWlkXCIpLnZhbCgkKGV2LnRhcmdldCkuY2xvc2VzdChcIi5jb21tZW50LWl0ZW1cIikuYXR0cihcImRhdGEtY29tbWVudC1pZFwiKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgdGhpcy5lZGl0Q29tbWVudFRodW1iU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2VkaXRDb21tZW50TW9kYWxcIikubW9kYWwoKTtcclxuICAgICAgICAgICAgJChcIiNlZGl0LWNvbW1lbnQtaWRcIikudmFsKCQoZXYudGFyZ2V0KS5jbG9zZXN0KFwiLmNvbW1lbnQtaXRlbVwiKS5hdHRyKFwiZGF0YS1jb21tZW50LWlkXCIpKTtcclxuICAgICAgICAgICAgJChcIiNjb21tZW50LXRleHRcIikudmFsKCQoZXYudGFyZ2V0KS5jbG9zZXN0KFwiLmNvbW1lbnQtaXRlbVwiKS5maW5kKFwiLnBhbmVsLWJvZHlcIikudGV4dCgpLnRyaW0oKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuZGVsZXRlQ29tbWVudEZvcm0pIHtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVDb21tZW50Rm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUNvbW1lbnQoJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLnVwZGF0ZUNvbW1lbnRGb3JtKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ29tbWVudEZvcm0ub24oXCJzdWJtaXRcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDb21tZW50KCQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCB0aGlzLmRlbGV0ZVdvcmtsb2dCdXR0b25TZWxlY3RvciwgKGV2KSA9PiB7Y29uc29sZS5sb2coXCJ3aGExXCIpXHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlV29ya2xvZ01vZGFsXCIpLm1vZGFsKCk7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlLXdvcmstbG9nLWlkXCIpLnZhbCgkKGV2LnRhcmdldCkuY2xvc2VzdChcIi53b3JrLWxvZy1pdGVtXCIpLmF0dHIoXCJkYXRhLXdvcmstbG9nLWlkXCIpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCB0aGlzLmVkaVdvcmtsb2dCdXR0b25TZWxlY3RvciwgKGV2KSA9PiB7Y29uc29sZS5sb2coXCJ3aGFcIilcclxuICAgICAgICAgICAgJChcIiNlZGl0V29ya2xvZ01vZGFsXCIpLm1vZGFsKCk7XHJcbiAgICAgICAgICAgICQoXCIjZWRpdC13b3JrLWxvZy1pZFwiKS52YWwoJChldi50YXJnZXQpLmNsb3Nlc3QoXCIud29yay1sb2ctaXRlbVwiKS5hdHRyKFwiZGF0YS13b3JrLWxvZy1pZFwiKSk7XHJcbiAgICAgICAgICAgICQoXCIjZWRpdC13b3JrLWxvZy10ZXh0XCIpLnZhbCgkKGV2LnRhcmdldCkuY2xvc2VzdChcIi53b3JrLWxvZy1pdGVtXCIpLmZpbmQoXCIud29ya2xvZy10ZXh0XCIpLnRleHQoKS50cmltKCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc2VyaWFsaXplRm9ybShzZXJpYWxpemVkRm9ybURhdGEpIHtcclxuICAgICAgICBsZXQgc2VyaWFsaXplZERhdGFBcnJheSA9IHNlcmlhbGl6ZWRGb3JtRGF0YS5zcGxpdChcIiZcIik7XHJcbiAgICAgICAgbGV0IGRlc2VyaWFsaXplZERhdGEgPSBuZXcgT2JqZWN0KCk7XHJcbiAgICAgICAgbGV0IGl0ZW1TcGxpdDtcclxuXHJcbiAgICAgICAgZm9yKGxldCBsZW5ndGggPSBzZXJpYWxpemVkRGF0YUFycmF5Lmxlbmd0aCwgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBzZXJpYWxpemVkRGF0YUFycmF5W2ldID0gc2VyaWFsaXplZERhdGFBcnJheVtpXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpO1xyXG5cclxuICAgICAgICAgICAgaXRlbVNwbGl0ID0gc2VyaWFsaXplZERhdGFBcnJheVtpXS5zcGxpdChcIj1cIik7XHJcbiAgICAgICAgICAgIGRlc2VyaWFsaXplZERhdGFbaXRlbVNwbGl0WzBdXSA9IGl0ZW1TcGxpdFsxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlc2VyaWFsaXplZERhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgY29udmVydEVzdGltYXRlKGVzdGltYXRlU3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IHJlZ2V4cCA9IC8oXlxcZCpoIFxcZCptJCl8KF5cXGQqKFxcLlxcZCspP2gkKXwoXlxcZCptJCkvOyAvKmUuZyAxaCAzMG0gb3IgMzBtIG9yIDEuNWgqL1xyXG4gICAgICAgIGxldCBtYXRjaCA9IGVzdGltYXRlU3RyaW5nLm1hdGNoKHJlZ2V4cCk7XHJcbiAgICAgICAgbGV0IG1hdGNoU3BsaXQ7XHJcbiAgICAgICAgbGV0IHNwbGl0TGVuZ3RoO1xyXG4gICAgICAgIGxldCBob3VycztcclxuICAgICAgICBsZXQgbWludXRlcyA9IDA7XHJcbiAgICAgICAgbGV0IGFkZGl0aW9uYWxNaW51dGVzID0gMDtcclxuXHJcbiAgICAgICAgaWYoIW1hdGNoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1hdGNoID0gbWF0Y2hbMF07XHJcbiAgICAgICAgbWF0Y2hTcGxpdCA9IG1hdGNoLnNwbGl0KFwiIFwiKTtcclxuICAgICAgICBzcGxpdExlbmd0aCA9IG1hdGNoU3BsaXQubGVuZ3RoO1xyXG5cclxuICAgICAgICBpZihzcGxpdExlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgIGxldCBpbmRleE9mTSA9IG1hdGNoU3BsaXRbMF0uaW5kZXhPZihcIm1cIik7XHJcbiAgICAgICAgICAgIGxldCBpbmRleE9mSCA9IG1hdGNoU3BsaXRbMF0uaW5kZXhPZihcImhcIik7XHJcblxyXG4gICAgICAgICAgICBpZihpbmRleE9mTSAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgbWludXRlcyA9IG1hdGNoU3BsaXRbMF0uc2xpY2UoMCwgaW5kZXhPZk0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihpbmRleE9mSCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgaG91cnMgPSBtYXRjaFNwbGl0WzBdLnNsaWNlKDAsIGluZGV4T2ZIKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgbGV0IGluZGV4T2ZIID0gbWF0Y2hTcGxpdFswXS5pbmRleE9mKFwiaFwiKTtcclxuICAgICAgICAgICAgbGV0IGluZGV4T2ZNID0gbWF0Y2hTcGxpdFsxXS5pbmRleE9mKFwibVwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGluZGV4T2ZIICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBob3VycyA9IG1hdGNoU3BsaXRbMF0uc2xpY2UoMCwgaW5kZXhPZkgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihpbmRleE9mTSAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgbWludXRlcyA9IG1hdGNoU3BsaXRbMV0uc2xpY2UoMCwgaW5kZXhPZk0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihob3Vycykge1xyXG4gICAgICAgICAgICBhZGRpdGlvbmFsTWludXRlcyA9IHBhcnNlSW50KDYwICogaG91cnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWludXRlcyA9IHBhcnNlSW50KG1pbnV0ZXMpO1xyXG4gICAgICAgIG1pbnV0ZXMgKz0gYWRkaXRpb25hbE1pbnV0ZXM7XHJcblxyXG4gICAgICAgIHJldHVybiBtaW51dGVzO1xyXG4gICAgfVxyXG5cclxuICAgIG1pbnV0ZXNUb1N0cmluZyhtaW51dGVzKSB7XHJcbiAgICAgICAgbGV0IGhvdXJzID0gbWludXRlcyAvIDYwO1xyXG4gICAgICAgIGxldCByZXN1bHRTdHJpbmcgPSBob3VycyA8IDEgPyAoIChtaW51dGVzID09IDEpID8gcGFyc2VJbnQobWludXRlcykgKyBcIiBtaW51dGVcIiA6IHBhcnNlSW50KG1pbnV0ZXMpICsgXCIgbWludXRlc1wiICkgOiAoIChob3VycyA9PSAxKSA/IGhvdXJzICsgXCIgaG91clwiIDogaG91cnMgKyBcIiBob3Vyc1wiICk7XHJcbiAgICAgICAgcmVzdWx0U3RyaW5nID0gJ1RpbWUgc3BlbnQgJyArIHJlc3VsdFN0cmluZztcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdFN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVDb21tZW50KGRhdGEpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKVxyXG4gICAgICAgIGxldCBjcmVhdGVDb21tZW50UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2NvbW1lbnRcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjcmVhdGVDb21tZW50UHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcyBjcmVhdGluZyBjb21tZW50OlwiLCBkYXRhKTtcclxuICAgICAgICAgICAgJChcIiNhZGRDb21tZW50TW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGR1cmluZyBjb21tZW50IGNyZWF0aW9uXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgY29tbWVudCBjcmVhdGlvblwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVJc3N1ZShkYXRhKSB7XHJcbiAgICAgICAgbGV0IGNyZWF0ZUlzc3VlUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2lzc3VlXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY3JlYXRlSXNzdWVQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzIHJlZzpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICQoXCIjYWRkSXNzdWVNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZHVyaW5nIHByb2plY3QgY3JlYXRpb25cIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIGR1cmluZyBpc3N1ZSBjcmVhdGlvblwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVQcm9qZWN0KGRhdGEpIHtcclxuICAgICAgICBsZXQgZGVsZXRlUHJvamVjdFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9qZWN0XCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZWxldGVQcm9qZWN0UHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlUHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciByZW1vdmluZyBwcm9qZWN0XCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciB3aGlsZSByZW1vdmluZyBwcm9qZWN0XCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVByb2plY3QoZGF0YSkge1xyXG4gICAgICAgIGxldCB1cGRhdGVQcm9qZWN0UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL3Byb2plY3RcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MsIFwiLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICQoXCIjZWRpdFByb2plY3RNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB1cGRhdGVQcm9qZWN0UHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlUHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciByZW1vdmluZyBwcm9qZWN0XCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciB1cGRhdGluZyBwcm9qZWN0c1wiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVJc3N1ZShkYXRhKSB7XHJcbiAgICAgICAgbGV0IGRlbGV0ZUlzc3VlUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2lzc3VlXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZWxldGVJc3N1ZVByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZUlzc3VlTW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHJlbW92aW5nIGlzc3VlXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciByZW1vdmluZyBpc3N1ZVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVJc3N1ZShkYXRhKSB7XHJcbiAgICAgICAgbGV0IHVwZGF0ZUlzc3VlUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2lzc3VlXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2VkaXRQcm9qZWN0TW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdXBkYXRlSXNzdWVQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgJChcIiNkZWxldGVQcm9qZWN0TW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHVwZGF0aW5nIGlzc3VlXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciB3aGlsZSB1cGRhdGluZyBpc3N1ZVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwb3B1bGF0ZVByb2plY3RQYWdlKHByb2plY3RJZCkge1xyXG4gICAgICAgIGxldCBpc3N1ZXNQcm9taXNlID0gdGhpcy5nZXRJc3N1ZXMocHJvamVjdElkLCBwb3B1bGF0ZUlzc3Vlc1RlbXBsYXRlKTtcclxuICAgICAgICBsZXQgJGlzc3Vlc1NlY3Rpb24gPSAkKFwiLnByb2plY3QtcGFnZSAuaXNzdWVzLXNlY3Rpb25cIik7XHJcblxyXG4gICAgICAgIGlzc3Vlc1Byb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImlzc3VlcyBjb2xsZWN0aW9uIGlzOjpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgIHBvcHVsYXRlSXNzdWVzVGVtcGxhdGUoZGF0YSk7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcG9wdWxhdGVJc3N1ZXNUZW1wbGF0ZShpc3N1ZXNMaXN0KSB7XHJcbiAgICAgICAgICAgIGxldCBnZXRQcm9qZWN0c1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3RlbXBsYXRlcy90ZW1wbGF0ZXMuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZ2V0UHJvamVjdHNQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBzb3VyY2UgPSAkKGRhdGEpLmZpbmQoXCIjcHJvamVjdC10ZW1wbGF0ZVwiKS5odG1sKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGUgPSBIYW5kbGViYXJzLmNvbXBpbGUoc291cmNlKTtcclxuICAgICAgICAgICAgICAgIGxldCBjb250ZXh0ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzc3Vlc0xpc3Q6IGlzc3Vlc0xpc3RcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBsZXQgaHRtbCA9IHRlbXBsYXRlKGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgJGlzc3Vlc1NlY3Rpb24uaHRtbChodG1sKTtcclxuICAgICAgICAgICAgICAgICQoXCIjZWRpdElzc3VlTW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGR1cmluZyBpc3N1ZXMgdGVtcGxhdGUgZmV0Y2hcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgcHJvamVjdCBjcmVhdGlvblwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHBvcHVsYXRlSXNzdWVQYWdlKGlzc3VlSWQpIHtcclxuICAgICAgICB0aGlzLnBvcHVsYXRlSXNzdWVDb21tZW50cyhpc3N1ZUlkKTtcclxuICAgICAgICB0aGlzLnBvcHVsYXRlSXNzdWVXb3JrbG9ncyhpc3N1ZUlkKTtcclxuICAgIH1cclxuXHJcbiAgICBwb3B1bGF0ZUlzc3VlQ29tbWVudHMoaXNzdWVJZCkge1xyXG4gICAgICAgIGxldCBjb21tZW50c1Byb21pc2UgPSB0aGlzLmdldENvbW1lbnRzKGlzc3VlSWQpO1xyXG4gICAgICAgIGxldCAkY29tbWVudHNTZWN0aW9uID0gJChcIi5pc3N1ZS1wYWdlIC5pc3N1ZS1jb21tZW50c1wiKTtcclxuXHJcbiAgICAgICAgY29tbWVudHNQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpc3N1ZXMgY29tbWVudHMgaXM6OlwiLCBkYXRhKTtcclxuICAgICAgICAgICAgcG9wdWxhdGVDb21tZW50c1RlbXBsYXRlKGRhdGEpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHBvcHVsYXRlQ29tbWVudHNUZW1wbGF0ZShjb21tZW50c0xpc3QpIHtcclxuICAgICAgICAgICAgY29tbWVudHNMaXN0LmZvckVhY2goKGNvbW1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKGNvbW1lbnQuY3JlYXRvci5faWQgPT09IHdpbmRvdy5yZXNvdXJjZXMudXNlci5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1lbnQuaXNDb21tZW50T3duZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1lbnQuaXNDb21tZW50T3duZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZ2V0Q29tbWVudHNQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgdXJsOiBcIi90ZW1wbGF0ZXMvdGVtcGxhdGVzLmh0bWxcIixcclxuICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnaHRtbCdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGdldENvbW1lbnRzUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc291cmNlID0gJChkYXRhKS5maW5kKFwiI2NvbW1lbnRzLXRlbXBsYXRlXCIpLmh0bWwoKTtcclxuICAgICAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IEhhbmRsZWJhcnMuY29tcGlsZShzb3VyY2UpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbnRleHQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWVudHNMaXN0OiBjb21tZW50c0xpc3QsXHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFVzZXI6IHdpbmRvdy5yZXNvdXJjZXMudXNlci5pZFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGxldCBodG1sID0gdGVtcGxhdGUoY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICAkY29tbWVudHNTZWN0aW9uLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZHVyaW5nIGNvbW1lbnRzIHRlbXBsYXRlIGZldGNoXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZHVyaW5nIHByb2plY3QgY3JlYXRpb25cIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwb3B1bGF0ZUlzc3VlV29ya2xvZ3MoaXNzdWVJZCkge1xyXG4gICAgICAgIGxldCB3b3JrTG9nc1Byb21pc2UgPSB0aGlzLmdldFdvcmtsb2dzKGlzc3VlSWQpO1xyXG4gICAgICAgIGxldCAkd29ya0xvZ3NTZWN0aW9uID0gJChcIi5pc3N1ZS1wYWdlIC5pc3N1ZS13b3JrbG9nc1wiKTtcclxuXHJcbiAgICAgICAgd29ya0xvZ3NQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpc3N1ZXMgbG9ncyBpczpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgIGRhdGEuZm9yRWFjaCgod29ya0xvZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgd29ya0xvZy50aW1lU3BlbnQgPSB0aGlzLm1pbnV0ZXNUb1N0cmluZyh3b3JrTG9nLnRpbWVTcGVudCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcG9wdWxhdGVXb3JrbG9nc1RlbXBsYXRlKGRhdGEpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHBvcHVsYXRlV29ya2xvZ3NUZW1wbGF0ZSh3b3JrTG9nc0xpc3QpIHtcclxuICAgICAgICAgICAgd29ya0xvZ3NMaXN0LmZvckVhY2goKHdvcmtMb2cpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHdvcmtMb2cuY3JlYXRvci5faWQgPT09IHdpbmRvdy5yZXNvdXJjZXMudXNlci5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtMb2cuaXNXb3JrTG9nT3duZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtMb2cuaXNXb3JrTG9nT3duZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZ2V0V29ya0xvZ3NQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgdXJsOiBcIi90ZW1wbGF0ZXMvdGVtcGxhdGVzLmh0bWxcIixcclxuICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnaHRtbCdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGdldFdvcmtMb2dzUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc291cmNlID0gJChkYXRhKS5maW5kKFwiI3dvcmstbG9ncy10ZW1wbGF0ZVwiKS5odG1sKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGUgPSBIYW5kbGViYXJzLmNvbXBpbGUoc291cmNlKTtcclxuICAgICAgICAgICAgICAgIGxldCBjb250ZXh0ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtMb2dzTGlzdDogd29ya0xvZ3NMaXN0LFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRVc2VyOiB3aW5kb3cucmVzb3VyY2VzLnVzZXIuaWRcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBsZXQgaHRtbCA9IHRlbXBsYXRlKGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgJHdvcmtMb2dzU2VjdGlvbi5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGR1cmluZyBjb21tZW50cyB0ZW1wbGF0ZSBmZXRjaFwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICBhbGVydChcIkVycm9yIGR1cmluZyBwcm9qZWN0IGNyZWF0aW9uXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcG9wdWxhdGVQcm9qZWN0c1BhZ2UoKSB7XHJcbiAgICAgICAgbGV0IHByb2plY3RzUHJvbWlzZSA9IHRoaXMuZ2V0UHJvamVjdHMoKTtcclxuICAgICAgICBsZXQgcHJvamVjdHM7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgICBwcm9qZWN0c1Byb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImZldGNoZWQgcHJvamVjdHM6XCIsIGRhdGEpO1xyXG4gICAgICAgICAgICBwb3B1bGF0ZVByb2plY3RzVGVtcGxhdGUoZGF0YSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZmV0Y2hpbmcgcHJvamVjdHNcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIGZldGNoaW5nIHByb2plY3RzXCIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBwb3B1bGF0ZVByb2plY3RzVGVtcGxhdGUocHJvamVjdHNMaXN0KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHByb2plY3RzTGlzdClcclxuICAgICAgICAgICAgbGV0IGdldFByb2plY3RzUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgIHVybDogXCIvdGVtcGxhdGVzL3RlbXBsYXRlcy5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2h0bWwnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBnZXRQcm9qZWN0c1Byb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNvdXJjZSA9ICQoZGF0YSkuZmluZChcIiNwcm9qZWN0cy10ZW1wbGF0ZVwiKS5odG1sKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGUgPSBIYW5kbGViYXJzLmNvbXBpbGUoc291cmNlKTtcclxuICAgICAgICAgICAgICAgIGxldCBjb250ZXh0ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb2plY3RzTGlzdDogcHJvamVjdHNMaXN0XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgbGV0IGh0bWwgPSB0ZW1wbGF0ZShjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgIHRoYXQucHJvamVjdHNTZWN0aW9uLmh0bWwoaHRtbCk7XHJcblxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGR1cmluZyBwcm9qZWN0cyB0ZW1wbGF0ZSBmZXRjaFwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICBhbGVydChcIkVycm9yIGR1cmluZyBwcm9qZWN0IGNyZWF0aW9uXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlUHJvamVjdCgkdGFyZ2V0KSB7XHJcbiAgICAgICAgbGV0IGRhdGEgPSAkdGFyZ2V0LnNlcmlhbGl6ZSgpO1xyXG5cclxuICAgICAgICBsZXQgY3JlYXRlUHJvamVjdFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9qZWN0XCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNhZGRQcm9qZWN0TW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY3JlYXRlUHJvamVjdFByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MgcmVnOlwiLCBkYXRhKTtcclxuXHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZHVyaW5nIHByb2plY3QgY3JlYXRpb25cIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIGR1cmluZyBwcm9qZWN0IGNyZWF0aW9uXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFByb2plY3RzKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgbGV0IGdldFByb2plY3RzUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL3Byb2plY3RzSXRlbXNcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBnZXRQcm9qZWN0c1Byb21pc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SXNzdWVzKHByb2plY3RJZCwgY2FsbGJhY2spIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInByaTpcIiwgcHJvamVjdElkKTtcclxuICAgICAgICBsZXQgZ2V0SXNzdWVzUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2lzc3Vlc1wiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgIHByb2plY3RJZDogcHJvamVjdElkXHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGdldElzc3Vlc1Byb21pc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q29tbWVudHMoaXNzdWVJZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiaXNzdWVJZGw6XCIsIGlzc3VlSWQpO1xyXG4gICAgICAgIGxldCBnZXRDb21tZW50c1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9jb21tZW50c1wiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgIGlzc3VlSWQ6IGlzc3VlSWRcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZ2V0Q29tbWVudHNQcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFdvcmtsb2dzKGlzc3VlSWQpIHtcclxuICAgICAgICBsZXQgZ2V0V29ya0xvZ3NQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvbG9nc1wiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgIGlzc3VlSWQ6IGlzc3VlSWRcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZ2V0V29ya0xvZ3NQcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUNvbW1lbnQoZGF0YSkge1xyXG4gICAgICAgIGxldCBkZXNlcmlhbGl6ZWREYXRhID0gdGhpcy5kZXNlcmlhbGl6ZUZvcm0oZGF0YSlcclxuICAgICAgICBkZXNlcmlhbGl6ZWREYXRhLmlzc3VlSWQgPSB3aW5kb3cucmVzb3VyY2VzLmlzc3VlO1xyXG4gICAgICAgIGxldCB1cGRhdGVDb21tZW50UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2NvbW1lbnRcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkZXNlcmlhbGl6ZWREYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MsIFwiLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICQoXCIjZWRpdENvbW1lbnRNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB1cGRhdGVDb21tZW50UHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlUHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZyBpc3N1ZVwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3Igd2hpbGUgdXBkYXRpbmcgaXNzdWVcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlQ29tbWVudChkYXRhKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgbGV0IGRlc2VyaWFsaXplZERhdGEgPSB0aGlzLmRlc2VyaWFsaXplRm9ybShkYXRhKVxyXG4gICAgICAgIGRlc2VyaWFsaXplZERhdGEuaXNzdWVJZCA9IHdpbmRvdy5yZXNvdXJjZXMuaXNzdWU7XHJcbiAgICAgICAgbGV0IGRlbGV0ZUNvbW1lbnRQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvY29tbWVudFwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRlc2VyaWFsaXplZERhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVsZXRlQ29tbWVudFByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZUNvbW1lbnRNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgcmVtb3ZpbmcgY29tbWVudFwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgcmVtb3ZpbmcgY29tbWVudFwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVXb3JrbG9nKGRhdGEpIHtcclxuICAgICAgICBsZXQgY3JlYXRlV29ya2xvZ1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9sb2dcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjcmVhdGVXb3JrbG9nUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcyByZWc6XCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAkKFwiI2FkZFdvcmtMb2dNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZHVyaW5nIGxvZyBjcmVhdGlvblwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZHVyaW5nIGxvZyBjcmVhdGlvblwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dpbkFuZFJlZ2lzdGVyTGlzdGVuZXJzKCkge1xyXG4gICAgICAgIGlmKHRoaXMubG9naW5Gb3JtKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9naW5Gb3JtLm9uKFwic3VibWl0XCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9naW4oJCggZXYudGFyZ2V0ICkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMucmVnaXN0ZXJGb3JtKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJGb3JtLm9uKFwic3VibWl0XCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZigkKFwiI3Bhc3N3b3JkMVwiKS52YWwoKSAhPSAkKFwiI3Bhc3N3b3JkMlwiKS52YWwoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoXCIuZm9ybS1ncm91cFwiKS5hZGRDbGFzcyhcImhhcy1lcnJvclwiKTtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcInBhc3N3b3JkcyB5b3UgZW50ZXJlZCBhcmUgbm90IGlkZW50aWNhbFwiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlZ2lzdGVyKCQoIGV2LnRhcmdldCApKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBJc3N1ZVRyYWNrZXIgZnJvbSAnLi9Jc3N1ZVRyYWNrZXInO1xyXG5cclxubGV0IGlzc3VlVHJhY2tlciA9IG5ldyBJc3N1ZVRyYWNrZXIoKTtcclxuLy9jb25zb2xlLmxvZyhJc3N1ZVRyYWNrZXIpO1xyXG4vL3ZhciBbYSwgYiwgY10gPSBbMSAsIDIsIDNdO1xyXG4iXX0=
