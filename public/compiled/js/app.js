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
                if (data.issue == window.resources.issue) {
                    _this5.populateIssuePage(window.resources.issue);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRcXElzc3VlVHJhY2tlci5qcyIsInNjcmlwdFxcYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztJQ0FxQjtBQUNqQixhQURpQixZQUNqQixHQUFjOzhCQURHLGNBQ0g7O0FBQ1YsWUFBSSxTQUFTLE9BQU8sUUFBUCxDQUFnQixRQUFoQixJQUE0QixXQUE1QixHQUEwQyxzQkFBc0IsVUFBVSxJQUFWLEdBQWlCLGFBQWEsT0FBTyxRQUFQLENBQWdCLFFBQWhCLENBRGpHO0FBRVYsYUFBSyxNQUFMLEdBQWMsR0FBRyxNQUFILENBQWQsQ0FGVTtBQUdWLGFBQUssU0FBTCxHQUhVO0FBSVYsYUFBSyxPQUFMLEdBSlU7QUFLVixhQUFLLFlBQUwsR0FMVTtLQUFkOztpQkFEaUI7O29DQVNMO0FBQ1IsaUJBQUssbUJBQUwsR0FBMkIsRUFBRSxjQUFGLEVBQWtCLE1BQWxCLEdBQTJCLEVBQUUsY0FBRixDQUEzQixHQUErQyxLQUEvQyxDQURuQjtBQUVSLGlCQUFLLGtCQUFMLEdBQTBCLEVBQUUsa0JBQUYsRUFBc0IsTUFBdEIsR0FBK0IsRUFBRSxrQkFBRixDQUEvQixHQUF1RCxLQUF2RCxDQUZsQjtBQUdSLGlCQUFLLFNBQUwsR0FBaUIsRUFBRSxhQUFGLEVBQWlCLE1BQWpCLEdBQTBCLEVBQUUsYUFBRixDQUExQixHQUE2QyxLQUE3QyxDQUhUO0FBSVIsaUJBQUssZUFBTCxHQUF1QixFQUFFLGtCQUFGLENBQXZCLENBSlE7QUFLUixpQkFBSyxZQUFMLEdBQW9CLEVBQUUsZ0JBQUYsRUFBb0IsTUFBcEIsR0FBNkIsRUFBRSxnQkFBRixDQUE3QixHQUFtRCxLQUFuRCxDQUxaO0FBTVIsaUJBQUssa0JBQUwsR0FBMEIsRUFBRSx5QkFBRixDQUExQixDQU5RO0FBT1IsaUJBQUssaUJBQUwsR0FBeUIsRUFBRSxnQkFBRixFQUFvQixNQUFwQixHQUE2QixF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VUFBQyxJQUFELEVBQVU7QUFDaEMsa0JBQUUscUJBQUYsRUFBeUIsS0FBekIsQ0FBK0IsTUFBL0IsRUFEZ0M7YUFBVixDQUExQixDQUdDLEtBSEQsQ0FHTyxVQUFDLEtBQUQsRUFBUSxVQUFSLEVBQXVCO0FBQzFCLHdCQUFRLEdBQVIsQ0FBWSx3QkFBWixFQUFzQyxLQUF0QyxFQUE2QyxVQUE3QyxFQUQwQjtBQUUxQixzQkFBTSx3QkFBTixFQUYwQjthQUF2QixDQUhQLENBckJnQjs7OztvREE4QlE7OztBQUN4QixnQkFBRyxLQUFLLFNBQUwsRUFBZ0I7QUFDZixxQkFBSyxTQUFMLENBQWUsRUFBZixDQUFrQixRQUFsQixFQUE0QixVQUFDLEVBQUQsRUFBUTtBQUNoQyx1QkFBRyxjQUFILEdBRGdDO0FBRWhDLDJCQUFLLEtBQUwsQ0FBVyxFQUFHLEdBQUcsTUFBSCxDQUFkLEVBRmdDO2lCQUFSLENBQTVCLENBRGU7YUFBbkI7O0FBT0EsZ0JBQUcsS0FBSyxZQUFMLEVBQW1CO0FBQ2xCLHFCQUFLLFlBQUwsQ0FBa0IsRUFBbEIsQ0FBcUIsUUFBckIsRUFBK0IsVUFBQyxFQUFELEVBQVE7QUFDbkMsdUJBQUcsY0FBSCxHQURtQzs7QUFHbkMsd0JBQUcsRUFBRSxZQUFGLEVBQWdCLEdBQWhCLE1BQXlCLEVBQUUsWUFBRixFQUFnQixHQUFoQixFQUF6QixFQUFnRDtBQUMvQywwQkFBRSxhQUFGLEVBQWlCLFFBQWpCLENBQTBCLFdBQTFCLEVBRCtDO0FBRS9DLDhCQUFNLHlDQUFOLEVBRitDO0FBRy9DLCtCQUFPLEtBQVAsQ0FIK0M7cUJBQW5EO0FBS0EsMkJBQUssUUFBTCxDQUFjLEVBQUcsR0FBRyxNQUFILENBQWpCLEVBUm1DO2lCQUFSLENBQS9CLENBRGtCO2FBQXRCOzs7O1dBbDFCYTs7Ozs7Ozs7QUNBckI7Ozs7OztBQUVBLElBQUksZUFBZSw0QkFBZiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBJc3N1ZVRyYWNrZXIge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgbGV0IGlvUGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSA9PSBcImxvY2FsaG9zdFwiID8gXCJodHRwOi8vbG9jYWxob3N0OlwiICsgcmVzb3VyY2VzLnBvcnQgOiBcImh0dHBzOi8vXCIgKyB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWU7XHJcbiAgICAgICAgdGhpcy5zb2NrZXQgPSBpbyhpb1BhdGgpO1xyXG4gICAgICAgIHRoaXMuaW5pdENhY2hlKCk7XHJcbiAgICAgICAgdGhpcy5pbml0RG9tKCk7XHJcbiAgICAgICAgdGhpcy5zZXRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0Q2FjaGUoKSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVQcm9qZWN0QnV0dG9uID0gJChcIi5hZGQtcHJvamVjdFwiKS5sZW5ndGggPyAkKFwiLmFkZC1wcm9qZWN0XCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVQcm9qZWN0TW9kYWwgPSAkKFwiI2FkZFByb2plY3RNb2RhbFwiKS5sZW5ndGggPyAkKFwiI2FkZFByb2plY3RNb2RhbFwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubG9naW5Gb3JtID0gJChcIi5sb2dpbi1mb3JtXCIpLmxlbmd0aCA/ICQoXCIubG9naW4tZm9ybVwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubG9naW5FcnJvck1vZGFsID0gJChcIiNMb2dpbkVycm9yTW9kYWxcIik7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckZvcm0gPSAkKFwiLnJlZ2lzdGVyLWZvcm1cIikubGVuZ3RoID8gJChcIi5yZWdpc3Rlci1mb3JtXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckVycm9yTW9kYWwgPSAkKFwiI1JlZ2lzdHJhdGlvbkVycm9yTW9kYWxcIik7XHJcbiAgICAgICAgdGhpcy5hZGROZXdQcm9qZWN0Rm9ybSA9ICQoXCIjYWRkTmV3UHJvamVjdFwiKS5sZW5ndGggPyAkKFwiI2FkZE5ld1Byb2plY3RcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLnByb2plY3RzUGFnZSA9ICQoXCIucHJvamVjdHMtcGFnZVwiKS5sZW5ndGggPyAkKFwiLnByb2plY3RzLXBhZ2VcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLnByb2plY3RzU2VjdGlvbiA9ICQoXCIucHJvamVjdHMtc2VjdGlvblwiKTtcclxuICAgICAgICB0aGlzLnByb2plY3RFZGl0U2VsZWN0b3IgPSBcIi5wcm9qZWN0LWVkaXRcIjtcclxuICAgICAgICB0aGlzLnByb2plY3REZWxldGVTZWxlY3RvciA9IFwiLnByb2plY3QtZGVsZXRlXCI7XHJcbiAgICAgICAgdGhpcy5kZWxldGVQcm9qZWN0Rm9ybVNlbGVjdG9yID0gXCIjZGVsZXRlUHJvamVjdFwiO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUHJvamVjdEZvcm1TZWxlY3RvciA9IFwiI3VwZGF0ZVByb2plY3RcIjtcclxuICAgICAgICB0aGlzLnByb2plY3RQYWdlID0gJChcIi5wcm9qZWN0LXBhZ2VcIikubGVuZ3RoID8gJChcIi5wcm9qZWN0LXBhZ2VcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmlzc3VlUGFnZSA9ICQoXCIuaXNzdWUtcGFnZVwiKS5sZW5ndGggPyAkKFwiLmlzc3VlLXBhZ2VcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmFkZElzc3VlID0gJChcIi5hZGQtaXNzdWVcIik7XHJcbiAgICAgICAgdGhpcy5hZGRJc3N1ZUZvcm0gPSAkKFwiI2FkZE5ld0lzc3VlXCIpLmxlbmd0aCA/ICQoXCIjYWRkTmV3SXNzdWVcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUlzc3VlRm9ybSA9ICQoXCIjdXBkYXRlSXNzdWVcIikubGVuZ3RoID8gJChcIiN1cGRhdGVJc3N1ZVwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlSXNzdWVGb3JtID0gJChcIiNkZWxldGVJc3N1ZVwiKS5sZW5ndGggPyAkKFwiI2RlbGV0ZUlzc3VlXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5pc3N1ZUVkaXRTZWxlY3RvciA9IFwiLmlzc3VlLWVkaXRcIjtcclxuICAgICAgICB0aGlzLmlzc3VlRGVsZXRlU2VsZWN0b3IgPSBcIi5pc3N1ZS1kZWxldGVcIjtcclxuICAgICAgICB0aGlzLmFkZENvbW1lbnQgPSAkKFwiLm5ldy1jb21tZW50XCIpLmxlbmd0aCA/ICQoXCIubmV3LWNvbW1lbnRcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmFkZFdyb2tMb2cgPSAkKFwiLm5ldy13b3JrbG9nXCIpLmxlbmd0aCA/ICQoXCIubmV3LXdvcmtsb2dcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmFkZENvbW1lbnRNb2RhbCA9ICQoXCIjYWRkQ29tbWVudE1vZGFsXCIpO1xyXG4gICAgICAgIHRoaXMuYWRkV29ya0xvZ01vZGFsID0gJChcIiNhZGRXb3JrTG9nTW9kYWxcIik7XHJcbiAgICAgICAgdGhpcy5hZGROZXdDb21tZW50Rm9ybVNlbGVjdG9yID0gXCIjYWRkTmV3Q29tbWVudFwiO1xyXG4gICAgICAgIHRoaXMuYWRkTmV3V29ya2xvZ0Zvcm1TZWxlY3RvciA9IFwiI2FkZE5ld1dvcmtsb2dcIjtcclxuICAgICAgICB0aGlzLmRhdGVUaW1lUGlja2VyID0gJChcIiN3b3JrLWxvZy1kYXRldGltZXBpY2tlclwiKS5sZW5ndGggPyAkKFwiI3dvcmstbG9nLWRhdGV0aW1lcGlja2VyXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5lZGl0Q29tbWVudFRodW1iU2VsZWN0b3IgPSBcIi5lZGl0LWNvbW1lbnRcIjtcclxuICAgICAgICB0aGlzLmRlbGV0ZUNvbW1lbnRUaHVtYlNlbGVjdG9yID0gXCIuZGVsZXRlLWNvbW1lbnRcIjtcclxuICAgICAgICB0aGlzLmRlbGV0ZUNvbW1lbnRGb3JtID0gJChcIiNkZWxldGVDb21tZW50XCIpLmxlbmd0aCA/ICQoXCIjZGVsZXRlQ29tbWVudFwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ29tbWVudEZvcm0gPSAkKFwiI3VwZGF0ZUNvbW1lbnRcIikubGVuZ3RoID8gJChcIiN1cGRhdGVDb21tZW50XCIpIDogZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdERvbSgpIHtcclxuICAgICAgICBpZih0aGlzLmRhdGVUaW1lUGlja2VyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVQaWNrZXIuZGF0ZXRpbWVwaWNrZXIoe1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdERhdGU6IG5ldyBEYXRlKClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQoXCIjZGF0ZS10aW1lLXBpY2tlci1pbnB1dFwiKS5mb2N1cygoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgICQoXCIuaW5wdXQtZ3JvdXAtYWRkb25cIikuY2xpY2soKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxvZ2luKCR0YXJnZXQpIHtcclxuICAgICAgICBsZXQgZGF0YSA9ICR0YXJnZXQuc2VyaWFsaXplKCk7XHJcbiAgICAgICAgLypsZXQgbmFtZSA9IGRhdGFbMF0udmFsdWU7XHJcbiAgICAgICAgbGV0IHBhc3N3b3JkID0gZGF0YVsxXS52YWx1ZTsqL1xyXG4gICAgICAgIGxldCBsb2dpblByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9sb2dpblwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsb2dpblByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBkYXRhLnJlZGlyZWN0VG87XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubG9naW5FcnJvck1vZGFsLm1vZGFsKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVnaXN0ZXIoJHRhcmdldCkge1xyXG4gICAgICAgIGxldCBkYXRhID0gJHRhcmdldC5zZXJpYWxpemUoKTtcclxuICAgICAgICAvKmxldCBuYW1lID0gZGF0YVswXS52YWx1ZTtcclxuICAgICAgICBsZXQgcGFzc3dvcmQgPSBkYXRhWzFdLnZhbHVlOyovXHJcbiAgICAgICAgbGV0IHJlZ2lzdGVyUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL3JlZ2lzdGVyXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJlZ2lzdGVyUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcyByZWc6XCIsIGRhdGEpO1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBkYXRhLnJlZGlyZWN0VG87XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9naW4gZXJyb3JcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyRXJyb3JNb2RhbC5tb2RhbCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNldExpc3RlbmVycygpIHtcclxuICAgICAgICB0aGlzLmxvZ2luQW5kUmVnaXN0ZXJMaXN0ZW5lcnMoKTtcclxuICAgICAgICB0aGlzLnByb2plY3RzTGlzdGVuZXJzKCk7XHJcbiAgICAgICAgdGhpcy5pc3N1ZUxpc3RlbmVycygpO1xyXG5cclxuICAgICAgICAkKHdpbmRvdykubG9hZCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMucHJvamVjdHNQYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvcHVsYXRlUHJvamVjdHNQYWdlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMucHJvamVjdFBhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9wdWxhdGVQcm9qZWN0UGFnZSh3aW5kb3cucmVzb3VyY2VzLnByb2plY3QpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLmlzc3VlUGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUlzc3VlUGFnZSh3aW5kb3cucmVzb3VyY2VzLmlzc3VlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb2plY3RzTGlzdGVuZXJzKCkge1xyXG4gICAgICAgIGlmKHRoaXMuY3JlYXRlUHJvamVjdEJ1dHRvbikge1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVByb2plY3RCdXR0b24ub24oXCJjbGlja1wiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVByb2plY3RNb2RhbC5tb2RhbCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMuYWRkTmV3UHJvamVjdEZvcm0pIHtcclxuICAgICAgICAgICAgdGhpcy5hZGROZXdQcm9qZWN0Rm9ybS5vbignc3VibWl0JywgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVQcm9qZWN0KCQoZXYudGFyZ2V0KSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCB0aGlzLnByb2plY3RFZGl0U2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgbGV0ICRwYXJlbnQgPSAkKGV2LnRhcmdldCkuY2xvc2VzdChcInRyXCIpO1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdElkID0gJHBhcmVudC5hdHRyKFwiZGF0YS1wcm9qZWN0LWlkXCIpO1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdE5hbWUgPSAkcGFyZW50LmZpbmQoXCIucHItbmFtZVwiKS5odG1sKCk7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0RGVzY3JpcHRpb24gPSAkcGFyZW50LmZpbmQoXCIucHItZGVzY3JpcHRpb25cIikuaHRtbCgpO1xyXG5cclxuICAgICAgICAgICAgJChcIiNlZGl0UHJvamVjdE1vZGFsXCIpLm1vZGFsKCk7XHJcbiAgICAgICAgICAgICQoXCIjdXBkYXRlZS1wcm9qZWN0LWlkXCIpLnZhbChwcm9qZWN0SWQpO1xyXG4gICAgICAgICAgICAkKFwiI25ldy1wcm9qZWN0LW5hbWVcIikudmFsKHByb2plY3ROYW1lKTtcclxuICAgICAgICAgICAgJChcIiNuZXctZGVzY3JpcHRpb25cIikudmFsKHByb2plY3REZXNjcmlwdGlvbik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgdGhpcy5wcm9qZWN0RGVsZXRlU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3RJZCA9ICQoZXYudGFyZ2V0KS5jbG9zZXN0KFwidHJcIikuYXR0cihcImRhdGEtcHJvamVjdC1pZFwiKTtcclxuICAgICAgICAgICAgJChcIiNkZWxldGVQcm9qZWN0TW9kYWxcIikubW9kYWwoKTtcclxuICAgICAgICAgICAgJChcIiNkZWxldGUtcHJvamVjdC1pZFwiKS52YWwocHJvamVjdElkKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJzdWJtaXRcIiwgdGhpcy5kZWxldGVQcm9qZWN0Rm9ybVNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVQcm9qZWN0KCQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwic3VibWl0XCIsIHRoaXMudXBkYXRlUHJvamVjdEZvcm1TZWxlY3RvciwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUHJvamVjdCgkKGV2LnRhcmdldCkuc2VyaWFsaXplKCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIHRoaXMuaXNzdWVFZGl0U2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgbGV0ICRwYXJlbnQgPSAkKGV2LnRhcmdldCkuY2xvc2VzdChcInRyXCIpO1xyXG4gICAgICAgICAgICBsZXQgaXNzdWVJZCA9ICRwYXJlbnQuYXR0cihcImRhdGEtaXNzdWUtaWRcIik7XHJcbiAgICAgICAgICAgIGxldCBpc3N1ZU5hbWUgPSAkcGFyZW50LmZpbmQoXCIuaXNzdWUtbmFtZVwiKS5odG1sKCk7XHJcbiAgICAgICAgICAgIGxldCBpc3N1ZURlc2NyaXB0aW9uID0gJHBhcmVudC5maW5kKFwiLmlzc3VlLWRlc2NyaXB0aW9uXCIpLmh0bWwoKTtcclxuXHJcbiAgICAgICAgICAgICQoXCIjZWRpdElzc3VlTW9kYWxcIikubW9kYWwoKTtcclxuICAgICAgICAgICAgJChcIiN1cGRhdGVlLWlzc3VlLWlkXCIpLnZhbChpc3N1ZUlkKTtcclxuICAgICAgICAgICAgJChcIiNuZXctaXNzdWUtbmFtZVwiKS52YWwoaXNzdWVOYW1lKTtcclxuICAgICAgICAgICAgJChcIiNuZXctZGVzY3JpcHRpb25cIikudmFsKGlzc3VlRGVzY3JpcHRpb24pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIHRoaXMuaXNzdWVEZWxldGVTZWxlY3RvciwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImhlcmVcIilcclxuICAgICAgICAgICAgbGV0IGlzc3VlSWQgPSAkKGV2LnRhcmdldCkuY2xvc2VzdChcInRyXCIpLmF0dHIoXCJkYXRhLWlzc3VlLWlkXCIpO1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZUlzc3VlTW9kYWxcIikubW9kYWwoKTtcclxuICAgICAgICAgICAgJChcIiNkZWxldGUtaXNzdWUtaWRcIikudmFsKGlzc3VlSWQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZih0aGlzLmRlbGV0ZUlzc3VlRm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUlzc3VlRm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUlzc3VlKCQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy51cGRhdGVJc3N1ZUZvcm0pIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVJc3N1ZUZvcm0ub24oXCJzdWJtaXRcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVJc3N1ZSgkKGV2LnRhcmdldCkuc2VyaWFsaXplKCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgXCIucHJvamVjdC1pdGVtXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICBsZXQgJHRhcmdldCA9ICQoZXYudGFyZ2V0KS5jbG9zZXN0KFwiLnByb2plY3QtaXRlbVwiKTtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9wcm9qZWN0L1wiICsgJHRhcmdldC5hdHRyKFwiZGF0YS1wcm9qZWN0LWlkXCIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIFwiLmlzc3VlLWl0ZW1cIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCAkdGFyZ2V0ID0gJChldi50YXJnZXQpLmNsb3Nlc3QoXCIuaXNzdWUtaXRlbVwiKTtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9pc3N1ZS9cIiArICR0YXJnZXQuYXR0cihcImRhdGEtaXNzdWUtaWRcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc29ja2V0Lm9uKFwidXBkYXRlUHJvamVjdHNcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRlUHJvamVjdHNQYWdlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkSXNzdWUub24oXCJjbGlja1wiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCQoXCIjYWRkSXNzdWVNb2RhbFwiKSlcclxuICAgICAgICAgICAgJChcIiNhZGRJc3N1ZU1vZGFsXCIpLm1vZGFsKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuYWRkSXNzdWVGb3JtKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkSXNzdWVGb3JtLm9uKFwic3VibWl0XCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIGxldCBzZXJpYWxpemVkID0gJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGRlc2VyaWFsaXplZERhdGEgPSB0aGlzLmRlc2VyaWFsaXplRm9ybShzZXJpYWxpemVkKTtcclxuICAgICAgICAgICAgICAgIGxldCBlc3RpbWF0ZWRNaW51dGVzID0gdGhpcy5jb252ZXJ0RXN0aW1hdGUoZGVzZXJpYWxpemVkRGF0YS5vcmlnaW5hbEVzdGltYXRlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZighZXN0aW1hdGVkTWludXRlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICQoXCIub3JpZ2luYWwtZXN0aW1hdGUtZ3JvdXBcIikuYWRkQ2xhc3MoXCJoYXMtZXJyb3JcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGRlc2VyaWFsaXplZERhdGEub3JpZ2luYWxFc3RpbWF0ZSA9IGVzdGltYXRlZE1pbnV0ZXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUlzc3VlKGRlc2VyaWFsaXplZERhdGEpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGVzZXJpYWxpemVkRGF0YSlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNvY2tldC5vbihcInVwZGF0ZUlzc3Vlc1wiLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgaWYoZGF0YS5wcm9qZWN0ID09IHJlc291cmNlcy5wcm9qZWN0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvcHVsYXRlUHJvamVjdFBhZ2UocmVzb3VyY2VzLnByb2plY3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNzdWVMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgaWYodGhpcy5hZGRDb21tZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ29tbWVudC5vbihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDb21tZW50TW9kYWwubW9kYWwoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLmFkZFdyb2tMb2cpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRXcm9rTG9nLm9uKFwiY2xpY2tcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFdvcmtMb2dNb2RhbC5tb2RhbCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwic3VibWl0XCIsIHRoaXMuYWRkTmV3Q29tbWVudEZvcm1TZWxlY3RvciwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlQ29tbWVudCgkKGV2LnRhcmdldCkuc2VyaWFsaXplKCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcInN1Ym1pdFwiLCB0aGlzLmFkZE5ld1dvcmtsb2dGb3JtU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNvY2tldC5vbihcInVwZGF0ZUNvbW1lbnRzXCIsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGRhdGEuaXNzdWUgPT0gd2luZG93LnJlc291cmNlcy5pc3N1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUlzc3VlUGFnZSh3aW5kb3cucmVzb3VyY2VzLmlzc3VlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIHRoaXMuZGVsZXRlQ29tbWVudFRodW1iU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZUNvbW1lbnRNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZS1jb21tZW50LWlkXCIpLnZhbCgkKGV2LnRhcmdldCkuY2xvc2VzdChcIi5jb21tZW50LWl0ZW1cIikuYXR0cihcImRhdGEtY29tbWVudC1pZFwiKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgdGhpcy5lZGl0Q29tbWVudFRodW1iU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2VkaXRDb21tZW50TW9kYWxcIikubW9kYWwoKTtcclxuICAgICAgICAgICAgJChcIiNlZGl0LWNvbW1lbnQtaWRcIikudmFsKCQoZXYudGFyZ2V0KS5jbG9zZXN0KFwiLmNvbW1lbnQtaXRlbVwiKS5hdHRyKFwiZGF0YS1jb21tZW50LWlkXCIpKTtcclxuICAgICAgICAgICAgJChcIiNjb21tZW50LXRleHRcIikudmFsKCQoZXYudGFyZ2V0KS5jbG9zZXN0KFwiLmNvbW1lbnQtaXRlbVwiKS5maW5kKFwiLnBhbmVsLWJvZHlcIikudGV4dCgpLnRyaW0oKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuZGVsZXRlQ29tbWVudEZvcm0pIHtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVDb21tZW50Rm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUNvbW1lbnQoJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLnVwZGF0ZUNvbW1lbnRGb3JtKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ29tbWVudEZvcm0ub24oXCJzdWJtaXRcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDb21tZW50KCQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkZXNlcmlhbGl6ZUZvcm0oc2VyaWFsaXplZEZvcm1EYXRhKSB7XHJcbiAgICAgICAgbGV0IHNlcmlhbGl6ZWREYXRhQXJyYXkgPSBzZXJpYWxpemVkRm9ybURhdGEuc3BsaXQoXCImXCIpO1xyXG4gICAgICAgIGxldCBkZXNlcmlhbGl6ZWRkRGF0YSA9IG5ldyBPYmplY3QoKTtcclxuICAgICAgICBsZXQgaXRlbVNwbGl0O1xyXG5cclxuICAgICAgICBmb3IobGV0IGxlbmd0aCA9IHNlcmlhbGl6ZWREYXRhQXJyYXkubGVuZ3RoLCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHNlcmlhbGl6ZWREYXRhQXJyYXlbaV0gPSBzZXJpYWxpemVkRGF0YUFycmF5W2ldLnJlcGxhY2UoL1xcKy9nLCBcIiBcIik7XHJcblxyXG4gICAgICAgICAgICBpdGVtU3BsaXQgPSBzZXJpYWxpemVkRGF0YUFycmF5W2ldLnNwbGl0KFwiPVwiKTtcclxuICAgICAgICAgICAgZGVzZXJpYWxpemVkZERhdGFbaXRlbVNwbGl0WzBdXSA9IGl0ZW1TcGxpdFsxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlc2VyaWFsaXplZGREYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnZlcnRFc3RpbWF0ZShlc3RpbWF0ZVN0cmluZykge1xyXG4gICAgICAgIGxldCByZWdleHAgPSAvKF5cXGQqaCBcXGQqbSQpfCheXFxkKihcXC5cXGQrKT9oJCl8KF5cXGQqbSQpLzsgLyplLmcgMWggMzBtIG9yIDMwbSBvciAxLjVoKi9cclxuICAgICAgICBsZXQgbWF0Y2ggPSBlc3RpbWF0ZVN0cmluZy5tYXRjaChyZWdleHApO1xyXG4gICAgICAgIGxldCBtYXRjaFNwbGl0O1xyXG4gICAgICAgIGxldCBzcGxpdExlbmd0aDtcclxuICAgICAgICBsZXQgaG91cnM7XHJcbiAgICAgICAgbGV0IG1pbnV0ZXMgPSAwO1xyXG4gICAgICAgIGxldCBhZGRpdGlvbmFsTWludXRlcyA9IDA7XHJcblxyXG4gICAgICAgIGlmKCFtYXRjaCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtYXRjaCA9IG1hdGNoWzBdO1xyXG4gICAgICAgIG1hdGNoU3BsaXQgPSBtYXRjaC5zcGxpdChcIiBcIik7XHJcbiAgICAgICAgc3BsaXRMZW5ndGggPSBtYXRjaFNwbGl0Lmxlbmd0aDtcclxuXHJcbiAgICAgICAgaWYoc3BsaXRMZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICBsZXQgaW5kZXhPZk0gPSBtYXRjaFNwbGl0WzBdLmluZGV4T2YoXCJtXCIpO1xyXG4gICAgICAgICAgICBsZXQgaW5kZXhPZkggPSBtYXRjaFNwbGl0WzBdLmluZGV4T2YoXCJoXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYoaW5kZXhPZk0gIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPSBtYXRjaFNwbGl0WzBdLnNsaWNlKDAsIGluZGV4T2ZNKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoaW5kZXhPZkggIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGhvdXJzID0gbWF0Y2hTcGxpdFswXS5zbGljZSgwLCBpbmRleE9mSCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBpbmRleE9mSCA9IG1hdGNoU3BsaXRbMF0uaW5kZXhPZihcImhcIik7XHJcbiAgICAgICAgICAgIGxldCBpbmRleE9mTSA9IG1hdGNoU3BsaXRbMV0uaW5kZXhPZihcIm1cIik7XHJcblxyXG4gICAgICAgICAgICBpZihpbmRleE9mSCAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgaG91cnMgPSBtYXRjaFNwbGl0WzBdLnNsaWNlKDAsIGluZGV4T2ZIKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoaW5kZXhPZk0gIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPSBtYXRjaFNwbGl0WzFdLnNsaWNlKDAsIGluZGV4T2ZNKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoaG91cnMpIHtcclxuICAgICAgICAgICAgYWRkaXRpb25hbE1pbnV0ZXMgPSBwYXJzZUludCg2MCAqIGhvdXJzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1pbnV0ZXMgPSBwYXJzZUludChtaW51dGVzKTtcclxuICAgICAgICBtaW51dGVzICs9IGFkZGl0aW9uYWxNaW51dGVzO1xyXG5cclxuICAgICAgICByZXR1cm4gbWludXRlcztcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVDb21tZW50KGRhdGEpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKVxyXG4gICAgICAgIGxldCBjcmVhdGVDb21tZW50UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2NvbW1lbnRcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjcmVhdGVDb21tZW50UHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcyBjcmVhdGluZyBjb21tZW50OlwiLCBkYXRhKTtcclxuICAgICAgICAgICAgJChcIiNhZGRDb21tZW50TW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGR1cmluZyBjb21tZW50IGNyZWF0aW9uXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgY29tbWVudCBjcmVhdGlvblwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVJc3N1ZShkYXRhKSB7XHJcbiAgICAgICAgbGV0IGNyZWF0ZUlzc3VlUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2lzc3VlXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY3JlYXRlSXNzdWVQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzIHJlZzpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICQoXCIjYWRkSXNzdWVNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZHVyaW5nIHByb2plY3QgY3JlYXRpb25cIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIGR1cmluZyBpc3N1ZSBjcmVhdGlvblwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVQcm9qZWN0KGRhdGEpIHtcclxuICAgICAgICBsZXQgZGVsZXRlUHJvamVjdFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9qZWN0XCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZWxldGVQcm9qZWN0UHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlUHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciByZW1vdmluZyBwcm9qZWN0XCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciB3aGlsZSByZW1vdmluZyBwcm9qZWN0XCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVByb2plY3QoZGF0YSkge1xyXG4gICAgICAgIGxldCB1cGRhdGVQcm9qZWN0UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL3Byb2plY3RcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MsIFwiLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICQoXCIjZWRpdFByb2plY3RNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB1cGRhdGVQcm9qZWN0UHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlUHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciByZW1vdmluZyBwcm9qZWN0XCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciB1cGRhdGluZyBwcm9qZWN0c1wiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVJc3N1ZShkYXRhKSB7XHJcbiAgICAgICAgbGV0IGRlbGV0ZUlzc3VlUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2lzc3VlXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZWxldGVJc3N1ZVByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZUlzc3VlTW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHJlbW92aW5nIGlzc3VlXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciByZW1vdmluZyBpc3N1ZVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVJc3N1ZShkYXRhKSB7XHJcbiAgICAgICAgbGV0IHVwZGF0ZUlzc3VlUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2lzc3VlXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2VkaXRQcm9qZWN0TW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdXBkYXRlSXNzdWVQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgJChcIiNkZWxldGVQcm9qZWN0TW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHVwZGF0aW5nIGlzc3VlXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciB3aGlsZSB1cGRhdGluZyBpc3N1ZVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwb3B1bGF0ZVByb2plY3RQYWdlKHByb2plY3RJZCkge1xyXG4gICAgICAgIGxldCBpc3N1ZXNQcm9taXNlID0gdGhpcy5nZXRJc3N1ZXMocHJvamVjdElkLCBwb3B1bGF0ZUlzc3Vlc1RlbXBsYXRlKTtcclxuICAgICAgICBsZXQgJGlzc3Vlc1NlY3Rpb24gPSAkKFwiLnByb2plY3QtcGFnZSAuaXNzdWVzLXNlY3Rpb25cIik7XHJcblxyXG4gICAgICAgIGlzc3Vlc1Byb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImlzc3VlcyBjb2xsZWN0aW9uIGlzOjpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgIHBvcHVsYXRlSXNzdWVzVGVtcGxhdGUoZGF0YSk7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcG9wdWxhdGVJc3N1ZXNUZW1wbGF0ZShpc3N1ZXNMaXN0KSB7XHJcbiAgICAgICAgICAgIGxldCBnZXRQcm9qZWN0c1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3RlbXBsYXRlcy90ZW1wbGF0ZXMuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZ2V0UHJvamVjdHNQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBzb3VyY2UgPSAkKGRhdGEpLmZpbmQoXCIjcHJvamVjdC10ZW1wbGF0ZVwiKS5odG1sKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGUgPSBIYW5kbGViYXJzLmNvbXBpbGUoc291cmNlKTtcclxuICAgICAgICAgICAgICAgIGxldCBjb250ZXh0ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzc3Vlc0xpc3Q6IGlzc3Vlc0xpc3RcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBsZXQgaHRtbCA9IHRlbXBsYXRlKGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgJGlzc3Vlc1NlY3Rpb24uaHRtbChodG1sKTtcclxuICAgICAgICAgICAgICAgICQoXCIjZWRpdElzc3VlTW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGR1cmluZyBpc3N1ZXMgdGVtcGxhdGUgZmV0Y2hcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgcHJvamVjdCBjcmVhdGlvblwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHBvcHVsYXRlSXNzdWVQYWdlKGlzc3VlSWQpIHtcclxuICAgICAgICBsZXQgaXNzdWVzUHJvbWlzZSA9IHRoaXMuZ2V0Q29tbWVudHMoaXNzdWVJZCk7XHJcbiAgICAgICAgbGV0ICRjb21tZW50c1NlY3Rpb24gPSAkKFwiLmlzc3VlLXBhZ2UgLmlzc3VlLWNvbW1lbnRzXCIpO1xyXG5cclxuICAgICAgICBpc3N1ZXNQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpc3N1ZXMgY29tbWVudHMgaXM6OlwiLCBkYXRhKTtcclxuICAgICAgICAgICAgcG9wdWxhdGVJc3N1ZXNUZW1wbGF0ZShkYXRhKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwb3B1bGF0ZUlzc3Vlc1RlbXBsYXRlKGNvbW1lbnRzTGlzdCkge1xyXG4gICAgICAgICAgICBjb21tZW50c0xpc3QuZm9yRWFjaCgoY29tbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYoY29tbWVudC5jcmVhdG9yLl9pZCA9PT0gd2luZG93LnJlc291cmNlcy51c2VyLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWVudC5pc0NvbW1lbnRPd25lciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWVudC5pc0NvbW1lbnRPd25lciA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBnZXRDb21tZW50c1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3RlbXBsYXRlcy90ZW1wbGF0ZXMuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZ2V0Q29tbWVudHNQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBzb3VyY2UgPSAkKGRhdGEpLmZpbmQoXCIjY29tbWVudHMtdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gSGFuZGxlYmFycy5jb21waWxlKHNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGV4dCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tZW50c0xpc3Q6IGNvbW1lbnRzTGlzdCxcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VXNlcjogd2luZG93LnJlc291cmNlcy51c2VyLmlkXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgbGV0IGh0bWwgPSB0ZW1wbGF0ZShjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgICRjb21tZW50c1NlY3Rpb24uaHRtbChodG1sKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBkdXJpbmcgY29tbWVudHMgdGVtcGxhdGUgZmV0Y2hcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgcHJvamVjdCBjcmVhdGlvblwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHBvcHVsYXRlUHJvamVjdHNQYWdlKCkge1xyXG4gICAgICAgIGxldCBwcm9qZWN0c1Byb21pc2UgPSB0aGlzLmdldFByb2plY3RzKCk7XHJcbiAgICAgICAgbGV0IHByb2plY3RzO1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgcHJvamVjdHNQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJmZXRjaGVkIHByb2plY3RzOlwiLCBkYXRhKTtcclxuICAgICAgICAgICAgcG9wdWxhdGVQcm9qZWN0c1RlbXBsYXRlKGRhdGEpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGZldGNoaW5nIHByb2plY3RzXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBmZXRjaGluZyBwcm9qZWN0c1wiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcG9wdWxhdGVQcm9qZWN0c1RlbXBsYXRlKHByb2plY3RzTGlzdCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwcm9qZWN0c0xpc3QpXHJcbiAgICAgICAgICAgIGxldCBnZXRQcm9qZWN0c1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3RlbXBsYXRlcy90ZW1wbGF0ZXMuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdodG1sJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZ2V0UHJvamVjdHNQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBzb3VyY2UgPSAkKGRhdGEpLmZpbmQoXCIjcHJvamVjdHMtdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gSGFuZGxlYmFycy5jb21waWxlKHNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGV4dCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0c0xpc3Q6IHByb2plY3RzTGlzdFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGxldCBodG1sID0gdGVtcGxhdGUoY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnByb2plY3RzU2VjdGlvbi5odG1sKGh0bWwpO1xyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBkdXJpbmcgcHJvamVjdHMgdGVtcGxhdGUgZmV0Y2hcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgcHJvamVjdCBjcmVhdGlvblwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVByb2plY3QoJHRhcmdldCkge1xyXG4gICAgICAgIGxldCBkYXRhID0gJHRhcmdldC5zZXJpYWxpemUoKTtcclxuXHJcbiAgICAgICAgbGV0IGNyZWF0ZVByb2plY3RQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvcHJvamVjdFwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MsIFwiLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgICQoXCIjYWRkUHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNyZWF0ZVByb2plY3RQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzIHJlZzpcIiwgZGF0YSk7XHJcblxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGR1cmluZyBwcm9qZWN0IGNyZWF0aW9uXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgcHJvamVjdCBjcmVhdGlvblwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQcm9qZWN0cyhjYWxsYmFjaykge1xyXG4gICAgICAgIGxldCBnZXRQcm9qZWN0c1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9qZWN0c0l0ZW1zXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZ2V0UHJvamVjdHNQcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldElzc3Vlcyhwcm9qZWN0SWQsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJwcmk6XCIsIHByb2plY3RJZCk7XHJcbiAgICAgICAgbGV0IGdldElzc3Vlc1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9pc3N1ZXNcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICBwcm9qZWN0SWQ6IHByb2plY3RJZFxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBnZXRJc3N1ZXNQcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENvbW1lbnRzKGlzc3VlSWQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImlzc3VlSWRsOlwiLCBpc3N1ZUlkKTtcclxuICAgICAgICBsZXQgZ2V0Q29tbWVudHNQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvY29tbWVudHNcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICBpc3N1ZUlkOiBpc3N1ZUlkXHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGdldENvbW1lbnRzUHJvbWlzZTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVDb21tZW50KGRhdGEpIHtcclxuICAgICAgICBsZXQgZGVzZXJpYWxpemVkRGF0YSA9IHRoaXMuZGVzZXJpYWxpemVGb3JtKGRhdGEpXHJcbiAgICAgICAgZGVzZXJpYWxpemVkRGF0YS5pc3N1ZUlkID0gd2luZG93LnJlc291cmNlcy5pc3N1ZTtcclxuICAgICAgICBsZXQgdXBkYXRlQ29tbWVudFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9jb21tZW50XCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGVzZXJpYWxpemVkRGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2VkaXRDb21tZW50TW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdXBkYXRlQ29tbWVudFByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZVByb2plY3RNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgdXBkYXRpbmcgaXNzdWVcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIHdoaWxlIHVwZGF0aW5nIGlzc3VlXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZUNvbW1lbnQoZGF0YSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgIGxldCBkZXNlcmlhbGl6ZWREYXRhID0gdGhpcy5kZXNlcmlhbGl6ZUZvcm0oZGF0YSlcclxuICAgICAgICBkZXNlcmlhbGl6ZWREYXRhLmlzc3VlSWQgPSB3aW5kb3cucmVzb3VyY2VzLmlzc3VlO1xyXG4gICAgICAgIGxldCBkZWxldGVDb21tZW50UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2NvbW1lbnRcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkZXNlcmlhbGl6ZWREYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MsIFwiLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlbGV0ZUNvbW1lbnRQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgJChcIiNkZWxldGVDb21tZW50TW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIHJlbW92aW5nIGNvbW1lbnRcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIHJlbW92aW5nIGNvbW1lbnRcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9naW5BbmRSZWdpc3Rlckxpc3RlbmVycygpIHtcclxuICAgICAgICBpZih0aGlzLmxvZ2luRm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2luRm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2luKCQoIGV2LnRhcmdldCApKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLnJlZ2lzdGVyRm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyRm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJChcIiNwYXNzd29yZDFcIikudmFsKCkgIT0gJChcIiNwYXNzd29yZDJcIikudmFsKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiLmZvcm0tZ3JvdXBcIikuYWRkQ2xhc3MoXCJoYXMtZXJyb3JcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJwYXNzd29yZHMgeW91IGVudGVyZWQgYXJlIG5vdCBpZGVudGljYWxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWdpc3RlcigkKCBldi50YXJnZXQgKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgSXNzdWVUcmFja2VyIGZyb20gJy4vSXNzdWVUcmFja2VyJztcclxuXHJcbmxldCBpc3N1ZVRyYWNrZXIgPSBuZXcgSXNzdWVUcmFja2VyKCk7XHJcbi8vY29uc29sZS5sb2coSXNzdWVUcmFja2VyKTtcclxuLy92YXIgW2EsIGIsIGNdID0gWzEgLCAyLCAzXTtcclxuIl19
