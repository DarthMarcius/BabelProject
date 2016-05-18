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
                    var deserializedData = _this5.deserializeForm(serialized);
                    var estimatedMinutes = _this5.convertEstimate(deserializedData.originalEstimate);

                    if (!estimatedMinutes) {
                        $(".original-estimate-group").addClass("has-error");
                        return;
                    }

                    deserializedData.originalEstimate = estimatedMinutes;
                    _this5.createIssue(deserializedData);
                    console.log(deserializedData);
                });
            }

            this.socket.on("updateIssues", function (data) {
                console.log(data);
                if (data.project == resources.project) {
                    _this5.populateProjectPage(resources.project);
                }
            });
        }
    }, {
        key: "issueListeners",
        value: function issueListeners() {
            var _this6 = this;

            if (this.addComment) {
                this.addComment.on("click", function (ev) {
                    _this6.addCommentModal.modal();
                });
            }

            if (this.addWrokLog) {
                this.addWrokLog.on("click", function (ev) {
                    _this6.addWorkLogModal.modal();
                });

                this.addWorkLogModal.on("show.bs.modal", function (ev) {
                    if (_this6.dateTimePicker) {
                        if (_this6.dateTimePicker.data('DateTimePicker')) {
                            _this6.dateTimePicker.data('DateTimePicker').date(new Date());
                        } else {
                            _this6.dateTimePicker.datetimepicker({
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
                _this6.createComment($(ev.target).serialize());
            });

            $("body").on("submit", this.updateWorklogFormSelector, function (ev) {
                ev.preventDefault();
                var serialized = $(ev.target).serialize();
                var deserializedData = _this6.deserializeForm(serialized);
                var estimatedMinutes = _this6.convertEstimate(deserializedData.timeSpent);
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

                _this6.updateWorklog(result);
            });

            this.socket.on("updateComments", function (data) {
                if (data.issue == window.resources.issue) {
                    _this6.populateIssueComments(window.resources.issue);
                }
            });

            this.socket.on("updateWorkLogs", function (data) {
                if (data.issue == window.resources.issue) {
                    _this6.populateIssueWorklogs(window.resources.issue);
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
                    _this6.deleteComment($(ev.target).serialize());
                });
            }

            if (this.updateCommentForm) {
                this.updateCommentForm.on("submit", function (ev) {
                    ev.preventDefault();
                    _this6.updateComment($(ev.target).serialize());
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
                var timeSpentNotation = _this6.minutesToString(timeSpent, "notation");

                $("#editWorklogModal").modal();
                $("#edit-work-log-id").val($currentItem.attr("data-work-log-id"));
                $("#edit-work-log-text").val($currentItem.find(".worklog-text").text().trim());
                $("#timeSpentUpdate").val(timeSpentNotation);

                if ($(_this6.dateTimePickerEditSelector).data('DateTimePicker')) {
                    $(_this6.dateTimePickerEditSelector).data('DateTimePicker').date(dateTime);
                } else {
                    $(_this6.dateTimePickerEditSelector).datetimepicker({
                        defaultDate: dateTime
                    });
                }
            });

            if (this.deleteWorklogForm) {
                this.deleteWorklogForm.on("submit", function (ev) {
                    ev.preventDefault();
                    _this6.deleteWorklog($(ev.target).serialize());
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
                var _minutes = remainder * 60;
                hours = hours - remainder;
                console.log(remainder);
                var resultString = hours < 1 ? parseInt(_minutes) + "m" : hours + "h" + " " + _minutes + "m";
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
            var _this7 = this;

            var workLogsPromise = this.getWorklogs(issueId);
            var $workLogsSection = $(".issue-page .issue-worklogs");

            workLogsPromise.then(function (data) {
                console.log("issues logs is:", data);
                data.forEach(function (workLog) {
                    workLog.timeSpentMinutes = workLog.timeSpent;
                    workLog.timeSpent = _this7.minutesToString(workLog.timeSpent);
                    workLog.dateStarted = new Date(workLog.dateStarted);
                    workLog.dateStarted = workLog.dateStarted.getMonth() + 1 + "/" + workLog.dateStarted.getDate() + "/" + workLog.dateStarted.getFullYear() + " " + workLog.dateStarted.getHours() + ":" + workLog.dateStarted.getMinutes();
                    //console.log("wl" +new Date(workLog.dateStarted))
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
            var _this8 = this;

            if (this.loginForm) {
                this.loginForm.on("submit", function (ev) {
                    ev.preventDefault();
                    _this8.login($(ev.target));
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
                    _this8.register($(ev.target));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRcXElzc3VlVHJhY2tlci5qcyIsInNjcmlwdFxcYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztJQ0FxQjtBQUNqQixhQURpQixZQUNqQixHQUFjOzhCQURHLGNBQ0g7O0FBQ1YsWUFBSSxTQUFTLE9BQU8sUUFBUCxDQUFnQixRQUFoQixJQUE0QixXQUE1QixHQUEwQyxzQkFBc0IsVUFBVSxJQUFWLEdBQWlCLGFBQWEsT0FBTyxRQUFQLENBQWdCLFFBQWhCLENBRGpHO0FBRVYsYUFBSyxNQUFMLEdBQWMsR0FBRyxNQUFILENBQWQsQ0FGVTtBQUdWLGFBQUssU0FBTCxHQUhVO0FBSVYsYUFBSyxPQUFMLEdBSlU7QUFLVixhQUFLLFlBQUwsR0FMVTtLQUFkOztpQkFEaUI7O29DQVNMO0FBQ1IsaUJBQUssbUJBQUwsR0FBMkIsRUFBRSxjQUFGLEVBQWtCLE1BQWxCLEdBQTJCLEVBQUUsY0FBRixDQUEzQixHQUErQyxLQUEvQyxDQURuQjtBQUVSLGlCQUFLLGtCQUFMLEdBQTBCLEVBQUUsa0JBQUYsRUFBc0IsTUFBdEIsR0FBK0IsRUFBRSxrQkFBRixDQUEvQixHQUF1RCxLQUF2RCxDQUZsQjtBQUdSLGlCQUFLLFNBQUwsR0FBaUIsRUFBRSxhQUFGLEVBQWlCLE1BQWpCLEdBQTBCLEVBQUUsYUFBRixDQUExQixHQUE2QyxLQUE3QyxDQUhUO0FBSVIsaUJBQUssZUFBTCxHQUF1QixFQUFFLGtCQUFGLENBQXZCLENBSlE7QUFLUixpQkFBSyxZQUFMLEdBQW9CLEVBQUUsZ0JBQUYsRUFBb0IsTUFBcEIsR0FBNkIsRUFBRSxnQkFBRixDQUE3QixHQUFtRCxLQUFuRCxDQUxaO0FBTVIsaUJBQUssa0JBQUwsR0FBMEIsRUFBRSx5QkFBRixDQUExQixDQU5RO0FBT1IsaUJBQUssaUJBQUwsR0FBeUIsRUFBRSxnQkFBRixFQUFvQixNQUFwQixHQUE2QixF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QzthQUFWLENBQTFCLENBR0MsS0FIRCxDQUdPLFVBQUMsS0FBRCxFQUFRLFVBQVIsRUFBdUI7QUFDMUIsd0JBQVEsR0FBUixDQUFZLHdCQUFaLEVBQXNDLEtBQXRDLEVBQTZDLFVBQTdDLEVBRDBCO0FBRTFCLHNCQUFNLHdCQUFOLEVBRjBCO2FBQXZCLENBSFAsQ0FyQmdCOzs7O29EQThCUTs7O0FBQ3hCLGdCQUFHLEtBQUssU0FBTCxFQUFnQjtBQUNmLHFCQUFLLFNBQUwsQ0FBZSxFQUFmLENBQWtCLFFBQWxCLEVBQTRCLFVBQUMsRUFBRCxFQUFRO0FBQ2hDLHVCQUFHLGNBQUgsR0FEZ0M7QUFFaEMsMkJBQUssS0FBTCxDQUFXLEVBQUcsR0FBRyxNQUFILENBQWQsRUFGZ0M7aUJBQVIsQ0FBNUIsQ0FEZTthQUFuQjs7QUFPQSxnQkFBRyxLQUFLLFlBQUwsRUFBbUI7QUFDbEIscUJBQUssWUFBTCxDQUFrQixFQUFsQixDQUFxQixRQUFyQixFQUErQixVQUFDLEVBQUQsRUFBUTtBQUNuQyx1QkFBRyxjQUFILEdBRG1DOztBQUduQyx3QkFBRyxFQUFFLFlBQUYsRUFBZ0IsR0FBaEIsTUFBeUIsRUFBRSxZQUFGLEVBQWdCLEdBQWhCLEVBQXpCLEVBQWdEO0FBQy9DLDBCQUFFLGFBQUYsRUFBaUIsUUFBakIsQ0FBMEIsV0FBMUIsRUFEK0M7QUFFL0MsOEJBQU0seUNBQU4sRUFGK0M7QUFHL0MsK0JBQU8sS0FBUCxDQUgrQztxQkFBbkQ7QUFLQSwyQkFBSyxRQUFMLENBQWMsRUFBRyxHQUFHLE1BQUgsQ0FBakIsRUFSbUM7aUJBQVIsQ0FBL0IsQ0FEa0I7YUFBdEI7Ozs7V0E1ckNhOzs7Ozs7OztBQ0FyQjs7Ozs7O0FBRUEsSUFBSSxlQUFlLDRCQUFmIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIElzc3VlVHJhY2tlciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBsZXQgaW9QYXRoID0gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lID09IFwibG9jYWxob3N0XCIgPyBcImh0dHA6Ly9sb2NhbGhvc3Q6XCIgKyByZXNvdXJjZXMucG9ydCA6IFwiaHR0cHM6Ly9cIiArIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZTtcclxuICAgICAgICB0aGlzLnNvY2tldCA9IGlvKGlvUGF0aCk7XHJcbiAgICAgICAgdGhpcy5pbml0Q2FjaGUoKTtcclxuICAgICAgICB0aGlzLmluaXREb20oKTtcclxuICAgICAgICB0aGlzLnNldExpc3RlbmVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRDYWNoZSgpIHtcclxuICAgICAgICB0aGlzLmNyZWF0ZVByb2plY3RCdXR0b24gPSAkKFwiLmFkZC1wcm9qZWN0XCIpLmxlbmd0aCA/ICQoXCIuYWRkLXByb2plY3RcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmNyZWF0ZVByb2plY3RNb2RhbCA9ICQoXCIjYWRkUHJvamVjdE1vZGFsXCIpLmxlbmd0aCA/ICQoXCIjYWRkUHJvamVjdE1vZGFsXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5sb2dpbkZvcm0gPSAkKFwiLmxvZ2luLWZvcm1cIikubGVuZ3RoID8gJChcIi5sb2dpbi1mb3JtXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5sb2dpbkVycm9yTW9kYWwgPSAkKFwiI0xvZ2luRXJyb3JNb2RhbFwiKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyRm9ybSA9ICQoXCIucmVnaXN0ZXItZm9ybVwiKS5sZW5ndGggPyAkKFwiLnJlZ2lzdGVyLWZvcm1cIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXJyb3JNb2RhbCA9ICQoXCIjUmVnaXN0cmF0aW9uRXJyb3JNb2RhbFwiKTtcclxuICAgICAgICB0aGlzLmFkZE5ld1Byb2plY3RGb3JtID0gJChcIiNhZGROZXdQcm9qZWN0XCIpLmxlbmd0aCA/ICQoXCIjYWRkTmV3UHJvamVjdFwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucHJvamVjdHNQYWdlID0gJChcIi5wcm9qZWN0cy1wYWdlXCIpLmxlbmd0aCA/ICQoXCIucHJvamVjdHMtcGFnZVwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucHJvamVjdHNTZWN0aW9uID0gJChcIi5wcm9qZWN0cy1zZWN0aW9uXCIpO1xyXG4gICAgICAgIHRoaXMucHJvamVjdEVkaXRTZWxlY3RvciA9IFwiLnByb2plY3QtZWRpdFwiO1xyXG4gICAgICAgIHRoaXMucHJvamVjdERlbGV0ZVNlbGVjdG9yID0gXCIucHJvamVjdC1kZWxldGVcIjtcclxuICAgICAgICB0aGlzLmRlbGV0ZVByb2plY3RGb3JtU2VsZWN0b3IgPSBcIiNkZWxldGVQcm9qZWN0XCI7XHJcbiAgICAgICAgdGhpcy51cGRhdGVQcm9qZWN0Rm9ybVNlbGVjdG9yID0gXCIjdXBkYXRlUHJvamVjdFwiO1xyXG4gICAgICAgIHRoaXMucHJvamVjdFBhZ2UgPSAkKFwiLnByb2plY3QtcGFnZVwiKS5sZW5ndGggPyAkKFwiLnByb2plY3QtcGFnZVwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuaXNzdWVQYWdlID0gJChcIi5pc3N1ZS1wYWdlXCIpLmxlbmd0aCA/ICQoXCIuaXNzdWUtcGFnZVwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYWRkSXNzdWUgPSAkKFwiLmFkZC1pc3N1ZVwiKTtcclxuICAgICAgICB0aGlzLmFkZElzc3VlRm9ybSA9ICQoXCIjYWRkTmV3SXNzdWVcIikubGVuZ3RoID8gJChcIiNhZGROZXdJc3N1ZVwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlSXNzdWVGb3JtID0gJChcIiN1cGRhdGVJc3N1ZVwiKS5sZW5ndGggPyAkKFwiI3VwZGF0ZUlzc3VlXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5kZWxldGVJc3N1ZUZvcm0gPSAkKFwiI2RlbGV0ZUlzc3VlXCIpLmxlbmd0aCA/ICQoXCIjZGVsZXRlSXNzdWVcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmlzc3VlRWRpdFNlbGVjdG9yID0gXCIuaXNzdWUtZWRpdFwiO1xyXG4gICAgICAgIHRoaXMuaXNzdWVEZWxldGVTZWxlY3RvciA9IFwiLmlzc3VlLWRlbGV0ZVwiO1xyXG4gICAgICAgIHRoaXMuYWRkQ29tbWVudCA9ICQoXCIubmV3LWNvbW1lbnRcIikubGVuZ3RoID8gJChcIi5uZXctY29tbWVudFwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYWRkV3Jva0xvZyA9ICQoXCIubmV3LXdvcmtsb2dcIikubGVuZ3RoID8gJChcIi5uZXctd29ya2xvZ1wiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYWRkQ29tbWVudE1vZGFsID0gJChcIiNhZGRDb21tZW50TW9kYWxcIik7XHJcbiAgICAgICAgdGhpcy5hZGRXb3JrTG9nTW9kYWwgPSAkKFwiI2FkZFdvcmtMb2dNb2RhbFwiKTtcclxuICAgICAgICB0aGlzLmFkZE5ld0NvbW1lbnRGb3JtU2VsZWN0b3IgPSBcIiNhZGROZXdDb21tZW50XCI7XHJcbiAgICAgICAgdGhpcy5hZGROZXdXb3JrbG9nRm9ybVNlbGVjdG9yID0gXCIjYWRkTmV3V29ya2xvZ1wiO1xyXG4gICAgICAgIHRoaXMudXBkYXRlV29ya2xvZ0Zvcm1TZWxlY3RvciA9IFwiI3VwZGF0ZVdvcmtsb2dcIjtcclxuICAgICAgICB0aGlzLmRhdGVUaW1lUGlja2VyID0gJChcIiN3b3JrLWxvZy1kYXRldGltZXBpY2tlclwiKS5sZW5ndGggPyAkKFwiI3dvcmstbG9nLWRhdGV0aW1lcGlja2VyXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5kYXRlVGltZVBpY2tlckVkaXRTZWxlY3RvciA9IFwiI3dvcmstbG9nLWRhdGV0aW1lcGlja2VyLWVkaXRcIjtcclxuICAgICAgICB0aGlzLmVkaXRDb21tZW50VGh1bWJTZWxlY3RvciA9IFwiLmVkaXQtY29tbWVudFwiO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlQ29tbWVudFRodW1iU2VsZWN0b3IgPSBcIi5kZWxldGUtY29tbWVudFwiO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlQ29tbWVudEZvcm0gPSAkKFwiI2RlbGV0ZUNvbW1lbnRcIikubGVuZ3RoID8gJChcIiNkZWxldGVDb21tZW50XCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDb21tZW50Rm9ybSA9ICQoXCIjdXBkYXRlQ29tbWVudFwiKS5sZW5ndGggPyAkKFwiI3VwZGF0ZUNvbW1lbnRcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmRlbGV0ZVdvcmtsb2dCdXR0b25TZWxlY3RvciA9IFwiLmRlbGV0ZS13b3JrLWxvZ1wiO1xyXG4gICAgICAgIHRoaXMuZWRpV29ya2xvZ0J1dHRvblNlbGVjdG9yID0gXCIuZWRpdC13b3JrLWxvZ1wiO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlV29ya2xvZ0Zvcm0gPSAkKFwiI2RlbGV0ZVdvcmtsb2dcIikubGVuZ3RoID8gJChcIiNkZWxldGVXb3JrbG9nXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5lZGl0V29ya2xvZ0Zvcm0gPSAkKFwiI3VwZGF0ZVdvcmtsb2dcIikubGVuZ3RoID8gJChcIiN1cGRhdGVXb3JrbG9nXCIpIDogZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdERvbSgpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgbG9naW4oJHRhcmdldCkge1xyXG4gICAgICAgIGxldCBkYXRhID0gJHRhcmdldC5zZXJpYWxpemUoKTtcclxuICAgICAgICAvKmxldCBuYW1lID0gZGF0YVswXS52YWx1ZTtcclxuICAgICAgICBsZXQgcGFzc3dvcmQgPSBkYXRhWzFdLnZhbHVlOyovXHJcbiAgICAgICAgbGV0IGxvZ2luUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2xvZ2luXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxvZ2luUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGRhdGEucmVkaXJlY3RUbztcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5sb2dpbkVycm9yTW9kYWwubW9kYWwoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZWdpc3RlcigkdGFyZ2V0KSB7XHJcbiAgICAgICAgbGV0IGRhdGEgPSAkdGFyZ2V0LnNlcmlhbGl6ZSgpO1xyXG4gICAgICAgIC8qbGV0IG5hbWUgPSBkYXRhWzBdLnZhbHVlO1xyXG4gICAgICAgIGxldCBwYXNzd29yZCA9IGRhdGFbMV0udmFsdWU7Ki9cclxuICAgICAgICBsZXQgcmVnaXN0ZXJQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvcmVnaXN0ZXJcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmVnaXN0ZXJQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzIHJlZzpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGRhdGEucmVkaXJlY3RUbztcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2dpbiBlcnJvclwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFcnJvck1vZGFsLm1vZGFsKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0TGlzdGVuZXJzKCkge1xyXG4gICAgICAgIHRoaXMubG9naW5BbmRSZWdpc3Rlckxpc3RlbmVycygpO1xyXG4gICAgICAgIHRoaXMucHJvamVjdHNMaXN0ZW5lcnMoKTtcclxuICAgICAgICB0aGlzLmlzc3VlTGlzdGVuZXJzKCk7XHJcblxyXG4gICAgICAgICQod2luZG93KS5sb2FkKCgpID0+IHtcclxuICAgICAgICAgICAgaWYodGhpcy5wcm9qZWN0c1BhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9wdWxhdGVQcm9qZWN0c1BhZ2UoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYodGhpcy5wcm9qZWN0UGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZVByb2plY3RQYWdlKHdpbmRvdy5yZXNvdXJjZXMucHJvamVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMuaXNzdWVQYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvcHVsYXRlSXNzdWVQYWdlKHdpbmRvdy5yZXNvdXJjZXMuaXNzdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvamVjdHNMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgaWYodGhpcy5jcmVhdGVQcm9qZWN0QnV0dG9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUHJvamVjdEJ1dHRvbi5vbihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUHJvamVjdE1vZGFsLm1vZGFsKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5hZGROZXdQcm9qZWN0Rm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZE5ld1Byb2plY3RGb3JtLm9uKCdzdWJtaXQnLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVByb2plY3QoJChldi50YXJnZXQpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIHRoaXMucHJvamVjdEVkaXRTZWxlY3RvciwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBsZXQgJHBhcmVudCA9ICQoZXYudGFyZ2V0KS5jbG9zZXN0KFwidHJcIik7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0SWQgPSAkcGFyZW50LmF0dHIoXCJkYXRhLXByb2plY3QtaWRcIik7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0TmFtZSA9ICRwYXJlbnQuZmluZChcIi5wci1uYW1lXCIpLmh0bWwoKTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3REZXNjcmlwdGlvbiA9ICRwYXJlbnQuZmluZChcIi5wci1kZXNjcmlwdGlvblwiKS5odG1sKCk7XHJcblxyXG4gICAgICAgICAgICAkKFwiI2VkaXRQcm9qZWN0TW9kYWxcIikubW9kYWwoKTtcclxuICAgICAgICAgICAgJChcIiN1cGRhdGVlLXByb2plY3QtaWRcIikudmFsKHByb2plY3RJZCk7XHJcbiAgICAgICAgICAgICQoXCIjbmV3LXByb2plY3QtbmFtZVwiKS52YWwocHJvamVjdE5hbWUpO1xyXG4gICAgICAgICAgICAkKFwiI25ldy1kZXNjcmlwdGlvblwiKS52YWwocHJvamVjdERlc2NyaXB0aW9uKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCB0aGlzLnByb2plY3REZWxldGVTZWxlY3RvciwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdElkID0gJChldi50YXJnZXQpLmNsb3Nlc3QoXCJ0clwiKS5hdHRyKFwiZGF0YS1wcm9qZWN0LWlkXCIpO1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZVByb2plY3RNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZS1wcm9qZWN0LWlkXCIpLnZhbChwcm9qZWN0SWQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcInN1Ym1pdFwiLCB0aGlzLmRlbGV0ZVByb2plY3RGb3JtU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZVByb2plY3QoJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJzdWJtaXRcIiwgdGhpcy51cGRhdGVQcm9qZWN0Rm9ybVNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQcm9qZWN0KCQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgdGhpcy5pc3N1ZUVkaXRTZWxlY3RvciwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBsZXQgJHBhcmVudCA9ICQoZXYudGFyZ2V0KS5jbG9zZXN0KFwidHJcIik7XHJcbiAgICAgICAgICAgIGxldCBpc3N1ZUlkID0gJHBhcmVudC5hdHRyKFwiZGF0YS1pc3N1ZS1pZFwiKTtcclxuICAgICAgICAgICAgbGV0IGlzc3VlTmFtZSA9ICRwYXJlbnQuZmluZChcIi5pc3N1ZS1uYW1lXCIpLmh0bWwoKTtcclxuICAgICAgICAgICAgbGV0IGlzc3VlRGVzY3JpcHRpb24gPSAkcGFyZW50LmZpbmQoXCIuaXNzdWUtZGVzY3JpcHRpb25cIikuaHRtbCgpO1xyXG5cclxuICAgICAgICAgICAgJChcIiNlZGl0SXNzdWVNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgICAgICAkKFwiI3VwZGF0ZWUtaXNzdWUtaWRcIikudmFsKGlzc3VlSWQpO1xyXG4gICAgICAgICAgICAkKFwiI25ldy1pc3N1ZS1uYW1lXCIpLnZhbChpc3N1ZU5hbWUpO1xyXG4gICAgICAgICAgICAkKFwiI25ldy1kZXNjcmlwdGlvblwiKS52YWwoaXNzdWVEZXNjcmlwdGlvbik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgdGhpcy5pc3N1ZURlbGV0ZVNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaGVyZVwiKVxyXG4gICAgICAgICAgICBsZXQgaXNzdWVJZCA9ICQoZXYudGFyZ2V0KS5jbG9zZXN0KFwidHJcIikuYXR0cihcImRhdGEtaXNzdWUtaWRcIik7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlSXNzdWVNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZS1pc3N1ZS1pZFwiKS52YWwoaXNzdWVJZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuZGVsZXRlSXNzdWVGb3JtKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlSXNzdWVGb3JtLm9uKFwic3VibWl0XCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlSXNzdWUoJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLnVwZGF0ZUlzc3VlRm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUlzc3VlRm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUlzc3VlKCQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5wcm9qZWN0LWl0ZW1cIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCAkdGFyZ2V0ID0gJChldi50YXJnZXQpLmNsb3Nlc3QoXCIucHJvamVjdC1pdGVtXCIpO1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL3Byb2plY3QvXCIgKyAkdGFyZ2V0LmF0dHIoXCJkYXRhLXByb2plY3QtaWRcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgXCIuaXNzdWUtaXRlbVwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgbGV0ICR0YXJnZXQgPSAkKGV2LnRhcmdldCkuY2xvc2VzdChcIi5pc3N1ZS1pdGVtXCIpO1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL2lzc3VlL1wiICsgJHRhcmdldC5hdHRyKFwiZGF0YS1pc3N1ZS1pZFwiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJ1cGRhdGVQcm9qZWN0c1wiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVQcm9qZWN0c1BhZ2UoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRJc3N1ZS5vbihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygkKFwiI2FkZElzc3VlTW9kYWxcIikpXHJcbiAgICAgICAgICAgICQoXCIjYWRkSXNzdWVNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZih0aGlzLmFkZElzc3VlRm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZElzc3VlRm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VyaWFsaXplZCA9ICQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKTtcclxuICAgICAgICAgICAgICAgIGxldCBkZXNlcmlhbGl6ZWREYXRhID0gdGhpcy5kZXNlcmlhbGl6ZUZvcm0oc2VyaWFsaXplZCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZXN0aW1hdGVkTWludXRlcyA9IHRoaXMuY29udmVydEVzdGltYXRlKGRlc2VyaWFsaXplZERhdGEub3JpZ2luYWxFc3RpbWF0ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoIWVzdGltYXRlZE1pbnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiLm9yaWdpbmFsLWVzdGltYXRlLWdyb3VwXCIpLmFkZENsYXNzKFwiaGFzLWVycm9yXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBkZXNlcmlhbGl6ZWREYXRhLm9yaWdpbmFsRXN0aW1hdGUgPSBlc3RpbWF0ZWRNaW51dGVzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVJc3N1ZShkZXNlcmlhbGl6ZWREYXRhKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRlc2VyaWFsaXplZERhdGEpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJ1cGRhdGVJc3N1ZXNcIiwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIGlmKGRhdGEucHJvamVjdCA9PSByZXNvdXJjZXMucHJvamVjdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZVByb2plY3RQYWdlKHJlc291cmNlcy5wcm9qZWN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlzc3VlTGlzdGVuZXJzKCkge1xyXG4gICAgICAgIGlmKHRoaXMuYWRkQ29tbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZENvbW1lbnQub24oXCJjbGlja1wiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ29tbWVudE1vZGFsLm1vZGFsKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5hZGRXcm9rTG9nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkV3Jva0xvZy5vbihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRXb3JrTG9nTW9kYWwubW9kYWwoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFkZFdvcmtMb2dNb2RhbC5vbihcInNob3cuYnMubW9kYWxcIiwgKGV2KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5kYXRlVGltZVBpY2tlcikge1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmRhdGVUaW1lUGlja2VyLmRhdGEoJ0RhdGVUaW1lUGlja2VyJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVQaWNrZXIuZGF0YSgnRGF0ZVRpbWVQaWNrZXInKS5kYXRlKG5ldyBEYXRlKCkpO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lUGlja2VyLmRhdGV0aW1lcGlja2VyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0RGF0ZTogbmV3IERhdGUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKiQoXCIjZGF0ZS10aW1lLXBpY2tlci1pbnB1dFwiKS5mb2N1cygoZXYpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIuaW5wdXQtZ3JvdXAtYWRkb25cIikuY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7Ki9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJzdWJtaXRcIiwgdGhpcy5hZGROZXdDb21tZW50Rm9ybVNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVDb21tZW50KCQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwic3VibWl0XCIsIHRoaXMuYWRkTmV3V29ya2xvZ0Zvcm1TZWxlY3RvciwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGxldCBzZXJpYWxpemVkID0gJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpO1xyXG4gICAgICAgICAgICBsZXQgZGVzZXJpYWxpemVkRGF0YSA9IHRoaXMuZGVzZXJpYWxpemVGb3JtKHNlcmlhbGl6ZWQpO1xyXG4gICAgICAgICAgICBsZXQgZXN0aW1hdGVkTWludXRlcyA9IHRoaXMuY29udmVydEVzdGltYXRlKGRlc2VyaWFsaXplZERhdGEudGltZVNwZW50KTtcclxuICAgICAgICAgICAgbGV0IGxvZ0RhdGVUaW1lID0gbmV3IERhdGUoJChcIiNkYXRlLXRpbWUtcGlja2VyLWlucHV0XCIpLnZhbCgpKTtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBPYmplY3QoKTtcclxuXHJcbiAgICAgICAgICAgIGlmKCFsb2dEYXRlVGltZSB8fCBsb2dEYXRlVGltZSA9PT0gXCJJbnZhbGlkIERhdGVcIikge1xyXG4gICAgICAgICAgICAgICAgJChcIi5sb2ctZGF0ZS10aW1lXCIpLmFkZENsYXNzKFwiaGFzLWVycm9yXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZighZXN0aW1hdGVkTWludXRlcykge1xyXG4gICAgICAgICAgICAgICAgJChcIi50aW1lLXNwZW50LWdyb3VwXCIpLmFkZENsYXNzKFwiaGFzLWVycm9yXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXN1bHQuZXN0aW1hdGVkTWludXRlcyA9IGVzdGltYXRlZE1pbnV0ZXM7XHJcbiAgICAgICAgICAgIHJlc3VsdC5sb2dEYXRlVGltZSA9IGxvZ0RhdGVUaW1lO1xyXG4gICAgICAgICAgICByZXN1bHQudGV4dCA9IGRlc2VyaWFsaXplZERhdGEudGV4dDtcclxuICAgICAgICAgICAgcmVzdWx0LmNyZWF0b3IgPSBkZXNlcmlhbGl6ZWREYXRhLmNyZWF0b3I7XHJcbiAgICAgICAgICAgIHJlc3VsdC5pc3N1ZUlkID0gZGVzZXJpYWxpemVkRGF0YS5pc3N1ZUlkO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVXb3JrbG9nKHJlc3VsdCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkSXNzdWUub24oXCJjbGlja1wiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJChcIiNhZGRJc3N1ZU1vZGFsXCIpKVxyXG4gICAgICAgICAgICAkKFwiI2FkZElzc3VlTW9kYWxcIikubW9kYWwoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5hZGRJc3N1ZUZvcm0pIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRJc3N1ZUZvcm0ub24oXCJzdWJtaXRcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlcmlhbGl6ZWQgPSAkKGV2LnRhcmdldCkuc2VyaWFsaXplKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGVzZXJpYWxpemVkRGF0YSA9IHRoaXMuZGVzZXJpYWxpemVGb3JtKHNlcmlhbGl6ZWQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGVzdGltYXRlZE1pbnV0ZXMgPSB0aGlzLmNvbnZlcnRFc3RpbWF0ZShkZXNlcmlhbGl6ZWREYXRhLm9yaWdpbmFsRXN0aW1hdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCFlc3RpbWF0ZWRNaW51dGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcIi5vcmlnaW5hbC1lc3RpbWF0ZS1ncm91cFwiKS5hZGRDbGFzcyhcImhhcy1lcnJvclwiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZGVzZXJpYWxpemVkRGF0YS5vcmlnaW5hbEVzdGltYXRlID0gZXN0aW1hdGVkTWludXRlcztcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlSXNzdWUoZGVzZXJpYWxpemVkRGF0YSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkZXNlcmlhbGl6ZWREYXRhKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc29ja2V0Lm9uKFwidXBkYXRlSXNzdWVzXCIsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICBpZihkYXRhLnByb2plY3QgPT0gcmVzb3VyY2VzLnByb2plY3QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9wdWxhdGVQcm9qZWN0UGFnZShyZXNvdXJjZXMucHJvamVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpc3N1ZUxpc3RlbmVycygpIHtcclxuICAgICAgICBpZih0aGlzLmFkZENvbW1lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRDb21tZW50Lm9uKFwiY2xpY2tcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZENvbW1lbnRNb2RhbC5tb2RhbCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMuYWRkV3Jva0xvZykge1xyXG4gICAgICAgICAgICB0aGlzLmFkZFdyb2tMb2cub24oXCJjbGlja1wiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkV29ya0xvZ01vZGFsLm1vZGFsKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hZGRXb3JrTG9nTW9kYWwub24oXCJzaG93LmJzLm1vZGFsXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5kYXRlVGltZVBpY2tlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZGF0ZVRpbWVQaWNrZXIuZGF0YSgnRGF0ZVRpbWVQaWNrZXInKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lUGlja2VyLmRhdGEoJ0RhdGVUaW1lUGlja2VyJykuZGF0ZShuZXcgRGF0ZSgpKTtcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVQaWNrZXIuZGF0ZXRpbWVwaWNrZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdERhdGU6IG5ldyBEYXRlKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiQoXCIjZGF0ZS10aW1lLXBpY2tlci1pbnB1dFwiKS5mb2N1cygoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJChcIi5pbnB1dC1ncm91cC1hZGRvblwiKS5jbGljaygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pOyovXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcInN1Ym1pdFwiLCB0aGlzLmFkZE5ld0NvbW1lbnRGb3JtU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUNvbW1lbnQoJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJzdWJtaXRcIiwgdGhpcy51cGRhdGVXb3JrbG9nRm9ybVNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgbGV0IHNlcmlhbGl6ZWQgPSAkKGV2LnRhcmdldCkuc2VyaWFsaXplKCk7XHJcbiAgICAgICAgICAgIGxldCBkZXNlcmlhbGl6ZWREYXRhID0gdGhpcy5kZXNlcmlhbGl6ZUZvcm0oc2VyaWFsaXplZCk7XHJcbiAgICAgICAgICAgIGxldCBlc3RpbWF0ZWRNaW51dGVzID0gdGhpcy5jb252ZXJ0RXN0aW1hdGUoZGVzZXJpYWxpemVkRGF0YS50aW1lU3BlbnQpO1xyXG4gICAgICAgICAgICBsZXQgbG9nRGF0ZVRpbWUgPSBuZXcgRGF0ZSgkKFwiI2RhdGUtdGltZS1waWNrZXItdXBkYXRlLWlucHV0XCIpLnZhbCgpKTtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBPYmplY3QoKTtcclxuXHJcbiAgICAgICAgICAgIGlmKCFsb2dEYXRlVGltZSB8fCBsb2dEYXRlVGltZSA9PT0gXCJJbnZhbGlkIERhdGVcIikge1xyXG4gICAgICAgICAgICAgICAgJChcIi5sb2ctZGF0ZS10aW1lLXVwZGF0ZVwiKS5hZGRDbGFzcyhcImhhcy1lcnJvclwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoIWVzdGltYXRlZE1pbnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgICQoXCIudXBkYXRlLXRpbWUtc3BlbnQtZ3JvdXBcIikuYWRkQ2xhc3MoXCJoYXMtZXJyb3JcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlc3VsdC5lc3RpbWF0ZWRNaW51dGVzID0gZXN0aW1hdGVkTWludXRlcztcclxuICAgICAgICAgICAgcmVzdWx0LmxvZ0RhdGVUaW1lID0gbG9nRGF0ZVRpbWU7XHJcbiAgICAgICAgICAgIHJlc3VsdC50ZXh0ID0gZGVzZXJpYWxpemVkRGF0YS50ZXh0O1xyXG4gICAgICAgICAgICByZXN1bHQuaXNzdWVJZCA9IGRlc2VyaWFsaXplZERhdGEuaXNzdWVJZDtcclxuICAgICAgICAgICAgcmVzdWx0Lndvcmtsb2dJZCA9IGRlc2VyaWFsaXplZERhdGEud29ya2xvZ0lkO1xyXG5cclxuICAgICAgICAgICAgdGhpcy51cGRhdGVXb3JrbG9nKHJlc3VsdCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc29ja2V0Lm9uKFwidXBkYXRlQ29tbWVudHNcIiwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgaWYoZGF0YS5pc3N1ZSA9PSB3aW5kb3cucmVzb3VyY2VzLmlzc3VlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvcHVsYXRlSXNzdWVDb21tZW50cyh3aW5kb3cucmVzb3VyY2VzLmlzc3VlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNvY2tldC5vbihcInVwZGF0ZVdvcmtMb2dzXCIsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGRhdGEuaXNzdWUgPT0gd2luZG93LnJlc291cmNlcy5pc3N1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUlzc3VlV29ya2xvZ3Mod2luZG93LnJlc291cmNlcy5pc3N1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCB0aGlzLmRlbGV0ZUNvbW1lbnRUaHVtYlNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgJChcIiNkZWxldGVDb21tZW50TW9kYWxcIikubW9kYWwoKTtcclxuICAgICAgICAgICAgJChcIiNkZWxldGUtY29tbWVudC1pZFwiKS52YWwoJChldi50YXJnZXQpLmNsb3Nlc3QoXCIuY29tbWVudC1pdGVtXCIpLmF0dHIoXCJkYXRhLWNvbW1lbnQtaWRcIikpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIHRoaXMuZWRpdENvbW1lbnRUaHVtYlNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgJChcIiNlZGl0Q29tbWVudE1vZGFsXCIpLm1vZGFsKCk7XHJcbiAgICAgICAgICAgICQoXCIjZWRpdC1jb21tZW50LWlkXCIpLnZhbCgkKGV2LnRhcmdldCkuY2xvc2VzdChcIi5jb21tZW50LWl0ZW1cIikuYXR0cihcImRhdGEtY29tbWVudC1pZFwiKSk7XHJcbiAgICAgICAgICAgICQoXCIjY29tbWVudC10ZXh0XCIpLnZhbCgkKGV2LnRhcmdldCkuY2xvc2VzdChcIi5jb21tZW50LWl0ZW1cIikuZmluZChcIi5wYW5lbC1ib2R5XCIpLnRleHQoKS50cmltKCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZih0aGlzLmRlbGV0ZUNvbW1lbnRGb3JtKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlQ29tbWVudEZvcm0ub24oXCJzdWJtaXRcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWxldGVDb21tZW50KCQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy51cGRhdGVDb21tZW50Rm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNvbW1lbnRGb3JtLm9uKFwic3VibWl0XCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ29tbWVudCgkKGV2LnRhcmdldCkuc2VyaWFsaXplKCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgdGhpcy5kZWxldGVXb3JrbG9nQnV0dG9uU2VsZWN0b3IsIChldikgPT4ge2NvbnNvbGUubG9nKFwid2hhMVwiKVxyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZVdvcmtsb2dNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZS13b3JrLWxvZy1pZFwiKS52YWwoJChldi50YXJnZXQpLmNsb3Nlc3QoXCIud29yay1sb2ctaXRlbVwiKS5hdHRyKFwiZGF0YS13b3JrLWxvZy1pZFwiKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgdGhpcy5lZGlXb3JrbG9nQnV0dG9uU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBsZXQgJGN1cnJlbnRJdGVtID0gJChldi50YXJnZXQpLmNsb3Nlc3QoXCIud29yay1sb2ctaXRlbVwiKTtcclxuICAgICAgICAgICAgbGV0IGRhdGVUaW1lID0gJGN1cnJlbnRJdGVtLmZpbmQoXCIud29yay1sb2ctaW5mb1wiKS5odG1sKCkuc3BsaXQoXCItIFwiKVsxXTtcclxuICAgICAgICAgICAgbGV0IHRpbWVTcGVudCA9ICRjdXJyZW50SXRlbS5maW5kKFwiLnRpbWUtc3BlbnRcIikuYXR0cihcImRhdGEtbWludXRlc1wiKTtcclxuICAgICAgICAgICAgbGV0IHRpbWVTcGVudE5vdGF0aW9uID0gdGhpcy5taW51dGVzVG9TdHJpbmcodGltZVNwZW50LCBcIm5vdGF0aW9uXCIpO1xyXG5cclxuICAgICAgICAgICAgJChcIiNlZGl0V29ya2xvZ01vZGFsXCIpLm1vZGFsKCk7XHJcbiAgICAgICAgICAgICQoXCIjZWRpdC13b3JrLWxvZy1pZFwiKS52YWwoJGN1cnJlbnRJdGVtLmF0dHIoXCJkYXRhLXdvcmstbG9nLWlkXCIpKTtcclxuICAgICAgICAgICAgJChcIiNlZGl0LXdvcmstbG9nLXRleHRcIikudmFsKCRjdXJyZW50SXRlbS5maW5kKFwiLndvcmtsb2ctdGV4dFwiKS50ZXh0KCkudHJpbSgpKTtcclxuICAgICAgICAgICAgJChcIiN0aW1lU3BlbnRVcGRhdGVcIikudmFsKHRpbWVTcGVudE5vdGF0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIGlmKCQodGhpcy5kYXRlVGltZVBpY2tlckVkaXRTZWxlY3RvcikuZGF0YSgnRGF0ZVRpbWVQaWNrZXInKSkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzLmRhdGVUaW1lUGlja2VyRWRpdFNlbGVjdG9yKS5kYXRhKCdEYXRlVGltZVBpY2tlcicpLmRhdGUoZGF0ZVRpbWUpO1xyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMuZGF0ZVRpbWVQaWNrZXJFZGl0U2VsZWN0b3IpLmRhdGV0aW1lcGlja2VyKHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0RGF0ZTogZGF0ZVRpbWVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuZGVsZXRlV29ya2xvZ0Zvcm0pIHtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVXb3JrbG9nRm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZVdvcmtsb2coJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRlc2VyaWFsaXplRm9ybShzZXJpYWxpemVkRm9ybURhdGEpIHtcclxuICAgICAgICBsZXQgc2VyaWFsaXplZERhdGFBcnJheSA9IHNlcmlhbGl6ZWRGb3JtRGF0YS5zcGxpdChcIiZcIik7XHJcbiAgICAgICAgbGV0IGRlc2VyaWFsaXplZERhdGEgPSBuZXcgT2JqZWN0KCk7XHJcbiAgICAgICAgbGV0IGl0ZW1TcGxpdDtcclxuXHJcbiAgICAgICAgZm9yKGxldCBsZW5ndGggPSBzZXJpYWxpemVkRGF0YUFycmF5Lmxlbmd0aCwgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBzZXJpYWxpemVkRGF0YUFycmF5W2ldID0gc2VyaWFsaXplZERhdGFBcnJheVtpXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpO1xyXG5cclxuICAgICAgICAgICAgaXRlbVNwbGl0ID0gc2VyaWFsaXplZERhdGFBcnJheVtpXS5zcGxpdChcIj1cIik7XHJcbiAgICAgICAgICAgIGRlc2VyaWFsaXplZERhdGFbaXRlbVNwbGl0WzBdXSA9IGl0ZW1TcGxpdFsxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlc2VyaWFsaXplZERhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgY29udmVydEVzdGltYXRlKGVzdGltYXRlU3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IHJlZ2V4cCA9IC8oXlxcZCpoIFxcZCptJCl8KF5cXGQqKFxcLlxcZCspP2gkKXwoXlxcZCptJCkvOyAvKmUuZyAxaCAzMG0gb3IgMzBtIG9yIDEuNWgqL1xyXG4gICAgICAgIGxldCBtYXRjaCA9IGVzdGltYXRlU3RyaW5nLm1hdGNoKHJlZ2V4cCk7XHJcbiAgICAgICAgbGV0IG1hdGNoU3BsaXQ7XHJcbiAgICAgICAgbGV0IHNwbGl0TGVuZ3RoO1xyXG4gICAgICAgIGxldCBob3VycztcclxuICAgICAgICBsZXQgbWludXRlcyA9IDA7XHJcbiAgICAgICAgbGV0IGFkZGl0aW9uYWxNaW51dGVzID0gMDtcclxuXHJcbiAgICAgICAgaWYoIW1hdGNoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1hdGNoID0gbWF0Y2hbMF07XHJcbiAgICAgICAgbWF0Y2hTcGxpdCA9IG1hdGNoLnNwbGl0KFwiIFwiKTtcclxuICAgICAgICBzcGxpdExlbmd0aCA9IG1hdGNoU3BsaXQubGVuZ3RoO1xyXG5cclxuICAgICAgICBpZihzcGxpdExlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgIGxldCBpbmRleE9mTSA9IG1hdGNoU3BsaXRbMF0uaW5kZXhPZihcIm1cIik7XHJcbiAgICAgICAgICAgIGxldCBpbmRleE9mSCA9IG1hdGNoU3BsaXRbMF0uaW5kZXhPZihcImhcIik7XHJcblxyXG4gICAgICAgICAgICBpZihpbmRleE9mTSAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgbWludXRlcyA9IG1hdGNoU3BsaXRbMF0uc2xpY2UoMCwgaW5kZXhPZk0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihpbmRleE9mSCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgaG91cnMgPSBtYXRjaFNwbGl0WzBdLnNsaWNlKDAsIGluZGV4T2ZIKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgbGV0IGluZGV4T2ZIID0gbWF0Y2hTcGxpdFswXS5pbmRleE9mKFwiaFwiKTtcclxuICAgICAgICAgICAgbGV0IGluZGV4T2ZNID0gbWF0Y2hTcGxpdFsxXS5pbmRleE9mKFwibVwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGluZGV4T2ZIICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBob3VycyA9IG1hdGNoU3BsaXRbMF0uc2xpY2UoMCwgaW5kZXhPZkgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZihpbmRleE9mTSAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgbWludXRlcyA9IG1hdGNoU3BsaXRbMV0uc2xpY2UoMCwgaW5kZXhPZk0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihob3Vycykge1xyXG4gICAgICAgICAgICBhZGRpdGlvbmFsTWludXRlcyA9IHBhcnNlSW50KDYwICogaG91cnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWludXRlcyA9IHBhcnNlSW50KG1pbnV0ZXMpO1xyXG4gICAgICAgIG1pbnV0ZXMgKz0gYWRkaXRpb25hbE1pbnV0ZXM7XHJcblxyXG4gICAgICAgIHJldHVybiBtaW51dGVzO1xyXG4gICAgfVxyXG5cclxuICAgIG1pbnV0ZXNUb1N0cmluZyhtaW51dGVzLCBub3RhdGlvbikge1xyXG4gICAgICAgIGxldCBob3VycyA9IG1pbnV0ZXMgLyA2MDtcclxuICAgICAgICBpZighbm90YXRpb24pIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdFN0cmluZyA9IGhvdXJzIDwgMSA/ICggKG1pbnV0ZXMgPT0gMSkgPyBwYXJzZUludChtaW51dGVzKSArIFwiIG1pbnV0ZVwiIDogcGFyc2VJbnQobWludXRlcykgKyBcIiBtaW51dGVzXCIgKSA6ICggKGhvdXJzID09IDEpID8gaG91cnMgKyBcIiBob3VyXCIgOiBob3VycyArIFwiIGhvdXJzXCIgKTtcclxuICAgICAgICAgICAgcmVzdWx0U3RyaW5nID0gJ1RpbWUgc3BlbnQ6ICcgKyByZXN1bHRTdHJpbmc7XHJcbiAgICAgICAgfSBlbHNlIGlmKG5vdGF0aW9uID09PSBcIm5vdGF0aW9uXCIpIHtcclxuICAgICAgICAgICAgbGV0IHJlbWFpbmRlciA9IGhvdXJzICUgMTtcclxuICAgICAgICAgICAgbGV0IG1pbnV0ZXMgPSByZW1haW5kZXIgKiA2MDtcclxuICAgICAgICAgICAgaG91cnMgPSBob3VycyAtIHJlbWFpbmRlcjtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVtYWluZGVyKVxyXG4gICAgICAgICAgICB2YXIgcmVzdWx0U3RyaW5nID0gaG91cnMgPCAxID8gcGFyc2VJbnQobWludXRlcykgKyBcIm1cIiA6IGhvdXJzICsgXCJoXCIgKyBcIiBcIiArIG1pbnV0ZXMgKyBcIm1cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHRTdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlQ29tbWVudChkYXRhKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSlcclxuICAgICAgICBsZXQgY3JlYXRlQ29tbWVudFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9jb21tZW50XCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY3JlYXRlQ29tbWVudFByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MgY3JlYXRpbmcgY29tbWVudDpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICQoXCIjYWRkQ29tbWVudE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciBkdXJpbmcgY29tbWVudCBjcmVhdGlvblwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZHVyaW5nIGNvbW1lbnQgY3JlYXRpb25cIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlSXNzdWUoZGF0YSkge1xyXG4gICAgICAgIGxldCBjcmVhdGVJc3N1ZVByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9pc3N1ZVwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MsIFwiLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNyZWF0ZUlzc3VlUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcyByZWc6XCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAkKFwiI2FkZElzc3VlTW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGR1cmluZyBwcm9qZWN0IGNyZWF0aW9uXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgaXNzdWUgY3JlYXRpb25cIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlUHJvamVjdChkYXRhKSB7XHJcbiAgICAgICAgbGV0IGRlbGV0ZVByb2plY3RQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvcHJvamVjdFwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVsZXRlUHJvamVjdFByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZVByb2plY3RNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgcmVtb3ZpbmcgcHJvamVjdFwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3Igd2hpbGUgcmVtb3ZpbmcgcHJvamVjdFwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVQcm9qZWN0KGRhdGEpIHtcclxuICAgICAgICBsZXQgdXBkYXRlUHJvamVjdFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9qZWN0XCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2VkaXRQcm9qZWN0TW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdXBkYXRlUHJvamVjdFByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZVByb2plY3RNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgcmVtb3ZpbmcgcHJvamVjdFwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgdXBkYXRpbmcgcHJvamVjdHNcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlSXNzdWUoZGF0YSkge1xyXG4gICAgICAgIGxldCBkZWxldGVJc3N1ZVByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9pc3N1ZVwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVsZXRlSXNzdWVQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgJChcIiNkZWxldGVJc3N1ZU1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciByZW1vdmluZyBpc3N1ZVwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgcmVtb3ZpbmcgaXNzdWVcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlSXNzdWUoZGF0YSkge1xyXG4gICAgICAgIGxldCB1cGRhdGVJc3N1ZVByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9pc3N1ZVwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNlZGl0UHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHVwZGF0ZUlzc3VlUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlUHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZyBpc3N1ZVwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3Igd2hpbGUgdXBkYXRpbmcgaXNzdWVcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcG9wdWxhdGVQcm9qZWN0UGFnZShwcm9qZWN0SWQpIHtcclxuICAgICAgICBsZXQgaXNzdWVzUHJvbWlzZSA9IHRoaXMuZ2V0SXNzdWVzKHByb2plY3RJZCwgcG9wdWxhdGVJc3N1ZXNUZW1wbGF0ZSk7XHJcbiAgICAgICAgbGV0ICRpc3N1ZXNTZWN0aW9uID0gJChcIi5wcm9qZWN0LXBhZ2UgLmlzc3Vlcy1zZWN0aW9uXCIpO1xyXG5cclxuICAgICAgICBpc3N1ZXNQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpc3N1ZXMgY29sbGVjdGlvbiBpczo6XCIsIGRhdGEpO1xyXG4gICAgICAgICAgICBwb3B1bGF0ZUlzc3Vlc1RlbXBsYXRlKGRhdGEpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHBvcHVsYXRlSXNzdWVzVGVtcGxhdGUoaXNzdWVzTGlzdCkge1xyXG4gICAgICAgICAgICBsZXQgZ2V0UHJvamVjdHNQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgdXJsOiBcIi90ZW1wbGF0ZXMvdGVtcGxhdGVzLmh0bWxcIixcclxuICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnaHRtbCdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGdldFByb2plY3RzUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc291cmNlID0gJChkYXRhKS5maW5kKFwiI3Byb2plY3QtdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gSGFuZGxlYmFycy5jb21waWxlKHNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGV4dCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBpc3N1ZXNMaXN0OiBpc3N1ZXNMaXN0XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgbGV0IGh0bWwgPSB0ZW1wbGF0ZShjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgICRpc3N1ZXNTZWN0aW9uLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2VkaXRJc3N1ZU1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBkdXJpbmcgaXNzdWVzIHRlbXBsYXRlIGZldGNoXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZHVyaW5nIHByb2plY3QgY3JlYXRpb25cIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwb3B1bGF0ZUlzc3VlUGFnZShpc3N1ZUlkKSB7XHJcbiAgICAgICAgdGhpcy5wb3B1bGF0ZUlzc3VlQ29tbWVudHMoaXNzdWVJZCk7XHJcbiAgICAgICAgdGhpcy5wb3B1bGF0ZUlzc3VlV29ya2xvZ3MoaXNzdWVJZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcG9wdWxhdGVJc3N1ZUNvbW1lbnRzKGlzc3VlSWQpIHtcclxuICAgICAgICBsZXQgY29tbWVudHNQcm9taXNlID0gdGhpcy5nZXRDb21tZW50cyhpc3N1ZUlkKTtcclxuICAgICAgICBsZXQgJGNvbW1lbnRzU2VjdGlvbiA9ICQoXCIuaXNzdWUtcGFnZSAuaXNzdWUtY29tbWVudHNcIik7XHJcblxyXG4gICAgICAgIGNvbW1lbnRzUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaXNzdWVzIGNvbW1lbnRzIGlzOjpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgIHBvcHVsYXRlQ29tbWVudHNUZW1wbGF0ZShkYXRhKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwb3B1bGF0ZUNvbW1lbnRzVGVtcGxhdGUoY29tbWVudHNMaXN0KSB7XHJcbiAgICAgICAgICAgIGNvbW1lbnRzTGlzdC5mb3JFYWNoKChjb21tZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZihjb21tZW50LmNyZWF0b3IuX2lkID09PSB3aW5kb3cucmVzb3VyY2VzLnVzZXIuaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tZW50LmlzQ29tbWVudE93bmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tZW50LmlzQ29tbWVudE93bmVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29tbWVudC51cGRhdGVkID0gbmV3IERhdGUoY29tbWVudC51cGRhdGVkKTtcclxuICAgICAgICAgICAgICAgIGNvbW1lbnQudXBkYXRlZCA9IGNvbW1lbnQudXBkYXRlZC5nZXRNb250aCgpICsgMSArIFwiL1wiICsgY29tbWVudC51cGRhdGVkLmdldERhdGUoKSArIFwiL1wiICsgY29tbWVudC51cGRhdGVkLmdldEZ1bGxZZWFyKCkgKyBcIiBcIiArIGNvbW1lbnQudXBkYXRlZC5nZXRIb3VycygpICsgXCI6XCIgKyBjb21tZW50LnVwZGF0ZWQuZ2V0TWludXRlcygpO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIndsXCIgK25ldyBEYXRlKHdvcmtMb2cuZGF0ZVN0YXJ0ZWQpKXNcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZ2V0Q29tbWVudHNQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgdXJsOiBcIi90ZW1wbGF0ZXMvdGVtcGxhdGVzLmh0bWxcIixcclxuICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnaHRtbCdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGdldENvbW1lbnRzUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc291cmNlID0gJChkYXRhKS5maW5kKFwiI2NvbW1lbnRzLXRlbXBsYXRlXCIpLmh0bWwoKTtcclxuICAgICAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IEhhbmRsZWJhcnMuY29tcGlsZShzb3VyY2UpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbnRleHQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWVudHNMaXN0OiBjb21tZW50c0xpc3QsXHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFVzZXI6IHdpbmRvdy5yZXNvdXJjZXMudXNlci5pZFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGxldCBodG1sID0gdGVtcGxhdGUoY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICAkY29tbWVudHNTZWN0aW9uLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZHVyaW5nIGNvbW1lbnRzIHRlbXBsYXRlIGZldGNoXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZHVyaW5nIHByb2plY3QgY3JlYXRpb25cIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwb3B1bGF0ZUlzc3VlV29ya2xvZ3MoaXNzdWVJZCkge1xyXG4gICAgICAgIGxldCB3b3JrTG9nc1Byb21pc2UgPSB0aGlzLmdldFdvcmtsb2dzKGlzc3VlSWQpO1xyXG4gICAgICAgIGxldCAkd29ya0xvZ3NTZWN0aW9uID0gJChcIi5pc3N1ZS1wYWdlIC5pc3N1ZS13b3JrbG9nc1wiKTtcclxuXHJcbiAgICAgICAgd29ya0xvZ3NQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpc3N1ZXMgbG9ncyBpczpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgIGRhdGEuZm9yRWFjaCgod29ya0xvZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgd29ya0xvZy50aW1lU3BlbnRNaW51dGVzID0gd29ya0xvZy50aW1lU3BlbnQ7XHJcbiAgICAgICAgICAgICAgICB3b3JrTG9nLnRpbWVTcGVudCA9IHRoaXMubWludXRlc1RvU3RyaW5nKHdvcmtMb2cudGltZVNwZW50KTtcclxuICAgICAgICAgICAgICAgIHdvcmtMb2cuZGF0ZVN0YXJ0ZWQgPSBuZXcgRGF0ZSh3b3JrTG9nLmRhdGVTdGFydGVkKTtcclxuICAgICAgICAgICAgICAgIHdvcmtMb2cuZGF0ZVN0YXJ0ZWQgPSB3b3JrTG9nLmRhdGVTdGFydGVkLmdldE1vbnRoKCkgKyAxICsgXCIvXCIgKyB3b3JrTG9nLmRhdGVTdGFydGVkLmdldERhdGUoKSArIFwiL1wiICsgd29ya0xvZy5kYXRlU3RhcnRlZC5nZXRGdWxsWWVhcigpICsgXCIgXCIgKyB3b3JrTG9nLmRhdGVTdGFydGVkLmdldEhvdXJzKCkgKyBcIjpcIiArIHdvcmtMb2cuZGF0ZVN0YXJ0ZWQuZ2V0TWludXRlcygpO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIndsXCIgK25ldyBEYXRlKHdvcmtMb2cuZGF0ZVN0YXJ0ZWQpKVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHBvcHVsYXRlV29ya2xvZ3NUZW1wbGF0ZShkYXRhKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwb3B1bGF0ZVdvcmtsb2dzVGVtcGxhdGUod29ya0xvZ3NMaXN0KSB7XHJcbiAgICAgICAgICAgIHdvcmtMb2dzTGlzdC5mb3JFYWNoKCh3b3JrTG9nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZih3b3JrTG9nLmNyZWF0b3IuX2lkID09PSB3aW5kb3cucmVzb3VyY2VzLnVzZXIuaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB3b3JrTG9nLmlzV29ya0xvZ093bmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB3b3JrTG9nLmlzV29ya0xvZ093bmVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGdldFdvcmtMb2dzUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgIHVybDogXCIvdGVtcGxhdGVzL3RlbXBsYXRlcy5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2h0bWwnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBnZXRXb3JrTG9nc1Byb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNvdXJjZSA9ICQoZGF0YSkuZmluZChcIiN3b3JrLWxvZ3MtdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gSGFuZGxlYmFycy5jb21waWxlKHNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGV4dCA9IHtcclxuICAgICAgICAgICAgICAgICAgICB3b3JrTG9nc0xpc3Q6IHdvcmtMb2dzTGlzdCxcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VXNlcjogd2luZG93LnJlc291cmNlcy51c2VyLmlkXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgbGV0IGh0bWwgPSB0ZW1wbGF0ZShjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgICR3b3JrTG9nc1NlY3Rpb24uaHRtbChodG1sKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBkdXJpbmcgY29tbWVudHMgdGVtcGxhdGUgZmV0Y2hcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgcHJvamVjdCBjcmVhdGlvblwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHBvcHVsYXRlUHJvamVjdHNQYWdlKCkge1xyXG4gICAgICAgIGxldCBwcm9qZWN0c1Byb21pc2UgPSB0aGlzLmdldFByb2plY3RzKCk7XHJcbiAgICAgICAgbGV0IHByb2plY3RzO1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgcHJvamVjdHNQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJmZXRjaGVkIHByb2plY3RzOlwiLCBkYXRhKTtcclxuICAgICAgICAgICAgcG9wdWxhdGVQcm9qZWN0c1RlbXBsYXRlKGRhdGEpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGZldGNoaW5nIHByb2plY3RzXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBmZXRjaGluZyBwcm9qZWN0c1wiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcG9wdWxhdGVQcm9qZWN0c1RlbXBsYXRlKHByb2plY3RzTGlzdCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwcm9qZWN0c0xpc3QpXHJcbiAgICAgICAgICAgIGxldCBnZXRQcm9qZWN0c1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3RlbXBsYXRlcy90ZW1wbGF0ZXMuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZ2V0UHJvamVjdHNQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBzb3VyY2UgPSAkKGRhdGEpLmZpbmQoXCIjcHJvamVjdHMtdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gSGFuZGxlYmFycy5jb21waWxlKHNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGV4dCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0c0xpc3Q6IHByb2plY3RzTGlzdFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGxldCBodG1sID0gdGVtcGxhdGUoY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnByb2plY3RzU2VjdGlvbi5odG1sKGh0bWwpO1xyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBkdXJpbmcgcHJvamVjdHMgdGVtcGxhdGUgZmV0Y2hcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgcHJvamVjdCBjcmVhdGlvblwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVByb2plY3QoJHRhcmdldCkge1xyXG4gICAgICAgIGxldCBkYXRhID0gJHRhcmdldC5zZXJpYWxpemUoKTtcclxuXHJcbiAgICAgICAgbGV0IGNyZWF0ZVByb2plY3RQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvcHJvamVjdFwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MsIFwiLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICQoXCIjYWRkUHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNyZWF0ZVByb2plY3RQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzIHJlZzpcIiwgZGF0YSk7XHJcblxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGR1cmluZyBwcm9qZWN0IGNyZWF0aW9uXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgcHJvamVjdCBjcmVhdGlvblwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQcm9qZWN0cyhjYWxsYmFjaykge1xyXG4gICAgICAgIGxldCBnZXRQcm9qZWN0c1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9qZWN0c0l0ZW1zXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZ2V0UHJvamVjdHNQcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldElzc3Vlcyhwcm9qZWN0SWQsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJwcmk6XCIsIHByb2plY3RJZCk7XHJcbiAgICAgICAgbGV0IGdldElzc3Vlc1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9pc3N1ZXNcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICBwcm9qZWN0SWQ6IHByb2plY3RJZFxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBnZXRJc3N1ZXNQcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENvbW1lbnRzKGlzc3VlSWQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImlzc3VlSWRsOlwiLCBpc3N1ZUlkKTtcclxuICAgICAgICBsZXQgZ2V0Q29tbWVudHNQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvY29tbWVudHNcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICBpc3N1ZUlkOiBpc3N1ZUlkXHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGdldENvbW1lbnRzUHJvbWlzZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRXb3JrbG9ncyhpc3N1ZUlkKSB7XHJcbiAgICAgICAgbGV0IGdldFdvcmtMb2dzUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2xvZ3NcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICBpc3N1ZUlkOiBpc3N1ZUlkXHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGdldFdvcmtMb2dzUHJvbWlzZTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVDb21tZW50KGRhdGEpIHtcclxuICAgICAgICBsZXQgZGVzZXJpYWxpemVkRGF0YSA9IHRoaXMuZGVzZXJpYWxpemVGb3JtKGRhdGEpXHJcbiAgICAgICAgZGVzZXJpYWxpemVkRGF0YS5pc3N1ZUlkID0gd2luZG93LnJlc291cmNlcy5pc3N1ZTtcclxuICAgICAgICBsZXQgdXBkYXRlQ29tbWVudFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9jb21tZW50XCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGVzZXJpYWxpemVkRGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2VkaXRDb21tZW50TW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdXBkYXRlQ29tbWVudFByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZVByb2plY3RNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgdXBkYXRpbmcgaXNzdWVcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIHdoaWxlIHVwZGF0aW5nIGlzc3VlXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZUNvbW1lbnQoZGF0YSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgIGxldCBkZXNlcmlhbGl6ZWREYXRhID0gdGhpcy5kZXNlcmlhbGl6ZUZvcm0oZGF0YSlcclxuICAgICAgICBkZXNlcmlhbGl6ZWREYXRhLmlzc3VlSWQgPSB3aW5kb3cucmVzb3VyY2VzLmlzc3VlO1xyXG4gICAgICAgIGxldCBkZWxldGVDb21tZW50UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2NvbW1lbnRcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkZXNlcmlhbGl6ZWREYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MsIFwiLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlbGV0ZUNvbW1lbnRQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgJChcIiNkZWxldGVDb21tZW50TW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHJlbW92aW5nIGNvbW1lbnRcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIHJlbW92aW5nIGNvbW1lbnRcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlV29ya2xvZyhkYXRhKSB7XHJcbiAgICAgICAgbGV0IGNyZWF0ZVdvcmtsb2dQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvbG9nXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY3JlYXRlV29ya2xvZ1Byb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MgcmVnOlwiLCBkYXRhKTtcclxuICAgICAgICAgICAgJChcIiNhZGRXb3JrTG9nTW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGR1cmluZyBsb2cgY3JlYXRpb25cIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIGR1cmluZyBsb2cgY3JlYXRpb25cIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlV29ya2xvZyhkYXRhKSB7Y29uc29sZS5sb2coXCJkYXRhXCIsIGRhdGEpXHJcbiAgICAgICAgbGV0IHVwZGF0ZVdvcmtsb2dQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvbG9nXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB1cGRhdGVXb3JrbG9nUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcyB3b3JrbG9nbG9nOlwiLCBkYXRhKTtcclxuICAgICAgICAgICAgJChcIiNlZGl0V29ya2xvZ01vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBkdXJpbmcgbG9nIHVwZGF0ZVwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZHVyaW5nIGxvZyB1cGRhdGVcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGRlbGV0ZVdvcmtsb2coZGF0YSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgIGxldCBkZXNlcmlhbGl6ZWREYXRhID0gdGhpcy5kZXNlcmlhbGl6ZUZvcm0oZGF0YSlcclxuICAgICAgICBkZXNlcmlhbGl6ZWREYXRhLmlzc3VlSWQgPSB3aW5kb3cucmVzb3VyY2VzLmlzc3VlO1xyXG4gICAgICAgIGxldCBkZWxldGVDb21tZW50UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2xvZ1wiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRlc2VyaWFsaXplZERhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVsZXRlQ29tbWVudFByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZVdvcmtsb2dNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgcmVtb3Zpbmcgd29ya2xvZ1wiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgcmVtb3Zpbmcgd29ya2xvZ1wiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dpbkFuZFJlZ2lzdGVyTGlzdGVuZXJzKCkge1xyXG4gICAgICAgIGlmKHRoaXMubG9naW5Gb3JtKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9naW5Gb3JtLm9uKFwic3VibWl0XCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9naW4oJCggZXYudGFyZ2V0ICkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMucmVnaXN0ZXJGb3JtKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJGb3JtLm9uKFwic3VibWl0XCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZigkKFwiI3Bhc3N3b3JkMVwiKS52YWwoKSAhPSAkKFwiI3Bhc3N3b3JkMlwiKS52YWwoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoXCIuZm9ybS1ncm91cFwiKS5hZGRDbGFzcyhcImhhcy1lcnJvclwiKTtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcInBhc3N3b3JkcyB5b3UgZW50ZXJlZCBhcmUgbm90IGlkZW50aWNhbFwiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlZ2lzdGVyKCQoIGV2LnRhcmdldCApKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBJc3N1ZVRyYWNrZXIgZnJvbSAnLi9Jc3N1ZVRyYWNrZXInO1xyXG5cclxubGV0IGlzc3VlVHJhY2tlciA9IG5ldyBJc3N1ZVRyYWNrZXIoKTtcclxuLy9jb25zb2xlLmxvZyhJc3N1ZVRyYWNrZXIpO1xyXG4vL3ZhciBbYSwgYiwgY10gPSBbMSAsIDIsIDNdO1xyXG4iXX0=
