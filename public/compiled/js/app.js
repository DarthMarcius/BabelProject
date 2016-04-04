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

        var ioPath = "https://" + window.location.hostname + window.resources.port;
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
            var projects = void 0;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRcXElzc3VlVHJhY2tlci5qcyIsInNjcmlwdFxcYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztJQ0FxQjtBQUNqQixhQURpQixZQUNqQixHQUFjOzhCQURHLGNBQ0g7O0FBQ1YsWUFBSSxTQUFTLGFBQWEsT0FBTyxRQUFQLENBQWdCLFFBQWhCLEdBQTJCLE9BQU8sU0FBUCxDQUFpQixJQUFqQixDQUQzQztBQUVWLGFBQUssTUFBTCxHQUFjLEdBQUcsTUFBSCxDQUFkLENBRlU7QUFHVixhQUFLLFNBQUwsR0FIVTtBQUlWLGFBQUssWUFBTCxHQUpVO0tBQWQ7O2lCQURpQjs7b0NBUUw7QUFDUixpQkFBSyxtQkFBTCxHQUEyQixFQUFFLGNBQUYsRUFBa0IsTUFBbEIsR0FBMkIsRUFBRSxjQUFGLENBQTNCLEdBQStDLEtBQS9DLENBRG5CO0FBRVIsaUJBQUssa0JBQUwsR0FBMEIsRUFBRSxrQkFBRixFQUFzQixNQUF0QixHQUErQixFQUFFLGtCQUFGLENBQS9CLEdBQXVELEtBQXZELENBRmxCO0FBR1IsaUJBQUssU0FBTCxHQUFpQixFQUFFLGFBQUYsRUFBaUIsTUFBakIsR0FBMEIsRUFBRSxhQUFGLENBQTFCLEdBQTZDLEtBQTdDLENBSFQ7QUFJUixpQkFBSyxlQUFMLEdBQXVCLEVBQUUsa0JBQUYsQ0FBdkIsQ0FKUTtBQUtSLGlCQUFLLFlBQUwsR0FBb0IsRUFBRSxnQkFBRixFQUFvQixNQUFwQixHQUE2QixFQUFFLGdCQUFGLENBQTdCLEdBQW1ELEtBQW5ELENBTFo7QUFNUixpQkFBSyxrQkFBTCxHQUEwQixFQUFFLHlCQUFGLENBQTFCLENBTlE7QUFPUixpQkFBSyxpQkFBTCxHQUF5QixFQUFFLGdCQUFGLEVBQW9CLE1BQXBCLEdBQTZCLEVBQUUsZ0JBQUYsQ0FBN0IsR0FBbUQsS0FBbkQsQ0FQakI7QUFRUixpQkFBSyxZQUFMLEdBQW9C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QUFmIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIElzc3VlVHJhY2tlciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBsZXQgaW9QYXRoID0gXCJodHRwczovL1wiICsgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lICsgd2luZG93LnJlc291cmNlcy5wb3J0O1xyXG4gICAgICAgIHRoaXMuc29ja2V0ID0gaW8oaW9QYXRoKTtcclxuICAgICAgICB0aGlzLmluaXRDYWNoZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0TGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdENhY2hlKCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlUHJvamVjdEJ1dHRvbiA9ICQoXCIuYWRkLXByb2plY3RcIikubGVuZ3RoID8gJChcIi5hZGQtcHJvamVjdFwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlUHJvamVjdE1vZGFsID0gJChcIiNhZGRQcm9qZWN0TW9kYWxcIikubGVuZ3RoID8gJChcIiNhZGRQcm9qZWN0TW9kYWxcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmxvZ2luRm9ybSA9ICQoXCIubG9naW4tZm9ybVwiKS5sZW5ndGggPyAkKFwiLmxvZ2luLWZvcm1cIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmxvZ2luRXJyb3JNb2RhbCA9ICQoXCIjTG9naW5FcnJvck1vZGFsXCIpO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJGb3JtID0gJChcIi5yZWdpc3Rlci1mb3JtXCIpLmxlbmd0aCA/ICQoXCIucmVnaXN0ZXItZm9ybVwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFcnJvck1vZGFsID0gJChcIiNSZWdpc3RyYXRpb25FcnJvck1vZGFsXCIpO1xyXG4gICAgICAgIHRoaXMuYWRkTmV3UHJvamVjdEZvcm0gPSAkKFwiI2FkZE5ld1Byb2plY3RcIikubGVuZ3RoID8gJChcIiNhZGROZXdQcm9qZWN0XCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0c1BhZ2UgPSAkKFwiLnByb2plY3RzLXBhZ2VcIikubGVuZ3RoID8gJChcIi5wcm9qZWN0cy1wYWdlXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0c1NlY3Rpb24gPSAkKFwiLnByb2plY3RzLXNlY3Rpb25cIik7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0RWRpdFNlbGVjdG9yID0gXCIucHJvamVjdC1lZGl0XCI7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0RGVsZXRlU2VsZWN0b3IgPSBcIi5wcm9qZWN0LWRlbGV0ZVwiO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlUHJvamVjdEZvcm1TZWxlY3RvciA9IFwiI2RlbGV0ZVByb2plY3RcIjtcclxuICAgICAgICB0aGlzLnVwZGF0ZVByb2plY3RGb3JtU2VsZWN0b3IgPSBcIiN1cGRhdGVQcm9qZWN0XCI7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0UGFnZSA9ICQoXCIucHJvamVjdC1wYWdlXCIpLmxlbmd0aCA/ICQoXCIucHJvamVjdC1wYWdlXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5hZGRJc3N1ZSA9ICQoXCIuYWRkLWlzc3VlXCIpO1xyXG4gICAgICAgIHRoaXMuYWRkSXNzdWVGb3JtID0gJChcIiNhZGROZXdJc3N1ZVwiKS5sZW5ndGggPyAkKFwiI2FkZE5ld0lzc3VlXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy51cGRhdGVJc3N1ZUZvcm0gPSAkKFwiI3VwZGF0ZUlzc3VlXCIpLmxlbmd0aCA/ICQoXCIjdXBkYXRlSXNzdWVcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmRlbGV0ZUlzc3VlRm9ybSA9ICQoXCIjZGVsZXRlSXNzdWVcIikubGVuZ3RoID8gJChcIiNkZWxldGVJc3N1ZVwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuaXNzdWVFZGl0U2VsZWN0b3IgPSBcIi5pc3N1ZS1lZGl0XCI7XHJcbiAgICAgICAgdGhpcy5pc3N1ZURlbGV0ZVNlbGVjdG9yID0gXCIuaXNzdWUtZGVsZXRlXCI7XHJcbiAgICB9XHJcblxyXG4gICAgbG9naW4oJHRhcmdldCkge1xyXG4gICAgICAgIGxldCBkYXRhID0gJHRhcmdldC5zZXJpYWxpemUoKTtcclxuICAgICAgICAvKmxldCBuYW1lID0gZGF0YVswXS52YWx1ZTtcclxuICAgICAgICBsZXQgcGFzc3dvcmQgPSBkYXRhWzFdLnZhbHVlOyovXHJcbiAgICAgICAgbGV0IGxvZ2luUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL2xvZ2luXCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxvZ2luUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGRhdGEucmVkaXJlY3RUbztcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5sb2dpbkVycm9yTW9kYWwubW9kYWwoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZWdpc3RlcigkdGFyZ2V0KSB7XHJcbiAgICAgICAgbGV0IGRhdGEgPSAkdGFyZ2V0LnNlcmlhbGl6ZSgpO1xyXG4gICAgICAgIC8qbGV0IG5hbWUgPSBkYXRhWzBdLnZhbHVlO1xyXG4gICAgICAgIGxldCBwYXNzd29yZCA9IGRhdGFbMV0udmFsdWU7Ki9cclxuICAgICAgICBsZXQgcmVnaXN0ZXJQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvcmVnaXN0ZXJcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmVnaXN0ZXJQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzIHJlZzpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGRhdGEucmVkaXJlY3RUbztcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2dpbiBlcnJvclwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFcnJvck1vZGFsLm1vZGFsKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0TGlzdGVuZXJzKCkge1xyXG4gICAgICAgIHRoaXMubG9naW5BbmRSZWdpc3Rlckxpc3RlbmVycygpO1xyXG4gICAgICAgIHRoaXMucHJvamVjdHNMaXN0ZW5lcnMoKTtcclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLmxvYWQoKCkgPT4ge1xyXG4gICAgICAgICAgICBpZih0aGlzLnByb2plY3RzUGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZVByb2plY3RzUGFnZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLnByb2plY3RQYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvcHVsYXRlUHJvamVjdFBhZ2Uod2luZG93LnJlc291cmNlcy5wcm9qZWN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb2plY3RzTGlzdGVuZXJzKCkge1xyXG4gICAgICAgIGlmKHRoaXMuY3JlYXRlUHJvamVjdEJ1dHRvbikge1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVByb2plY3RCdXR0b24ub24oXCJjbGlja1wiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVByb2plY3RNb2RhbC5tb2RhbCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMuYWRkTmV3UHJvamVjdEZvcm0pIHtcclxuICAgICAgICAgICAgdGhpcy5hZGROZXdQcm9qZWN0Rm9ybS5vbignc3VibWl0JywgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVQcm9qZWN0KCQoZXYudGFyZ2V0KSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJjbGlja1wiLCB0aGlzLnByb2plY3RFZGl0U2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgbGV0ICRwYXJlbnQgPSAkKGV2LnRhcmdldCkuY2xvc2VzdChcInRyXCIpO1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdElkID0gJHBhcmVudC5hdHRyKFwiZGF0YS1wcm9qZWN0LWlkXCIpO1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdE5hbWUgPSAkcGFyZW50LmZpbmQoXCIucHItbmFtZVwiKS5odG1sKCk7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0RGVzY3JpcHRpb24gPSAkcGFyZW50LmZpbmQoXCIucHItZGVzY3JpcHRpb25cIikuaHRtbCgpO1xyXG5cclxuICAgICAgICAgICAgJChcIiNlZGl0UHJvamVjdE1vZGFsXCIpLm1vZGFsKCk7XHJcbiAgICAgICAgICAgICQoXCIjdXBkYXRlZS1wcm9qZWN0LWlkXCIpLnZhbChwcm9qZWN0SWQpO1xyXG4gICAgICAgICAgICAkKFwiI25ldy1wcm9qZWN0LW5hbWVcIikudmFsKHByb2plY3ROYW1lKTtcclxuICAgICAgICAgICAgJChcIiNuZXctZGVzY3JpcHRpb25cIikudmFsKHByb2plY3REZXNjcmlwdGlvbik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgdGhpcy5wcm9qZWN0RGVsZXRlU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3RJZCA9ICQoZXYudGFyZ2V0KS5jbG9zZXN0KFwidHJcIikuYXR0cihcImRhdGEtcHJvamVjdC1pZFwiKTtcclxuICAgICAgICAgICAgJChcIiNkZWxldGVQcm9qZWN0TW9kYWxcIikubW9kYWwoKTtcclxuICAgICAgICAgICAgJChcIiNkZWxldGUtcHJvamVjdC1pZFwiKS52YWwocHJvamVjdElkKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcImJvZHlcIikub24oXCJzdWJtaXRcIiwgdGhpcy5kZWxldGVQcm9qZWN0Rm9ybVNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVQcm9qZWN0KCQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwic3VibWl0XCIsIHRoaXMudXBkYXRlUHJvamVjdEZvcm1TZWxlY3RvciwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUHJvamVjdCgkKGV2LnRhcmdldCkuc2VyaWFsaXplKCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIHRoaXMuaXNzdWVFZGl0U2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgbGV0ICRwYXJlbnQgPSAkKGV2LnRhcmdldCkuY2xvc2VzdChcInRyXCIpO1xyXG4gICAgICAgICAgICBsZXQgaXNzdWVJZCA9ICRwYXJlbnQuYXR0cihcImRhdGEtaXNzdWUtaWRcIik7XHJcbiAgICAgICAgICAgIGxldCBpc3N1ZU5hbWUgPSAkcGFyZW50LmZpbmQoXCIuaXNzdWUtbmFtZVwiKS5odG1sKCk7XHJcbiAgICAgICAgICAgIGxldCBpc3N1ZURlc2NyaXB0aW9uID0gJHBhcmVudC5maW5kKFwiLmlzc3VlLWRlc2NyaXB0aW9uXCIpLmh0bWwoKTtcclxuXHJcbiAgICAgICAgICAgICQoXCIjZWRpdElzc3VlTW9kYWxcIikubW9kYWwoKTtcclxuICAgICAgICAgICAgJChcIiN1cGRhdGVlLWlzc3VlLWlkXCIpLnZhbChpc3N1ZUlkKTtcclxuICAgICAgICAgICAgJChcIiNuZXctaXNzdWUtbmFtZVwiKS52YWwoaXNzdWVOYW1lKTtcclxuICAgICAgICAgICAgJChcIiNuZXctZGVzY3JpcHRpb25cIikudmFsKGlzc3VlRGVzY3JpcHRpb24pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIHRoaXMuaXNzdWVEZWxldGVTZWxlY3RvciwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImhlcmVcIilcclxuICAgICAgICAgICAgbGV0IGlzc3VlSWQgPSAkKGV2LnRhcmdldCkuY2xvc2VzdChcInRyXCIpLmF0dHIoXCJkYXRhLWlzc3VlLWlkXCIpO1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZUlzc3VlTW9kYWxcIikubW9kYWwoKTtcclxuICAgICAgICAgICAgJChcIiNkZWxldGUtaXNzdWUtaWRcIikudmFsKGlzc3VlSWQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZih0aGlzLmRlbGV0ZUlzc3VlRm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUlzc3VlRm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUlzc3VlKCQoZXYudGFyZ2V0KS5zZXJpYWxpemUoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy51cGRhdGVJc3N1ZUZvcm0pIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVJc3N1ZUZvcm0ub24oXCJzdWJtaXRcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVJc3N1ZSgkKGV2LnRhcmdldCkuc2VyaWFsaXplKCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgXCIucHJvamVjdC1pdGVtXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICBsZXQgJHRhcmdldCA9ICQoZXYudGFyZ2V0KS5jbG9zZXN0KFwiLnByb2plY3QtaXRlbVwiKTtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9wcm9qZWN0L1wiICsgJHRhcmdldC5hdHRyKFwiZGF0YS1wcm9qZWN0LWlkXCIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIFwiLmlzc3VlLWl0ZW1cIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCAkdGFyZ2V0ID0gJChldi50YXJnZXQpLmNsb3Nlc3QoXCIuaXNzdWUtaXRlbVwiKTtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9pc3N1ZS9cIiArICR0YXJnZXQuYXR0cihcImRhdGEtaXNzdWUtaWRcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc29ja2V0Lm9uKFwidXBkYXRlUHJvamVjdHNcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRlUHJvamVjdHNQYWdlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkSXNzdWUub24oXCJjbGlja1wiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCQoXCIjYWRkSXNzdWVNb2RhbFwiKSlcclxuICAgICAgICAgICAgJChcIiNhZGRJc3N1ZU1vZGFsXCIpLm1vZGFsKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuYWRkSXNzdWVGb3JtKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkSXNzdWVGb3JtLm9uKFwic3VibWl0XCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIGxldCBzZXJpYWxpemVkID0gJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGRlc2VyaWFsaXplZERhdGEgPSB0aGlzLmRlc2VyaWFsaXplRm9ybShzZXJpYWxpemVkKTtcclxuICAgICAgICAgICAgICAgIGxldCBlc3RpbWF0ZWRNaW51dGVzID0gdGhpcy5jb252ZXJ0RXN0aW1hdGUoZGVzZXJpYWxpemVkRGF0YS5vcmlnaW5hbEVzdGltYXRlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZighZXN0aW1hdGVkTWludXRlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICQoXCIub3JpZ2luYWwtZXN0aW1hdGUtZ3JvdXBcIikuYWRkQ2xhc3MoXCJoYXMtZXJyb3JcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGRlc2VyaWFsaXplZERhdGEub3JpZ2luYWxFc3RpbWF0ZSA9IGVzdGltYXRlZE1pbnV0ZXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUlzc3VlKGRlc2VyaWFsaXplZERhdGEpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGVzZXJpYWxpemVkRGF0YSlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNvY2tldC5vbihcInVwZGF0ZUlzc3Vlc1wiLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgaWYoZGF0YS5wcm9qZWN0ID09IHJlc291cmNlcy5wcm9qZWN0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvcHVsYXRlUHJvamVjdFBhZ2UocmVzb3VyY2VzLnByb2plY3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzZXJpYWxpemVGb3JtKHNlcmlhbGl6ZWRGb3JtRGF0YSkge1xyXG4gICAgICAgIGxldCBzZXJpYWxpemVkRGF0YUFycmF5ID0gc2VyaWFsaXplZEZvcm1EYXRhLnNwbGl0KFwiJlwiKTtcclxuICAgICAgICBsZXQgZGVzZXJpYWxpemVkZERhdGEgPSBuZXcgT2JqZWN0KCk7XHJcbiAgICAgICAgbGV0IGl0ZW1TcGxpdDtcclxuXHJcbiAgICAgICAgZm9yKGxldCBsZW5ndGggPSBzZXJpYWxpemVkRGF0YUFycmF5Lmxlbmd0aCwgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBzZXJpYWxpemVkRGF0YUFycmF5W2ldID0gc2VyaWFsaXplZERhdGFBcnJheVtpXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpO1xyXG5cclxuICAgICAgICAgICAgaXRlbVNwbGl0ID0gc2VyaWFsaXplZERhdGFBcnJheVtpXS5zcGxpdChcIj1cIik7XHJcbiAgICAgICAgICAgIGRlc2VyaWFsaXplZGREYXRhW2l0ZW1TcGxpdFswXV0gPSBpdGVtU3BsaXRbMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkZXNlcmlhbGl6ZWRkRGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBjb252ZXJ0RXN0aW1hdGUoZXN0aW1hdGVTdHJpbmcpIHtcclxuICAgICAgICBsZXQgcmVnZXhwID0gLyheXFxkKmggXFxkKm0kKXwoXlxcZCooXFwuXFxkKyk/aCQpfCheXFxkKm0kKS87IC8qZS5nIDFoIDMwbSBvciAzMG0gb3IgMS41aCovXHJcbiAgICAgICAgbGV0IG1hdGNoID0gZXN0aW1hdGVTdHJpbmcubWF0Y2gocmVnZXhwKTtcclxuICAgICAgICBsZXQgbWF0Y2hTcGxpdDtcclxuICAgICAgICBsZXQgc3BsaXRMZW5ndGg7XHJcbiAgICAgICAgbGV0IGhvdXJzO1xyXG4gICAgICAgIGxldCBtaW51dGVzID0gMDtcclxuICAgICAgICBsZXQgYWRkaXRpb25hbE1pbnV0ZXMgPSAwO1xyXG5cclxuICAgICAgICBpZighbWF0Y2gpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWF0Y2ggPSBtYXRjaFswXTtcclxuICAgICAgICBtYXRjaFNwbGl0ID0gbWF0Y2guc3BsaXQoXCIgXCIpO1xyXG4gICAgICAgIHNwbGl0TGVuZ3RoID0gbWF0Y2hTcGxpdC5sZW5ndGg7XHJcblxyXG4gICAgICAgIGlmKHNwbGl0TGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgbGV0IGluZGV4T2ZNID0gbWF0Y2hTcGxpdFswXS5pbmRleE9mKFwibVwiKTtcclxuICAgICAgICAgICAgbGV0IGluZGV4T2ZIID0gbWF0Y2hTcGxpdFswXS5pbmRleE9mKFwiaFwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGluZGV4T2ZNICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBtaW51dGVzID0gbWF0Y2hTcGxpdFswXS5zbGljZSgwLCBpbmRleE9mTSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKGluZGV4T2ZIICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBob3VycyA9IG1hdGNoU3BsaXRbMF0uc2xpY2UoMCwgaW5kZXhPZkgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgaW5kZXhPZkggPSBtYXRjaFNwbGl0WzBdLmluZGV4T2YoXCJoXCIpO1xyXG4gICAgICAgICAgICBsZXQgaW5kZXhPZk0gPSBtYXRjaFNwbGl0WzFdLmluZGV4T2YoXCJtXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYoaW5kZXhPZkggIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGhvdXJzID0gbWF0Y2hTcGxpdFswXS5zbGljZSgwLCBpbmRleE9mSCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKGluZGV4T2ZNICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBtaW51dGVzID0gbWF0Y2hTcGxpdFsxXS5zbGljZSgwLCBpbmRleE9mTSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKGhvdXJzKSB7XHJcbiAgICAgICAgICAgIGFkZGl0aW9uYWxNaW51dGVzID0gcGFyc2VJbnQoNjAgKiBob3Vycyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtaW51dGVzID0gcGFyc2VJbnQobWludXRlcyk7XHJcbiAgICAgICAgbWludXRlcyArPSBhZGRpdGlvbmFsTWludXRlcztcclxuXHJcbiAgICAgICAgcmV0dXJuIG1pbnV0ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlSXNzdWUoZGF0YSkge1xyXG4gICAgICAgIGxldCBjcmVhdGVJc3N1ZVByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9pc3N1ZVwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MsIFwiLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNyZWF0ZUlzc3VlUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcyByZWc6XCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAkKFwiI2FkZElzc3VlTW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIGR1cmluZyBwcm9qZWN0IGNyZWF0aW9uXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBkdXJpbmcgaXNzdWUgY3JlYXRpb25cIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlUHJvamVjdChkYXRhKSB7XHJcbiAgICAgICAgbGV0IGRlbGV0ZVByb2plY3RQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvcHJvamVjdFwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVsZXRlUHJvamVjdFByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZVByb2plY3RNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgcmVtb3ZpbmcgcHJvamVjdFwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3Igd2hpbGUgcmVtb3ZpbmcgcHJvamVjdFwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVQcm9qZWN0KGRhdGEpIHtcclxuICAgICAgICBsZXQgdXBkYXRlUHJvamVjdFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9qZWN0XCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2VkaXRQcm9qZWN0TW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdXBkYXRlUHJvamVjdFByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZVByb2plY3RNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgcmVtb3ZpbmcgcHJvamVjdFwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgdXBkYXRpbmcgcHJvamVjdHNcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlSXNzdWUoZGF0YSkge1xyXG4gICAgICAgIGxldCBkZWxldGVJc3N1ZVByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9pc3N1ZVwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVsZXRlSXNzdWVQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgJChcIiNkZWxldGVJc3N1ZU1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciByZW1vdmluZyBpc3N1ZVwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgcmVtb3ZpbmcgaXNzdWVcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlSXNzdWUoZGF0YSkge1xyXG4gICAgICAgIGxldCB1cGRhdGVJc3N1ZVByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9pc3N1ZVwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXHJcbiAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNlZGl0UHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHVwZGF0ZUlzc3VlUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlUHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciB1cGRhdGluZyBpc3N1ZVwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3Igd2hpbGUgdXBkYXRpbmcgaXNzdWVcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcG9wdWxhdGVQcm9qZWN0UGFnZShwcm9qZWN0SWQpIHtcclxuICAgICAgICBsZXQgaXNzdWVzUHJvbWlzZSA9IHRoaXMuZ2V0SXNzdWVzKHByb2plY3RJZCwgcG9wdWxhdGVJc3N1ZXNUZW1wbGF0ZSk7XHJcbiAgICAgICAgbGV0ICRpc3N1ZXNTZWN0aW9uID0gJChcIi5wcm9qZWN0LXBhZ2UgLmlzc3Vlcy1zZWN0aW9uXCIpO1xyXG5cclxuICAgICAgICBpc3N1ZXNQcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpc3N1ZXMgY29sbGVjdGlvbiBpczo6XCIsIGRhdGEpO1xyXG4gICAgICAgICAgICBwb3B1bGF0ZUlzc3Vlc1RlbXBsYXRlKGRhdGEpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHBvcHVsYXRlSXNzdWVzVGVtcGxhdGUoaXNzdWVzTGlzdCkge1xyXG4gICAgICAgICAgICBsZXQgZ2V0UHJvamVjdHNQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgdXJsOiBcIi90ZW1wbGF0ZXMvdGVtcGxhdGVzLmh0bWxcIixcclxuICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnaHRtbCdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGdldFByb2plY3RzUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc291cmNlID0gJChkYXRhKS5maW5kKFwiI3Byb2plY3QtdGVtcGxhdGVcIikuaHRtbCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlID0gSGFuZGxlYmFycy5jb21waWxlKHNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGV4dCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBpc3N1ZXNMaXN0OiBpc3N1ZXNMaXN0XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgbGV0IGh0bWwgPSB0ZW1wbGF0ZShjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgICRpc3N1ZXNTZWN0aW9uLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2VkaXRJc3N1ZU1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBkdXJpbmcgaXNzdWVzIHRlbXBsYXRlIGZldGNoXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZHVyaW5nIHByb2plY3QgY3JlYXRpb25cIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwb3B1bGF0ZVByb2plY3RzUGFnZSgpIHtcclxuICAgICAgICBsZXQgcHJvamVjdHNQcm9taXNlID0gdGhpcy5nZXRQcm9qZWN0cygpO1xyXG4gICAgICAgIGxldCBwcm9qZWN0cztcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgICAgIHByb2plY3RzUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzczpcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgIHBvcHVsYXRlUHJvamVjdHNUZW1wbGF0ZShkYXRhKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBmZXRjaGluZyBwcm9qZWN0c1wiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZmV0Y2hpbmcgcHJvamVjdHNcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHBvcHVsYXRlUHJvamVjdHNUZW1wbGF0ZShwcm9qZWN0c0xpc3QpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocHJvamVjdHNMaXN0KVxyXG4gICAgICAgICAgICBsZXQgZ2V0UHJvamVjdHNQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgdXJsOiBcIi90ZW1wbGF0ZXMvdGVtcGxhdGVzLmh0bWxcIixcclxuICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnaHRtbCdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGdldFByb2plY3RzUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc291cmNlID0gJChkYXRhKS5maW5kKFwiI3Byb2plY3RzLXRlbXBsYXRlXCIpLmh0bWwoKTtcclxuICAgICAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IEhhbmRsZWJhcnMuY29tcGlsZShzb3VyY2UpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbnRleHQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdHNMaXN0OiBwcm9qZWN0c0xpc3RcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBsZXQgaHRtbCA9IHRlbXBsYXRlKGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgdGhhdC5wcm9qZWN0c1NlY3Rpb24uaHRtbChodG1sKTtcclxuXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZHVyaW5nIHByb2plY3RzIHRlbXBsYXRlIGZldGNoXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZHVyaW5nIHByb2plY3QgY3JlYXRpb25cIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVQcm9qZWN0KCR0YXJnZXQpIHtcclxuICAgICAgICBsZXQgZGF0YSA9ICR0YXJnZXQuc2VyaWFsaXplKCk7XHJcblxyXG4gICAgICAgIGxldCBjcmVhdGVQcm9qZWN0UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL3Byb2plY3RcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2FkZFByb2plY3RNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjcmVhdGVQcm9qZWN0UHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcyByZWc6XCIsIGRhdGEpO1xyXG5cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBkdXJpbmcgcHJvamVjdCBjcmVhdGlvblwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZHVyaW5nIHByb2plY3QgY3JlYXRpb25cIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UHJvamVjdHMoY2FsbGJhY2spIHtcclxuICAgICAgICBsZXQgZ2V0UHJvamVjdHNQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvcHJvamVjdHNJdGVtc1wiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCJcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGdldFByb2plY3RzUHJvbWlzZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRJc3N1ZXMocHJvamVjdElkLCBjYWxsYmFjaykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicHJpOlwiLCBwcm9qZWN0SWQpO1xyXG4gICAgICAgIGxldCBnZXRQcm9qZWN0c1Byb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9pc3N1ZXNcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICBwcm9qZWN0SWQ6IHByb2plY3RJZFxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBnZXRQcm9qZWN0c1Byb21pc2U7XHJcbiAgICB9XHJcblxyXG4gICAgbG9naW5BbmRSZWdpc3Rlckxpc3RlbmVycygpIHtcclxuICAgICAgICBpZih0aGlzLmxvZ2luRm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2luRm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2luKCQoIGV2LnRhcmdldCApKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLnJlZ2lzdGVyRm9ybSkge1xyXG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyRm9ybS5vbihcInN1Ym1pdFwiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJChcIiNwYXNzd29yZDFcIikudmFsKCkgIT0gJChcIiNwYXNzd29yZDJcIikudmFsKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiLmZvcm0tZ3JvdXBcIikuYWRkQ2xhc3MoXCJoYXMtZXJyb3JcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJwYXNzd29yZHMgeW91IGVudGVyZWQgYXJlIG5vdCBpZGVudGljYWxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWdpc3RlcigkKCBldi50YXJnZXQgKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgSXNzdWVUcmFja2VyIGZyb20gJy4vSXNzdWVUcmFja2VyJztcclxuXHJcbmxldCBpc3N1ZVRyYWNrZXIgPSBuZXcgSXNzdWVUcmFja2VyKCk7XHJcbi8vY29uc29sZS5sb2coSXNzdWVUcmFja2VyKTtcclxuLy92YXIgW2EsIGIsIGNdID0gWzEgLCAyLCAzXTtcclxuIl19
