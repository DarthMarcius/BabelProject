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
            this.updateWorklogFormSelector = "#updateWorklog";
            this.dateTimePicker = $("#work-log-datetimepicker").length ? $("#work-log-datetimepicker") : false;
            this.dateTimePickerEditSelector = "#work-log-datetimepicker-edit";
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
        value: function initDom() {}
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

                this.addWorkLogModal.on("show.bs.modal", function (ev) {
                    if (_this5.dateTimePicker) {
                        if (_this5.dateTimePicker.data('DateTimePicker')) {
                            _this5.dateTimePicker.data('DateTimePicker').date(new Date());
                        } else {
                            _this5.dateTimePicker.datetimepicker({
                                defaultDate: new Date()
                            });
                        }

                        /*$("#date-time-picker-input").focus((ev) => {
                            $(".input-group-addon").click();
                        });*/
                    }
                });
            }

            $("body").on("submit", this.addNewCommentFormSelector, function (ev) {
                ev.preventDefault();
                _this5.createComment($(ev.target).serialize());
            });

            $("body").on("submit", this.updateWorklogFormSelector, function (ev) {
                ev.preventDefault();
                var serialized = $(ev.target).serialize();
                var deserializedData = _this5.deserializeForm(serialized);
                var estimatedMinutes = _this5.convertEstimate(deserializedData.timeSpent);
                var logDateTime = new Date($("#date-time-picker-update-input").val());
                var result = new Object();

                if (!logDateTime || logDateTime === "Invalid Date") {
                    $(".log-date-time-update").addClass("has-error");
                    return;
                }

                if (!estimatedMinutes) {
                    $(".update-time-spent-group").addClass("has-error");
                    return;
                }

                result.estimatedMinutes = estimatedMinutes;
                result.logDateTime = logDateTime;
                result.text = deserializedData.text;
                result.issueId = deserializedData.issueId;
                result.worklogId = deserializedData.worklogId;

                _this5.updateWorklog(result);
            });

            this.socket.on("updateComments", function (data) {
                if (data.issue == window.resources.issue) {
                    _this5.populateIssueComments(window.resources.issue);
                }
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
                var $currentItem = $(ev.target).closest(".work-log-item");
                var dateTime = $currentItem.find(".work-log-info").html().split("- ")[1];
                var timeSpent = $currentItem.find(".time-spent").attr("data-minutes");
                var timeSpentNotation = _this5.minutesToString(timeSpent, "notation");

                $("#editWorklogModal").modal();
                $("#edit-work-log-id").val($currentItem.attr("data-work-log-id"));
                $("#edit-work-log-text").val($currentItem.find(".worklog-text").text().trim());
                $("#timeSpentUpdate").val(timeSpentNotation);

                if ($(_this5.dateTimePickerEditSelector).data('DateTimePicker')) {
                    $(_this5.dateTimePickerEditSelector).data('DateTimePicker').date(dateTime);
                } else {
                    $(_this5.dateTimePickerEditSelector).datetimepicker({
                        defaultDate: dateTime
                    });
                }
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
        value: function minutesToString(minutes, notation) {
            var hours = minutes / 60;
            if (!notation) {
                var resultString = hours < 1 ? minutes == 1 ? parseInt(minutes) + " minute" : parseInt(minutes) + " minutes" : hours == 1 ? hours + " hour" : hours + " hours";
                resultString = 'Time spent: ' + resultString;
            } else if (notation === "notation") {
                var remainder = hours % 1;
                var _minutes = parseInt(remainder * 60);
                hours = parseInt(hours - remainder);

                var resultString = hours < 1 ? _minutes + "m" : hours + "h" + " " + _minutes + "m";
            }

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

                    comment.updated = new Date(comment.updated);
                    comment.updated = comment.updated.getMonth() + 1 + "/" + comment.updated.getDate() + "/" + comment.updated.getFullYear() + " " + comment.updated.getHours() + ":" + comment.updated.getMinutes();
                    //console.log("wl" +new Date(workLog.dateStarted))s
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
            var issueOriginalEstimate = void 0;
            var that = this;

            workLogsPromise.then(function (data) {
                console.log("issues logs is:", data);
                var originelEstimate = data.originelEstimate;
                var worklogs = data.worklogs;

                worklogs.forEach(function (workLog) {
                    workLog.timeSpentMinutes = workLog.timeSpent;
                    workLog.timeSpent = _this6.minutesToString(workLog.timeSpent);
                    workLog.dateStarted = new Date(workLog.dateStarted);
                    workLog.dateStarted = workLog.dateStarted.getMonth() + 1 + "/" + workLog.dateStarted.getDate() + "/" + workLog.dateStarted.getFullYear() + " " + workLog.dateStarted.getHours() + ":" + workLog.dateStarted.getMinutes();
                    //console.log("wl" +new Date(workLog.dateStarted))
                });

                issueOriginalEstimate = originelEstimate;

                populateWorklogsTemplate({
                    originelEstimate: originelEstimate,
                    workLogsList: worklogs
                });
            });

            function populateWorklogsTemplate(data) {
                console.log("this", this);
                var originelEstimate = data.originelEstimate;
                var workLogsList = data.workLogsList;

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

                    that.populateIssueTimeTracking(issueOriginalEstimate, workLogsList);
                }).catch(function (jqXHR, textStatus) {
                    console.log("error during comments template fetch", jqXHR, textStatus);
                    alert("Error during project creation");
                });
            }
        }
    }, {
        key: "populateIssueTimeTracking",
        value: function populateIssueTimeTracking(issueOriginalEstimate, workLogsList) {
            var issueLoggedMinutes = 0;
            var issueLoggedTimeString = void 0;
            var issueEstimatedTimeString = void 0;
            var loggedPercent = void 0;

            workLogsList.forEach(function (worklog) {
                issueLoggedMinutes += worklog.timeSpentMinutes;
            });

            issueLoggedTimeString = this.minutesToString(issueLoggedMinutes, "notation");
            issueEstimatedTimeString = this.minutesToString(issueOriginalEstimate, "notation");

            loggedPercent = issueLoggedMinutes * 100 / issueOriginalEstimate;
            console.log(issueOriginalEstimate, issueLoggedMinutes, loggedPercent);
            $(".progress-bar").css({
                width: loggedPercent + "%"
            });

            $(".issue-logged").html(issueLoggedTimeString);
            $(".issue-estimated").html(issueEstimatedTimeString);

            if (issueLoggedMinutes > issueOriginalEstimate) {
                $(".progress-bar").removeClass("progress-bar-success").addClass("progress-bar-danger");
            } else {
                $(".progress-bar").removeClass("progress-bar-danger").addClass("progress-bar-success");
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
                    console.log("from Serever: ", data);
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
        key: "updateWorklog",
        value: function updateWorklog(data) {
            console.log("data", data);
            var updateWorklogPromise = new Promise(function (resolve, reject) {
                var request = $.ajax({
                    url: "/log",
                    method: "PUT",
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

            updateWorklogPromise.then(function (data) {
                console.log("success workloglog:", data);
                $("#editWorklogModal").modal("hide");
            }).catch(function (jqXHR, textStatus) {
                console.log("error during log update", jqXHR, textStatus);
                alert("Error during log update");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRcXElzc3VlVHJhY2tlci5qcyIsInNjcmlwdFxcYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztJQ0FxQjtBQUNqQixhQURpQixZQUNqQixHQUFjOzhCQURHLGNBQ0g7O0FBQ1YsWUFBSSxTQUFTLE9BQU8sUUFBUCxDQUFnQixRQUFoQixJQUE0QixXQUE1QixHQUEwQyxzQkFBc0IsVUFBVSxJQUFWLEdBQWlCLGFBQWEsT0FBTyxRQUFQLENBQWdCLFFBQWhCLENBRGpHO0FBRVYsYUFBSyxNQUFMLEdBQWMsR0FBRyxNQUFILENBQWQsQ0FGVTtBQUdWLGFBQUssU0FBTCxHQUhVO0FBSVYsYUFBSyxPQUFMLEdBSlU7QUFLVixhQUFLLFlBQUwsR0FMVTtLQUFkOztpQkFEaUI7O29DQVNMO0FBQ1IsaUJBQUssbUJBQUwsR0FBMkIsRUFBRSxjQUFGLEVBQWtCLE1BQWxCLEdBQTJCLEVBQUUsY0FBRixDQUEzQixHQUErQyxLQUEvQyxDQURuQjtBQUVSLGlCQUFLLGtCQUFMLEdBQTBCLEVBQUUsa0JBQUYsRUFBc0IsTUFBdEIsR0FBK0IsRUFBRSxrQkFBRixDQUEvQixHQUF1RCxLQUF2RCxDQUZsQjtBQUdSLGlCQUFLLFNBQUwsR0FBaUIsRUFBRSxhQUFGLEVBQWlCLE1BQWpCLEdBQTBCLEVBQUUsYUFBRixDQUExQixHQUE2QyxLQUE3QyxDQUhUO0FBSVIsaUJBQUssZUFBTCxHQUF1QixFQUFFLGtCQUFGLENBQXZCLENBSlE7QUFLUixpQkFBSyxZQUFMLEdBQW9CLEVBQUUsZ0JBQUYsRUFBb0IsTUFBcEIsR0FBNkIsRUFBRSxnQkFBRixDQUE3QixHQUFtRCxLQUFuRCxDQUxaO0FBTVIsaUJBQUssa0JBQUwsR0FBMEIsRUFBRSx5QkFBRixDQUExQixDQU5RO0FBT1IsaUJBQUssaUJBQUwsR0FBeUIsRUFBRSxnQkFBRixFQUFvQixNQUFwQixHQUE2QixFQUFFLGdCQUFGLENBQTdCLEdBQW1ELEtBQW5ELENBUGpCO0FBUVIsaUJBQUssWUFBTCxHQUFvQixFQUFFLGdCQUFGLEVBQW9CLE1BQXBCLEdBQTZCLEVBQUUsZ0JBQUYsQ0FBN0IsR0FBbUQsS0FBbkQsQ0FSWjtBQVNSLGlCQUFLLGVBQUwsR0FBdUIsRUFBRSxtQkFBRixDQUF2QixDQVRRO0FBVVIsaUJBQUssbUJBQUwsR0FBMkIsZUFBM0IsQ0FWUTtBQVdSLGlCQUFLLHFCQUFMLEdBQTZCLGlCQUE3QixDQVhRO0FBWVIsaUJBQUsseUJBQUwsR0FBaUMsZ0JBQWpDLENBWlE7QUFhUixpQkFBSyx5QkFBTCxHQUFpQyxnQkFBakMsQ0FiUTtBQWNSLGlCQUFLLFdBQUwsR0FBbUIsRUFBRSxlQUFGLEVBQW1CLE1BQW5CLEdBQTRCLEVBQUUsZUFBRixDQUE1QixHQUFpRCxLQUFqRCxDQWRYO0FBZVIsaUJBQUssU0FBTCxHQUFpQixFQUFFLGFBQUYsRUFBaUIsTUFBakIsR0FBMEIsRUFBRSxhQUFGLENBQTFCLEdBQTZDLEtBQTdDLENBZlQ7QUFnQlIsaUJBQUssUUFBTCxHQUFnQixFQUFFLFlBQUYsQ0FBaEIsQ0FoQlE7QUFpQlIsaUJBQUssWUFBTCxHQUFvQixFQUFFLGNBQUYsRUFBa0IsTUFBbEIsR0FBMkIsRUFBRSxjQUFGLENBQTNCLEdBQStDLEtBQS9DLENBakJaO0FBa0JSLGlCQUFLLGVBQUwsR0FBdUIsRUFBRSxjQUFGLEVBQWtCLE1BQWxCLEdBQTJCLEVBQUUsY0FBRixDQUEzQixHQUErQyxLQUEvQyxDQWxCZjtBQW1CUixpQkFBSyxlQUFMLEdBQXVCLEVBQUUsY0FBRixFQUFrQixNQUFsQixHQUEyQixFQUFFLGNBQUYsQ0FBM0IsR0FBK0MsS0FBL0MsQ0FuQmY7QUFvQlIsaUJBQUssaUJBQUwsR0FBeUIsYUFBekIsQ0FwQlE7QUFxQlIsaUJBQUssbUJBQUwsR0FBMkIsZUFBM0IsQ0FyQlE7QUFzQlIsaUJBQUssVUFBTCxHQUFrQixFQUFFLGNBQUYsRUFBa0IsTUFBbEIsR0FBMkIsRUFBRSxjQUFGLENBQTNCLEdBQStDLEtBQS9DLENBdEJWO0FBdUJSLGlCQUFLLFVBQUwsR0FBa0IsRUFBRSxjQUFGLEVBQWtCLE1BQWxCLEdBQTJCLEVBQUUsY0FBRixDQUEzQixHQUErQyxLQUEvQyxDQXZCVjtBQXdCUixpQkFBSyxlQUFMLEdBQXVCLEVBQUUsa0JBQUYsQ0FBdkIsQ0F4QlE7QUF5QlIsaUJBQUssZUFBTCxHQUF1QixFQUFFLGtCQUFGLENBQXZCLENBekJRO0FBMEJSLGlCQUFLLHlCQUFMLEdBQWlDLGdCQUFqQyxDQTFCUTtBQTJCUixpQkFBSyx5QkFBTCxHQUFpQyxnQkFBakMsQ0EzQlE7QUE0QlIsaUJBQUsseUJBQUwsR0FBaUMsZ0JBQWpDLENBNUJRO0FBNkJSLGlCQUFLLGNBQUwsR0FBc0IsRUFBRSwwQkFBRixFQUE4QixNQUE5QixHQUF1QyxFQUFFLDBCQUFGLENBQXZDLEdBQXVFLEtBQXZFLENBN0JkO0FBOEJSLGlCQUFLLDBCQUFMLEdBQWtDLCtCQUFsQyxDQTlCUTtBQStCUixpQkFBSyx3QkFBTCxHQUFnQyxlQUFoQyxDQS9CUTtBQWdDUixpQkFBSywwQkFBTCxHQUFrQyxpQkFBbEMsQ0FoQ1E7QUFpQ1IsaUJBQUssaUJBQUwsR0FBeUIsRUFBRSxnQkFBRixFQUFvQixNQUFwQixHQUE2QixFQUFFLGdCQUFGLENBQTdCLEdBQW1ELEtBQW5ELENBakNqQjtBQWtDUixpQkFBSyxpQkFBTCxHQUF5QixFQUFFLGdCQUFGLEVBQW9CLE1BQXBCLEdBQTZCLEVBQUUsZ0JBQUYsQ0FBN0IsR0FBbUQsS0FBbkQsQ0FsQ2pCO0FBbUNSLGlCQUFLLDJCQUFMLEdBQW1DLGtCQUFuQyxDQW5DUTtBQW9DUixpQkFBSyx3QkFBTCxHQUFnQyxnQkFBaEMsQ0FwQ1E7QUFxQ1IsaUJBQUssaUJBQUwsR0FBeUIsRUFBRSxnQkFBRixFQUFvQixNQUFwQixHQUE2QixFQUFFLGdCQUFGLENBQTdCLEdBQW1ELEtBQW5ELENBckNqQjtBQXNDUixpQkFBSyxlQUFMLEdBQXVCLEVBQUUsZ0JBQUYsRUFBb0IsTUFBcEIsR0FBNkIsRUFBRSxnQkFBRixDQUE3QixHQUFtRCxLQUFuRCxDQXRDZjs7OztrQ0F5Q0Y7Ozs4QkFJSixTQUFTOzs7QUFDWCxnQkFBSSxPQUFPLFFBQVEsU0FBUixFQUFQOzs7QUFETyxnQkFJUCxlQUFlLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBcUI7QUFDaEQsb0JBQUksVUFBVSxFQUFFLElBQUYsQ0FBTztBQUNsQix5QkFBSyxRQUFMO0FBQ0EsNEJBQVEsTUFBUjtBQUNBLDBCQUFNLElBQU47aUJBSFcsQ0FBVixDQUQ0Qzs7QUFPaEQsd0JBQVEsSUFBUixDQUFhLFVBQUMsSUFBRCxFQUFVO0FBQ25CLDRCQUFRLElBQVIsRUFEbUI7aUJBQVYsQ0FBYixDQVBnRDs7QUFXaEQsd0JBQVEsSUFBUixDQUFhLFVBQUMsS0FBRCxFQUFRLFVBQVIsRUFBdUI7QUFDaEMsMkJBQU8sS0FBUCxFQUFjLFVBQWQsRUFEZ0M7aUJBQXZCLENBQWIsQ0FYZ0Q7YUFBckIsQ0FBM0IsQ0FKTzs7QUFvQlgseUJBQWEsSUFBYixDQUFrQixVQUFDLElBQUQsRUFBVTtBQUN4Qix1QkFBTyxRQUFQLEdBQWtCLEtBQUssVUFBTCxDQURNO2FBQVYsQ0FBbEIsQ0FHQyxLQUhELENBR08sVUFBQyxLQUFELEVBQVEsVUFBUixFQUF1QjtBQUMxQixzQkFBSyxlQUFMLENBQXFCLEtBQXJCLEdBRDBCO2FBQXZCLENBSFAsQ0FwQlc7Ozs7aUNBNEJOLFNBQVM7OztBQUNkLGdCQUFJLE9BQU8sUUFBUSxTQUFSLEVBQVA7OztBQURVLGdCQUlWLGtCQUFrQixJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ25ELG9CQUFJLFVBQVUsRUFBRSxJQUFGLENBQU87QUFDbEIseUJBQUssV0FBTDtBQUNBLDRCQUFRLE1BQVI7QUFDQSwwQkFBTSxJQUFOO2lCQUhXLENBQVYsQ0FEK0M7O0FBT25ELHdCQUFRLElBQVIsQ0FBYSxVQUFDLElBQUQsRUFBVTtBQUNuQiw0QkFBUSxJQUFSLEVBRG1CO2lCQUFWLENBQWIsQ0FQbUQ7O0FBV25ELHdCQUFRLElBQVIsQ0FBYSxVQUFDLEtBQUQsRUFBUSxVQUFSLEVBQXVCO0FBQ2hDLDJCQUFPLEtBQVAsRUFBYyxVQUFkLEVBRGdDO2lCQUF2QixDQUFiLENBWG1EO2FBQXJCLENBQTlCLENBSlU7O0FBb0JkLDRCQUFnQixJQUFoQixDQUFxQixVQUFDLElBQUQsRUFBVTtBQUMzQix3QkFBUSxHQUFSLENBQVksY0FBWixFQUE0QixJQUE1QixFQUQyQjtBQUUzQix1QkFBTyxRQUFQLEdBQWtCLEtBQUssVUFBTCxDQUZTO2FBQVYsQ0FBckIsQ0FJQyxLQUpELENBSU8sVUFBQyxLQUFELEVBQVEsVUFBUixFQUF1QjtBQUMxQix3QkFBUSxHQUFSLENBQVksYUFBWixFQUEyQixLQUEzQixFQUFrQyxVQUFsQyxFQUQwQjtBQUUxQix1QkFBSyxrQkFBTCxDQUF3QixLQUF4QixHQUYwQjthQUF2QixDQUpQLENBcEJjOzs7O3VDQThCSDs7O0FBQ1gsaUJBQUsseUJBQUwsR0FEVztBQUVYLGlCQUFLLGlCQUFMLEdBRlc7QUFHWCxpQkFBSyxjQUFMLEdBSFc7O0FBS1gsY0FBRSxNQUFGLEVBQVUsSUFBVixDQUFlLFlBQU07QUFDakIsb0JBQUcsT0FBSyxZQUFMLEVBQW1CO0FBQ2xCLDJCQUFLLG9CQUFMLEdBRGtCO2lCQUF0Qjs7QUFJQSxvQkFBRyxPQUFLLFdBQUwsRUFBa0I7QUFDakIsMkJBQUssbUJBQUwsQ0FBeUIsT0FBTyxTQUFQLENBQWlCLE9BQWpCLENBQXpCLENBRGlCO2lCQUFyQjs7QUFJQSxvQkFBRyxPQUFLLFNBQUwsRUFBZ0I7QUFDZiwyQkFBSyxpQkFBTCxDQUF1QixPQUFPLFNBQVAsQ0FBaUIsS0FBakIsQ0FBdkIsQ0FEZTtpQkFBbkI7YUFUVyxDQUFmLENBTFc7Ozs7NENBb0JLOzs7QUFDaEIsZ0JBQUcsS0FBSyxtQkFBTCxFQUEwQjtBQUN6QixxQkFBSyxtQkFBTCxDQUF5QixFQUF6QixDQUE0QixPQUE1QixFQUFxQyxVQUFDLEVBQUQsRUFBUTtBQUN6Qyx1QkFBRyxjQUFILEdBRHlDO0FBRXpDLDJCQUFLLGtCQUFMLENBQXdCLEtBQXhCLEdBRnlDO2lCQUFSLENBQXJDLENBRHlCO2FBQTdCOztBQU9BLGdCQUFHLEtBQUssaUJBQUwsRUFBd0I7QUFDdkIscUJBQUssaUJBQUwsQ0FBdUIsRUFBdkIsQ0FBMEIsUUFBMUIsRUFBb0MsVUFBQyxFQUFELEVBQVE7QUFDeEMsdUJBQUcsY0FBSCxHQUR3QztBQUV4QywyQkFBSyxhQUFMLENBQW1CLEVBQUUsR0FBRyxNQUFILENBQXJCLEVBRndDO2lCQUFSLENBQXBDLENBRHVCO2FBQTNCOztBQU9BLGNBQUUsTUFBRixFQUFVLEVBQVYsQ0FBYSxPQUFiLEVBQXNCLEtBQUssbUJBQUwsRUFBMEIsVUFBQyxFQUFELEVBQVE7QUFDcEQsbUJBQUcsZUFBSCxHQURvRDtBQUVwRCxvQkFBSSxVQUFVLEVBQUUsR0FBRyxNQUFILENBQUYsQ0FBYSxPQUFiLENBQXFCLElBQXJCLENBQVYsQ0FGZ0Q7QUFHcEQsb0JBQUksWUFBWSxRQUFRLElBQVIsQ0FBYSxpQkFBYixDQUFaLENBSGdEO0FBSXBELG9CQUFJLGNBQWMsUUFBUSxJQUFSLENBQWEsVUFBYixFQUF5QixJQUF6QixFQUFkLENBSmdEO0FBS3BELG9CQUFJLHFCQUFxQixRQUFRLElBQVIsQ0FBYSxpQkFBYixFQUFnQyxJQUFoQyxFQUFyQixDQUxnRDs7QUFPcEQsa0JBQUUsbUJBQUYsRUFBdUIsS0FBdkIsR0FQb0Q7QUFRcEQsa0JBQUUscUJBQUYsRUFBeUIsR0FBekIsQ0FBNkIsU0FBN0IsRUFSb0Q7QUFTcEQsa0JBQUUsbUJBQUYsRUFBdUIsR0FBdkIsQ0FBMkIsV0FBM0IsRUFUb0Q7QUFVcEQsa0JBQUUsa0JBQUYsRUFBc0IsR0FBdEIsQ0FBMEIsa0JBQTFCLEVBVm9EO2FBQVIsQ0FBaEQsQ0FmZ0I7O0FBNEJoQixjQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsT0FBYixFQUFzQixLQUFLLHFCQUFMLEVBQTRCLFVBQUMsRUFBRCxFQUFRO0FBQ3RELG1CQUFHLGVBQUgsR0FEc0Q7QUFFdEQsb0JBQUksWUFBWSxFQUFFLEdBQUcsTUFBSCxDQUFGLENBQWEsT0FBYixDQUFxQixJQUFyQixFQUEyQixJQUEzQixDQUFnQyxpQkFBaEMsQ0FBWixDQUZrRDtBQUd0RCxrQkFBRSxxQkFBRixFQUF5QixLQUF6QixHQUhzRDtBQUl0RCxrQkFBRSxvQkFBRixFQUF3QixHQUF4QixDQUE0QixTQUE1QixFQUpzRDthQUFSLENBQWxELENBNUJnQjs7QUFtQ2hCLGNBQUUsTUFBRixFQUFVLEVBQVYsQ0FBYSxRQUFiLEVBQXVCLEtBQUsseUJBQUwsRUFBZ0MsVUFBQyxFQUFELEVBQVE7QUFDM0QsbUJBQUcsY0FBSCxHQUQyRDtBQUUzRCx1QkFBSyxhQUFMLENBQW1CLEVBQUUsR0FBRyxNQUFILENBQUYsQ0FBYSxTQUFiLEVBQW5CLEVBRjJEO2FBQVIsQ0FBdkQsQ0FuQ2dCOztBQXdDaEIsY0FBRSxNQUFGLEVBQVUsRUFBVixDQUFhLFFBQWIsRUFBdUIsS0FBSyx5QkFBTCxFQUFnQyxVQUFDLEVBQUQsRUFBUTtBQUMzRCxtQkFBRyxjQUFILEdBRDJEO0FBRTNELHVCQUFLLGFBQUwsQ0FBbUIsRUFBRSxHQUFHLE1BQUgsQ0FBRixDQUFhLFNBQWIsRUFBbkIsRUFGMkQ7YUFBUixDQUF2RCxDQXhDZ0I7O0FBNkNoQixjQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsT0FBYixFQUFzQixLQUFLLGlCQUFMLEVBQXdCLFVBQUMsRUFBRCxFQUFRO0FBQ2xELG1CQUFHLGVBQUgsR0FEa0Q7QUFFbEQsb0JBQUksVUFBVSxFQUFFLEdBQUcsTUFBSCxDQUFGLENBQWEsT0FBYixDQUFxQixJQUFyQixDQUFWLENBRjhDO0FBR2xELG9CQUFJLFVBQVUsUUFBUSxJQUFSLENBQWEsZUFBYixDQUFWLENBSDhDO0FBSWxELG9CQUFJLFlBQVksUUFBUSxJQUFSLENBQWEsYUFBYixFQUE0QixJQUE1QixFQUFaLENBSjhDO0FBS2xELG9CQUFJLG1CQUFtQixRQUFRLElBQVIsQ0FBYSxvQkFBYixFQUFtQyxJQUFuQyxFQUFuQixDQUw4Qzs7QUFPbEQsa0JBQUUsaUJBQUYsRUFBcUIsS0FBckIsR0FQa0Q7QUFRbEQsa0JBQUUsbUJBQUYsRUFBdUIsR0FBdkIsQ0FBMkIsT0FBM0IsRUFSa0Q7QUFTbEQsa0JBQUUsaUJBQUYsRUFBcUIsR0FBckIsQ0FBeUIsU0FBekIsRUFUa0Q7QUFVbEQsa0JBQUUsa0JBQUYsRUFBc0IsR0FBdEIsQ0FBMEIsZ0JBQTFCLEVBVmtEO2FBQVIsQ0FBOUMsQ0E3Q2dCOztBQTBEaEIsY0FBRSxNQUFGLEVBQVUsRUFBVixDQUFhLE9BQWIsRUFBc0IsS0FBSyxtQkFBTCxFQUEwQixVQUFDLEVBQUQsRUFBUTtBQUNwRCxtQkFBRyxlQUFILEdBRG9EO0FBRXBELHdCQUFRLEdBQVIsQ0FBWSxNQUFaLEVBRm9EO0FBR3BELG9CQUFJLFVBQVUsRUFBRSxHQUFHLE1BQUgsQ0FBRixDQUFhLE9BQWIsQ0FBcUIsSUFBckIsRUFBMkIsSUFBM0IsQ0FBZ0MsZUFBaEMsQ0FBVixDQUhnRDtBQUlwRCxrQkFBRSxtQkFBRixFQUF1QixLQUF2QixHQUpvRDtBQUtwRCxrQkFBRSxrQkFBRixFQUFzQixHQUF0QixDQUEwQixPQUExQixFQUxvRDthQUFSLENBQWhELENBMURnQjs7QUFrRWhCLGdCQUFHLEtBQUssZUFBTCxFQUFzQjtBQUNyQixxQkFBSyxlQUFMLENBQXFCLEVBQXJCLENBQXdCLFFBQXhCLEVBQWtDLFVBQUMsRUFBRCxFQUFRO0FBQ3RDLHVCQUFHLGNBQUgsR0FEc0M7QUFFdEMsMkJBQUssV0FBTCxDQUFpQixFQUFFLEdBQUcsTUFBSCxDQUFGLENBQWEsU0FBYixFQUFqQixFQUZzQztpQkFBUixDQUFsQyxDQURxQjthQUF6Qjs7QUFPQSxnQkFBRyxLQUFLLGVBQUwsRUFBc0I7QUFDckIscUJBQUssZUFBTCxDQUFxQixFQUFyQixDQUF3QixRQUF4QixFQUFrQyxVQUFDLEVBQUQsRUFBUTtBQUN0Qyx1QkFBRyxjQUFILEdBRHNDO0FBRXRDLDJCQUFLLFdBQUwsQ0FBaUIsRUFBRSxHQUFHLE1BQUgsQ0FBRixDQUFhLFNBQWIsRUFBakIsRUFGc0M7aUJBQVIsQ0FBbEMsQ0FEcUI7YUFBekI7O0FBT0EsY0FBRSxNQUFGLEVBQVUsRUFBVixDQUFhLE9BQWIsRUFBc0IsZUFBdEIsRUFBdUMsVUFBQyxFQUFELEVBQVE7QUFDM0Msb0JBQUksVUFBVSxFQUFFLEdBQUcsTUFBSCxDQUFGLENBQWEsT0FBYixDQUFxQixlQUFyQixDQUFWLENBRHVDO0FBRTNDLHVCQUFPLFFBQVAsQ0FBZ0IsSUFBaEIsR0FBdUIsY0FBYyxRQUFRLElBQVIsQ0FBYSxpQkFBYixDQUFkLENBRm9CO2FBQVIsQ0FBdkMsQ0FoRmdCOztBQXFGaEIsY0FBRSxNQUFGLEVBQVUsRUFBVixDQUFhLE9BQWIsRUFBc0IsYUFBdEIsRUFBcUMsVUFBQyxFQUFELEVBQVE7QUFDekMsb0JBQUksVUFBVSxFQUFFLEdBQUcsTUFBSCxDQUFGLENBQWEsT0FBYixDQUFxQixhQUFyQixDQUFWLENBRHFDO0FBRXpDLHVCQUFPLFFBQVAsQ0FBZ0IsSUFBaEIsR0FBdUIsWUFBWSxRQUFRLElBQVIsQ0FBYSxlQUFiLENBQVosQ0FGa0I7YUFBUixDQUFyQyxDQXJGZ0I7O0FBMEZoQixpQkFBSyxNQUFMLENBQVksRUFBWixDQUFlLGdCQUFmLEVBQWlDLFlBQU07QUFDbkMsdUJBQUssb0JBQUwsR0FEbUM7YUFBTixDQUFqQyxDQTFGZ0I7O0FBOEZoQixpQkFBSyxRQUFMLENBQWMsRUFBZCxDQUFpQixPQUFqQixFQUEwQixVQUFDLEVBQUQsRUFBUTtBQUM5QixtQkFBRyxlQUFILEdBRDhCO0FBRTlCLG1CQUFHLGNBQUg7O0FBRjhCLGlCQUk5QixDQUFFLGdCQUFGLEVBQW9CLEtBQXBCLEdBSjhCO2FBQVIsQ0FBMUIsQ0E5RmdCOztBQXFHaEIsZ0JBQUcsS0FBSyxZQUFMLEVBQW1CO0FBQ2xCLHFCQUFLLFlBQUwsQ0FBa0IsRUFBbEIsQ0FBcUIsUUFBckIsRUFBK0IsVUFBQyxFQUFELEVBQVE7QUFDbkMsdUJBQUcsY0FBSCxHQURtQztBQUVuQyx3QkFBSSxhQUFhLEVBQUUsR0FBRyxNQUFILENBQUYsQ0FBYSxTQUFiLEVBQWIsQ0FGK0I7QUFHbkMsd0JBQUksbUJBQW1CLE9BQUssZUFBTCxDQUFxQixVQUFyQixDQUFuQixDQUgrQjtBQUluQyx3QkFBSSxtQkFBbUIsT0FBSyxlQUFMLENBQXFCLGlCQUFpQixnQkFBakIsQ0FBeEMsQ0FKK0I7O0FBTW5DLHdCQUFHLENBQUMsZ0JBQUQsRUFBbUI7QUFDbEIsMEJBQUUsMEJBQUYsRUFBOEIsUUFBOUIsQ0FBdUMsV0FBdkMsRUFEa0I7QUFFbEIsK0JBRmtCO3FCQUF0Qjs7QUFLQSxxQ0FBaUIsZ0JBQWpCLEdBQW9DLGdCQUFwQyxDQVhtQztBQVluQywyQkFBSyxXQUFMLENBQWlCLGdCQUFqQixFQVptQztBQWFuQyw0QkFBUSxHQUFSLENBQVksZ0JBQVosRUFibUM7aUJBQVIsQ0FBL0IsQ0FEa0I7YUFBdEI7O0FBa0JBLGlCQUFLLE1BQUwsQ0FBWSxFQUFaLENBQWUsY0FBZixFQUErQixVQUFDLElBQUQsRUFBVTtBQUNyQyx3QkFBUSxHQUFSLENBQVksSUFBWixFQURxQztBQUVyQyxvQkFBRyxLQUFLLE9BQUwsSUFBZ0IsVUFBVSxPQUFWLEVBQW1CO0FBQ2xDLDJCQUFLLG1CQUFMLENBQXlCLFVBQVUsT0FBVixDQUF6QixDQURrQztpQkFBdEM7YUFGMkIsQ0FBL0IsQ0F2SGdCOzs7O3lDQStISDs7O0FBQ2IsZ0JBQUcsS0FBSyxVQUFMLEVBQWlCO0FBQ2hCLHFCQUFLLFVBQUwsQ0FBZ0IsRUFBaEIsQ0FBbUIsT0FBbkIsRUFBNEIsVUFBQyxFQUFELEVBQVE7QUFDaEMsMkJBQUssZUFBTCxDQUFxQixLQUFyQixHQURnQztpQkFBUixDQUE1QixDQURnQjthQUFwQjs7QUFNQSxnQkFBRyxLQUFLLFVBQUwsRUFBaUI7QUFDaEIscUJBQUssVUFBTCxDQUFnQixFQUFoQixDQUFtQixPQUFuQixFQUE0QixVQUFDLEVBQUQsRUFBUTtBQUNoQywyQkFBSyxlQUFMLENBQXFCLEtBQXJCLEdBRGdDO2lCQUFSLENBQTVCLENBRGdCOztBQUtoQixxQkFBSyxlQUFMLENBQXFCLEVBQXJCLENBQXdCLGVBQXhCLEVBQXlDLFVBQUMsRUFBRCxFQUFRO0FBQzdDLHdCQUFHLE9BQUssY0FBTCxFQUFxQjtBQUNwQiw0QkFBRyxPQUFLLGNBQUwsQ0FBb0IsSUFBcEIsQ0FBeUIsZ0JBQXpCLENBQUgsRUFBK0M7QUFDM0MsbUNBQUssY0FBTCxDQUFvQixJQUFwQixDQUF5QixnQkFBekIsRUFBMkMsSUFBM0MsQ0FBZ0QsSUFBSSxJQUFKLEVBQWhELEVBRDJDO3lCQUEvQyxNQUVNO0FBQ0YsbUNBQUssY0FBTCxDQUFvQixjQUFwQixDQUFtQztBQUMvQiw2Q0FBYSxJQUFJLElBQUosRUFBYjs2QkFESixFQURFO3lCQUZOOzs7OztBQURvQixxQkFBeEI7aUJBRHFDLENBQXpDLENBTGdCO2FBQXBCOztBQXNCQSxjQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsUUFBYixFQUF1QixLQUFLLHlCQUFMLEVBQWdDLFVBQUMsRUFBRCxFQUFRO0FBQzNELG1CQUFHLGNBQUgsR0FEMkQ7QUFFM0QsdUJBQUssYUFBTCxDQUFtQixFQUFFLEdBQUcsTUFBSCxDQUFGLENBQWEsU0FBYixFQUFuQixFQUYyRDthQUFSLENBQXZELENBN0JhOztBQWtDYixjQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsUUFBYixFQUF1QixLQUFLLHlCQUFMLEVBQWdDLFVBQUMsRUFBRCxFQUFRO0FBQzNELG1CQUFHLGNBQUgsR0FEMkQ7QUFFM0Qsb0JBQUksYUFBYSxFQUFFLEdBQUcsTUFBSCxDQUFGLENBQWEsU0FBYixFQUFiLENBRnVEO0FBRzNELG9CQUFJLG1CQUFtQixPQUFLLGVBQUwsQ0FBcUIsVUFBckIsQ0FBbkIsQ0FIdUQ7QUFJM0Qsb0JBQUksbUJBQW1CLE9BQUssZUFBTCxDQUFxQixpQkFBaUIsU0FBakIsQ0FBeEMsQ0FKdUQ7QUFLM0Qsb0JBQUksY0FBYyxJQUFJLElBQUosQ0FBUyxFQUFFLGdDQUFGLEVBQW9DLEdBQXBDLEVBQVQsQ0FBZCxDQUx1RDtBQU0zRCxvQkFBSSxTQUFTLElBQUksTUFBSixFQUFULENBTnVEOztBQVEzRCxvQkFBRyxDQUFDLFdBQUQsSUFBZ0IsZ0JBQWdCLGNBQWhCLEVBQWdDO0FBQy9DLHNCQUFFLHVCQUFGLEVBQTJCLFFBQTNCLENBQW9DLFdBQXBDLEVBRCtDO0FBRS9DLDJCQUYrQztpQkFBbkQ7O0FBS0Esb0JBQUcsQ0FBQyxnQkFBRCxFQUFtQjtBQUNsQixzQkFBRSwwQkFBRixFQUE4QixRQUE5QixDQUF1QyxXQUF2QyxFQURrQjtBQUVsQiwyQkFGa0I7aUJBQXRCOztBQUtBLHVCQUFPLGdCQUFQLEdBQTBCLGdCQUExQixDQWxCMkQ7QUFtQjNELHVCQUFPLFdBQVAsR0FBcUIsV0FBckIsQ0FuQjJEO0FBb0IzRCx1QkFBTyxJQUFQLEdBQWMsaUJBQWlCLElBQWpCLENBcEI2QztBQXFCM0QsdUJBQU8sT0FBUCxHQUFpQixpQkFBaUIsT0FBakIsQ0FyQjBDO0FBc0IzRCx1QkFBTyxTQUFQLEdBQW1CLGlCQUFpQixTQUFqQixDQXRCd0M7O0FBd0IzRCx1QkFBSyxhQUFMLENBQW1CLE1BQW5CLEVBeEIyRDthQUFSLENBQXZELENBbENhOztBQTZEYixpQkFBSyxNQUFMLENBQVksRUFBWixDQUFlLGdCQUFmLEVBQWlDLFVBQUMsSUFBRCxFQUFVO0FBQ3ZDLG9CQUFHLEtBQUssS0FBTCxJQUFjLE9BQU8sU0FBUCxDQUFpQixLQUFqQixFQUF3QjtBQUNyQywyQkFBSyxxQkFBTCxDQUEyQixPQUFPLFNBQVAsQ0FBaUIsS0FBakIsQ0FBM0IsQ0FEcUM7aUJBQXpDO2FBRDZCLENBQWpDLENBN0RhOztBQW1FYixjQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsUUFBYixFQUF1QixLQUFLLHlCQUFMLEVBQWdDLFVBQUMsRUFBRCxFQUFRO0FBQzNELG1CQUFHLGNBQUgsR0FEMkQ7QUFFM0Qsb0JBQUksYUFBYSxFQUFFLEdBQUcsTUFBSCxDQUFGLENBQWEsU0FBYixFQUFiLENBRnVEO0FBRzNELG9CQUFJLG1CQUFtQixPQUFLLGVBQUwsQ0FBcUIsVUFBckIsQ0FBbkIsQ0FIdUQ7QUFJM0Qsb0JBQUksbUJBQW1CLE9BQUssZUFBTCxDQUFxQixpQkFBaUIsU0FBakIsQ0FBeEMsQ0FKdUQ7QUFLM0Qsb0JBQUksY0FBYyxJQUFJLElBQUosQ0FBUyxFQUFFLHlCQUFGLEVBQTZCLEdBQTdCLEVBQVQsQ0FBZCxDQUx1RDtBQU0zRCxvQkFBSSxTQUFTLElBQUksTUFBSixFQUFULENBTnVEOztBQVEzRCxvQkFBRyxDQUFDLFdBQUQsSUFBZ0IsZ0JBQWdCLGNBQWhCLEVBQWdDO0FBQy9DLHNCQUFFLGdCQUFGLEVBQW9CLFFBQXBCLENBQTZCLFdBQTdCLEVBRCtDO0FBRS9DLDJCQUYrQztpQkFBbkQ7O0FBS0Esb0JBQUcsQ0FBQyxnQkFBRCxFQUFtQjtBQUNsQixzQkFBRSxtQkFBRixFQUF1QixRQUF2QixDQUFnQyxXQUFoQyxFQURrQjtBQUVsQiwyQkFGa0I7aUJBQXRCOztBQUtBLHVCQUFPLGdCQUFQLEdBQTBCLGdCQUExQixDQWxCMkQ7QUFtQjNELHVCQUFPLFdBQVAsR0FBcUIsV0FBckIsQ0FuQjJEO0FBb0IzRCx1QkFBTyxJQUFQLEdBQWMsaUJBQWlCLElBQWpCLENBcEI2QztBQXFCM0QsdUJBQU8sT0FBUCxHQUFpQixpQkFBaUIsT0FBakIsQ0FyQjBDO0FBc0IzRCx1QkFBTyxPQUFQLEdBQWlCLGlCQUFpQixPQUFqQixDQXRCMEM7O0FBd0IzRCx1QkFBSyxhQUFMLENBQW1CLE1BQW5CLEVBeEIyRDthQUFSLENBQXZELENBbkVhOztBQThGYixpQkFBSyxNQUFMLENBQVksRUFBWixDQUFlLGdCQUFmLEVBQWlDLFVBQUMsSUFBRCxFQUFVO0FBQ3ZDLG9CQUFHLEtBQUssS0FBTCxJQUFjLE9BQU8sU0FBUCxDQUFpQixLQUFqQixFQUF3QjtBQUNyQywyQkFBSyxxQkFBTCxDQUEyQixPQUFPLFNBQVAsQ0FBaUIsS0FBakIsQ0FBM0IsQ0FEcUM7aUJBQXpDO2FBRDZCLENBQWpDLENBOUZhOztBQW9HYixjQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsT0FBYixFQUFzQixLQUFLLDBCQUFMLEVBQWlDLFVBQUMsRUFBRCxFQUFRO0FBQzNELGtCQUFFLHFCQUFGLEVBQXlCLEtBQXpCLEdBRDJEO0FBRTNELGtCQUFFLG9CQUFGLEVBQXdCLEdBQXhCLENBQTRCLEVBQUUsR0FBRyxNQUFILENBQUYsQ0FBYSxPQUFiLENBQXFCLGVBQXJCLEVBQXNDLElBQXRDLENBQTJDLGlCQUEzQyxDQUE1QixFQUYyRDthQUFSLENBQXZELENBcEdhOztBQXlHYixjQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsT0FBYixFQUFzQixLQUFLLHdCQUFMLEVBQStCLFVBQUMsRUFBRCxFQUFRO0FBQ3pELGtCQUFFLG1CQUFGLEVBQXVCLEtBQXZCLEdBRHlEO0FBRXpELGtCQUFFLGtCQUFGLEVBQXNCLEdBQXRCLENBQTBCLEVBQUUsR0FBRyxNQUFILENBQUYsQ0FBYSxPQUFiLENBQXFCLGVBQXJCLEVBQXNDLElBQXRDLENBQTJDLGlCQUEzQyxDQUExQixFQUZ5RDtBQUd6RCxrQkFBRSxlQUFGLEVBQW1CLEdBQW5CLENBQXVCLEVBQUUsR0FBRyxNQUFILENBQUYsQ0FBYSxPQUFiLENBQXFCLGVBQXJCLEVBQXNDLElBQXRDLENBQTJDLGFBQTNDLEVBQTBELElBQTFELEdBQWlFLElBQWpFLEVBQXZCLEVBSHlEO2FBQVIsQ0FBckQsQ0F6R2E7O0FBK0diLGdCQUFHLEtBQUssaUJBQUwsRUFBd0I7QUFDdkIscUJBQUssaUJBQUwsQ0FBdUIsRUFBdkIsQ0FBMEIsUUFBMUIsRUFBb0MsVUFBQyxFQUFELEVBQVE7QUFDeEMsdUJBQUcsY0FBSCxHQUR3QztBQUV4QywyQkFBSyxhQUFMLENBQW1CLEVBQUUsR0FBRyxNQUFILENBQUYsQ0FBYSxTQUFiLEVBQW5CLEVBRndDO2lCQUFSLENBQXBDLENBRHVCO2FBQTNCOztBQU9BLGdCQUFHLEtBQUssaUJBQUwsRUFBd0I7QUFDdkIscUJBQUssaUJBQUwsQ0FBdUIsRUFBdkIsQ0FBMEIsUUFBMUIsRUFBb0MsVUFBQyxFQUFELEVBQVE7QUFDeEMsdUJBQUcsY0FBSCxHQUR3QztBQUV4QywyQkFBSyxhQUFMLENBQW1CLEVBQUUsR0FBRyxNQUFILENBQUYsQ0FBYSxTQUFiLEVBQW5CLEVBRndDO2lCQUFSLENBQXBDLENBRHVCO2FBQTNCOztBQU9BLGNBQUUsTUFBRixFQUFVLEVBQVYsQ0FBYSxPQUFiLEVBQXNCLEtBQUssMkJBQUwsRUFBa0MsVUFBQyxFQUFELEVBQVE7QUFBQyx3QkFBUSxHQUFSLENBQVksTUFBWixFQUFEO0FBQzVELGtCQUFFLHFCQUFGLEVBQXlCLEtBQXpCLEdBRDREO0FBRTVELGtCQUFFLHFCQUFGLEVBQXlCLEdBQXpCLENBQTZCLEVBQUUsR0FBRyxNQUFILENBQUYsQ0FBYSxPQUFiLENBQXFCLGdCQUFyQixFQUF1QyxJQUF2QyxDQUE0QyxrQkFBNUMsQ0FBN0IsRUFGNEQ7YUFBUixDQUF4RCxDQTdIYTs7QUFrSWIsY0FBRSxNQUFGLEVBQVUsRUFBVixDQUFhLE9BQWIsRUFBc0IsS0FBSyx3QkFBTCxFQUErQixVQUFDLEVBQUQsRUFBUTtBQUN6RCxvQkFBSSxlQUFlLEVBQUUsR0FBRyxNQUFILENBQUYsQ0FBYSxPQUFiLENBQXFCLGdCQUFyQixDQUFmLENBRHFEO0FBRXpELG9CQUFJLFdBQVcsYUFBYSxJQUFiLENBQWtCLGdCQUFsQixFQUFvQyxJQUFwQyxHQUEyQyxLQUEzQyxDQUFpRCxJQUFqRCxFQUF1RCxDQUF2RCxDQUFYLENBRnFEO0FBR3pELG9CQUFJLFlBQVksYUFBYSxJQUFiLENBQWtCLGFBQWxCLEVBQWlDLElBQWpDLENBQXNDLGNBQXRDLENBQVosQ0FIcUQ7QUFJekQsb0JBQUksb0JBQW9CLE9BQUssZUFBTCxDQUFxQixTQUFyQixFQUFnQyxVQUFoQyxDQUFwQixDQUpxRDs7QUFNekQsa0JBQUUsbUJBQUYsRUFBdUIsS0FBdkIsR0FOeUQ7QUFPekQsa0JBQUUsbUJBQUYsRUFBdUIsR0FBdkIsQ0FBMkIsYUFBYSxJQUFiLENBQWtCLGtCQUFsQixDQUEzQixFQVB5RDtBQVF6RCxrQkFBRSxxQkFBRixFQUF5QixHQUF6QixDQUE2QixhQUFhLElBQWIsQ0FBa0IsZUFBbEIsRUFBbUMsSUFBbkMsR0FBMEMsSUFBMUMsRUFBN0IsRUFSeUQ7QUFTekQsa0JBQUUsa0JBQUYsRUFBc0IsR0FBdEIsQ0FBMEIsaUJBQTFCLEVBVHlEOztBQVd6RCxvQkFBRyxFQUFFLE9BQUssMEJBQUwsQ0FBRixDQUFtQyxJQUFuQyxDQUF3QyxnQkFBeEMsQ0FBSCxFQUE4RDtBQUMxRCxzQkFBRSxPQUFLLDBCQUFMLENBQUYsQ0FBbUMsSUFBbkMsQ0FBd0MsZ0JBQXhDLEVBQTBELElBQTFELENBQStELFFBQS9ELEVBRDBEO2lCQUE5RCxNQUVNO0FBQ0Ysc0JBQUUsT0FBSywwQkFBTCxDQUFGLENBQW1DLGNBQW5DLENBQWtEO0FBQzlDLHFDQUFhLFFBQWI7cUJBREosRUFERTtpQkFGTjthQVhpRCxDQUFyRCxDQWxJYTs7QUFzSmIsZ0JBQUcsS0FBSyxpQkFBTCxFQUF3QjtBQUN2QixxQkFBSyxpQkFBTCxDQUF1QixFQUF2QixDQUEwQixRQUExQixFQUFvQyxVQUFDLEVBQUQsRUFBUTtBQUN4Qyx1QkFBRyxjQUFILEdBRHdDO0FBRXhDLDJCQUFLLGFBQUwsQ0FBbUIsRUFBRSxHQUFHLE1BQUgsQ0FBRixDQUFhLFNBQWIsRUFBbkIsRUFGd0M7aUJBQVIsQ0FBcEMsQ0FEdUI7YUFBM0I7Ozs7d0NBUVksb0JBQW9CO0FBQ2hDLGdCQUFJLHNCQUFzQixtQkFBbUIsS0FBbkIsQ0FBeUIsR0FBekIsQ0FBdEIsQ0FENEI7QUFFaEMsZ0JBQUksbUJBQW1CLElBQUksTUFBSixFQUFuQixDQUY0QjtBQUdoQyxnQkFBSSxrQkFBSixDQUhnQzs7QUFLaEMsaUJBQUksSUFBSSxTQUFTLG9CQUFvQixNQUFwQixFQUE0QixJQUFJLENBQUosRUFBTyxJQUFJLE1BQUosRUFBWSxHQUFoRSxFQUFxRTtBQUNqRSxvQ0FBb0IsQ0FBcEIsSUFBeUIsb0JBQW9CLENBQXBCLEVBQXVCLE9BQXZCLENBQStCLEtBQS9CLEVBQXNDLEdBQXRDLENBQXpCLENBRGlFOztBQUdqRSw0QkFBWSxvQkFBb0IsQ0FBcEIsRUFBdUIsS0FBdkIsQ0FBNkIsR0FBN0IsQ0FBWixDQUhpRTtBQUlqRSxpQ0FBaUIsVUFBVSxDQUFWLENBQWpCLElBQWlDLFVBQVUsQ0FBVixDQUFqQyxDQUppRTthQUFyRTtBQU1BLG1CQUFPLGdCQUFQLENBWGdDOzs7O3dDQWNwQixnQkFBZ0I7QUFDNUIsZ0JBQUksU0FBUyx5Q0FBVDtBQUR3QixnQkFFeEIsUUFBUSxlQUFlLEtBQWYsQ0FBcUIsTUFBckIsQ0FBUixDQUZ3QjtBQUc1QixnQkFBSSxtQkFBSixDQUg0QjtBQUk1QixnQkFBSSxvQkFBSixDQUo0QjtBQUs1QixnQkFBSSxjQUFKLENBTDRCO0FBTTVCLGdCQUFJLFVBQVUsQ0FBVixDQU53QjtBQU81QixnQkFBSSxvQkFBb0IsQ0FBcEIsQ0FQd0I7O0FBUzVCLGdCQUFHLENBQUMsS0FBRCxFQUFRO0FBQ1AsdUJBQU8sS0FBUCxDQURPO2FBQVg7O0FBSUEsb0JBQVEsTUFBTSxDQUFOLENBQVIsQ0FiNEI7QUFjNUIseUJBQWEsTUFBTSxLQUFOLENBQVksR0FBWixDQUFiLENBZDRCO0FBZTVCLDBCQUFjLFdBQVcsTUFBWCxDQWZjOztBQWlCNUIsZ0JBQUcsZUFBZSxDQUFmLEVBQWtCO0FBQ2pCLG9CQUFJLFdBQVcsV0FBVyxDQUFYLEVBQWMsT0FBZCxDQUFzQixHQUF0QixDQUFYLENBRGE7QUFFakIsb0JBQUksV0FBVyxXQUFXLENBQVgsRUFBYyxPQUFkLENBQXNCLEdBQXRCLENBQVgsQ0FGYTs7QUFJakIsb0JBQUcsWUFBWSxDQUFDLENBQUQsRUFBSTtBQUNmLDhCQUFVLFdBQVcsQ0FBWCxFQUFjLEtBQWQsQ0FBb0IsQ0FBcEIsRUFBdUIsUUFBdkIsQ0FBVixDQURlO2lCQUFuQjs7QUFJQSxvQkFBRyxZQUFZLENBQUMsQ0FBRCxFQUFJO0FBQ2YsNEJBQVEsV0FBVyxDQUFYLEVBQWMsS0FBZCxDQUFvQixDQUFwQixFQUF1QixRQUF2QixDQUFSLENBRGU7aUJBQW5CO2FBUkosTUFXTTtBQUNGLG9CQUFJLFlBQVcsV0FBVyxDQUFYLEVBQWMsT0FBZCxDQUFzQixHQUF0QixDQUFYLENBREY7QUFFRixvQkFBSSxZQUFXLFdBQVcsQ0FBWCxFQUFjLE9BQWQsQ0FBc0IsR0FBdEIsQ0FBWCxDQUZGOztBQUlGLG9CQUFHLGFBQVksQ0FBQyxDQUFELEVBQUk7QUFDZiw0QkFBUSxXQUFXLENBQVgsRUFBYyxLQUFkLENBQW9CLENBQXBCLEVBQXVCLFNBQXZCLENBQVIsQ0FEZTtpQkFBbkI7O0FBSUEsb0JBQUcsYUFBWSxDQUFDLENBQUQsRUFBSTtBQUNmLDhCQUFVLFdBQVcsQ0FBWCxFQUFjLEtBQWQsQ0FBb0IsQ0FBcEIsRUFBdUIsU0FBdkIsQ0FBVixDQURlO2lCQUFuQjthQW5CSjs7QUF3QkEsZ0JBQUcsS0FBSCxFQUFVO0FBQ04sb0NBQW9CLFNBQVMsS0FBSyxLQUFMLENBQTdCLENBRE07YUFBVjs7QUFJQSxzQkFBVSxTQUFTLE9BQVQsQ0FBVixDQTdDNEI7QUE4QzVCLHVCQUFXLGlCQUFYLENBOUM0Qjs7QUFnRDVCLG1CQUFPLE9BQVAsQ0FoRDRCOzs7O3dDQW1EaEIsU0FBUyxVQUFVO0FBQy9CLGdCQUFJLFFBQVEsVUFBVSxFQUFWLENBRG1CO0FBRS9CLGdCQUFHLENBQUMsUUFBRCxFQUFXO0FBQ1Ysb0JBQUksZUFBZSxRQUFRLENBQVIsR0FBYyxPQUFDLElBQVcsQ0FBWCxHQUFnQixTQUFTLE9BQVQsSUFBb0IsU0FBcEIsR0FBZ0MsU0FBUyxPQUFULElBQW9CLFVBQXBCLEdBQXFDLEtBQUMsSUFBUyxDQUFULEdBQWMsUUFBUSxPQUFSLEdBQWtCLFFBQVEsUUFBUixDQUQ5STtBQUVWLCtCQUFlLGlCQUFpQixZQUFqQixDQUZMO2FBQWQsTUFHTyxJQUFHLGFBQWEsVUFBYixFQUF5QjtBQUMvQixvQkFBSSxZQUFZLFFBQVEsQ0FBUixDQURlO0FBRS9CLG9CQUFJLFdBQVUsU0FBUyxZQUFZLEVBQVosQ0FBbkIsQ0FGMkI7QUFHL0Isd0JBQVEsU0FBUyxRQUFRLFNBQVIsQ0FBakIsQ0FIK0I7O0FBSy9CLG9CQUFJLGVBQWUsUUFBUSxDQUFSLEdBQVksV0FBVSxHQUFWLEdBQWdCLFFBQVEsR0FBUixHQUFjLEdBQWQsR0FBb0IsUUFBcEIsR0FBOEIsR0FBOUIsQ0FMaEI7YUFBNUI7O0FBUVAsbUJBQU8sWUFBUCxDQWIrQjs7OztzQ0FnQnJCLE1BQU07QUFDaEIsb0JBQVEsR0FBUixDQUFZLElBQVosRUFEZ0I7QUFFaEIsZ0JBQUksdUJBQXVCLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBcUI7QUFDeEQsb0JBQUksVUFBVSxFQUFFLElBQUYsQ0FBTztBQUNsQix5QkFBSyxVQUFMO0FBQ0EsNEJBQVEsTUFBUjtBQUNBLDBCQUFNLElBQU47aUJBSFcsQ0FBVixDQURvRDs7QUFPeEQsd0JBQVEsSUFBUixDQUFhLFVBQUMsSUFBRCxFQUFVO0FBQ25CLDRCQUFRLEdBQVIsQ0FBWSxXQUFaLEVBQXlCLElBQXpCLEVBRG1CO0FBRW5CLDRCQUFRLElBQVIsRUFGbUI7aUJBQVYsQ0FBYixDQVB3RDs7QUFZeEQsd0JBQVEsSUFBUixDQUFhLFVBQUMsS0FBRCxFQUFRLFVBQVIsRUFBdUI7QUFDaEMsMkJBQU8sS0FBUCxFQUFjLFVBQWQsRUFEZ0M7aUJBQXZCLENBQWIsQ0Fad0Q7YUFBckIsQ0FBbkMsQ0FGWTs7QUFtQmhCLGlDQUFxQixJQUFyQixDQUEwQixVQUFDLElBQUQsRUFBVTtBQUNoQyx3QkFBUSxHQUFSLENBQVksMkJBQVosRUFBeUMsSUFBekMsRUFEZ0M7QUFFaEMsa0JBQUUsa0JBQUYsRUFBc0IsS0FBdEIsQ0FBNEIsTUFBNUIsRUFGZ0M7YUFBVixDQUExQixDQUlDLEtBSkQsQ0FJTyxVQUFDLEtBQUQsRUFBUSxVQUFSLEVBQXVCO0FBQzFCLHdCQUFRLEdBQVIsQ0FBWSwrQkFBWixFQUE2QyxLQUE3QyxFQUFvRCxVQUFwRCxFQUQwQjtBQUUxQixzQkFBTSwrQkFBTixFQUYwQjthQUF2QixDQUpQLENBbkJnQjs7OztvQ0E2QlIsTUFBTTtBQUNkLGdCQUFJLHFCQUFxQixJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3RELG9CQUFJLFVBQVUsRUFBRSxJQUFGLENBQU87QUFDbEIseUJBQUssUUFBTDtBQUNBLDRCQUFRLE1BQVI7QUFDQSwwQkFBTSxJQUFOO2lCQUhXLENBQVYsQ0FEa0Q7O0FBT3RELHdCQUFRLElBQVIsQ0FBYSxVQUFDLElBQUQsRUFBVTtBQUNuQiw0QkFBUSxHQUFSLENBQVksV0FBWixFQUF5QixJQUF6QixFQURtQjtBQUVuQiw0QkFBUSxJQUFSLEVBRm1CO2lCQUFWLENBQWIsQ0FQc0Q7O0FBWXRELHdCQUFRLElBQVIsQ0FBYSxVQUFDLEtBQUQsRUFBUSxVQUFSLEVBQXVCO0FBQ2hDLDJCQUFPLEtBQVAsRUFBYyxVQUFkLEVBRGdDO2lCQUF2QixDQUFiLENBWnNEO2FBQXJCLENBQWpDLENBRFU7O0FBa0JkLCtCQUFtQixJQUFuQixDQUF3QixVQUFDLElBQUQsRUFBVTtBQUM5Qix3QkFBUSxHQUFSLENBQVksY0FBWixFQUE0QixJQUE1QixFQUQ4QjtBQUU5QixrQkFBRSxnQkFBRixFQUFvQixLQUFwQixDQUEwQixNQUExQixFQUY4QjthQUFWLENBQXhCLENBSUMsS0FKRCxDQUlPLFVBQUMsS0FBRCxFQUFRLFVBQVIsRUFBdUI7QUFDMUIsd0JBQVEsR0FBUixDQUFZLCtCQUFaLEVBQTZDLEtBQTdDLEVBQW9ELFVBQXBELEVBRDBCO0FBRTFCLHNCQUFNLDZCQUFOLEVBRjBCO2FBQXZCLENBSlAsQ0FsQmM7Ozs7c0NBNEJKLE1BQU07QUFDaEIsZ0JBQUksdUJBQXVCLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBcUI7QUFDeEQsb0JBQUksVUFBVSxFQUFFLElBQUYsQ0FBTztBQUNsQix5QkFBSyxVQUFMO0FBQ0EsNEJBQVEsUUFBUjtBQUNBLDBCQUFNLElBQU47aUJBSFcsQ0FBVixDQURvRDs7QUFPeEQsd0JBQVEsSUFBUixDQUFhLFVBQUMsSUFBRCxFQUFVO0FBQ25CLDRCQUFRLEdBQVIsQ0FBWSxXQUFaLEVBQXlCLElBQXpCLEVBRG1CO0FBRW5CLDRCQUFRLElBQVIsRUFGbUI7aUJBQVYsQ0FBYixDQVB3RDs7QUFZeEQsd0JBQVEsSUFBUixDQUFhLFVBQUMsS0FBRCxFQUFRLFVBQVIsRUFBdUI7QUFDaEMsMkJBQU8sS0FBUCxFQUFjLFVBQWQsRUFEZ0M7aUJBQXZCLENBQWIsQ0Fad0Q7YUFBckIsQ0FBbkMsQ0FEWTs7QUFrQmhCLGlDQUFxQixJQUFyQixDQUEwQixVQUFDLElBQUQsRUFBVTtBQUNoQyxrQkFBRSxxQkFBRixFQUF5QixLQUF6QixDQUErQixNQUEvQixFQURnQzthQUFWLENBQTFCLENBR0MsS0FIRCxDQUdPLFVBQUMsS0FBRCxFQUFRLFVBQVIsRUFBdUI7QUFDMUIsd0JBQVEsR0FBUixDQUFZLHdCQUFaLEVBQXNDLEtBQXRDLEVBQTZDLFVBQTdDLEVBRDBCO0FBRTFCLHNCQUFNLDhCQUFOLEVBRjBCO2FBQXZCLENBSFAsQ0FsQmdCOzs7O3NDQTJCTixNQUFNO0FBQ2hCLGdCQUFJLHVCQUF1QixJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3hELG9CQUFJLFVBQVUsRUFBRSxJQUFGLENBQU87QUFDbEIseUJBQUssVUFBTDtBQUNBLDRCQUFRLEtBQVI7QUFDQSwwQkFBTSxJQUFOO2lCQUhXLENBQVYsQ0FEb0Q7O0FBT3hELHdCQUFRLElBQVIsQ0FBYSxVQUFDLElBQUQsRUFBVTtBQUNuQiw0QkFBUSxHQUFSLENBQVksV0FBWixFQUF5QixJQUF6QixFQURtQjtBQUVuQixzQkFBRSxtQkFBRixFQUF1QixLQUF2QixDQUE2QixNQUE3QixFQUZtQjtBQUduQiw0QkFBUSxJQUFSLEVBSG1CO2lCQUFWLENBQWIsQ0FQd0Q7O0FBYXhELHdCQUFRLElBQVIsQ0FBYSxVQUFDLEtBQUQsRUFBUSxVQUFSLEVBQXVCO0FBQ2hDLDJCQUFPLEtBQVAsRUFBYyxVQUFkLEVBRGdDO2lCQUF2QixDQUFiLENBYndEO2FBQXJCLENBQW5DLENBRFk7O0FBbUJoQixpQ0FBcUIsSUFBckIsQ0FBMEIsVUFBQyxJQUFELEVBQVU7QUFDaEMsa0JBQUUscUJBQUYsRUFBeUIsS0FBekIsQ0FBK0IsTUFBL0IsRUFEZ0M7YUFBVixDQUExQixDQUdDLEtBSEQsQ0FHTyxVQUFDLEtBQUQsRUFBUSxVQUFSLEVBQXVCO0FBQzFCLHdCQUFRLEdBQVIsQ0FBWSx3QkFBWixFQUFzQyxLQUF0QyxFQUE2QyxVQUE3QyxFQUQwQjtBQUUxQixzQkFBTSx5QkFBTixFQUYwQjthQUF2QixDQUhQLENBbkJnQjs7OztvQ0E0QlIsTUFBTTtBQUNkLGdCQUFJLHFCQUFxQixJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3RELG9CQUFJLFVBQVUsRUFBRSxJQUFGLENBQU87QUFDbEIseUJBQUssUUFBTDtBQUNBLDRCQUFRLFFBQVI7QUFDQSwwQkFBTSxJQUFOO2lCQUhXLENBQVYsQ0FEa0Q7O0FBT3RELHdCQUFRLElBQVIsQ0FBYSxVQUFDLElBQUQsRUFBVTtBQUNuQiw0QkFBUSxHQUFSLENBQVksV0FBWixFQUF5QixJQUF6QixFQURtQjtBQUVuQiw0QkFBUSxJQUFSLEVBRm1CO2lCQUFWLENBQWIsQ0FQc0Q7O0FBWXRELHdCQUFRLElBQVIsQ0FBYSxVQUFDLEtBQUQsRUFBUSxVQUFSLEVBQXVCO0FBQ2hDLDJCQUFPLEtBQVAsRUFBYyxVQUFkLEVBRGdDO2lCQUF2QixDQUFiLENBWnNEO2FBQXJCLENBQWpDLENBRFU7O0FBa0JkLCtCQUFtQixJQUFuQixDQUF3QixVQUFDLElBQUQsRUFBVTtBQUM5QixrQkFBRSxtQkFBRixFQUF1QixLQUF2QixDQUE2QixNQUE3QixFQUQ4QjthQUFWLENBQXhCLENBR0MsS0FIRCxDQUdPLFVBQUMsS0FBRCxFQUFRLFVBQVIsRUFBdUI7QUFDMUIsd0JBQVEsR0FBUixDQUFZLHNCQUFaLEVBQW9DLEtBQXBDLEVBQTJDLFVBQTNDLEVBRDBCO0FBRTFCLHNCQUFNLHNCQUFOLEVBRjBCO2FBQXZCLENBSFAsQ0FsQmM7Ozs7b0NBMkJOLE1BQU07QUFDZCxnQkFBSSxxQkFBcUIsSUFBSSxPQUFKLENBQVksVUFBQyxPQUFELEVBQVUsTUFBVixFQUFxQjtBQUN0RCxvQkFBSSxVQUFVLEVBQUUsSUFBRixDQUFPO0FBQ2xCLHlCQUFLLFFBQUw7QUFDQSw0QkFBUSxLQUFSO0FBQ0EsMEJBQU0sSUFBTjtpQkFIVyxDQUFWLENBRGtEOztBQU90RCx3QkFBUSxJQUFSLENBQWEsVUFBQyxJQUFELEVBQVU7QUFDbkIsNEJBQVEsR0FBUixDQUFZLFdBQVosRUFBeUIsSUFBekIsRUFEbUI7QUFFbkIsc0JBQUUsbUJBQUYsRUFBdUIsS0FBdkIsQ0FBNkIsTUFBN0IsRUFGbUI7QUFHbkIsNEJBQVEsSUFBUixFQUhtQjtpQkFBVixDQUFiLENBUHNEOztBQWF0RCx3QkFBUSxJQUFSLENBQWEsVUFBQyxLQUFELEVBQVEsVUFBUixFQUF1QjtBQUNoQywyQkFBTyxLQUFQLEVBQWMsVUFBZCxFQURnQztpQkFBdkIsQ0FBYixDQWJzRDthQUFyQixDQUFqQyxDQURVOztBQW1CZCwrQkFBbUIsSUFBbkIsQ0FBd0IsVUFBQyxJQUFELEVBQVU7QUFDOUIsa0JBQUUscUJBQUYsRUFBeUIsS0FBekIsQ0FBK0IsTUFBL0IsRUFEOEI7YUFBVixDQUF4QixDQUdDLEtBSEQsQ0FHTyxVQUFDLEtBQUQsRUFBUSxVQUFSLEVBQXVCO0FBQzFCLHdCQUFRLEdBQVIsQ0FBWSxzQkFBWixFQUFvQyxLQUFwQyxFQUEyQyxVQUEzQyxFQUQwQjtBQUUxQixzQkFBTSw0QkFBTixFQUYwQjthQUF2QixDQUhQLENBbkJjOzs7OzRDQTRCRSxXQUFXO0FBQzNCLGdCQUFJLGdCQUFnQixLQUFLLFNBQUwsQ0FBZSxTQUFmLEVBQTBCLHNCQUExQixDQUFoQixDQUR1QjtBQUUzQixnQkFBSSxpQkFBaUIsRUFBRSwrQkFBRixDQUFqQixDQUZ1Qjs7QUFJM0IsMEJBQWMsSUFBZCxDQUFtQixVQUFDLElBQUQsRUFBVTtBQUN6Qix3QkFBUSxHQUFSLENBQVksd0JBQVosRUFBc0MsSUFBdEMsRUFEeUI7QUFFekIsdUNBQXVCLElBQXZCLEVBRnlCO2FBQVYsQ0FBbkIsQ0FKMkI7O0FBUzNCLHFCQUFTLHNCQUFULENBQWdDLFVBQWhDLEVBQTRDO0FBQ3hDLG9CQUFJLHFCQUFxQixJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3RELHdCQUFJLFVBQVUsRUFBRSxJQUFGLENBQU87QUFDbEIsNkJBQUssMkJBQUw7QUFDQSxnQ0FBUSxLQUFSO0FBQ0Esa0NBQVUsTUFBVjtxQkFIVyxDQUFWLENBRGtEOztBQU90RCw0QkFBUSxJQUFSLENBQWEsVUFBQyxJQUFELEVBQVU7QUFDbkIsZ0NBQVEsSUFBUixFQURtQjtxQkFBVixDQUFiLENBUHNEOztBQVd0RCw0QkFBUSxJQUFSLENBQWEsVUFBQyxLQUFELEVBQVEsVUFBUixFQUF1QjtBQUNoQywrQkFBTyxLQUFQLEVBQWMsVUFBZCxFQURnQztxQkFBdkIsQ0FBYixDQVhzRDtpQkFBckIsQ0FBakMsQ0FEb0M7O0FBaUJ4QyxtQ0FBbUIsSUFBbkIsQ0FBd0IsVUFBQyxJQUFELEVBQVU7QUFDOUIsd0JBQUksU0FBUyxFQUFFLElBQUYsRUFBUSxJQUFSLENBQWEsbUJBQWIsRUFBa0MsSUFBbEMsRUFBVCxDQUQwQjtBQUU5Qix3QkFBSSxXQUFXLFdBQVcsT0FBWCxDQUFtQixNQUFuQixDQUFYLENBRjBCO0FBRzlCLHdCQUFJLFVBQVU7QUFDVixvQ0FBWSxVQUFaO3FCQURBLENBSDBCO0FBTTlCLHdCQUFJLE9BQU8sU0FBUyxPQUFULENBQVAsQ0FOMEI7QUFPOUIsbUNBQWUsSUFBZixDQUFvQixJQUFwQixFQVA4QjtBQVE5QixzQkFBRSxpQkFBRixFQUFxQixLQUFyQixDQUEyQixNQUEzQixFQVI4QjtpQkFBVixDQUF4QixDQVVDLEtBVkQsQ0FVTyxVQUFDLEtBQUQsRUFBUSxVQUFSLEVBQXVCO0FBQzFCLDRCQUFRLEdBQVIsQ0FBWSxvQ0FBWixFQUFrRCxLQUFsRCxFQUF5RCxVQUF6RCxFQUQwQjtBQUUxQiwwQkFBTSwrQkFBTixFQUYwQjtpQkFBdkIsQ0FWUCxDQWpCd0M7YUFBNUM7Ozs7MENBa0NjLFNBQVM7QUFDdkIsaUJBQUsscUJBQUwsQ0FBMkIsT0FBM0IsRUFEdUI7QUFFdkIsaUJBQUsscUJBQUwsQ0FBMkIsT0FBM0IsRUFGdUI7Ozs7OENBS0wsU0FBUztBQUMzQixnQkFBSSxrQkFBa0IsS0FBSyxXQUFMLENBQWlCLE9BQWpCLENBQWxCLENBRHVCO0FBRTNCLGdCQUFJLG1CQUFtQixFQUFFLDZCQUFGLENBQW5CLENBRnVCOztBQUkzQiw0QkFBZ0IsSUFBaEIsQ0FBcUIsVUFBQyxJQUFELEVBQVU7QUFDM0Isd0JBQVEsR0FBUixDQUFZLHNCQUFaLEVBQW9DLElBQXBDLEVBRDJCO0FBRTNCLHlDQUF5QixJQUF6QixFQUYyQjthQUFWLENBQXJCLENBSjJCOztBQVMzQixxQkFBUyx3QkFBVCxDQUFrQyxZQUFsQyxFQUFnRDtBQUM1Qyw2QkFBYSxPQUFiLENBQXFCLFVBQUMsT0FBRCxFQUFhO0FBQzlCLHdCQUFHLFFBQVEsT0FBUixDQUFnQixHQUFoQixLQUF3QixPQUFPLFNBQVAsQ0FBaUIsSUFBakIsQ0FBc0IsRUFBdEIsRUFBMEI7QUFDakQsZ0NBQVEsY0FBUixHQUF5QixJQUF6QixDQURpRDtxQkFBckQsTUFFTTtBQUNGLGdDQUFRLGNBQVIsR0FBeUIsS0FBekIsQ0FERTtxQkFGTjs7QUFNQSw0QkFBUSxPQUFSLEdBQWtCLElBQUksSUFBSixDQUFTLFFBQVEsT0FBUixDQUEzQixDQVA4QjtBQVE5Qiw0QkFBUSxPQUFSLEdBQWtCLFFBQVEsT0FBUixDQUFnQixRQUFoQixLQUE2QixDQUE3QixHQUFpQyxHQUFqQyxHQUF1QyxRQUFRLE9BQVIsQ0FBZ0IsT0FBaEIsRUFBdkMsR0FBbUUsR0FBbkUsR0FBeUUsUUFBUSxPQUFSLENBQWdCLFdBQWhCLEVBQXpFLEdBQXlHLEdBQXpHLEdBQStHLFFBQVEsT0FBUixDQUFnQixRQUFoQixFQUEvRyxHQUE0SSxHQUE1SSxHQUFrSixRQUFRLE9BQVIsQ0FBZ0IsVUFBaEIsRUFBbEo7O0FBUlksaUJBQWIsQ0FBckIsQ0FENEM7O0FBYTVDLG9CQUFJLHFCQUFxQixJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3RELHdCQUFJLFVBQVUsRUFBRSxJQUFGLENBQU87QUFDbEIsNkJBQUssMkJBQUw7QUFDQSxnQ0FBUSxLQUFSO0FBQ0Esa0NBQVUsTUFBVjtxQkFIVyxDQUFWLENBRGtEOztBQU90RCw0QkFBUSxJQUFSLENBQWEsVUFBQyxJQUFELEVBQVU7QUFDbkIsZ0NBQVEsSUFBUixFQURtQjtxQkFBVixDQUFiLENBUHNEOztBQVd0RCw0QkFBUSxJQUFSLENBQWEsVUFBQyxLQUFELEVBQVEsVUFBUixFQUF1QjtBQUNoQywrQkFBTyxLQUFQLEVBQWMsVUFBZCxFQURnQztxQkFBdkIsQ0FBYixDQVhzRDtpQkFBckIsQ0FBakMsQ0Fid0M7O0FBNkI1QyxtQ0FBbUIsSUFBbkIsQ0FBd0IsVUFBQyxJQUFELEVBQVU7QUFDOUIsd0JBQUksU0FBUyxFQUFFLElBQUYsRUFBUSxJQUFSLENBQWEsb0JBQWIsRUFBbUMsSUFBbkMsRUFBVCxDQUQwQjtBQUU5Qix3QkFBSSxXQUFXLFdBQVcsT0FBWCxDQUFtQixNQUFuQixDQUFYLENBRjBCO0FBRzlCLHdCQUFJLFVBQVU7QUFDVixzQ0FBYyxZQUFkO0FBQ0EscUNBQWEsT0FBTyxTQUFQLENBQWlCLElBQWpCLENBQXNCLEVBQXRCO3FCQUZiLENBSDBCO0FBTzlCLHdCQUFJLE9BQU8sU0FBUyxPQUFULENBQVAsQ0FQMEI7QUFROUIscUNBQWlCLElBQWpCLENBQXNCLElBQXRCLEVBUjhCO2lCQUFWLENBQXhCLENBVUMsS0FWRCxDQVVPLFVBQUMsS0FBRCxFQUFRLFVBQVIsRUFBdUI7QUFDMUIsNEJBQVEsR0FBUixDQUFZLHNDQUFaLEVBQW9ELEtBQXBELEVBQTJELFVBQTNELEVBRDBCO0FBRTFCLDBCQUFNLCtCQUFOLEVBRjBCO2lCQUF2QixDQVZQLENBN0I0QzthQUFoRDs7Ozs4Q0E4Q2tCLFNBQVM7OztBQUMzQixnQkFBSSxrQkFBa0IsS0FBSyxXQUFMLENBQWlCLE9BQWpCLENBQWxCLENBRHVCO0FBRTNCLGdCQUFJLG1CQUFtQixFQUFFLDZCQUFGLENBQW5CLENBRnVCO0FBRzNCLGdCQUFJLDhCQUFKLENBSDJCO0FBSTNCLGdCQUFJLE9BQU8sSUFBUCxDQUp1Qjs7QUFNM0IsNEJBQWdCLElBQWhCLENBQXFCLFVBQUMsSUFBRCxFQUFVO0FBQzNCLHdCQUFRLEdBQVIsQ0FBWSxpQkFBWixFQUErQixJQUEvQixFQUQyQjtvQkFFdEIsbUJBQThCLEtBQTlCLGlCQUZzQjtvQkFFSixXQUFZLEtBQVosU0FGSTs7QUFHM0IseUJBQVMsT0FBVCxDQUFpQixVQUFDLE9BQUQsRUFBYTtBQUMxQiw0QkFBUSxnQkFBUixHQUEyQixRQUFRLFNBQVIsQ0FERDtBQUUxQiw0QkFBUSxTQUFSLEdBQW9CLE9BQUssZUFBTCxDQUFxQixRQUFRLFNBQVIsQ0FBekMsQ0FGMEI7QUFHMUIsNEJBQVEsV0FBUixHQUFzQixJQUFJLElBQUosQ0FBUyxRQUFRLFdBQVIsQ0FBL0IsQ0FIMEI7QUFJMUIsNEJBQVEsV0FBUixHQUFzQixRQUFRLFdBQVIsQ0FBb0IsUUFBcEIsS0FBaUMsQ0FBakMsR0FBcUMsR0FBckMsR0FBMkMsUUFBUSxXQUFSLENBQW9CLE9BQXBCLEVBQTNDLEdBQTJFLEdBQTNFLEdBQWlGLFFBQVEsV0FBUixDQUFvQixXQUFwQixFQUFqRixHQUFxSCxHQUFySCxHQUEySCxRQUFRLFdBQVIsQ0FBb0IsUUFBcEIsRUFBM0gsR0FBNEosR0FBNUosR0FBa0ssUUFBUSxXQUFSLENBQW9CLFVBQXBCLEVBQWxLOztBQUpJLGlCQUFiLENBQWpCLENBSDJCOztBQVczQix3Q0FBd0IsZ0JBQXhCLENBWDJCOztBQWEzQix5Q0FBeUI7QUFDckIsc0NBQWtCLGdCQUFsQjtBQUNBLGtDQUFjLFFBQWQ7aUJBRkosRUFiMkI7YUFBVixDQUFyQixDQU4yQjs7QUF5QjNCLHFCQUFTLHdCQUFULENBQWtDLElBQWxDLEVBQXdDO0FBQUMsd0JBQVEsR0FBUixDQUFZLE1BQVosRUFBb0IsSUFBcEIsRUFBRDtvQkFDL0IsbUJBQWtDLEtBQWxDLGlCQUQrQjtvQkFDYixlQUFnQixLQUFoQixhQURhOztBQUVwQyw2QkFBYSxPQUFiLENBQXFCLFVBQUMsT0FBRCxFQUFhO0FBQzlCLHdCQUFHLFFBQVEsT0FBUixDQUFnQixHQUFoQixLQUF3QixPQUFPLFNBQVAsQ0FBaUIsSUFBakIsQ0FBc0IsRUFBdEIsRUFBMEI7QUFDakQsZ0NBQVEsY0FBUixHQUF5QixJQUF6QixDQURpRDtxQkFBckQsTUFFTTtBQUNGLGdDQUFRLGNBQVIsR0FBeUIsS0FBekIsQ0FERTtxQkFGTjtpQkFEaUIsQ0FBckIsQ0FGb0M7O0FBVXBDLG9CQUFJLHFCQUFxQixJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3RELHdCQUFJLFVBQVUsRUFBRSxJQUFGLENBQU87QUFDbEIsNkJBQUssMkJBQUw7QUFDQSxnQ0FBUSxLQUFSO0FBQ0Esa0NBQVUsTUFBVjtxQkFIVyxDQUFWLENBRGtEOztBQU90RCw0QkFBUSxJQUFSLENBQWEsVUFBQyxJQUFELEVBQVU7QUFDbkIsZ0NBQVEsSUFBUixFQURtQjtxQkFBVixDQUFiLENBUHNEOztBQVd0RCw0QkFBUSxJQUFSLENBQWEsVUFBQyxLQUFELEVBQVEsVUFBUixFQUF1QjtBQUNoQywrQkFBTyxLQUFQLEVBQWMsVUFBZCxFQURnQztxQkFBdkIsQ0FBYixDQVhzRDtpQkFBckIsQ0FBakMsQ0FWZ0M7O0FBMEJwQyxtQ0FBbUIsSUFBbkIsQ0FBd0IsVUFBQyxJQUFELEVBQVU7QUFDOUIsd0JBQUksU0FBUyxFQUFFLElBQUYsRUFBUSxJQUFSLENBQWEscUJBQWIsRUFBb0MsSUFBcEMsRUFBVCxDQUQwQjtBQUU5Qix3QkFBSSxXQUFXLFdBQVcsT0FBWCxDQUFtQixNQUFuQixDQUFYLENBRjBCO0FBRzlCLHdCQUFJLFVBQVU7QUFDVixzQ0FBYyxZQUFkO0FBQ0EscUNBQWEsT0FBTyxTQUFQLENBQWlCLElBQWpCLENBQXNCLEVBQXRCO3FCQUZiLENBSDBCO0FBTzlCLHdCQUFJLE9BQU8sU0FBUyxPQUFULENBQVAsQ0FQMEI7QUFROUIscUNBQWlCLElBQWpCLENBQXNCLElBQXRCLEVBUjhCOztBQVU5Qix5QkFBSyx5QkFBTCxDQUErQixxQkFBL0IsRUFBc0QsWUFBdEQsRUFWOEI7aUJBQVYsQ0FBeEIsQ0FZQyxLQVpELENBWU8sVUFBQyxLQUFELEVBQVEsVUFBUixFQUF1QjtBQUMxQiw0QkFBUSxHQUFSLENBQVksc0NBQVosRUFBb0QsS0FBcEQsRUFBMkQsVUFBM0QsRUFEMEI7QUFFMUIsMEJBQU0sK0JBQU4sRUFGMEI7aUJBQXZCLENBWlAsQ0ExQm9DO2FBQXhDOzs7O2tEQTZDc0IsdUJBQXVCLGNBQWM7QUFDM0QsZ0JBQUkscUJBQXFCLENBQXJCLENBRHVEO0FBRTNELGdCQUFJLDhCQUFKLENBRjJEO0FBRzNELGdCQUFJLGlDQUFKLENBSDJEO0FBSTNELGdCQUFJLHNCQUFKLENBSjJEOztBQU0zRCx5QkFBYSxPQUFiLENBQXFCLFVBQUMsT0FBRCxFQUFhO0FBQzlCLHNDQUFzQixRQUFRLGdCQUFSLENBRFE7YUFBYixDQUFyQixDQU4yRDs7QUFVM0Qsb0NBQXdCLEtBQUssZUFBTCxDQUFxQixrQkFBckIsRUFBeUMsVUFBekMsQ0FBeEIsQ0FWMkQ7QUFXM0QsdUNBQTJCLEtBQUssZUFBTCxDQUFxQixxQkFBckIsRUFBNEMsVUFBNUMsQ0FBM0IsQ0FYMkQ7O0FBYTNELDRCQUFnQixxQkFBcUIsR0FBckIsR0FBMkIscUJBQTNCLENBYjJDO0FBYzNELG9CQUFRLEdBQVIsQ0FBWSxxQkFBWixFQUFtQyxrQkFBbkMsRUFBdUQsYUFBdkQsRUFkMkQ7QUFlM0QsY0FBRSxlQUFGLEVBQW1CLEdBQW5CLENBQXVCO0FBQ25CLHVCQUFPLGdCQUFnQixHQUFoQjthQURYLEVBZjJEOztBQW1CM0QsY0FBRSxlQUFGLEVBQW1CLElBQW5CLENBQXdCLHFCQUF4QixFQW5CMkQ7QUFvQjNELGNBQUUsa0JBQUYsRUFBc0IsSUFBdEIsQ0FBMkIsd0JBQTNCLEVBcEIyRDs7QUFzQjNELGdCQUFHLHFCQUFxQixxQkFBckIsRUFBNEM7QUFDM0Msa0JBQUUsZUFBRixFQUFtQixXQUFuQixDQUErQixzQkFBL0IsRUFBdUQsUUFBdkQsQ0FBZ0UscUJBQWhFLEVBRDJDO2FBQS9DLE1BRU07QUFDRixrQkFBRSxlQUFGLEVBQW1CLFdBQW5CLENBQStCLHFCQUEvQixFQUFzRCxRQUF0RCxDQUErRCxzQkFBL0QsRUFERTthQUZOOzs7OytDQU9tQjtBQUNuQixnQkFBSSxrQkFBa0IsS0FBSyxXQUFMLEVBQWxCLENBRGU7QUFFbkIsZ0JBQUksaUJBQUosQ0FGbUI7QUFHbkIsZ0JBQUksT0FBTyxJQUFQLENBSGU7O0FBS25CLDRCQUFnQixJQUFoQixDQUFxQixVQUFDLElBQUQsRUFBVTtBQUMzQix3QkFBUSxHQUFSLENBQVksbUJBQVosRUFBaUMsSUFBakMsRUFEMkI7QUFFM0IseUNBQXlCLElBQXpCLEVBRjJCO2FBQVYsQ0FBckIsQ0FJQyxLQUpELENBSU8sVUFBQyxLQUFELEVBQVEsVUFBUixFQUF1QjtBQUMxQix3QkFBUSxHQUFSLENBQVkseUJBQVosRUFBdUMsS0FBdkMsRUFBOEMsVUFBOUMsRUFEMEI7QUFFMUIsc0JBQU0seUJBQU4sRUFGMEI7YUFBdkIsQ0FKUCxDQUxtQjs7QUFjbkIscUJBQVMsd0JBQVQsQ0FBa0MsWUFBbEMsRUFBZ0Q7QUFDNUMsd0JBQVEsR0FBUixDQUFZLFlBQVosRUFENEM7QUFFNUMsb0JBQUkscUJBQXFCLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBcUI7QUFDdEQsd0JBQUksVUFBVSxFQUFFLElBQUYsQ0FBTztBQUNsQiw2QkFBSywyQkFBTDtBQUNBLGdDQUFRLEtBQVI7QUFDQSxrQ0FBVSxNQUFWO3FCQUhXLENBQVYsQ0FEa0Q7O0FBT3RELDRCQUFRLElBQVIsQ0FBYSxVQUFDLElBQUQsRUFBVTtBQUNuQixnQ0FBUSxJQUFSLEVBRG1CO3FCQUFWLENBQWIsQ0FQc0Q7O0FBV3RELDRCQUFRLElBQVIsQ0FBYSxVQUFDLEtBQUQsRUFBUSxVQUFSLEVBQXVCO0FBQ2hDLCtCQUFPLEtBQVAsRUFBYyxVQUFkLEVBRGdDO3FCQUF2QixDQUFiLENBWHNEO2lCQUFyQixDQUFqQyxDQUZ3Qzs7QUFrQjVDLG1DQUFtQixJQUFuQixDQUF3QixVQUFDLElBQUQsRUFBVTtBQUM5Qix3QkFBSSxTQUFTLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxvQkFBYixFQUFtQyxJQUFuQyxFQUFULENBRDBCO0FBRTlCLHdCQUFJLFdBQVcsV0FBVyxPQUFYLENBQW1CLE1BQW5CLENBQVgsQ0FGMEI7QUFHOUIsd0JBQUksVUFBVTtBQUNWLHNDQUFjLFlBQWQ7cUJBREEsQ0FIMEI7QUFNOUIsd0JBQUksT0FBTyxTQUFTLE9BQVQsQ0FBUCxDQU4wQjtBQU85Qix5QkFBSyxlQUFMLENBQXFCLElBQXJCLENBQTBCLElBQTFCLEVBUDhCO2lCQUFWLENBQXhCLENBVUMsS0FWRCxDQVVPLFVBQUMsS0FBRCxFQUFRLFVBQVIsRUFBdUI7QUFDMUIsNEJBQVEsR0FBUixDQUFZLHNDQUFaLEVBQW9ELEtBQXBELEVBQTJELFVBQTNELEVBRDBCO0FBRTFCLDBCQUFNLCtCQUFOLEVBRjBCO2lCQUF2QixDQVZQLENBbEI0QzthQUFoRDs7OztzQ0FtQ1UsU0FBUztBQUNuQixnQkFBSSxPQUFPLFFBQVEsU0FBUixFQUFQLENBRGU7O0FBR25CLGdCQUFJLHVCQUF1QixJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3hELG9CQUFJLFVBQVUsRUFBRSxJQUFGLENBQU87QUFDbEIseUJBQUssVUFBTDtBQUNBLDRCQUFRLE1BQVI7QUFDQSwwQkFBTSxJQUFOO2lCQUhXLENBQVYsQ0FEb0Q7O0FBT3hELHdCQUFRLElBQVIsQ0FBYSxVQUFDLElBQUQsRUFBVTtBQUNuQiw0QkFBUSxHQUFSLENBQVksV0FBWixFQUF5QixJQUF6QixFQURtQjtBQUVuQixzQkFBRSxrQkFBRixFQUFzQixLQUF0QixDQUE0QixNQUE1QixFQUZtQjtBQUduQiw0QkFBUSxJQUFSLEVBSG1CO2lCQUFWLENBQWIsQ0FQd0Q7O0FBYXhELHdCQUFRLElBQVIsQ0FBYSxVQUFDLEtBQUQsRUFBUSxVQUFSLEVBQXVCO0FBQ2hDLDJCQUFPLEtBQVAsRUFBYyxVQUFkLEVBRGdDO2lCQUF2QixDQUFiLENBYndEO2FBQXJCLENBQW5DLENBSGU7O0FBcUJuQixpQ0FBcUIsSUFBckIsQ0FBMEIsVUFBQyxJQUFELEVBQVU7QUFDaEMsd0JBQVEsR0FBUixDQUFZLGNBQVosRUFBNEIsSUFBNUIsRUFEZ0M7YUFBVixDQUExQixDQUlDLEtBSkQsQ0FJTyxVQUFDLEtBQUQsRUFBUSxVQUFSLEVBQXVCO0FBQzFCLHdCQUFRLEdBQVIsQ0FBWSwrQkFBWixFQUE2QyxLQUE3QyxFQUFvRCxVQUFwRCxFQUQwQjtBQUUxQixzQkFBTSwrQkFBTixFQUYwQjthQUF2QixDQUpQLENBckJtQjs7OztvQ0ErQlgsVUFBVTtBQUNsQixnQkFBSSxxQkFBcUIsSUFBSSxPQUFKLENBQVksVUFBQyxPQUFELEVBQVUsTUFBVixFQUFxQjtBQUN0RCxvQkFBSSxVQUFVLEVBQUUsSUFBRixDQUFPO0FBQ2xCLHlCQUFLLGdCQUFMO0FBQ0EsNEJBQVEsS0FBUjtpQkFGVyxDQUFWLENBRGtEOztBQU10RCx3QkFBUSxJQUFSLENBQWEsVUFBQyxJQUFELEVBQVU7QUFDbkIsNEJBQVEsSUFBUixFQURtQjtpQkFBVixDQUFiLENBTnNEOztBQVV0RCx3QkFBUSxJQUFSLENBQWEsVUFBQyxLQUFELEVBQVEsVUFBUixFQUF1QjtBQUNoQywyQkFBTyxLQUFQLEVBQWMsVUFBZCxFQURnQztpQkFBdkIsQ0FBYixDQVZzRDthQUFyQixDQUFqQyxDQURjO0FBZWxCLG1CQUFPLGtCQUFQLENBZmtCOzs7O2tDQWtCWixXQUFXLFVBQVU7QUFDM0Isb0JBQVEsR0FBUixDQUFZLE1BQVosRUFBb0IsU0FBcEIsRUFEMkI7QUFFM0IsZ0JBQUksbUJBQW1CLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBcUI7QUFDcEQsb0JBQUksVUFBVSxFQUFFLElBQUYsQ0FBTztBQUNsQix5QkFBSyxTQUFMO0FBQ0EsNEJBQVEsS0FBUjtBQUNBLDBCQUFNO0FBQ0YsbUNBQVcsU0FBWDtxQkFESjtpQkFIVyxDQUFWLENBRGdEOztBQVNwRCx3QkFBUSxJQUFSLENBQWEsVUFBQyxJQUFELEVBQVU7QUFDbkIsNEJBQVEsSUFBUixFQURtQjtpQkFBVixDQUFiLENBVG9EOztBQWFwRCx3QkFBUSxJQUFSLENBQWEsVUFBQyxLQUFELEVBQVEsVUFBUixFQUF1QjtBQUNoQywyQkFBTyxLQUFQLEVBQWMsVUFBZCxFQURnQztpQkFBdkIsQ0FBYixDQWJvRDthQUFyQixDQUEvQixDQUZ1QjtBQW1CM0IsbUJBQU8sZ0JBQVAsQ0FuQjJCOzs7O29DQXNCbkIsU0FBUztBQUNqQixvQkFBUSxHQUFSLENBQVksV0FBWixFQUF5QixPQUF6QixFQURpQjtBQUVqQixnQkFBSSxxQkFBcUIsSUFBSSxPQUFKLENBQVksVUFBQyxPQUFELEVBQVUsTUFBVixFQUFxQjtBQUN0RCxvQkFBSSxVQUFVLEVBQUUsSUFBRixDQUFPO0FBQ2xCLHlCQUFLLFdBQUw7QUFDQSw0QkFBUSxLQUFSO0FBQ0EsMEJBQU07QUFDRixpQ0FBUyxPQUFUO3FCQURKO2lCQUhXLENBQVYsQ0FEa0Q7O0FBU3RELHdCQUFRLElBQVIsQ0FBYSxVQUFDLElBQUQsRUFBVTtBQUNuQiw0QkFBUSxJQUFSLEVBRG1CO2lCQUFWLENBQWIsQ0FUc0Q7O0FBYXRELHdCQUFRLElBQVIsQ0FBYSxVQUFDLEtBQUQsRUFBUSxVQUFSLEVBQXVCO0FBQ2hDLDJCQUFPLEtBQVAsRUFBYyxVQUFkLEVBRGdDO2lCQUF2QixDQUFiLENBYnNEO2FBQXJCLENBQWpDLENBRmE7QUFtQmpCLG1CQUFPLGtCQUFQLENBbkJpQjs7OztvQ0FzQlQsU0FBUztBQUNqQixnQkFBSSxxQkFBcUIsSUFBSSxPQUFKLENBQVksVUFBQyxPQUFELEVBQVUsTUFBVixFQUFxQjtBQUN0RCxvQkFBSSxVQUFVLEVBQUUsSUFBRixDQUFPO0FBQ2xCLHlCQUFLLE9BQUw7QUFDQSw0QkFBUSxLQUFSO0FBQ0EsMEJBQU07QUFDRixpQ0FBUyxPQUFUO3FCQURKO2lCQUhXLENBQVYsQ0FEa0Q7O0FBU3RELHdCQUFRLElBQVIsQ0FBYSxVQUFDLElBQUQsRUFBVTtBQUFDLDRCQUFRLEdBQVIsQ0FBWSxnQkFBWixFQUE4QixJQUE5QixFQUFEO0FBQ25CLDRCQUFRLElBQVIsRUFEbUI7aUJBQVYsQ0FBYixDQVRzRDs7QUFhdEQsd0JBQVEsSUFBUixDQUFhLFVBQUMsS0FBRCxFQUFRLFVBQVIsRUFBdUI7QUFDaEMsMkJBQU8sS0FBUCxFQUFjLFVBQWQsRUFEZ0M7aUJBQXZCLENBQWIsQ0Fic0Q7YUFBckIsQ0FBakMsQ0FEYTtBQWtCakIsbUJBQU8sa0JBQVAsQ0FsQmlCOzs7O3NDQXFCUCxNQUFNO0FBQ2hCLGdCQUFJLG1CQUFtQixLQUFLLGVBQUwsQ0FBcUIsSUFBckIsQ0FBbkIsQ0FEWTtBQUVoQiw2QkFBaUIsT0FBakIsR0FBMkIsT0FBTyxTQUFQLENBQWlCLEtBQWpCLENBRlg7QUFHaEIsZ0JBQUksdUJBQXVCLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBcUI7QUFDeEQsb0JBQUksVUFBVSxFQUFFLElBQUYsQ0FBTztBQUNsQix5QkFBSyxVQUFMO0FBQ0EsNEJBQVEsS0FBUjtBQUNBLDBCQUFNLGdCQUFOO2lCQUhXLENBQVYsQ0FEb0Q7O0FBT3hELHdCQUFRLElBQVIsQ0FBYSxVQUFDLElBQUQsRUFBVTtBQUNuQiw0QkFBUSxHQUFSLENBQVksV0FBWixFQUF5QixJQUF6QixFQURtQjtBQUVuQixzQkFBRSxtQkFBRixFQUF1QixLQUF2QixDQUE2QixNQUE3QixFQUZtQjtBQUduQiw0QkFBUSxJQUFSLEVBSG1CO2lCQUFWLENBQWIsQ0FQd0Q7O0FBYXhELHdCQUFRLElBQVIsQ0FBYSxVQUFDLEtBQUQsRUFBUSxVQUFSLEVBQXVCO0FBQ2hDLDJCQUFPLEtBQVAsRUFBYyxVQUFkLEVBRGdDO2lCQUF2QixDQUFiLENBYndEO2FBQXJCLENBQW5DLENBSFk7O0FBcUJoQixpQ0FBcUIsSUFBckIsQ0FBMEIsVUFBQyxJQUFELEVBQVU7QUFDaEMsa0JBQUUscUJBQUYsRUFBeUIsS0FBekIsQ0FBK0IsTUFBL0IsRUFEZ0M7YUFBVixDQUExQixDQUdDLEtBSEQsQ0FHTyxVQUFDLEtBQUQsRUFBUSxVQUFSLEVBQXVCO0FBQzFCLHdCQUFRLEdBQVIsQ0FBWSxzQkFBWixFQUFvQyxLQUFwQyxFQUEyQyxVQUEzQyxFQUQwQjtBQUUxQixzQkFBTSw0QkFBTixFQUYwQjthQUF2QixDQUhQLENBckJnQjs7OztzQ0E4Qk4sTUFBTTtBQUNoQixvQkFBUSxHQUFSLENBQVksSUFBWixFQURnQjtBQUVoQixnQkFBSSxtQkFBbUIsS0FBSyxlQUFMLENBQXFCLElBQXJCLENBQW5CLENBRlk7QUFHaEIsNkJBQWlCLE9BQWpCLEdBQTJCLE9BQU8sU0FBUCxDQUFpQixLQUFqQixDQUhYO0FBSWhCLGdCQUFJLHVCQUF1QixJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3hELG9CQUFJLFVBQVUsRUFBRSxJQUFGLENBQU87QUFDbEIseUJBQUssVUFBTDtBQUNBLDRCQUFRLFFBQVI7QUFDQSwwQkFBTSxnQkFBTjtpQkFIVyxDQUFWLENBRG9EOztBQU94RCx3QkFBUSxJQUFSLENBQWEsVUFBQyxJQUFELEVBQVU7QUFDbkIsNEJBQVEsR0FBUixDQUFZLFdBQVosRUFBeUIsSUFBekIsRUFEbUI7QUFFbkIsNEJBQVEsSUFBUixFQUZtQjtpQkFBVixDQUFiLENBUHdEOztBQVl4RCx3QkFBUSxJQUFSLENBQWEsVUFBQyxLQUFELEVBQVEsVUFBUixFQUF1QjtBQUNoQywyQkFBTyxLQUFQLEVBQWMsVUFBZCxFQURnQztpQkFBdkIsQ0FBYixDQVp3RDthQUFyQixDQUFuQyxDQUpZOztBQXFCaEIsaUNBQXFCLElBQXJCLENBQTBCLFVBQUMsSUFBRCxFQUFVO0FBQ2hDLGtCQUFFLHFCQUFGLEVBQXlCLEtBQXpCLENBQStCLE1BQS9CLEVBRGdDO2FBQVYsQ0FBMUIsQ0FHQyxLQUhELENBR08sVUFBQyxLQUFELEVBQVEsVUFBUixFQUF1QjtBQUMxQix3QkFBUSxHQUFSLENBQVksd0JBQVosRUFBc0MsS0FBdEMsRUFBNkMsVUFBN0MsRUFEMEI7QUFFMUIsc0JBQU0sd0JBQU4sRUFGMEI7YUFBdkIsQ0FIUCxDQXJCZ0I7Ozs7c0NBOEJOLE1BQU07QUFDaEIsZ0JBQUksdUJBQXVCLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBcUI7QUFDeEQsb0JBQUksVUFBVSxFQUFFLElBQUYsQ0FBTztBQUNsQix5QkFBSyxNQUFMO0FBQ0EsNEJBQVEsTUFBUjtBQUNBLDBCQUFNLElBQU47aUJBSFcsQ0FBVixDQURvRDs7QUFPeEQsd0JBQVEsSUFBUixDQUFhLFVBQUMsSUFBRCxFQUFVO0FBQ25CLDRCQUFRLEdBQVIsQ0FBWSxXQUFaLEVBQXlCLElBQXpCLEVBRG1CO0FBRW5CLDRCQUFRLElBQVIsRUFGbUI7aUJBQVYsQ0FBYixDQVB3RDs7QUFZeEQsd0JBQVEsSUFBUixDQUFhLFVBQUMsS0FBRCxFQUFRLFVBQVIsRUFBdUI7QUFDaEMsMkJBQU8sS0FBUCxFQUFjLFVBQWQsRUFEZ0M7aUJBQXZCLENBQWIsQ0Fad0Q7YUFBckIsQ0FBbkMsQ0FEWTs7QUFrQmhCLGlDQUFxQixJQUFyQixDQUEwQixVQUFDLElBQUQsRUFBVTtBQUNoQyx3QkFBUSxHQUFSLENBQVksY0FBWixFQUE0QixJQUE1QixFQURnQztBQUVoQyxrQkFBRSxrQkFBRixFQUFzQixLQUF0QixDQUE0QixNQUE1QixFQUZnQzthQUFWLENBQTFCLENBSUMsS0FKRCxDQUlPLFVBQUMsS0FBRCxFQUFRLFVBQVIsRUFBdUI7QUFDMUIsd0JBQVEsR0FBUixDQUFZLDJCQUFaLEVBQXlDLEtBQXpDLEVBQWdELFVBQWhELEVBRDBCO0FBRTFCLHNCQUFNLDJCQUFOLEVBRjBCO2FBQXZCLENBSlAsQ0FsQmdCOzs7O3NDQTRCTixNQUFNO0FBQUMsb0JBQVEsR0FBUixDQUFZLE1BQVosRUFBb0IsSUFBcEIsRUFBRDtBQUNoQixnQkFBSSx1QkFBdUIsSUFBSSxPQUFKLENBQVksVUFBQyxPQUFELEVBQVUsTUFBVixFQUFxQjtBQUN4RCxvQkFBSSxVQUFVLEVBQUUsSUFBRixDQUFPO0FBQ2xCLHlCQUFLLE1BQUw7QUFDQSw0QkFBUSxLQUFSO0FBQ0EsMEJBQU0sSUFBTjtpQkFIVyxDQUFWLENBRG9EOztBQU94RCx3QkFBUSxJQUFSLENBQWEsVUFBQyxJQUFELEVBQVU7QUFDbkIsNEJBQVEsR0FBUixDQUFZLFdBQVosRUFBeUIsSUFBekIsRUFEbUI7QUFFbkIsNEJBQVEsSUFBUixFQUZtQjtpQkFBVixDQUFiLENBUHdEOztBQVl4RCx3QkFBUSxJQUFSLENBQWEsVUFBQyxLQUFELEVBQVEsVUFBUixFQUF1QjtBQUNoQywyQkFBTyxLQUFQLEVBQWMsVUFBZCxFQURnQztpQkFBdkIsQ0FBYixDQVp3RDthQUFyQixDQUFuQyxDQURZOztBQWtCaEIsaUNBQXFCLElBQXJCLENBQTBCLFVBQUMsSUFBRCxFQUFVO0FBQ2hDLHdCQUFRLEdBQVIsQ0FBWSxxQkFBWixFQUFtQyxJQUFuQyxFQURnQztBQUVoQyxrQkFBRSxtQkFBRixFQUF1QixLQUF2QixDQUE2QixNQUE3QixFQUZnQzthQUFWLENBQTFCLENBSUMsS0FKRCxDQUlPLFVBQUMsS0FBRCxFQUFRLFVBQVIsRUFBdUI7QUFDMUIsd0JBQVEsR0FBUixDQUFZLHlCQUFaLEVBQXVDLEtBQXZDLEVBQThDLFVBQTlDLEVBRDBCO0FBRTFCLHNCQUFNLHlCQUFOLEVBRjBCO2FBQXZCLENBSlAsQ0FsQmdCOzs7O3NDQTZCTixNQUFNO0FBQ2hCLG9CQUFRLEdBQVIsQ0FBWSxJQUFaLEVBRGdCO0FBRWhCLGdCQUFJLG1CQUFtQixLQUFLLGVBQUwsQ0FBcUIsSUFBckIsQ0FBbkIsQ0FGWTtBQUdoQiw2QkFBaUIsT0FBakIsR0FBMkIsT0FBTyxTQUFQLENBQWlCLEtBQWpCLENBSFg7QUFJaEIsZ0JBQUksdUJBQXVCLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBcUI7QUFDeEQsb0JBQUksVUFBVSxFQUFFLElBQUYsQ0FBTztBQUNsQix5QkFBSyxNQUFMO0FBQ0EsNEJBQVEsUUFBUjtBQUNBLDBCQUFNLGdCQUFOO2lCQUhXLENBQVYsQ0FEb0Q7O0FBT3hELHdCQUFRLElBQVIsQ0FBYSxVQUFDLElBQUQsRUFBVTtBQUNuQiw0QkFBUSxHQUFSLENBQVksV0FBWixFQUF5QixJQUF6QixFQURtQjtBQUVuQiw0QkFBUSxJQUFSLEVBRm1CO2lCQUFWLENBQWIsQ0FQd0Q7O0FBWXhELHdCQUFRLElBQVIsQ0FBYSxVQUFDLEtBQUQsRUFBUSxVQUFSLEVBQXVCO0FBQ2hDLDJCQUFPLEtBQVAsRUFBYyxVQUFkLEVBRGdDO2lCQUF2QixDQUFiLENBWndEO2FBQXJCLENBQW5DLENBSlk7O0FBcUJoQixpQ0FBcUIsSUFBckIsQ0FBMEIsVUFBQyxJQUFELEVBQVU7QUFDaEMsa0JBQUUscUJBQUYsRUFBeUIsS0FBekIsQ0FBK0IsTUFBL0IsRUFEZ0M7YUFBVixDQUExQixDQUdDLEtBSEQsQ0FHTyxVQUFDLEtBQUQsRUFBUSxVQUFSLEVBQXVCO0FBQzFCLHdCQUFRLEdBQVIsQ0FBWSx3QkFBWixFQUFzQyxLQUF0QyxFQUE2QyxVQUE3QyxFQUQwQjtBQUUxQixzQkFBTSx3QkFBTixFQUYwQjthQUF2QixDQUhQLENBckJnQjs7OztvREE4QlE7OztBQUN4QixnQkFBRyxLQUFLLFNBQUwsRUFBZ0I7QUFDZixxQkFBSyxTQUFMLENBQWUsRUFBZixDQUFrQixRQUFsQixFQUE0QixVQUFDLEVBQUQsRUFBUTtBQUNoQyx1QkFBRyxjQUFILEdBRGdDO0FBRWhDLDJCQUFLLEtBQUwsQ0FBVyxFQUFHLEdBQUcsTUFBSCxDQUFkLEVBRmdDO2lCQUFSLENBQTVCLENBRGU7YUFBbkI7O0FBT0EsZ0JBQUcsS0FBSyxZQUFMLEVBQW1CO0FBQ2xCLHFCQUFLLFlBQUwsQ0FBa0IsRUFBbEIsQ0FBcUIsUUFBckIsRUFBK0IsVUFBQyxFQUFELEVBQVE7QUFDbkMsdUJBQUcsY0FBSCxHQURtQzs7QUFHbkMsd0JBQUcsRUFBRSxZQUFGLEVBQWdCLEdBQWhCLE1BQXlCLEVBQUUsWUFBRixFQUFnQixHQUFoQixFQUF6QixFQUFnRDtBQUMvQywwQkFBRSxhQUFGLEVBQWlCLFFBQWpCLENBQTBCLFdBQTFCLEVBRCtDO0FBRS9DLDhCQUFNLHlDQUFOLEVBRitDO0FBRy9DLCtCQUFPLEtBQVAsQ0FIK0M7cUJBQW5EO0FBS0EsMkJBQUssUUFBTCxDQUFjLEVBQUcsR0FBRyxNQUFILENBQWpCLEVBUm1DO2lCQUFSLENBQS9CLENBRGtCO2FBQXRCOzs7O1dBanFDYTs7Ozs7Ozs7QUNBckI7Ozs7OztBQUVBLElBQUksZUFBZSw0QkFBZiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBJc3N1ZVRyYWNrZXIge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgbGV0IGlvUGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSA9PSBcImxvY2FsaG9zdFwiID8gXCJodHRwOi8vbG9jYWxob3N0OlwiICsgcmVzb3VyY2VzLnBvcnQgOiBcImh0dHBzOi8vXCIgKyB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWU7XHJcbiAgICAgICAgdGhpcy5zb2NrZXQgPSBpbyhpb1BhdGgpO1xyXG4gICAgICAgIHRoaXMuaW5pdENhY2hlKCk7XHJcbiAgICAgICAgdGhpcy5pbml0RG9tKCk7XHJcbiAgICAgICAgdGhpcy5zZXRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0Q2FjaGUoKSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVQcm9qZWN0QnV0dG9uID0gJChcIi5hZGQtcHJvamVjdFwiKS5sZW5ndGggPyAkKFwiLmFkZC1wcm9qZWN0XCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVQcm9qZWN0TW9kYWwgPSAkKFwiI2FkZFByb2plY3RNb2RhbFwiKS5sZW5ndGggPyAkKFwiI2FkZFByb2plY3RNb2RhbFwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubG9naW5Gb3JtID0gJChcIi5sb2dpbi1mb3JtXCIpLmxlbmd0aCA/ICQoXCIubG9naW4tZm9ybVwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubG9naW5FcnJvck1vZGFsID0gJChcIiNMb2dpbkVycm9yTW9kYWxcIik7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckZvcm0gPSAkKFwiLnJlZ2lzdGVyLWZvcm1cIikubGVuZ3RoID8gJChcIi5yZWdpc3Rlci1mb3JtXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckVycm9yTW9kYWwgPSAkKFwiI1JlZ2lzdHJhdGlvbkVycm9yTW9kYWxcIik7XHJcbiAgICAgICAgdGhpcy5hZGROZXdQcm9qZWN0Rm9ybSA9ICQoXCIjYWRkTmV3UHJvamVjdFwiKS5sZW5ndGggPyAkKFwiI2FkZE5ld1Byb2plY3RcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLnByb2plY3RzUGFnZSA9ICQoXCIucHJvamVjdHMtcGFnZVwiKS5sZW5ndGggPyAkKFwiLnByb2plY3RzLXBhZ2VcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLnByb2plY3RzU2VjdGlvbiA9ICQoXCIucHJvamVjdHMtc2VjdGlvblwiKTtcclxuICAgICAgICB0aGlzLnByb2plY3RFZGl0U2VsZWN0b3IgPSBcIi5wcm9qZWN0LWVkaXRcIjtcclxuICAgICAgICB0aGlzLnByb2plY3REZWxldGVTZWxlY3RvciA9IFwiLnByb2plY3QtZGVsZXRlXCI7XHJcbiAgICAgICAgdGhpcy5kZWxldGVQcm9qZWN0Rm9ybVNlbGVjdG9yID0gXCIjZGVsZXRlUHJvamVjdFwiO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUHJvamVjdEZvcm1TZWxlY3RvciA9IFwiI3VwZGF0ZVByb2plY3RcIjtcclxuICAgICAgICB0aGlzLnByb2plY3RQYWdlID0gJChcIi5wcm9qZWN0LXBhZ2VcIikubGVuZ3RoID8gJChcIi5wcm9qZWN0LXBhZ2VcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmlzc3VlUGFnZSA9ICQoXCIuaXNzdWUtcGFnZVwiKS5sZW5ndGggPyAkKFwiLmlzc3VlLXBhZ2VcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmFkZElzc3VlID0gJChcIi5hZGQtaXNzdWVcIik7XHJcbiAgICAgICAgdGhpcy5hZGRJc3N1ZUZvcm0gPSAkKFwiI2FkZE5ld0lzc3VlXCIpLmxlbmd0aCA/ICQoXCIjYWRkTmV3SXNzdWVcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUlzc3VlRm9ybSA9ICQoXCIjdXBkYXRlSXNzdWVcIikubGVuZ3RoID8gJChcIiN1cGRhdGVJc3N1ZVwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlSXNzdWVGb3JtID0gJChcIiNkZWxldGVJc3N1ZVwiKS5sZW5ndGggPyAkKFwiI2RlbGV0ZUlzc3VlXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5pc3N1ZUVkaXRTZWxlY3RvciA9IFwiLmlzc3VlLWVkaXRcIjtcclxuICAgICAgICB0aGlzLmlzc3VlRGVsZXRlU2VsZWN0b3IgPSBcIi5pc3N1ZS1kZWxldGVcIjtcclxuICAgICAgICB0aGlzLmFkZENvbW1lbnQgPSAkKFwiLm5ldy1jb21tZW50XCIpLmxlbmd0aCA/ICQoXCIubmV3LWNvbW1lbnRcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmFkZFdyb2tMb2cgPSAkKFwiLm5ldy13b3JrbG9nXCIpLmxlbmd0aCA/ICQoXCIubmV3LXdvcmtsb2dcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmFkZENvbW1lbnRNb2RhbCA9ICQoXCIjYWRkQ29tbWVudE1vZGFsXCIpO1xyXG4gICAgICAgIHRoaXMuYWRkV29ya0xvZ01vZGFsID0gJChcIiNhZGRXb3JrTG9nTW9kYWxcIik7XHJcbiAgICAgICAgdGhpcy5hZGROZXdDb21tZW50Rm9ybVNlbGVjdG9yID0gXCIjYWRkTmV3Q29tbWVudFwiO1xyXG4gICAgICAgIHRoaXMuYWRkTmV3V29ya2xvZ0Zvcm1TZWxlY3RvciA9IFwiI2FkZE5ld1dvcmtsb2dcIjtcclxuICAgICAgICB0aGlzLnVwZGF0ZVdvcmtsb2dGb3JtU2VsZWN0b3IgPSBcIiN1cGRhdGVXb3JrbG9nXCI7XHJcbiAgICAgICAgdGhpcy5kYXRlVGltZVBpY2tlciA9ICQoXCIjd29yay1sb2ctZGF0ZXRpbWVwaWNrZXJcIikubGVuZ3RoID8gJChcIiN3b3JrLWxvZy1kYXRldGltZXBpY2tlclwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZGF0ZVRpbWVQaWNrZXJFZGl0U2VsZWN0b3IgPSBcIiN3b3JrLWxvZy1kYXRldGltZXBpY2tlci1lZGl0XCI7XHJcbiAgICAgICAgdGhpcy5lZGl0Q29tbWVudFRodW1iU2VsZWN0b3IgPSBcIi5lZGl0LWNvbW1lbnRcIjtcclxuICAgICAgICB0aGlzLmRlbGV0ZUNvbW1lbnRUaHVtYlNlbGVjdG9yID0gXCIuZGVsZXRlLWNvbW1lbnRcIjtcclxuICAgICAgICB0aGlzLmRlbGV0ZUNvbW1lbnRGb3JtID0gJChcIiNkZWxldGVDb21tZW50XCIpLmxlbmd0aCA/ICQoXCIjZGVsZXRlQ29tbWVudFwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ29tbWVudEZvcm0gPSAkKFwiI3VwZGF0ZUNvbW1lbnRcIikubGVuZ3RoID8gJChcIiN1cGRhdGVDb21tZW50XCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5kZWxldGVXb3JrbG9nQnV0dG9uU2VsZWN0b3IgPSBcIi5kZWxldGUtd29yay1sb2dcIjtcclxuICAgICAgICB0aGlzLmVkaVdvcmtsb2dCdXR0b25TZWxlY3RvciA9IFwiLmVkaXQtd29yay1sb2dcIjtcclxuICAgICAgICB0aGlzLmRlbGV0ZVdvcmtsb2dGb3JtID0gJChcIiNkZWxldGVXb3JrbG9nXCIpLmxlbmd0aCA/ICQoXCIjZGVsZXRlV29ya2xvZ1wiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZWRpdFdvcmtsb2dGb3JtID0gJChcIiN1cGRhdGVXb3JrbG9nXCIpLmxlbmd0aCA/ICQoXCIjdXBkYXRlV29ya2xvZ1wiKSA6IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXREb20oKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGxvZ2luKCR0YXJnZXQpIHtcclxuICAgICAgICBsZXQgZGF0YSA9ICR0YXJnZXQuc2VyaWFsaXplKCk7XHJcbiAgICAgICAgLypsZXQgbmFtZSA9IGRhdGFbMF0udmFsdWU7XHJcbiAgICAgICAgbGV0IHBhc3N3b3JkID0gZGF0YVsxXS52YWx1ZTsqL1xyXG4gICAgICAgIGxldCBsb2dpblByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9sb2dpblwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsb2dpblByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBkYXRhLnJlZGlyZWN0VG87XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubG9naW5FcnJvck1vZGFsLm1vZGFsKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVnaXN0ZXIoJHRhcmdldCkge1xyXG4gICAgICAgIGxldCBkYXRhID0gJHRhcmdldC5zZXJpYWxpemUoKTtcclxuICAgICAgICAvKmxldCBuYW1lID0gZGF0YVswXS52YWx1ZTtcclxuICAgICAgICBsZXQgcGFzc3dvcmQgPSBkYXRhWzFdLnZhbHVlOyovXHJcbiAgICAgICAgbGV0IHJlZ2lzdGVyUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL3JlZ2lzdGVyXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJlZ2lzdGVyUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcyByZWc6XCIsIGRhdGEpO1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBkYXRhLnJlZGlyZWN0VG87XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9naW4gZXJyb3JcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyRXJyb3JNb2RhbC5tb2RhbCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNldExpc3RlbmVycygpIHtcclxuICAgICAgICB0aGlzLmxvZ2luQW5kUmVnaXN0ZXJMaXN0ZW5lcnMoKTtcclxuICAgICAgICB0aGlzLnByb2plY3RzTGlzdGVuZXJzKCk7XHJcbiAgICAgICAgdGhpcy5pc3N1ZUxpc3RlbmVycygpO1xyXG5cclxuICAgICAgICAkKHdpbmRvdykubG9hZCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMucHJvamVjdHNQYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvcHVsYXRlUHJvamVjdHNQYWdlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMucHJvamVjdFBhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9wdWxhdGVQcm9qZWN0UGFnZSh3aW5kb3cucmVzb3VyY2VzLnByb2plY3QpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLmlzc3VlUGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUlzc3VlUGFnZSh3aW5kb3cucmVzb3VyY2VzLmlzc3VlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb2plY3RzTGlzdGVuZXJzKCkge1xyXG4gICAgICAgIGlmKHRoaXMuY3JlYXRlUHJvamVjdEJ1dHRvbikge1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVByb2plY3RCdXR0b24ub24oXCJjbGlja1wiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVByb2plY3RNb2RhbC5tb2RhbCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMuYWRkTmV3UHJvamVjdEZvcm0pIHtcclxuICAgICAgICAgICAgdGhpcy5hZGROZXdQcm9qZWN0Rm9ybS5vbignc3VibWl0JywgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVQcm9qZWN0KCQoZXYudGFyZ2V0KSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCB0aGlzLnByb2plY3RFZGl0U2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgbGV0ICRwYXJlbnQgPSAkKGV2LnRhcmdldCkuY2xvc2VzdChcInRyXCIpO1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdElkID0gJHBhcmVudC5hdHRyKFwiZGF0YS1wcm9qZWN0LWlkXCIpO1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdE5hbWUgPSAkcGFyZW50LmZpbmQoXCIucHItbmFtZVwiKS5odG1sKCk7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0RGVzY3JpcHRpb24gPSAkcGFyZW50LmZpbmQoXCIucHItZGVzY3JpcHRpb25cIikuaHRtbCgpO1xyXG5cclxuICAgICAgICAgICAgJChcIiNlZGl0UHJvamVjdE1vZGFsXCIpLm1vZGFsKCk7XHJcbiAgICAgICAgICAgICQoXCIjdXBkYXRlZS1wcm9qZWN0LWlkXCIpLnZhbChwcm9qZWN0SWQpO1xyXG4gICAgICAgICAgICAkKFwiI25ldy1wcm9qZWN0LW5hbWVcIikudmFsKHByb2plY3ROYW1lKTtcclxuICAgICAgICAgICAgJChcIiNuZXctZGVzY3JpcHRpb25cIikudmFsKHByb2plY3REZXNjcmlwdGlvbik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgdGhpcy5wcm9qZWN0RGVsZXRlU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3RJZCA9ICQoZXYudGFyZ2V0KS5jbG9zZXN0KFwidHJcIikuYXR0cihcImRhdGEtcHJvamVjdC1pZFwiKTtcclxuICAgICAgICAgICAgJChcIiNkZWxldGVQcm9qZWN0TW9kYWxcIikubW9kYWwoKTtcclxuICAgICAgICAgICAgJChcIiNkZWxldGUtcHJvamVjdC1pZFwiKS52YWwocHJvamVjdElkKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJzdWJtaXRcIiwgdGhpcy5kZWxldGVQcm9qZWN0Rm9ybVNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVQcm9qZWN0KCQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwic3VibWl0XCIsIHRoaXMudXBkYXRlUHJvamVjdEZvcm1TZWxlY3RvciwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUHJvamVjdCgkKGV2LnRhcmdldCkuc2VyaWFsaXplKCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIHRoaXMuaXNzdWVFZGl0U2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgbGV0ICRwYXJlbnQgPSAkKGV2LnRhcmdldCkuY2xvc2VzdChcInRyXCIpO1xyXG4gICAgICAgICAgICBsZXQgaXNzdWVJZCA9ICRwYXJlbnQuYXR0cihcImRhdGEtaXNzdWUtaWRcIik7XHJcbiAgICAgICAgICAgIGxldCBpc3N1ZU5hbWUgPSAkcGFyZW50LmZpbmQoXCIuaXNzdWUtbmFtZVwiKS5odG1sKCk7XHJcbiAgICAgICAgICAgIGxldCBpc3N1ZURlc2NyaXB0aW9uID0gJHBhcmVudC5maW5kKFwiLmlzc3VlLWRlc2NyaXB0aW9uXCIpLmh0bWwoKTtcclxuXHJcbiAgICAgICAgICAgICQoXCIjZWRpdElzc3VlTW9kYWxcIikubW9kYWwoKTtcclxuICAgICAgICAgICAgJChcIiN1cGRhdGVlLWlzc3VlLWlkXCIpLnZhbChpc3N1ZUlkKTtcclxuICAgICAgICAgICAgJChcIiNuZXctaXNzdWUtbmFtZVwiKS52YWwoaXNzdWVOYW1lKTtcclxuICAgICAgICAgICAgJChcIiNuZXctZGVzY3JpcHRpb25cIikudmFsKGlzc3VlRGVzY3JpcHRpb24pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIHRoaXMuaXNzdWVEZWxldGVTZWxlY3RvciwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImhlcmVcIilcclxuICAgICAgICAgICAgbGV0IGlzc3VlSWQgPSAkKGV2LnRhcmdldCkuY2xvc2VzdChcInRyXCIpLmF0dHIoXCJkYXRhLWlzc3VlLWlkXCIpO1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZUlzc3VlTW9kYWxcIikubW9kYWwoKTtcclxuICAgICAgICAgICAgJChcIiNkZWxldGUtaXNzdWUtaWRcIikudmFsKGlzc3VlSWQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZih0aGlzLmRlbGV0ZUlzc3VlRm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUlzc3VlRm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUlzc3VlKCQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy51cGRhdGVJc3N1ZUZvcm0pIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVJc3N1ZUZvcm0ub24oXCJzdWJtaXRcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVJc3N1ZSgkKGV2LnRhcmdldCkuc2VyaWFsaXplKCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgXCIucHJvamVjdC1pdGVtXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICBsZXQgJHRhcmdldCA9ICQoZXYudGFyZ2V0KS5jbG9zZXN0KFwiLnByb2plY3QtaXRlbVwiKTtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9wcm9qZWN0L1wiICsgJHRhcmdldC5hdHRyKFwiZGF0YS1wcm9qZWN0LWlkXCIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIFwiLmlzc3VlLWl0ZW1cIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCAkdGFyZ2V0ID0gJChldi50YXJnZXQpLmNsb3Nlc3QoXCIuaXNzdWUtaXRlbVwiKTtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9pc3N1ZS9cIiArICR0YXJnZXQuYXR0cihcImRhdGEtaXNzdWUtaWRcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc29ja2V0Lm9uKFwidXBkYXRlUHJvamVjdHNcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRlUHJvamVjdHNQYWdlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkSXNzdWUub24oXCJjbGlja1wiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJChcIiNhZGRJc3N1ZU1vZGFsXCIpKVxyXG4gICAgICAgICAgICAkKFwiI2FkZElzc3VlTW9kYWxcIikubW9kYWwoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5hZGRJc3N1ZUZvcm0pIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRJc3N1ZUZvcm0ub24oXCJzdWJtaXRcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlcmlhbGl6ZWQgPSAkKGV2LnRhcmdldCkuc2VyaWFsaXplKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGVzZXJpYWxpemVkRGF0YSA9IHRoaXMuZGVzZXJpYWxpemVGb3JtKHNlcmlhbGl6ZWQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGVzdGltYXRlZE1pbnV0ZXMgPSB0aGlzLmNvbnZlcnRFc3RpbWF0ZShkZXNlcmlhbGl6ZWREYXRhLm9yaWdpbmFsRXN0aW1hdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCFlc3RpbWF0ZWRNaW51dGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcIi5vcmlnaW5hbC1lc3RpbWF0ZS1ncm91cFwiKS5hZGRDbGFzcyhcImhhcy1lcnJvclwiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZGVzZXJpYWxpemVkRGF0YS5vcmlnaW5hbEVzdGltYXRlID0gZXN0aW1hdGVkTWludXRlcztcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlSXNzdWUoZGVzZXJpYWxpemVkRGF0YSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkZXNlcmlhbGl6ZWREYXRhKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc29ja2V0Lm9uKFwidXBkYXRlSXNzdWVzXCIsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICBpZihkYXRhLnByb2plY3QgPT0gcmVzb3VyY2VzLnByb2plY3QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9wdWxhdGVQcm9qZWN0UGFnZShyZXNvdXJjZXMucHJvamVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpc3N1ZUxpc3RlbmVycygpIHtcclxuICAgICAgICBpZih0aGlzLmFkZENvbW1lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRDb21tZW50Lm9uKFwiY2xpY2tcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZENvbW1lbnRNb2RhbC5tb2RhbCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMuYWRkV3Jva0xvZykge1xyXG4gICAgICAgICAgICB0aGlzLmFkZFdyb2tMb2cub24oXCJjbGlja1wiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkV29ya0xvZ01vZGFsLm1vZGFsKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hZGRXb3JrTG9nTW9kYWwub24oXCJzaG93LmJzLm1vZGFsXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5kYXRlVGltZVBpY2tlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZGF0ZVRpbWVQaWNrZXIuZGF0YSgnRGF0ZVRpbWVQaWNrZXInKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lUGlja2VyLmRhdGEoJ0RhdGVUaW1lUGlja2VyJykuZGF0ZShuZXcgRGF0ZSgpKTtcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVQaWNrZXIuZGF0ZXRpbWVwaWNrZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdERhdGU6IG5ldyBEYXRlKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiQoXCIjZGF0ZS10aW1lLXBpY2tlci1pbnB1dFwiKS5mb2N1cygoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJChcIi5pbnB1dC1ncm91cC1hZGRvblwiKS5jbGljaygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pOyovXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcInN1Ym1pdFwiLCB0aGlzLmFkZE5ld0NvbW1lbnRGb3JtU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUNvbW1lbnQoJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJzdWJtaXRcIiwgdGhpcy51cGRhdGVXb3JrbG9nRm9ybVNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgbGV0IHNlcmlhbGl6ZWQgPSAkKGV2LnRhcmdldCkuc2VyaWFsaXplKCk7XHJcbiAgICAgICAgICAgIGxldCBkZXNlcmlhbGl6ZWREYXRhID0gdGhpcy5kZXNlcmlhbGl6ZUZvcm0oc2VyaWFsaXplZCk7XHJcbiAgICAgICAgICAgIGxldCBlc3RpbWF0ZWRNaW51dGVzID0gdGhpcy5jb252ZXJ0RXN0aW1hdGUoZGVzZXJpYWxpemVkRGF0YS50aW1lU3BlbnQpO1xyXG4gICAgICAgICAgICBsZXQgbG9nRGF0ZVRpbWUgPSBuZXcgRGF0ZSgkKFwiI2RhdGUtdGltZS1waWNrZXItdXBkYXRlLWlucHV0XCIpLnZhbCgpKTtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBPYmplY3QoKTtcclxuXHJcbiAgICAgICAgICAgIGlmKCFsb2dEYXRlVGltZSB8fCBsb2dEYXRlVGltZSA9PT0gXCJJbnZhbGlkIERhdGVcIikge1xyXG4gICAgICAgICAgICAgICAgJChcIi5sb2ctZGF0ZS10aW1lLXVwZGF0ZVwiKS5hZGRDbGFzcyhcImhhcy1lcnJvclwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoIWVzdGltYXRlZE1pbnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgICQoXCIudXBkYXRlLXRpbWUtc3BlbnQtZ3JvdXBcIikuYWRkQ2xhc3MoXCJoYXMtZXJyb3JcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlc3VsdC5lc3RpbWF0ZWRNaW51dGVzID0gZXN0aW1hdGVkTWludXRlcztcclxuICAgICAgICAgICAgcmVzdWx0LmxvZ0RhdGVUaW1lID0gbG9nRGF0ZVRpbWU7XHJcbiAgICAgICAgICAgIHJlc3VsdC50ZXh0ID0gZGVzZXJpYWxpemVkRGF0YS50ZXh0O1xyXG4gICAgICAgICAgICByZXN1bHQuaXNzdWVJZCA9IGRlc2VyaWFsaXplZERhdGEuaXNzdWVJZDtcclxuICAgICAgICAgICAgcmVzdWx0Lndvcmtsb2dJZCA9IGRlc2VyaWFsaXplZERhdGEud29ya2xvZ0lkO1xyXG5cclxuICAgICAgICAgICAgdGhpcy51cGRhdGVXb3JrbG9nKHJlc3VsdCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc29ja2V0Lm9uKFwidXBkYXRlQ29tbWVudHNcIiwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgaWYoZGF0YS5pc3N1ZSA9PSB3aW5kb3cucmVzb3VyY2VzLmlzc3VlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvcHVsYXRlSXNzdWVDb21tZW50cyh3aW5kb3cucmVzb3VyY2VzLmlzc3VlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcInN1Ym1pdFwiLCB0aGlzLmFkZE5ld1dvcmtsb2dGb3JtU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBsZXQgc2VyaWFsaXplZCA9ICQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKTtcclxuICAgICAgICAgICAgbGV0IGRlc2VyaWFsaXplZERhdGEgPSB0aGlzLmRlc2VyaWFsaXplRm9ybShzZXJpYWxpemVkKTtcclxuICAgICAgICAgICAgbGV0IGVzdGltYXRlZE1pbnV0ZXMgPSB0aGlzLmNvbnZlcnRFc3RpbWF0ZShkZXNlcmlhbGl6ZWREYXRhLnRpbWVTcGVudCk7XHJcbiAgICAgICAgICAgIGxldCBsb2dEYXRlVGltZSA9IG5ldyBEYXRlKCQoXCIjZGF0ZS10aW1lLXBpY2tlci1pbnB1dFwiKS52YWwoKSk7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBuZXcgT2JqZWN0KCk7XHJcblxyXG4gICAgICAgICAgICBpZighbG9nRGF0ZVRpbWUgfHwgbG9nRGF0ZVRpbWUgPT09IFwiSW52YWxpZCBEYXRlXCIpIHtcclxuICAgICAgICAgICAgICAgICQoXCIubG9nLWRhdGUtdGltZVwiKS5hZGRDbGFzcyhcImhhcy1lcnJvclwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoIWVzdGltYXRlZE1pbnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgICQoXCIudGltZS1zcGVudC1ncm91cFwiKS5hZGRDbGFzcyhcImhhcy1lcnJvclwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVzdWx0LmVzdGltYXRlZE1pbnV0ZXMgPSBlc3RpbWF0ZWRNaW51dGVzO1xyXG4gICAgICAgICAgICByZXN1bHQubG9nRGF0ZVRpbWUgPSBsb2dEYXRlVGltZTtcclxuICAgICAgICAgICAgcmVzdWx0LnRleHQgPSBkZXNlcmlhbGl6ZWREYXRhLnRleHQ7XHJcbiAgICAgICAgICAgIHJlc3VsdC5jcmVhdG9yID0gZGVzZXJpYWxpemVkRGF0YS5jcmVhdG9yO1xyXG4gICAgICAgICAgICByZXN1bHQuaXNzdWVJZCA9IGRlc2VyaWFsaXplZERhdGEuaXNzdWVJZDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlV29ya2xvZyhyZXN1bHQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNvY2tldC5vbihcInVwZGF0ZVdvcmtMb2dzXCIsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGRhdGEuaXNzdWUgPT0gd2luZG93LnJlc291cmNlcy5pc3N1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUlzc3VlV29ya2xvZ3Mod2luZG93LnJlc291cmNlcy5pc3N1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCB0aGlzLmRlbGV0ZUNvbW1lbnRUaHVtYlNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgJChcIiNkZWxldGVDb21tZW50TW9kYWxcIikubW9kYWwoKTtcclxuICAgICAgICAgICAgJChcIiNkZWxldGUtY29tbWVudC1pZFwiKS52YWwoJChldi50YXJnZXQpLmNsb3Nlc3QoXCIuY29tbWVudC1pdGVtXCIpLmF0dHIoXCJkYXRhLWNvbW1lbnQtaWRcIikpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIHRoaXMuZWRpdENvbW1lbnRUaHVtYlNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgJChcIiNlZGl0Q29tbWVudE1vZGFsXCIpLm1vZGFsKCk7XHJcbiAgICAgICAgICAgICQoXCIjZWRpdC1jb21tZW50LWlkXCIpLnZhbCgkKGV2LnRhcmdldCkuY2xvc2VzdChcIi5jb21tZW50LWl0ZW1cIikuYXR0cihcImRhdGEtY29tbWVudC1pZFwiKSk7XHJcbiAgICAgICAgICAgICQoXCIjY29tbWVudC10ZXh0XCIpLnZhbCgkKGV2LnRhcmdldCkuY2xvc2VzdChcIi5jb21tZW50LWl0ZW1cIikuZmluZChcIi5wYW5lbC1ib2R5XCIpLnRleHQoKS50cmltKCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZih0aGlzLmRlbGV0ZUNvbW1lbnRGb3JtKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlQ29tbWVudEZvcm0ub24oXCJzdWJtaXRcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWxldGVDb21tZW50KCQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy51cGRhdGVDb21tZW50Rm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNvbW1lbnRGb3JtLm9uKFwic3VibWl0XCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ29tbWVudCgkKGV2LnRhcmdldCkuc2VyaWFsaXplKCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgdGhpcy5kZWxldGVXb3JrbG9nQnV0dG9uU2VsZWN0b3IsIChldikgPT4ge2NvbnNvbGUubG9nKFwid2hhMVwiKVxyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZVdvcmtsb2dNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZS13b3JrLWxvZy1pZFwiKS52YWwoJChldi50YXJnZXQpLmNsb3Nlc3QoXCIud29yay1sb2ctaXRlbVwiKS5hdHRyKFwiZGF0YS13b3JrLWxvZy1pZFwiKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgdGhpcy5lZGlXb3JrbG9nQnV0dG9uU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBsZXQgJGN1cnJlbnRJdGVtID0gJChldi50YXJnZXQpLmNsb3Nlc3QoXCIud29yay1sb2ctaXRlbVwiKTtcclxuICAgICAgICAgICAgbGV0IGRhdGVUaW1lID0gJGN1cnJlbnRJdGVtLmZpbmQoXCIud29yay1sb2ctaW5mb1wiKS5odG1sKCkuc3BsaXQoXCItIFwiKVsxXTtcclxuICAgICAgICAgICAgbGV0IHRpbWVTcGVudCA9ICRjdXJyZW50SXRlbS5maW5kKFwiLnRpbWUtc3BlbnRcIikuYXR0cihcImRhdGEtbWludXRlc1wiKTtcclxuICAgICAgICAgICAgbGV0IHRpbWVTcGVudE5vdGF0aW9uID0gdGhpcy5taW51dGVzVG9TdHJpbmcodGltZVNwZW50LCBcIm5vdGF0aW9uXCIpO1xyXG5cclxuICAgICAgICAgICAgJChcIiNlZGl0V29ya2xvZ01vZGFsXCIpLm1vZGFsKCk7XHJcbiAgICAgICAgICAgICQoXCIjZWRpdC13b3JrLWxvZy1pZFwiKS52YWwoJGN1cnJlbnRJdGVtLmF0dHIoXCJkYXRhLXdvcmstbG9nLWlkXCIpKTtcclxuICAgICAgICAgICAgJChcIiNlZGl0LXdvcmstbG9nLXRleHRcIikudmFsKCRjdXJyZW50SXRlbS5maW5kKFwiLndvcmtsb2ctdGV4dFwiKS50ZXh0KCkudHJpbSgpKTtcclxuICAgICAgICAgICAgJChcIiN0aW1lU3BlbnRVcGRhdGVcIikudmFsKHRpbWVTcGVudE5vdGF0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIGlmKCQodGhpcy5kYXRlVGltZVBpY2tlckVkaXRTZWxlY3RvcikuZGF0YSgnRGF0ZVRpbWVQaWNrZXInKSkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzLmRhdGVUaW1lUGlja2VyRWRpdFNlbGVjdG9yKS5kYXRhKCdEYXRlVGltZVBpY2tlcicpLmRhdGUoZGF0ZVRpbWUpO1xyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMuZGF0ZVRpbWVQaWNrZXJFZGl0U2VsZWN0b3IpLmRhdGV0aW1lcGlja2VyKHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0RGF0ZTogZGF0ZVRpbWVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuZGVsZXRlV29ya2xvZ0Zvcm0pIHtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVXb3JrbG9nRm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZVdvcmtsb2coJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRlc2VyaWFsaXplRm9ybShzZXJpYWxpemVkRm9ybURhdGEpIHtcclxuICAgICAgICBsZXQgc2VyaWFsaXplZERhdGFBcnJheSA9IHNlcmlhbGl6ZWRGb3JtRGF0YS5zcGxpdChcIiZcIik7XHJcbiAgICAgICAgbGV0IGRlc2VyaWFsaXplZERhdGEgPSBuZXcgT2JqZWN0KCk7XHJcbiAgICAgICAgbGV0IGl0ZW1TcGxpdDtcclxuXHJcbiAgICAgICAgZm9yKGxldCBsZW5ndGggPSBzZXJpYWxpemVkRGF0YUFycmF5Lmxlbmd0aCwgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBzZXJpYWxpemVkRGF0YUFycmF5W2ldID0gc2VyaWFsaXplZERhdGFBcnJheVtpXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpO1xyXG5cclxuICAgICAgICAgICAgaXRlbVNwbGl0ID0gc2VyaWFsaXplZERhdGFBcnJheVtpXS5zcGxpdChcIj1cIik7XHJcbiAgICAgICAgICAgIGRlc2VyaWFsaXplZERhdGFbaXRlbVNwbGl0WzBdXSA9IGl0ZW1TcGxpdFsxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlc2VyaWFsaXplZERhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgY29udmVydEVzdGltYXRlKGVzdGltYXRlU3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IHJlZ2V4cCA9IC8oXlxcZCpoIFxcZCptJCl8KF5cXGQqKFxcLlxcZCspP2gkKXwoXlxcZCptJCkvOyAvKmUuZyAxaCAzMG0gb3IgMzBtIG9yIDEuNWgqL1xyXG4gICAgICAgIGxldCBtYXRjaCA9IGVzdGltYXRlU3RyaW5nLm1hdGNoKHJlZ2V4cCk7XHJcbiAgICAgICAgbGV0IG1hdGNoU3BsaXQ7XHJcbiAgICAgICAgbGV0IHNwbGl0TGVuZ3RoO1xyXG4gICAgICAgIGxldCBob3VycztcclxuICAgICAgICBsZXQgbWludXRlcyA9IDA7XHJcbiAgICAgICAgbGV0IGFkZGl0aW9uYWxNaW51dGVzID0gMDtcclxuXHJcbiAgICAgICAgaWYoIW1hdGNoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1hdGNoID0gbWF0Y2hbMF07XHJcbiAgICAgICAgbWF0Y2hTcGxpdCA9IG1hdGNoLnNwbGl0KFwiIFwiKTtcclxuICAgICAgICBzcGxpdExlbmd0aCA9IG1hdGNoU3BsaXQubGVuZ3RoO1xyXG5cclxuICAgICAgICBpZihzcGxpdExlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgIGxldCBpbmRleE9mTSA9IG1hdGNoU3BsaXRbMF0uaW5kZXhPZihcIm1cIik7XHJcbiAgICAgICAgICAgIGxldCBpbmRleE9mSCA9IG1hdGNoU3BsaXRbMF0uaW5kZXhPZihcImhcIik7XHJcblxyXG4gICAgICAgICAgICBpZihpbmRleE9mTSAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgbWludXRlcyA9IG1hdGNoU3BsaXRbMF0uc2xpY2UoMCwgaW5kZXhPZk0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihpbmRleE9mSCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgaG91cnMgPSBtYXRjaFNwbGl0WzBdLnNsaWNlKDAsIGluZGV4T2ZIKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgbGV0IGluZGV4T2ZIID0gbWF0Y2hTcGxpdFswXS5pbmRleE9mKFwiaFwiKTtcclxuICAgICAgICAgICAgbGV0IGluZGV4T2ZNID0gbWF0Y2hTcGxpdFsxXS5pbmRleE9mKFwibVwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGluZGV4T2ZIICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBob3VycyA9IG1hdGNoU3BsaXRbMF0uc2xpY2UoMCwgaW5kZXhPZkgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihpbmRleE9mTSAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgbWludXRlcyA9IG1hdGNoU3BsaXRbMV0uc2xpY2UoMCwgaW5kZXhPZk0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihob3Vycykge1xyXG4gICAgICAgICAgICBhZGRpdGlvbmFsTWludXRlcyA9IHBhcnNlSW50KDYwICogaG91cnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWludXRlcyA9IHBhcnNlSW50KG1pbnV0ZXMpO1xyXG4gICAgICAgIG1pbnV0ZXMgKz0gYWRkaXRpb25hbE1pbnV0ZXM7XHJcblxyXG4gICAgICAgIHJldHVybiBtaW51dGVzO1xyXG4gICAgfVxyXG5cclxuICAgIG1pbnV0ZXNUb1N0cmluZyhtaW51dGVzLCBub3RhdGlvbikge1xyXG4gICAgICAgIGxldCBob3VycyA9IG1pbnV0ZXMgLyA2MDtcclxuICAgICAgICBpZighbm90YXRpb24pIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdFN0cmluZyA9IGhvdXJzIDwgMSA/ICggKG1pbnV0ZXMgPT0gMSkgPyBwYXJzZUludChtaW51dGVzKSArIFwiIG1pbnV0ZVwiIDogcGFyc2VJbnQobWludXRlcykgKyBcIiBtaW51dGVzXCIgKSA6ICggKGhvdXJzID09IDEpID8gaG91cnMgKyBcIiBob3VyXCIgOiBob3VycyArIFwiIGhvdXJzXCIgKTtcclxuICAgICAgICAgICAgcmVzdWx0U3RyaW5nID0gJ1RpbWUgc3BlbnQ6ICcgKyByZXN1bHRTdHJpbmc7XHJcbiAgICAgICAgfSBlbHNlIGlmKG5vdGF0aW9uID09PSBcIm5vdGF0aW9uXCIpIHtcclxuICAgICAgICAgICAgbGV0IHJlbWFpbmRlciA9IGhvdXJzICUgMTtcclxuICAgICAgICAgICAgbGV0IG1pbnV0ZXMgPSBwYXJzZUludChyZW1haW5kZXIgKiA2MCk7XHJcbiAgICAgICAgICAgIGhvdXJzID0gcGFyc2VJbnQoaG91cnMgLSByZW1haW5kZXIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJlc3VsdFN0cmluZyA9IGhvdXJzIDwgMSA/IG1pbnV0ZXMgKyBcIm1cIiA6IGhvdXJzICsgXCJoXCIgKyBcIiBcIiArIG1pbnV0ZXMgKyBcIm1cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHRTdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlQ29tbWVudChkYXRhKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSlcclxuICAgICAgICBsZXQgY3JlYXRlQ29tbWVudFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9jb21tZW50XCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY3JlYXRlQ29tbWVudFByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MgY3JlYXRpbmcgY29tbWVudDpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICQoXCIjYWRkQ29tbWVudE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciBkdXJpbmcgY29tbWVudCBjcmVhdGlvblwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZHVyaW5nIGNvbW1lbnQgY3JlYXRpb25cIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlSXNzdWUoZGF0YSkge1xyXG4gICAgICAgIGxldCBjcmVhdGVJc3N1ZVByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9pc3N1ZVwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MsIFwiLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNyZWF0ZUlzc3VlUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcyByZWc6XCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAkKFwiI2FkZElzc3VlTW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGR1cmluZyBwcm9qZWN0IGNyZWF0aW9uXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgaXNzdWUgY3JlYXRpb25cIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlUHJvamVjdChkYXRhKSB7XHJcbiAgICAgICAgbGV0IGRlbGV0ZVByb2plY3RQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvcHJvamVjdFwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVsZXRlUHJvamVjdFByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZVByb2plY3RNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgcmVtb3ZpbmcgcHJvamVjdFwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3Igd2hpbGUgcmVtb3ZpbmcgcHJvamVjdFwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVQcm9qZWN0KGRhdGEpIHtcclxuICAgICAgICBsZXQgdXBkYXRlUHJvamVjdFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9qZWN0XCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2VkaXRQcm9qZWN0TW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdXBkYXRlUHJvamVjdFByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZVByb2plY3RNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgcmVtb3ZpbmcgcHJvamVjdFwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgdXBkYXRpbmcgcHJvamVjdHNcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlSXNzdWUoZGF0YSkge1xyXG4gICAgICAgIGxldCBkZWxldGVJc3N1ZVByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9pc3N1ZVwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVsZXRlSXNzdWVQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgJChcIiNkZWxldGVJc3N1ZU1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciByZW1vdmluZyBpc3N1ZVwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgcmVtb3ZpbmcgaXNzdWVcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlSXNzdWUoZGF0YSkge1xyXG4gICAgICAgIGxldCB1cGRhdGVJc3N1ZVByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9pc3N1ZVwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNlZGl0UHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHVwZGF0ZUlzc3VlUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlUHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZyBpc3N1ZVwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3Igd2hpbGUgdXBkYXRpbmcgaXNzdWVcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcG9wdWxhdGVQcm9qZWN0UGFnZShwcm9qZWN0SWQpIHtcclxuICAgICAgICBsZXQgaXNzdWVzUHJvbWlzZSA9IHRoaXMuZ2V0SXNzdWVzKHByb2plY3RJZCwgcG9wdWxhdGVJc3N1ZXNUZW1wbGF0ZSk7XHJcbiAgICAgICAgbGV0ICRpc3N1ZXNTZWN0aW9uID0gJChcIi5wcm9qZWN0LXBhZ2UgLmlzc3Vlcy1zZWN0aW9uXCIpO1xyXG5cclxuICAgICAgICBpc3N1ZXNQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpc3N1ZXMgY29sbGVjdGlvbiBpczo6XCIsIGRhdGEpO1xyXG4gICAgICAgICAgICBwb3B1bGF0ZUlzc3Vlc1RlbXBsYXRlKGRhdGEpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHBvcHVsYXRlSXNzdWVzVGVtcGxhdGUoaXNzdWVzTGlzdCkge1xyXG4gICAgICAgICAgICBsZXQgZ2V0UHJvamVjdHNQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgdXJsOiBcIi90ZW1wbGF0ZXMvdGVtcGxhdGVzLmh0bWxcIixcclxuICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnaHRtbCdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGdldFByb2plY3RzUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc291cmNlID0gJChkYXRhKS5maW5kKFwiI3Byb2plY3QtdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gSGFuZGxlYmFycy5jb21waWxlKHNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGV4dCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBpc3N1ZXNMaXN0OiBpc3N1ZXNMaXN0XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgbGV0IGh0bWwgPSB0ZW1wbGF0ZShjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgICRpc3N1ZXNTZWN0aW9uLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2VkaXRJc3N1ZU1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBkdXJpbmcgaXNzdWVzIHRlbXBsYXRlIGZldGNoXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZHVyaW5nIHByb2plY3QgY3JlYXRpb25cIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwb3B1bGF0ZUlzc3VlUGFnZShpc3N1ZUlkKSB7XHJcbiAgICAgICAgdGhpcy5wb3B1bGF0ZUlzc3VlQ29tbWVudHMoaXNzdWVJZCk7XHJcbiAgICAgICAgdGhpcy5wb3B1bGF0ZUlzc3VlV29ya2xvZ3MoaXNzdWVJZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcG9wdWxhdGVJc3N1ZUNvbW1lbnRzKGlzc3VlSWQpIHtcclxuICAgICAgICBsZXQgY29tbWVudHNQcm9taXNlID0gdGhpcy5nZXRDb21tZW50cyhpc3N1ZUlkKTtcclxuICAgICAgICBsZXQgJGNvbW1lbnRzU2VjdGlvbiA9ICQoXCIuaXNzdWUtcGFnZSAuaXNzdWUtY29tbWVudHNcIik7XHJcblxyXG4gICAgICAgIGNvbW1lbnRzUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaXNzdWVzIGNvbW1lbnRzIGlzOjpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgIHBvcHVsYXRlQ29tbWVudHNUZW1wbGF0ZShkYXRhKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwb3B1bGF0ZUNvbW1lbnRzVGVtcGxhdGUoY29tbWVudHNMaXN0KSB7XHJcbiAgICAgICAgICAgIGNvbW1lbnRzTGlzdC5mb3JFYWNoKChjb21tZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZihjb21tZW50LmNyZWF0b3IuX2lkID09PSB3aW5kb3cucmVzb3VyY2VzLnVzZXIuaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tZW50LmlzQ29tbWVudE93bmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tZW50LmlzQ29tbWVudE93bmVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29tbWVudC51cGRhdGVkID0gbmV3IERhdGUoY29tbWVudC51cGRhdGVkKTtcclxuICAgICAgICAgICAgICAgIGNvbW1lbnQudXBkYXRlZCA9IGNvbW1lbnQudXBkYXRlZC5nZXRNb250aCgpICsgMSArIFwiL1wiICsgY29tbWVudC51cGRhdGVkLmdldERhdGUoKSArIFwiL1wiICsgY29tbWVudC51cGRhdGVkLmdldEZ1bGxZZWFyKCkgKyBcIiBcIiArIGNvbW1lbnQudXBkYXRlZC5nZXRIb3VycygpICsgXCI6XCIgKyBjb21tZW50LnVwZGF0ZWQuZ2V0TWludXRlcygpO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIndsXCIgK25ldyBEYXRlKHdvcmtMb2cuZGF0ZVN0YXJ0ZWQpKXNcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZ2V0Q29tbWVudHNQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgdXJsOiBcIi90ZW1wbGF0ZXMvdGVtcGxhdGVzLmh0bWxcIixcclxuICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnaHRtbCdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGdldENvbW1lbnRzUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc291cmNlID0gJChkYXRhKS5maW5kKFwiI2NvbW1lbnRzLXRlbXBsYXRlXCIpLmh0bWwoKTtcclxuICAgICAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IEhhbmRsZWJhcnMuY29tcGlsZShzb3VyY2UpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbnRleHQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWVudHNMaXN0OiBjb21tZW50c0xpc3QsXHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFVzZXI6IHdpbmRvdy5yZXNvdXJjZXMudXNlci5pZFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGxldCBodG1sID0gdGVtcGxhdGUoY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICAkY29tbWVudHNTZWN0aW9uLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZHVyaW5nIGNvbW1lbnRzIHRlbXBsYXRlIGZldGNoXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZHVyaW5nIHByb2plY3QgY3JlYXRpb25cIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwb3B1bGF0ZUlzc3VlV29ya2xvZ3MoaXNzdWVJZCkge1xyXG4gICAgICAgIGxldCB3b3JrTG9nc1Byb21pc2UgPSB0aGlzLmdldFdvcmtsb2dzKGlzc3VlSWQpO1xyXG4gICAgICAgIGxldCAkd29ya0xvZ3NTZWN0aW9uID0gJChcIi5pc3N1ZS1wYWdlIC5pc3N1ZS13b3JrbG9nc1wiKTtcclxuICAgICAgICBsZXQgaXNzdWVPcmlnaW5hbEVzdGltYXRlO1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgd29ya0xvZ3NQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpc3N1ZXMgbG9ncyBpczpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgIGxldCB7b3JpZ2luZWxFc3RpbWF0ZSwgd29ya2xvZ3N9ID0gZGF0YTtcclxuICAgICAgICAgICAgd29ya2xvZ3MuZm9yRWFjaCgod29ya0xvZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgd29ya0xvZy50aW1lU3BlbnRNaW51dGVzID0gd29ya0xvZy50aW1lU3BlbnQ7XHJcbiAgICAgICAgICAgICAgICB3b3JrTG9nLnRpbWVTcGVudCA9IHRoaXMubWludXRlc1RvU3RyaW5nKHdvcmtMb2cudGltZVNwZW50KTtcclxuICAgICAgICAgICAgICAgIHdvcmtMb2cuZGF0ZVN0YXJ0ZWQgPSBuZXcgRGF0ZSh3b3JrTG9nLmRhdGVTdGFydGVkKTtcclxuICAgICAgICAgICAgICAgIHdvcmtMb2cuZGF0ZVN0YXJ0ZWQgPSB3b3JrTG9nLmRhdGVTdGFydGVkLmdldE1vbnRoKCkgKyAxICsgXCIvXCIgKyB3b3JrTG9nLmRhdGVTdGFydGVkLmdldERhdGUoKSArIFwiL1wiICsgd29ya0xvZy5kYXRlU3RhcnRlZC5nZXRGdWxsWWVhcigpICsgXCIgXCIgKyB3b3JrTG9nLmRhdGVTdGFydGVkLmdldEhvdXJzKCkgKyBcIjpcIiArIHdvcmtMb2cuZGF0ZVN0YXJ0ZWQuZ2V0TWludXRlcygpO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIndsXCIgK25ldyBEYXRlKHdvcmtMb2cuZGF0ZVN0YXJ0ZWQpKVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlzc3VlT3JpZ2luYWxFc3RpbWF0ZSA9IG9yaWdpbmVsRXN0aW1hdGU7XHJcblxyXG4gICAgICAgICAgICBwb3B1bGF0ZVdvcmtsb2dzVGVtcGxhdGUoe1xyXG4gICAgICAgICAgICAgICAgb3JpZ2luZWxFc3RpbWF0ZTogb3JpZ2luZWxFc3RpbWF0ZSxcclxuICAgICAgICAgICAgICAgIHdvcmtMb2dzTGlzdDogd29ya2xvZ3NcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcG9wdWxhdGVXb3JrbG9nc1RlbXBsYXRlKGRhdGEpIHtjb25zb2xlLmxvZyhcInRoaXNcIiwgdGhpcylcclxuICAgICAgICAgICAgbGV0IHtvcmlnaW5lbEVzdGltYXRlLCB3b3JrTG9nc0xpc3R9ID0gZGF0YTtcclxuICAgICAgICAgICAgd29ya0xvZ3NMaXN0LmZvckVhY2goKHdvcmtMb2cpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHdvcmtMb2cuY3JlYXRvci5faWQgPT09IHdpbmRvdy5yZXNvdXJjZXMudXNlci5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtMb2cuaXNXb3JrTG9nT3duZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtMb2cuaXNXb3JrTG9nT3duZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZ2V0V29ya0xvZ3NQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgdXJsOiBcIi90ZW1wbGF0ZXMvdGVtcGxhdGVzLmh0bWxcIixcclxuICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnaHRtbCdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGdldFdvcmtMb2dzUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc291cmNlID0gJChkYXRhKS5maW5kKFwiI3dvcmstbG9ncy10ZW1wbGF0ZVwiKS5odG1sKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGUgPSBIYW5kbGViYXJzLmNvbXBpbGUoc291cmNlKTtcclxuICAgICAgICAgICAgICAgIGxldCBjb250ZXh0ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtMb2dzTGlzdDogd29ya0xvZ3NMaXN0LFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRVc2VyOiB3aW5kb3cucmVzb3VyY2VzLnVzZXIuaWRcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBsZXQgaHRtbCA9IHRlbXBsYXRlKGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgJHdvcmtMb2dzU2VjdGlvbi5odG1sKGh0bWwpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoYXQucG9wdWxhdGVJc3N1ZVRpbWVUcmFja2luZyhpc3N1ZU9yaWdpbmFsRXN0aW1hdGUsIHdvcmtMb2dzTGlzdCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZHVyaW5nIGNvbW1lbnRzIHRlbXBsYXRlIGZldGNoXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZHVyaW5nIHByb2plY3QgY3JlYXRpb25cIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwb3B1bGF0ZUlzc3VlVGltZVRyYWNraW5nKGlzc3VlT3JpZ2luYWxFc3RpbWF0ZSwgd29ya0xvZ3NMaXN0KSB7XHJcbiAgICAgICAgbGV0IGlzc3VlTG9nZ2VkTWludXRlcyA9IDA7XHJcbiAgICAgICAgbGV0IGlzc3VlTG9nZ2VkVGltZVN0cmluZztcclxuICAgICAgICBsZXQgaXNzdWVFc3RpbWF0ZWRUaW1lU3RyaW5nO1xyXG4gICAgICAgIGxldCBsb2dnZWRQZXJjZW50O1xyXG5cclxuICAgICAgICB3b3JrTG9nc0xpc3QuZm9yRWFjaCgod29ya2xvZykgPT4ge1xyXG4gICAgICAgICAgICBpc3N1ZUxvZ2dlZE1pbnV0ZXMgKz0gd29ya2xvZy50aW1lU3BlbnRNaW51dGVzO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpc3N1ZUxvZ2dlZFRpbWVTdHJpbmcgPSB0aGlzLm1pbnV0ZXNUb1N0cmluZyhpc3N1ZUxvZ2dlZE1pbnV0ZXMsIFwibm90YXRpb25cIik7XHJcbiAgICAgICAgaXNzdWVFc3RpbWF0ZWRUaW1lU3RyaW5nID0gdGhpcy5taW51dGVzVG9TdHJpbmcoaXNzdWVPcmlnaW5hbEVzdGltYXRlLCBcIm5vdGF0aW9uXCIpO1xyXG5cclxuICAgICAgICBsb2dnZWRQZXJjZW50ID0gaXNzdWVMb2dnZWRNaW51dGVzICogMTAwIC8gaXNzdWVPcmlnaW5hbEVzdGltYXRlO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGlzc3VlT3JpZ2luYWxFc3RpbWF0ZSwgaXNzdWVMb2dnZWRNaW51dGVzLCBsb2dnZWRQZXJjZW50KVxyXG4gICAgICAgICQoXCIucHJvZ3Jlc3MtYmFyXCIpLmNzcyh7XHJcbiAgICAgICAgICAgIHdpZHRoOiBsb2dnZWRQZXJjZW50ICsgXCIlXCJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcIi5pc3N1ZS1sb2dnZWRcIikuaHRtbChpc3N1ZUxvZ2dlZFRpbWVTdHJpbmcpO1xyXG4gICAgICAgICQoXCIuaXNzdWUtZXN0aW1hdGVkXCIpLmh0bWwoaXNzdWVFc3RpbWF0ZWRUaW1lU3RyaW5nKTtcclxuXHJcbiAgICAgICAgaWYoaXNzdWVMb2dnZWRNaW51dGVzID4gaXNzdWVPcmlnaW5hbEVzdGltYXRlKSB7XHJcbiAgICAgICAgICAgICQoXCIucHJvZ3Jlc3MtYmFyXCIpLnJlbW92ZUNsYXNzKFwicHJvZ3Jlc3MtYmFyLXN1Y2Nlc3NcIikuYWRkQ2xhc3MoXCJwcm9ncmVzcy1iYXItZGFuZ2VyXCIpO1xyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgJChcIi5wcm9ncmVzcy1iYXJcIikucmVtb3ZlQ2xhc3MoXCJwcm9ncmVzcy1iYXItZGFuZ2VyXCIpLmFkZENsYXNzKFwicHJvZ3Jlc3MtYmFyLXN1Y2Nlc3NcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHBvcHVsYXRlUHJvamVjdHNQYWdlKCkge1xyXG4gICAgICAgIGxldCBwcm9qZWN0c1Byb21pc2UgPSB0aGlzLmdldFByb2plY3RzKCk7XHJcbiAgICAgICAgbGV0IHByb2plY3RzO1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgcHJvamVjdHNQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJmZXRjaGVkIHByb2plY3RzOlwiLCBkYXRhKTtcclxuICAgICAgICAgICAgcG9wdWxhdGVQcm9qZWN0c1RlbXBsYXRlKGRhdGEpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGZldGNoaW5nIHByb2plY3RzXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBmZXRjaGluZyBwcm9qZWN0c1wiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcG9wdWxhdGVQcm9qZWN0c1RlbXBsYXRlKHByb2plY3RzTGlzdCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwcm9qZWN0c0xpc3QpXHJcbiAgICAgICAgICAgIGxldCBnZXRQcm9qZWN0c1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3RlbXBsYXRlcy90ZW1wbGF0ZXMuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZ2V0UHJvamVjdHNQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBzb3VyY2UgPSAkKGRhdGEpLmZpbmQoXCIjcHJvamVjdHMtdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gSGFuZGxlYmFycy5jb21waWxlKHNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGV4dCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0c0xpc3Q6IHByb2plY3RzTGlzdFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGxldCBodG1sID0gdGVtcGxhdGUoY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnByb2plY3RzU2VjdGlvbi5odG1sKGh0bWwpO1xyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBkdXJpbmcgcHJvamVjdHMgdGVtcGxhdGUgZmV0Y2hcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgcHJvamVjdCBjcmVhdGlvblwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVByb2plY3QoJHRhcmdldCkge1xyXG4gICAgICAgIGxldCBkYXRhID0gJHRhcmdldC5zZXJpYWxpemUoKTtcclxuXHJcbiAgICAgICAgbGV0IGNyZWF0ZVByb2plY3RQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvcHJvamVjdFwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MsIFwiLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICQoXCIjYWRkUHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNyZWF0ZVByb2plY3RQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzIHJlZzpcIiwgZGF0YSk7XHJcblxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGR1cmluZyBwcm9qZWN0IGNyZWF0aW9uXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgcHJvamVjdCBjcmVhdGlvblwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQcm9qZWN0cyhjYWxsYmFjaykge1xyXG4gICAgICAgIGxldCBnZXRQcm9qZWN0c1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9qZWN0c0l0ZW1zXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZ2V0UHJvamVjdHNQcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldElzc3Vlcyhwcm9qZWN0SWQsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJwcmk6XCIsIHByb2plY3RJZCk7XHJcbiAgICAgICAgbGV0IGdldElzc3Vlc1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9pc3N1ZXNcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICBwcm9qZWN0SWQ6IHByb2plY3RJZFxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBnZXRJc3N1ZXNQcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENvbW1lbnRzKGlzc3VlSWQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImlzc3VlSWRsOlwiLCBpc3N1ZUlkKTtcclxuICAgICAgICBsZXQgZ2V0Q29tbWVudHNQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvY29tbWVudHNcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICBpc3N1ZUlkOiBpc3N1ZUlkXHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGdldENvbW1lbnRzUHJvbWlzZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRXb3JrbG9ncyhpc3N1ZUlkKSB7XHJcbiAgICAgICAgbGV0IGdldFdvcmtMb2dzUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2xvZ3NcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICBpc3N1ZUlkOiBpc3N1ZUlkXHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtjb25zb2xlLmxvZyhcImZyb20gU2VyZXZlcjogXCIsIGRhdGEpXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBnZXRXb3JrTG9nc1Byb21pc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlQ29tbWVudChkYXRhKSB7XHJcbiAgICAgICAgbGV0IGRlc2VyaWFsaXplZERhdGEgPSB0aGlzLmRlc2VyaWFsaXplRm9ybShkYXRhKVxyXG4gICAgICAgIGRlc2VyaWFsaXplZERhdGEuaXNzdWVJZCA9IHdpbmRvdy5yZXNvdXJjZXMuaXNzdWU7XHJcbiAgICAgICAgbGV0IHVwZGF0ZUNvbW1lbnRQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvY29tbWVudFwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRlc2VyaWFsaXplZERhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNlZGl0Q29tbWVudE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHVwZGF0ZUNvbW1lbnRQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgJChcIiNkZWxldGVQcm9qZWN0TW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHVwZGF0aW5nIGlzc3VlXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciB3aGlsZSB1cGRhdGluZyBpc3N1ZVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVDb21tZW50KGRhdGEpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICBsZXQgZGVzZXJpYWxpemVkRGF0YSA9IHRoaXMuZGVzZXJpYWxpemVGb3JtKGRhdGEpXHJcbiAgICAgICAgZGVzZXJpYWxpemVkRGF0YS5pc3N1ZUlkID0gd2luZG93LnJlc291cmNlcy5pc3N1ZTtcclxuICAgICAgICBsZXQgZGVsZXRlQ29tbWVudFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9jb21tZW50XCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGVzZXJpYWxpemVkRGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZWxldGVDb21tZW50UHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlQ29tbWVudE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciByZW1vdmluZyBjb21tZW50XCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciByZW1vdmluZyBjb21tZW50XCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVdvcmtsb2coZGF0YSkge1xyXG4gICAgICAgIGxldCBjcmVhdGVXb3JrbG9nUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2xvZ1wiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MsIFwiLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNyZWF0ZVdvcmtsb2dQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzIHJlZzpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICQoXCIjYWRkV29ya0xvZ01vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBkdXJpbmcgbG9nIGNyZWF0aW9uXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgbG9nIGNyZWF0aW9uXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVdvcmtsb2coZGF0YSkge2NvbnNvbGUubG9nKFwiZGF0YVwiLCBkYXRhKVxyXG4gICAgICAgIGxldCB1cGRhdGVXb3JrbG9nUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2xvZ1wiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdXBkYXRlV29ya2xvZ1Byb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3Mgd29ya2xvZ2xvZzpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICQoXCIjZWRpdFdvcmtsb2dNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZHVyaW5nIGxvZyB1cGRhdGVcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIGR1cmluZyBsb2cgdXBkYXRlXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBkZWxldGVXb3JrbG9nKGRhdGEpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICBsZXQgZGVzZXJpYWxpemVkRGF0YSA9IHRoaXMuZGVzZXJpYWxpemVGb3JtKGRhdGEpXHJcbiAgICAgICAgZGVzZXJpYWxpemVkRGF0YS5pc3N1ZUlkID0gd2luZG93LnJlc291cmNlcy5pc3N1ZTtcclxuICAgICAgICBsZXQgZGVsZXRlQ29tbWVudFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9sb2dcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkZXNlcmlhbGl6ZWREYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MsIFwiLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlbGV0ZUNvbW1lbnRQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgJChcIiNkZWxldGVXb3JrbG9nTW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHJlbW92aW5nIHdvcmtsb2dcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIHJlbW92aW5nIHdvcmtsb2dcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9naW5BbmRSZWdpc3Rlckxpc3RlbmVycygpIHtcclxuICAgICAgICBpZih0aGlzLmxvZ2luRm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2luRm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2luKCQoIGV2LnRhcmdldCApKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLnJlZ2lzdGVyRm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyRm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJChcIiNwYXNzd29yZDFcIikudmFsKCkgIT0gJChcIiNwYXNzd29yZDJcIikudmFsKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiLmZvcm0tZ3JvdXBcIikuYWRkQ2xhc3MoXCJoYXMtZXJyb3JcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJwYXNzd29yZHMgeW91IGVudGVyZWQgYXJlIG5vdCBpZGVudGljYWxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWdpc3RlcigkKCBldi50YXJnZXQgKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgSXNzdWVUcmFja2VyIGZyb20gJy4vSXNzdWVUcmFja2VyJztcclxuXHJcbmxldCBpc3N1ZVRyYWNrZXIgPSBuZXcgSXNzdWVUcmFja2VyKCk7XHJcbi8vY29uc29sZS5sb2coSXNzdWVUcmFja2VyKTtcclxuLy92YXIgW2EsIGIsIGNdID0gWzEgLCAyLCAzXTtcclxuIl19
