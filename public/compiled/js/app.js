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
            this.deleteWorklogForm = $("#deleteWorklog").length ? $("#deleteWorklog") : false;
            this.editWorklogForm = $("#updateWorklog").length ? $("#updateWorklog") : false;
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

            if (this.deleteWorklogForm) {
                this.deleteWorklogForm.on("submit", function (ev) {
                    ev.preventDefault();
                    _this5.deleteWorklog($(ev.target).serialize());
                });
            }
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
                    workLog.timeSpent = _this6.minutesToString(workLog.timeSpent);console.log("wbl" + workLog.dateStarted);
                    //workLog.dateStarted = new Date(workLog.dateStarted);
                    //workLog.dateStarted = workLog.dateStarted.getMonth() + 1 + "/" + workLog.dateStarted.getDate() + "/" + workLog.dateStarted.getFullYear() + " " + workLog.dateStarted.getHours() + ":" + workLog.dateStarted.getMinutes();
                    console.log("wl" + workLog.dateStarted);
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
        key: "deleteWorklog",
        value: function deleteWorklog(data) {
            console.log(data);
            var deserializedData = this.deserializeForm(data);
            deserializedData.issueId = window.resources.issue;
            var deleteCommentPromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/log",
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
                $("#deleteWorklogModal").modal("hide");
            }).catch(function (jqXHR, textStatus) {
                console.log("error removing worklog", jqXHR, textStatus);
                alert("Error removing worklog");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRcXElzc3VlVHJhY2tlci5qcyIsInNjcmlwdFxcYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztJQ0FxQjtBQUNqQixhQURpQixZQUNqQixHQUFjOzhCQURHLGNBQ0g7O0FBQ1YsWUFBSSxTQUFTLE9BQU8sUUFBUCxDQUFnQixRQUFoQixJQUE0QixXQUE1QixHQUEwQyxzQkFBc0IsVUFBVSxJQUFWLEdBQWlCLGFBQWEsT0FBTyxRQUFQLENBQWdCLFFBQWhCLENBRGpHO0FBRVYsYUFBSyxNQUFMLEdBQWMsR0FBRyxNQUFILENBQWQsQ0FGVTtBQUdWLGFBQUssU0FBTCxHQUhVO0FBSVYsYUFBSyxPQUFMLEdBSlU7QUFLVixhQUFLLFlBQUwsR0FMVTtLQUFkOztpQkFEaUI7O29DQVNMO0FBQ1IsaUJBQUssbUJBQUwsR0FBMkIsRUFBRSxjQUFGLEVBQWtCLE1BQWxCLEdBQTJCLEVBQUUsY0FBRixDQUEzQixHQUErQyxLQUEvQyxDQURuQjtBQUVSLGlCQUFLLGtCQUFMLEdBQTBCLEVBQUUsa0JBQUYsRUFBc0IsTUFBdEIsR0FBK0IsRUFBRSxrQkFBRixDQUEvQixHQUF1RCxLQUF2RCxDQUZsQjtBQUdSLGlCQUFLLFNBQUwsR0FBaUIsRUFBRSxhQUFGLEVBQWlCLE1BQWpCLEdBQTBCLEVBQUUsYUFBRixDQUExQixHQUE2QyxLQUE3QyxDQUhUO0FBSVIsaUJBQUssZUFBTCxHQUF1QixFQUFFLGtCQUFGLENBQXZCLENBSlE7QUFLUixpQkFBSyxZQUFMLEdBQW9CLEVBQUUsZ0JBQUYsRUFBb0IsTUFBcEIsR0FBNkIsRUFBRSxnQkFBRixDQUE3QixHQUFtRCxLQUFuRCxDQUxaO0FBTVIsaUJBQUssa0JBQUwsR0FBMEIsRUFBRSx5QkFBRixDQUExQixDQU5RO0FBT1IsaUJBQUssaUJBQUwsR0FBeUIsRUFBRSxnQkFBRixFQUFvQixNQUFwQixHQUE2QixF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QUFMLENBQWtCLEVBQWxCLENBQXFCLFFBQXJCLEVBQStCLFVBQUMsRUFBRCxFQUFRO0FBQ25DLHVCQUFHLGNBQUgsR0FEbUM7O0FBR25DLHdCQUFHLEVBQUUsWUFBRixFQUFnQixHQUFoQixNQUF5QixFQUFFLFlBQUYsRUFBZ0IsR0FBaEIsRUFBekIsRUFBZ0Q7QUFDL0MsMEJBQUUsYUFBRixFQUFpQixRQUFqQixDQUEwQixXQUExQixFQUQrQztBQUUvQyw4QkFBTSx5Q0FBTixFQUYrQztBQUcvQywrQkFBTyxLQUFQLENBSCtDO3FCQUFuRDtBQUtBLDJCQUFLLFFBQUwsQ0FBYyxFQUFHLEdBQUcsTUFBSCxDQUFqQixFQVJtQztpQkFBUixDQUEvQixDQURrQjthQUF0Qjs7OztXQTdoQ2E7Ozs7Ozs7O0FDQXJCOzs7Ozs7QUFFQSxJQUFJLGVBQWUsNEJBQWYiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgSXNzdWVUcmFja2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGxldCBpb1BhdGggPSB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgPT0gXCJsb2NhbGhvc3RcIiA/IFwiaHR0cDovL2xvY2FsaG9zdDpcIiArIHJlc291cmNlcy5wb3J0IDogXCJodHRwczovL1wiICsgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lO1xyXG4gICAgICAgIHRoaXMuc29ja2V0ID0gaW8oaW9QYXRoKTtcclxuICAgICAgICB0aGlzLmluaXRDYWNoZSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdERvbSgpO1xyXG4gICAgICAgIHRoaXMuc2V0TGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdENhY2hlKCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlUHJvamVjdEJ1dHRvbiA9ICQoXCIuYWRkLXByb2plY3RcIikubGVuZ3RoID8gJChcIi5hZGQtcHJvamVjdFwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlUHJvamVjdE1vZGFsID0gJChcIiNhZGRQcm9qZWN0TW9kYWxcIikubGVuZ3RoID8gJChcIiNhZGRQcm9qZWN0TW9kYWxcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmxvZ2luRm9ybSA9ICQoXCIubG9naW4tZm9ybVwiKS5sZW5ndGggPyAkKFwiLmxvZ2luLWZvcm1cIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmxvZ2luRXJyb3JNb2RhbCA9ICQoXCIjTG9naW5FcnJvck1vZGFsXCIpO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJGb3JtID0gJChcIi5yZWdpc3Rlci1mb3JtXCIpLmxlbmd0aCA/ICQoXCIucmVnaXN0ZXItZm9ybVwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFcnJvck1vZGFsID0gJChcIiNSZWdpc3RyYXRpb25FcnJvck1vZGFsXCIpO1xyXG4gICAgICAgIHRoaXMuYWRkTmV3UHJvamVjdEZvcm0gPSAkKFwiI2FkZE5ld1Byb2plY3RcIikubGVuZ3RoID8gJChcIiNhZGROZXdQcm9qZWN0XCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0c1BhZ2UgPSAkKFwiLnByb2plY3RzLXBhZ2VcIikubGVuZ3RoID8gJChcIi5wcm9qZWN0cy1wYWdlXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0c1NlY3Rpb24gPSAkKFwiLnByb2plY3RzLXNlY3Rpb25cIik7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0RWRpdFNlbGVjdG9yID0gXCIucHJvamVjdC1lZGl0XCI7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0RGVsZXRlU2VsZWN0b3IgPSBcIi5wcm9qZWN0LWRlbGV0ZVwiO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlUHJvamVjdEZvcm1TZWxlY3RvciA9IFwiI2RlbGV0ZVByb2plY3RcIjtcclxuICAgICAgICB0aGlzLnVwZGF0ZVByb2plY3RGb3JtU2VsZWN0b3IgPSBcIiN1cGRhdGVQcm9qZWN0XCI7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0UGFnZSA9ICQoXCIucHJvamVjdC1wYWdlXCIpLmxlbmd0aCA/ICQoXCIucHJvamVjdC1wYWdlXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5pc3N1ZVBhZ2UgPSAkKFwiLmlzc3VlLXBhZ2VcIikubGVuZ3RoID8gJChcIi5pc3N1ZS1wYWdlXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5hZGRJc3N1ZSA9ICQoXCIuYWRkLWlzc3VlXCIpO1xyXG4gICAgICAgIHRoaXMuYWRkSXNzdWVGb3JtID0gJChcIiNhZGROZXdJc3N1ZVwiKS5sZW5ndGggPyAkKFwiI2FkZE5ld0lzc3VlXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy51cGRhdGVJc3N1ZUZvcm0gPSAkKFwiI3VwZGF0ZUlzc3VlXCIpLmxlbmd0aCA/ICQoXCIjdXBkYXRlSXNzdWVcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmRlbGV0ZUlzc3VlRm9ybSA9ICQoXCIjZGVsZXRlSXNzdWVcIikubGVuZ3RoID8gJChcIiNkZWxldGVJc3N1ZVwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuaXNzdWVFZGl0U2VsZWN0b3IgPSBcIi5pc3N1ZS1lZGl0XCI7XHJcbiAgICAgICAgdGhpcy5pc3N1ZURlbGV0ZVNlbGVjdG9yID0gXCIuaXNzdWUtZGVsZXRlXCI7XHJcbiAgICAgICAgdGhpcy5hZGRDb21tZW50ID0gJChcIi5uZXctY29tbWVudFwiKS5sZW5ndGggPyAkKFwiLm5ldy1jb21tZW50XCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5hZGRXcm9rTG9nID0gJChcIi5uZXctd29ya2xvZ1wiKS5sZW5ndGggPyAkKFwiLm5ldy13b3JrbG9nXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5hZGRDb21tZW50TW9kYWwgPSAkKFwiI2FkZENvbW1lbnRNb2RhbFwiKTtcclxuICAgICAgICB0aGlzLmFkZFdvcmtMb2dNb2RhbCA9ICQoXCIjYWRkV29ya0xvZ01vZGFsXCIpO1xyXG4gICAgICAgIHRoaXMuYWRkTmV3Q29tbWVudEZvcm1TZWxlY3RvciA9IFwiI2FkZE5ld0NvbW1lbnRcIjtcclxuICAgICAgICB0aGlzLmFkZE5ld1dvcmtsb2dGb3JtU2VsZWN0b3IgPSBcIiNhZGROZXdXb3JrbG9nXCI7XHJcbiAgICAgICAgdGhpcy5kYXRlVGltZVBpY2tlciA9ICQoXCIjd29yay1sb2ctZGF0ZXRpbWVwaWNrZXJcIikubGVuZ3RoID8gJChcIiN3b3JrLWxvZy1kYXRldGltZXBpY2tlclwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZWRpdENvbW1lbnRUaHVtYlNlbGVjdG9yID0gXCIuZWRpdC1jb21tZW50XCI7XHJcbiAgICAgICAgdGhpcy5kZWxldGVDb21tZW50VGh1bWJTZWxlY3RvciA9IFwiLmRlbGV0ZS1jb21tZW50XCI7XHJcbiAgICAgICAgdGhpcy5kZWxldGVDb21tZW50Rm9ybSA9ICQoXCIjZGVsZXRlQ29tbWVudFwiKS5sZW5ndGggPyAkKFwiI2RlbGV0ZUNvbW1lbnRcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUNvbW1lbnRGb3JtID0gJChcIiN1cGRhdGVDb21tZW50XCIpLmxlbmd0aCA/ICQoXCIjdXBkYXRlQ29tbWVudFwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlV29ya2xvZ0J1dHRvblNlbGVjdG9yID0gXCIuZGVsZXRlLXdvcmstbG9nXCI7XHJcbiAgICAgICAgdGhpcy5lZGlXb3JrbG9nQnV0dG9uU2VsZWN0b3IgPSBcIi5lZGl0LXdvcmstbG9nXCI7XHJcbiAgICAgICAgdGhpcy5kZWxldGVXb3JrbG9nRm9ybSA9ICQoXCIjZGVsZXRlV29ya2xvZ1wiKS5sZW5ndGggPyAkKFwiI2RlbGV0ZVdvcmtsb2dcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmVkaXRXb3JrbG9nRm9ybSA9ICQoXCIjdXBkYXRlV29ya2xvZ1wiKS5sZW5ndGggPyAkKFwiI3VwZGF0ZVdvcmtsb2dcIikgOiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0RG9tKCkge1xyXG4gICAgICAgIGlmKHRoaXMuZGF0ZVRpbWVQaWNrZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRlVGltZVBpY2tlci5kYXRldGltZXBpY2tlcih7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0RGF0ZTogbmV3IERhdGUoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJChcIiNkYXRlLXRpbWUtcGlja2VyLWlucHV0XCIpLmZvY3VzKChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgJChcIi5pbnB1dC1ncm91cC1hZGRvblwiKS5jbGljaygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9naW4oJHRhcmdldCkge1xyXG4gICAgICAgIGxldCBkYXRhID0gJHRhcmdldC5zZXJpYWxpemUoKTtcclxuICAgICAgICAvKmxldCBuYW1lID0gZGF0YVswXS52YWx1ZTtcclxuICAgICAgICBsZXQgcGFzc3dvcmQgPSBkYXRhWzFdLnZhbHVlOyovXHJcbiAgICAgICAgbGV0IGxvZ2luUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2xvZ2luXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxvZ2luUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGRhdGEucmVkaXJlY3RUbztcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5sb2dpbkVycm9yTW9kYWwubW9kYWwoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZWdpc3RlcigkdGFyZ2V0KSB7XHJcbiAgICAgICAgbGV0IGRhdGEgPSAkdGFyZ2V0LnNlcmlhbGl6ZSgpO1xyXG4gICAgICAgIC8qbGV0IG5hbWUgPSBkYXRhWzBdLnZhbHVlO1xyXG4gICAgICAgIGxldCBwYXNzd29yZCA9IGRhdGFbMV0udmFsdWU7Ki9cclxuICAgICAgICBsZXQgcmVnaXN0ZXJQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvcmVnaXN0ZXJcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmVnaXN0ZXJQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzIHJlZzpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGRhdGEucmVkaXJlY3RUbztcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2dpbiBlcnJvclwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFcnJvck1vZGFsLm1vZGFsKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0TGlzdGVuZXJzKCkge1xyXG4gICAgICAgIHRoaXMubG9naW5BbmRSZWdpc3Rlckxpc3RlbmVycygpO1xyXG4gICAgICAgIHRoaXMucHJvamVjdHNMaXN0ZW5lcnMoKTtcclxuICAgICAgICB0aGlzLmlzc3VlTGlzdGVuZXJzKCk7XHJcblxyXG4gICAgICAgICQod2luZG93KS5sb2FkKCgpID0+IHtcclxuICAgICAgICAgICAgaWYodGhpcy5wcm9qZWN0c1BhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9wdWxhdGVQcm9qZWN0c1BhZ2UoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYodGhpcy5wcm9qZWN0UGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZVByb2plY3RQYWdlKHdpbmRvdy5yZXNvdXJjZXMucHJvamVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMuaXNzdWVQYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvcHVsYXRlSXNzdWVQYWdlKHdpbmRvdy5yZXNvdXJjZXMuaXNzdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvamVjdHNMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgaWYodGhpcy5jcmVhdGVQcm9qZWN0QnV0dG9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUHJvamVjdEJ1dHRvbi5vbihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUHJvamVjdE1vZGFsLm1vZGFsKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5hZGROZXdQcm9qZWN0Rm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZE5ld1Byb2plY3RGb3JtLm9uKCdzdWJtaXQnLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVByb2plY3QoJChldi50YXJnZXQpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIHRoaXMucHJvamVjdEVkaXRTZWxlY3RvciwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBsZXQgJHBhcmVudCA9ICQoZXYudGFyZ2V0KS5jbG9zZXN0KFwidHJcIik7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0SWQgPSAkcGFyZW50LmF0dHIoXCJkYXRhLXByb2plY3QtaWRcIik7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0TmFtZSA9ICRwYXJlbnQuZmluZChcIi5wci1uYW1lXCIpLmh0bWwoKTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3REZXNjcmlwdGlvbiA9ICRwYXJlbnQuZmluZChcIi5wci1kZXNjcmlwdGlvblwiKS5odG1sKCk7XHJcblxyXG4gICAgICAgICAgICAkKFwiI2VkaXRQcm9qZWN0TW9kYWxcIikubW9kYWwoKTtcclxuICAgICAgICAgICAgJChcIiN1cGRhdGVlLXByb2plY3QtaWRcIikudmFsKHByb2plY3RJZCk7XHJcbiAgICAgICAgICAgICQoXCIjbmV3LXByb2plY3QtbmFtZVwiKS52YWwocHJvamVjdE5hbWUpO1xyXG4gICAgICAgICAgICAkKFwiI25ldy1kZXNjcmlwdGlvblwiKS52YWwocHJvamVjdERlc2NyaXB0aW9uKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCB0aGlzLnByb2plY3REZWxldGVTZWxlY3RvciwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdElkID0gJChldi50YXJnZXQpLmNsb3Nlc3QoXCJ0clwiKS5hdHRyKFwiZGF0YS1wcm9qZWN0LWlkXCIpO1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZVByb2plY3RNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZS1wcm9qZWN0LWlkXCIpLnZhbChwcm9qZWN0SWQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcInN1Ym1pdFwiLCB0aGlzLmRlbGV0ZVByb2plY3RGb3JtU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZVByb2plY3QoJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJzdWJtaXRcIiwgdGhpcy51cGRhdGVQcm9qZWN0Rm9ybVNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQcm9qZWN0KCQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgdGhpcy5pc3N1ZUVkaXRTZWxlY3RvciwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBsZXQgJHBhcmVudCA9ICQoZXYudGFyZ2V0KS5jbG9zZXN0KFwidHJcIik7XHJcbiAgICAgICAgICAgIGxldCBpc3N1ZUlkID0gJHBhcmVudC5hdHRyKFwiZGF0YS1pc3N1ZS1pZFwiKTtcclxuICAgICAgICAgICAgbGV0IGlzc3VlTmFtZSA9ICRwYXJlbnQuZmluZChcIi5pc3N1ZS1uYW1lXCIpLmh0bWwoKTtcclxuICAgICAgICAgICAgbGV0IGlzc3VlRGVzY3JpcHRpb24gPSAkcGFyZW50LmZpbmQoXCIuaXNzdWUtZGVzY3JpcHRpb25cIikuaHRtbCgpO1xyXG5cclxuICAgICAgICAgICAgJChcIiNlZGl0SXNzdWVNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgICAgICAkKFwiI3VwZGF0ZWUtaXNzdWUtaWRcIikudmFsKGlzc3VlSWQpO1xyXG4gICAgICAgICAgICAkKFwiI25ldy1pc3N1ZS1uYW1lXCIpLnZhbChpc3N1ZU5hbWUpO1xyXG4gICAgICAgICAgICAkKFwiI25ldy1kZXNjcmlwdGlvblwiKS52YWwoaXNzdWVEZXNjcmlwdGlvbik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgdGhpcy5pc3N1ZURlbGV0ZVNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaGVyZVwiKVxyXG4gICAgICAgICAgICBsZXQgaXNzdWVJZCA9ICQoZXYudGFyZ2V0KS5jbG9zZXN0KFwidHJcIikuYXR0cihcImRhdGEtaXNzdWUtaWRcIik7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlSXNzdWVNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZS1pc3N1ZS1pZFwiKS52YWwoaXNzdWVJZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuZGVsZXRlSXNzdWVGb3JtKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlSXNzdWVGb3JtLm9uKFwic3VibWl0XCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlSXNzdWUoJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLnVwZGF0ZUlzc3VlRm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUlzc3VlRm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUlzc3VlKCQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5wcm9qZWN0LWl0ZW1cIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCAkdGFyZ2V0ID0gJChldi50YXJnZXQpLmNsb3Nlc3QoXCIucHJvamVjdC1pdGVtXCIpO1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL3Byb2plY3QvXCIgKyAkdGFyZ2V0LmF0dHIoXCJkYXRhLXByb2plY3QtaWRcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgXCIuaXNzdWUtaXRlbVwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgbGV0ICR0YXJnZXQgPSAkKGV2LnRhcmdldCkuY2xvc2VzdChcIi5pc3N1ZS1pdGVtXCIpO1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL2lzc3VlL1wiICsgJHRhcmdldC5hdHRyKFwiZGF0YS1pc3N1ZS1pZFwiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJ1cGRhdGVQcm9qZWN0c1wiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVQcm9qZWN0c1BhZ2UoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRJc3N1ZS5vbihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygkKFwiI2FkZElzc3VlTW9kYWxcIikpXHJcbiAgICAgICAgICAgICQoXCIjYWRkSXNzdWVNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZih0aGlzLmFkZElzc3VlRm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZElzc3VlRm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VyaWFsaXplZCA9ICQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKTtcclxuICAgICAgICAgICAgICAgIGxldCBkZXNlcmlhbGl6ZWREYXRhID0gdGhpcy5kZXNlcmlhbGl6ZUZvcm0oc2VyaWFsaXplZCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZXN0aW1hdGVkTWludXRlcyA9IHRoaXMuY29udmVydEVzdGltYXRlKGRlc2VyaWFsaXplZERhdGEub3JpZ2luYWxFc3RpbWF0ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoIWVzdGltYXRlZE1pbnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiLm9yaWdpbmFsLWVzdGltYXRlLWdyb3VwXCIpLmFkZENsYXNzKFwiaGFzLWVycm9yXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBkZXNlcmlhbGl6ZWREYXRhLm9yaWdpbmFsRXN0aW1hdGUgPSBlc3RpbWF0ZWRNaW51dGVzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVJc3N1ZShkZXNlcmlhbGl6ZWREYXRhKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRlc2VyaWFsaXplZERhdGEpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJ1cGRhdGVJc3N1ZXNcIiwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIGlmKGRhdGEucHJvamVjdCA9PSByZXNvdXJjZXMucHJvamVjdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZVByb2plY3RQYWdlKHJlc291cmNlcy5wcm9qZWN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlzc3VlTGlzdGVuZXJzKCkge1xyXG4gICAgICAgIGlmKHRoaXMuYWRkQ29tbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZENvbW1lbnQub24oXCJjbGlja1wiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ29tbWVudE1vZGFsLm1vZGFsKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5hZGRXcm9rTG9nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkV3Jva0xvZy5vbihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRXb3JrTG9nTW9kYWwubW9kYWwoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcInN1Ym1pdFwiLCB0aGlzLmFkZE5ld0NvbW1lbnRGb3JtU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUNvbW1lbnQoJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJzdWJtaXRcIiwgdGhpcy5hZGROZXdXb3JrbG9nRm9ybVNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgbGV0IHNlcmlhbGl6ZWQgPSAkKGV2LnRhcmdldCkuc2VyaWFsaXplKCk7XHJcbiAgICAgICAgICAgIGxldCBkZXNlcmlhbGl6ZWREYXRhID0gdGhpcy5kZXNlcmlhbGl6ZUZvcm0oc2VyaWFsaXplZCk7XHJcbiAgICAgICAgICAgIGxldCBlc3RpbWF0ZWRNaW51dGVzID0gdGhpcy5jb252ZXJ0RXN0aW1hdGUoZGVzZXJpYWxpemVkRGF0YS50aW1lU3BlbnQpO1xyXG4gICAgICAgICAgICBsZXQgbG9nRGF0ZVRpbWUgPSBuZXcgRGF0ZSgkKFwiI2RhdGUtdGltZS1waWNrZXItaW5wdXRcIikudmFsKCkpO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IE9iamVjdCgpO1xyXG5cclxuICAgICAgICAgICAgaWYoIWxvZ0RhdGVUaW1lIHx8IGxvZ0RhdGVUaW1lID09PSBcIkludmFsaWQgRGF0ZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiLmxvZy1kYXRlLXRpbWVcIikuYWRkQ2xhc3MoXCJoYXMtZXJyb3JcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKCFlc3RpbWF0ZWRNaW51dGVzKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiLnRpbWUtc3BlbnQtZ3JvdXBcIikuYWRkQ2xhc3MoXCJoYXMtZXJyb3JcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlc3VsdC5lc3RpbWF0ZWRNaW51dGVzID0gZXN0aW1hdGVkTWludXRlcztcclxuICAgICAgICAgICAgcmVzdWx0LmxvZ0RhdGVUaW1lID0gbG9nRGF0ZVRpbWU7XHJcbiAgICAgICAgICAgIHJlc3VsdC50ZXh0ID0gZGVzZXJpYWxpemVkRGF0YS50ZXh0O1xyXG4gICAgICAgICAgICByZXN1bHQuY3JlYXRvciA9IGRlc2VyaWFsaXplZERhdGEuY3JlYXRvcjtcclxuICAgICAgICAgICAgcmVzdWx0Lmlzc3VlSWQgPSBkZXNlcmlhbGl6ZWREYXRhLmlzc3VlSWQ7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVdvcmtsb2cocmVzdWx0KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJ1cGRhdGVDb21tZW50c1wiLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBpZihkYXRhLmlzc3VlID09IHdpbmRvdy5yZXNvdXJjZXMuaXNzdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9wdWxhdGVJc3N1ZUNvbW1lbnRzKHdpbmRvdy5yZXNvdXJjZXMuaXNzdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc29ja2V0Lm9uKFwidXBkYXRlV29ya0xvZ3NcIiwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgaWYoZGF0YS5pc3N1ZSA9PSB3aW5kb3cucmVzb3VyY2VzLmlzc3VlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvcHVsYXRlSXNzdWVXb3JrbG9ncyh3aW5kb3cucmVzb3VyY2VzLmlzc3VlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIHRoaXMuZGVsZXRlQ29tbWVudFRodW1iU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZUNvbW1lbnRNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZS1jb21tZW50LWlkXCIpLnZhbCgkKGV2LnRhcmdldCkuY2xvc2VzdChcIi5jb21tZW50LWl0ZW1cIikuYXR0cihcImRhdGEtY29tbWVudC1pZFwiKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgdGhpcy5lZGl0Q29tbWVudFRodW1iU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2VkaXRDb21tZW50TW9kYWxcIikubW9kYWwoKTtcclxuICAgICAgICAgICAgJChcIiNlZGl0LWNvbW1lbnQtaWRcIikudmFsKCQoZXYudGFyZ2V0KS5jbG9zZXN0KFwiLmNvbW1lbnQtaXRlbVwiKS5hdHRyKFwiZGF0YS1jb21tZW50LWlkXCIpKTtcclxuICAgICAgICAgICAgJChcIiNjb21tZW50LXRleHRcIikudmFsKCQoZXYudGFyZ2V0KS5jbG9zZXN0KFwiLmNvbW1lbnQtaXRlbVwiKS5maW5kKFwiLnBhbmVsLWJvZHlcIikudGV4dCgpLnRyaW0oKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuZGVsZXRlQ29tbWVudEZvcm0pIHtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVDb21tZW50Rm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUNvbW1lbnQoJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLnVwZGF0ZUNvbW1lbnRGb3JtKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ29tbWVudEZvcm0ub24oXCJzdWJtaXRcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDb21tZW50KCQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCB0aGlzLmRlbGV0ZVdvcmtsb2dCdXR0b25TZWxlY3RvciwgKGV2KSA9PiB7Y29uc29sZS5sb2coXCJ3aGExXCIpXHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlV29ya2xvZ01vZGFsXCIpLm1vZGFsKCk7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlLXdvcmstbG9nLWlkXCIpLnZhbCgkKGV2LnRhcmdldCkuY2xvc2VzdChcIi53b3JrLWxvZy1pdGVtXCIpLmF0dHIoXCJkYXRhLXdvcmstbG9nLWlkXCIpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCB0aGlzLmVkaVdvcmtsb2dCdXR0b25TZWxlY3RvciwgKGV2KSA9PiB7Y29uc29sZS5sb2coXCJ3aGFcIilcclxuICAgICAgICAgICAgJChcIiNlZGl0V29ya2xvZ01vZGFsXCIpLm1vZGFsKCk7XHJcbiAgICAgICAgICAgICQoXCIjZWRpdC13b3JrLWxvZy1pZFwiKS52YWwoJChldi50YXJnZXQpLmNsb3Nlc3QoXCIud29yay1sb2ctaXRlbVwiKS5hdHRyKFwiZGF0YS13b3JrLWxvZy1pZFwiKSk7XHJcbiAgICAgICAgICAgICQoXCIjZWRpdC13b3JrLWxvZy10ZXh0XCIpLnZhbCgkKGV2LnRhcmdldCkuY2xvc2VzdChcIi53b3JrLWxvZy1pdGVtXCIpLmZpbmQoXCIud29ya2xvZy10ZXh0XCIpLnRleHQoKS50cmltKCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZih0aGlzLmRlbGV0ZVdvcmtsb2dGb3JtKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlV29ya2xvZ0Zvcm0ub24oXCJzdWJtaXRcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWxldGVXb3JrbG9nKCQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkZXNlcmlhbGl6ZUZvcm0oc2VyaWFsaXplZEZvcm1EYXRhKSB7XHJcbiAgICAgICAgbGV0IHNlcmlhbGl6ZWREYXRhQXJyYXkgPSBzZXJpYWxpemVkRm9ybURhdGEuc3BsaXQoXCImXCIpO1xyXG4gICAgICAgIGxldCBkZXNlcmlhbGl6ZWREYXRhID0gbmV3IE9iamVjdCgpO1xyXG4gICAgICAgIGxldCBpdGVtU3BsaXQ7XHJcblxyXG4gICAgICAgIGZvcihsZXQgbGVuZ3RoID0gc2VyaWFsaXplZERhdGFBcnJheS5sZW5ndGgsIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgc2VyaWFsaXplZERhdGFBcnJheVtpXSA9IHNlcmlhbGl6ZWREYXRhQXJyYXlbaV0ucmVwbGFjZSgvXFwrL2csIFwiIFwiKTtcclxuXHJcbiAgICAgICAgICAgIGl0ZW1TcGxpdCA9IHNlcmlhbGl6ZWREYXRhQXJyYXlbaV0uc3BsaXQoXCI9XCIpO1xyXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZWREYXRhW2l0ZW1TcGxpdFswXV0gPSBpdGVtU3BsaXRbMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkZXNlcmlhbGl6ZWREYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnZlcnRFc3RpbWF0ZShlc3RpbWF0ZVN0cmluZykge1xyXG4gICAgICAgIGxldCByZWdleHAgPSAvKF5cXGQqaCBcXGQqbSQpfCheXFxkKihcXC5cXGQrKT9oJCl8KF5cXGQqbSQpLzsgLyplLmcgMWggMzBtIG9yIDMwbSBvciAxLjVoKi9cclxuICAgICAgICBsZXQgbWF0Y2ggPSBlc3RpbWF0ZVN0cmluZy5tYXRjaChyZWdleHApO1xyXG4gICAgICAgIGxldCBtYXRjaFNwbGl0O1xyXG4gICAgICAgIGxldCBzcGxpdExlbmd0aDtcclxuICAgICAgICBsZXQgaG91cnM7XHJcbiAgICAgICAgbGV0IG1pbnV0ZXMgPSAwO1xyXG4gICAgICAgIGxldCBhZGRpdGlvbmFsTWludXRlcyA9IDA7XHJcblxyXG4gICAgICAgIGlmKCFtYXRjaCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtYXRjaCA9IG1hdGNoWzBdO1xyXG4gICAgICAgIG1hdGNoU3BsaXQgPSBtYXRjaC5zcGxpdChcIiBcIik7XHJcbiAgICAgICAgc3BsaXRMZW5ndGggPSBtYXRjaFNwbGl0Lmxlbmd0aDtcclxuXHJcbiAgICAgICAgaWYoc3BsaXRMZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICBsZXQgaW5kZXhPZk0gPSBtYXRjaFNwbGl0WzBdLmluZGV4T2YoXCJtXCIpO1xyXG4gICAgICAgICAgICBsZXQgaW5kZXhPZkggPSBtYXRjaFNwbGl0WzBdLmluZGV4T2YoXCJoXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYoaW5kZXhPZk0gIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPSBtYXRjaFNwbGl0WzBdLnNsaWNlKDAsIGluZGV4T2ZNKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoaW5kZXhPZkggIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGhvdXJzID0gbWF0Y2hTcGxpdFswXS5zbGljZSgwLCBpbmRleE9mSCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBpbmRleE9mSCA9IG1hdGNoU3BsaXRbMF0uaW5kZXhPZihcImhcIik7XHJcbiAgICAgICAgICAgIGxldCBpbmRleE9mTSA9IG1hdGNoU3BsaXRbMV0uaW5kZXhPZihcIm1cIik7XHJcblxyXG4gICAgICAgICAgICBpZihpbmRleE9mSCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgaG91cnMgPSBtYXRjaFNwbGl0WzBdLnNsaWNlKDAsIGluZGV4T2ZIKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoaW5kZXhPZk0gIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPSBtYXRjaFNwbGl0WzFdLnNsaWNlKDAsIGluZGV4T2ZNKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoaG91cnMpIHtcclxuICAgICAgICAgICAgYWRkaXRpb25hbE1pbnV0ZXMgPSBwYXJzZUludCg2MCAqIGhvdXJzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1pbnV0ZXMgPSBwYXJzZUludChtaW51dGVzKTtcclxuICAgICAgICBtaW51dGVzICs9IGFkZGl0aW9uYWxNaW51dGVzO1xyXG5cclxuICAgICAgICByZXR1cm4gbWludXRlcztcclxuICAgIH1cclxuXHJcbiAgICBtaW51dGVzVG9TdHJpbmcobWludXRlcykge1xyXG4gICAgICAgIGxldCBob3VycyA9IG1pbnV0ZXMgLyA2MDtcclxuICAgICAgICBsZXQgcmVzdWx0U3RyaW5nID0gaG91cnMgPCAxID8gKCAobWludXRlcyA9PSAxKSA/IHBhcnNlSW50KG1pbnV0ZXMpICsgXCIgbWludXRlXCIgOiBwYXJzZUludChtaW51dGVzKSArIFwiIG1pbnV0ZXNcIiApIDogKCAoaG91cnMgPT0gMSkgPyBob3VycyArIFwiIGhvdXJcIiA6IGhvdXJzICsgXCIgaG91cnNcIiApO1xyXG4gICAgICAgIHJlc3VsdFN0cmluZyA9ICdUaW1lIHNwZW50ICcgKyByZXN1bHRTdHJpbmc7XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHRTdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlQ29tbWVudChkYXRhKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSlcclxuICAgICAgICBsZXQgY3JlYXRlQ29tbWVudFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9jb21tZW50XCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY3JlYXRlQ29tbWVudFByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MgY3JlYXRpbmcgY29tbWVudDpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICQoXCIjYWRkQ29tbWVudE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciBkdXJpbmcgY29tbWVudCBjcmVhdGlvblwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZHVyaW5nIGNvbW1lbnQgY3JlYXRpb25cIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlSXNzdWUoZGF0YSkge1xyXG4gICAgICAgIGxldCBjcmVhdGVJc3N1ZVByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9pc3N1ZVwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MsIFwiLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNyZWF0ZUlzc3VlUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcyByZWc6XCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAkKFwiI2FkZElzc3VlTW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGR1cmluZyBwcm9qZWN0IGNyZWF0aW9uXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgaXNzdWUgY3JlYXRpb25cIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlUHJvamVjdChkYXRhKSB7XHJcbiAgICAgICAgbGV0IGRlbGV0ZVByb2plY3RQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvcHJvamVjdFwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVsZXRlUHJvamVjdFByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZVByb2plY3RNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgcmVtb3ZpbmcgcHJvamVjdFwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3Igd2hpbGUgcmVtb3ZpbmcgcHJvamVjdFwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVQcm9qZWN0KGRhdGEpIHtcclxuICAgICAgICBsZXQgdXBkYXRlUHJvamVjdFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9qZWN0XCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2VkaXRQcm9qZWN0TW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdXBkYXRlUHJvamVjdFByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZVByb2plY3RNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgcmVtb3ZpbmcgcHJvamVjdFwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgdXBkYXRpbmcgcHJvamVjdHNcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlSXNzdWUoZGF0YSkge1xyXG4gICAgICAgIGxldCBkZWxldGVJc3N1ZVByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9pc3N1ZVwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVsZXRlSXNzdWVQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgJChcIiNkZWxldGVJc3N1ZU1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciByZW1vdmluZyBpc3N1ZVwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgcmVtb3ZpbmcgaXNzdWVcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlSXNzdWUoZGF0YSkge1xyXG4gICAgICAgIGxldCB1cGRhdGVJc3N1ZVByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9pc3N1ZVwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNlZGl0UHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHVwZGF0ZUlzc3VlUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlUHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZyBpc3N1ZVwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3Igd2hpbGUgdXBkYXRpbmcgaXNzdWVcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcG9wdWxhdGVQcm9qZWN0UGFnZShwcm9qZWN0SWQpIHtcclxuICAgICAgICBsZXQgaXNzdWVzUHJvbWlzZSA9IHRoaXMuZ2V0SXNzdWVzKHByb2plY3RJZCwgcG9wdWxhdGVJc3N1ZXNUZW1wbGF0ZSk7XHJcbiAgICAgICAgbGV0ICRpc3N1ZXNTZWN0aW9uID0gJChcIi5wcm9qZWN0LXBhZ2UgLmlzc3Vlcy1zZWN0aW9uXCIpO1xyXG5cclxuICAgICAgICBpc3N1ZXNQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpc3N1ZXMgY29sbGVjdGlvbiBpczo6XCIsIGRhdGEpO1xyXG4gICAgICAgICAgICBwb3B1bGF0ZUlzc3Vlc1RlbXBsYXRlKGRhdGEpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHBvcHVsYXRlSXNzdWVzVGVtcGxhdGUoaXNzdWVzTGlzdCkge1xyXG4gICAgICAgICAgICBsZXQgZ2V0UHJvamVjdHNQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgdXJsOiBcIi90ZW1wbGF0ZXMvdGVtcGxhdGVzLmh0bWxcIixcclxuICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnaHRtbCdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGdldFByb2plY3RzUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc291cmNlID0gJChkYXRhKS5maW5kKFwiI3Byb2plY3QtdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gSGFuZGxlYmFycy5jb21waWxlKHNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGV4dCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBpc3N1ZXNMaXN0OiBpc3N1ZXNMaXN0XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgbGV0IGh0bWwgPSB0ZW1wbGF0ZShjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgICRpc3N1ZXNTZWN0aW9uLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2VkaXRJc3N1ZU1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBkdXJpbmcgaXNzdWVzIHRlbXBsYXRlIGZldGNoXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZHVyaW5nIHByb2plY3QgY3JlYXRpb25cIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwb3B1bGF0ZUlzc3VlUGFnZShpc3N1ZUlkKSB7XHJcbiAgICAgICAgdGhpcy5wb3B1bGF0ZUlzc3VlQ29tbWVudHMoaXNzdWVJZCk7XHJcbiAgICAgICAgdGhpcy5wb3B1bGF0ZUlzc3VlV29ya2xvZ3MoaXNzdWVJZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcG9wdWxhdGVJc3N1ZUNvbW1lbnRzKGlzc3VlSWQpIHtcclxuICAgICAgICBsZXQgY29tbWVudHNQcm9taXNlID0gdGhpcy5nZXRDb21tZW50cyhpc3N1ZUlkKTtcclxuICAgICAgICBsZXQgJGNvbW1lbnRzU2VjdGlvbiA9ICQoXCIuaXNzdWUtcGFnZSAuaXNzdWUtY29tbWVudHNcIik7XHJcblxyXG4gICAgICAgIGNvbW1lbnRzUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaXNzdWVzIGNvbW1lbnRzIGlzOjpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgIHBvcHVsYXRlQ29tbWVudHNUZW1wbGF0ZShkYXRhKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwb3B1bGF0ZUNvbW1lbnRzVGVtcGxhdGUoY29tbWVudHNMaXN0KSB7XHJcbiAgICAgICAgICAgIGNvbW1lbnRzTGlzdC5mb3JFYWNoKChjb21tZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZihjb21tZW50LmNyZWF0b3IuX2lkID09PSB3aW5kb3cucmVzb3VyY2VzLnVzZXIuaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tZW50LmlzQ29tbWVudE93bmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tZW50LmlzQ29tbWVudE93bmVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGdldENvbW1lbnRzUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgIHVybDogXCIvdGVtcGxhdGVzL3RlbXBsYXRlcy5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2h0bWwnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBnZXRDb21tZW50c1Byb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNvdXJjZSA9ICQoZGF0YSkuZmluZChcIiNjb21tZW50cy10ZW1wbGF0ZVwiKS5odG1sKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGUgPSBIYW5kbGViYXJzLmNvbXBpbGUoc291cmNlKTtcclxuICAgICAgICAgICAgICAgIGxldCBjb250ZXh0ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1lbnRzTGlzdDogY29tbWVudHNMaXN0LFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRVc2VyOiB3aW5kb3cucmVzb3VyY2VzLnVzZXIuaWRcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBsZXQgaHRtbCA9IHRlbXBsYXRlKGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgJGNvbW1lbnRzU2VjdGlvbi5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGR1cmluZyBjb21tZW50cyB0ZW1wbGF0ZSBmZXRjaFwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICBhbGVydChcIkVycm9yIGR1cmluZyBwcm9qZWN0IGNyZWF0aW9uXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcG9wdWxhdGVJc3N1ZVdvcmtsb2dzKGlzc3VlSWQpIHtcclxuICAgICAgICBsZXQgd29ya0xvZ3NQcm9taXNlID0gdGhpcy5nZXRXb3JrbG9ncyhpc3N1ZUlkKTtcclxuICAgICAgICBsZXQgJHdvcmtMb2dzU2VjdGlvbiA9ICQoXCIuaXNzdWUtcGFnZSAuaXNzdWUtd29ya2xvZ3NcIik7XHJcblxyXG4gICAgICAgIHdvcmtMb2dzUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaXNzdWVzIGxvZ3MgaXM6XCIsIGRhdGEpO1xyXG4gICAgICAgICAgICBkYXRhLmZvckVhY2goKHdvcmtMb2cpID0+IHtcclxuICAgICAgICAgICAgICAgIHdvcmtMb2cudGltZVNwZW50ID0gdGhpcy5taW51dGVzVG9TdHJpbmcod29ya0xvZy50aW1lU3BlbnQpO2NvbnNvbGUubG9nKFwid2JsXCIgKyB3b3JrTG9nLmRhdGVTdGFydGVkKVxyXG4gICAgICAgICAgICAgICAgLy93b3JrTG9nLmRhdGVTdGFydGVkID0gbmV3IERhdGUod29ya0xvZy5kYXRlU3RhcnRlZCk7XHJcbiAgICAgICAgICAgICAgICAvL3dvcmtMb2cuZGF0ZVN0YXJ0ZWQgPSB3b3JrTG9nLmRhdGVTdGFydGVkLmdldE1vbnRoKCkgKyAxICsgXCIvXCIgKyB3b3JrTG9nLmRhdGVTdGFydGVkLmdldERhdGUoKSArIFwiL1wiICsgd29ya0xvZy5kYXRlU3RhcnRlZC5nZXRGdWxsWWVhcigpICsgXCIgXCIgKyB3b3JrTG9nLmRhdGVTdGFydGVkLmdldEhvdXJzKCkgKyBcIjpcIiArIHdvcmtMb2cuZGF0ZVN0YXJ0ZWQuZ2V0TWludXRlcygpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ3bFwiICt3b3JrTG9nLmRhdGVTdGFydGVkKVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG5cclxuICAgICAgICAgICAgcG9wdWxhdGVXb3JrbG9nc1RlbXBsYXRlKGRhdGEpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHBvcHVsYXRlV29ya2xvZ3NUZW1wbGF0ZSh3b3JrTG9nc0xpc3QpIHtcclxuICAgICAgICAgICAgd29ya0xvZ3NMaXN0LmZvckVhY2goKHdvcmtMb2cpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHdvcmtMb2cuY3JlYXRvci5faWQgPT09IHdpbmRvdy5yZXNvdXJjZXMudXNlci5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtMb2cuaXNXb3JrTG9nT3duZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtMb2cuaXNXb3JrTG9nT3duZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZ2V0V29ya0xvZ3NQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgdXJsOiBcIi90ZW1wbGF0ZXMvdGVtcGxhdGVzLmh0bWxcIixcclxuICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnaHRtbCdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGdldFdvcmtMb2dzUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc291cmNlID0gJChkYXRhKS5maW5kKFwiI3dvcmstbG9ncy10ZW1wbGF0ZVwiKS5odG1sKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGUgPSBIYW5kbGViYXJzLmNvbXBpbGUoc291cmNlKTtcclxuICAgICAgICAgICAgICAgIGxldCBjb250ZXh0ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtMb2dzTGlzdDogd29ya0xvZ3NMaXN0LFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRVc2VyOiB3aW5kb3cucmVzb3VyY2VzLnVzZXIuaWRcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBsZXQgaHRtbCA9IHRlbXBsYXRlKGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgJHdvcmtMb2dzU2VjdGlvbi5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGR1cmluZyBjb21tZW50cyB0ZW1wbGF0ZSBmZXRjaFwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICBhbGVydChcIkVycm9yIGR1cmluZyBwcm9qZWN0IGNyZWF0aW9uXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcG9wdWxhdGVQcm9qZWN0c1BhZ2UoKSB7XHJcbiAgICAgICAgbGV0IHByb2plY3RzUHJvbWlzZSA9IHRoaXMuZ2V0UHJvamVjdHMoKTtcclxuICAgICAgICBsZXQgcHJvamVjdHM7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgICBwcm9qZWN0c1Byb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImZldGNoZWQgcHJvamVjdHM6XCIsIGRhdGEpO1xyXG4gICAgICAgICAgICBwb3B1bGF0ZVByb2plY3RzVGVtcGxhdGUoZGF0YSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZmV0Y2hpbmcgcHJvamVjdHNcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIGZldGNoaW5nIHByb2plY3RzXCIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBwb3B1bGF0ZVByb2plY3RzVGVtcGxhdGUocHJvamVjdHNMaXN0KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHByb2plY3RzTGlzdClcclxuICAgICAgICAgICAgbGV0IGdldFByb2plY3RzUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgIHVybDogXCIvdGVtcGxhdGVzL3RlbXBsYXRlcy5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2h0bWwnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBnZXRQcm9qZWN0c1Byb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNvdXJjZSA9ICQoZGF0YSkuZmluZChcIiNwcm9qZWN0cy10ZW1wbGF0ZVwiKS5odG1sKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGUgPSBIYW5kbGViYXJzLmNvbXBpbGUoc291cmNlKTtcclxuICAgICAgICAgICAgICAgIGxldCBjb250ZXh0ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb2plY3RzTGlzdDogcHJvamVjdHNMaXN0XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgbGV0IGh0bWwgPSB0ZW1wbGF0ZShjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgIHRoYXQucHJvamVjdHNTZWN0aW9uLmh0bWwoaHRtbCk7XHJcblxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGR1cmluZyBwcm9qZWN0cyB0ZW1wbGF0ZSBmZXRjaFwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICBhbGVydChcIkVycm9yIGR1cmluZyBwcm9qZWN0IGNyZWF0aW9uXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlUHJvamVjdCgkdGFyZ2V0KSB7XHJcbiAgICAgICAgbGV0IGRhdGEgPSAkdGFyZ2V0LnNlcmlhbGl6ZSgpO1xyXG5cclxuICAgICAgICBsZXQgY3JlYXRlUHJvamVjdFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9qZWN0XCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNhZGRQcm9qZWN0TW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY3JlYXRlUHJvamVjdFByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MgcmVnOlwiLCBkYXRhKTtcclxuXHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZHVyaW5nIHByb2plY3QgY3JlYXRpb25cIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIGR1cmluZyBwcm9qZWN0IGNyZWF0aW9uXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFByb2plY3RzKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgbGV0IGdldFByb2plY3RzUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL3Byb2plY3RzSXRlbXNcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBnZXRQcm9qZWN0c1Byb21pc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SXNzdWVzKHByb2plY3RJZCwgY2FsbGJhY2spIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInByaTpcIiwgcHJvamVjdElkKTtcclxuICAgICAgICBsZXQgZ2V0SXNzdWVzUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2lzc3Vlc1wiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgIHByb2plY3RJZDogcHJvamVjdElkXHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGdldElzc3Vlc1Byb21pc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q29tbWVudHMoaXNzdWVJZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiaXNzdWVJZGw6XCIsIGlzc3VlSWQpO1xyXG4gICAgICAgIGxldCBnZXRDb21tZW50c1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9jb21tZW50c1wiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgIGlzc3VlSWQ6IGlzc3VlSWRcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZ2V0Q29tbWVudHNQcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFdvcmtsb2dzKGlzc3VlSWQpIHtcclxuICAgICAgICBsZXQgZ2V0V29ya0xvZ3NQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvbG9nc1wiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgIGlzc3VlSWQ6IGlzc3VlSWRcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZ2V0V29ya0xvZ3NQcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUNvbW1lbnQoZGF0YSkge1xyXG4gICAgICAgIGxldCBkZXNlcmlhbGl6ZWREYXRhID0gdGhpcy5kZXNlcmlhbGl6ZUZvcm0oZGF0YSlcclxuICAgICAgICBkZXNlcmlhbGl6ZWREYXRhLmlzc3VlSWQgPSB3aW5kb3cucmVzb3VyY2VzLmlzc3VlO1xyXG4gICAgICAgIGxldCB1cGRhdGVDb21tZW50UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2NvbW1lbnRcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkZXNlcmlhbGl6ZWREYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MsIFwiLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICQoXCIjZWRpdENvbW1lbnRNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB1cGRhdGVDb21tZW50UHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlUHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZyBpc3N1ZVwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3Igd2hpbGUgdXBkYXRpbmcgaXNzdWVcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlQ29tbWVudChkYXRhKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgbGV0IGRlc2VyaWFsaXplZERhdGEgPSB0aGlzLmRlc2VyaWFsaXplRm9ybShkYXRhKVxyXG4gICAgICAgIGRlc2VyaWFsaXplZERhdGEuaXNzdWVJZCA9IHdpbmRvdy5yZXNvdXJjZXMuaXNzdWU7XHJcbiAgICAgICAgbGV0IGRlbGV0ZUNvbW1lbnRQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvY29tbWVudFwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRlc2VyaWFsaXplZERhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVsZXRlQ29tbWVudFByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZUNvbW1lbnRNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgcmVtb3ZpbmcgY29tbWVudFwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgcmVtb3ZpbmcgY29tbWVudFwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVXb3JrbG9nKGRhdGEpIHtcclxuICAgICAgICBsZXQgY3JlYXRlV29ya2xvZ1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9sb2dcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjcmVhdGVXb3JrbG9nUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcyByZWc6XCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAkKFwiI2FkZFdvcmtMb2dNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZHVyaW5nIGxvZyBjcmVhdGlvblwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZHVyaW5nIGxvZyBjcmVhdGlvblwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVXb3JrbG9nKGRhdGEpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICBsZXQgZGVzZXJpYWxpemVkRGF0YSA9IHRoaXMuZGVzZXJpYWxpemVGb3JtKGRhdGEpXHJcbiAgICAgICAgZGVzZXJpYWxpemVkRGF0YS5pc3N1ZUlkID0gd2luZG93LnJlc291cmNlcy5pc3N1ZTtcclxuICAgICAgICBsZXQgZGVsZXRlQ29tbWVudFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9sb2dcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkZXNlcmlhbGl6ZWREYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MsIFwiLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlbGV0ZUNvbW1lbnRQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgJChcIiNkZWxldGVXb3JrbG9nTW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHJlbW92aW5nIHdvcmtsb2dcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIHJlbW92aW5nIHdvcmtsb2dcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9naW5BbmRSZWdpc3Rlckxpc3RlbmVycygpIHtcclxuICAgICAgICBpZih0aGlzLmxvZ2luRm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2luRm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2luKCQoIGV2LnRhcmdldCApKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLnJlZ2lzdGVyRm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyRm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJChcIiNwYXNzd29yZDFcIikudmFsKCkgIT0gJChcIiNwYXNzd29yZDJcIikudmFsKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiLmZvcm0tZ3JvdXBcIikuYWRkQ2xhc3MoXCJoYXMtZXJyb3JcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJwYXNzd29yZHMgeW91IGVudGVyZWQgYXJlIG5vdCBpZGVudGljYWxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWdpc3RlcigkKCBldi50YXJnZXQgKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgSXNzdWVUcmFja2VyIGZyb20gJy4vSXNzdWVUcmFja2VyJztcclxuXHJcbmxldCBpc3N1ZVRyYWNrZXIgPSBuZXcgSXNzdWVUcmFja2VyKCk7XHJcbi8vY29uc29sZS5sb2coSXNzdWVUcmFja2VyKTtcclxuLy92YXIgW2EsIGIsIGNdID0gWzEgLCAyLCAzXTtcclxuIl19
