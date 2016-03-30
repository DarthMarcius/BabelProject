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
        console.log(ioPath);
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
                    console.log("success, ", data);
                    resolve(data);
                });

                request.fail(function (jqXHR, textStatus) {
                    reject(jqXHR, textStatus);
                });
            });

            loginPromise.then(function (data) {
                window.location = data.redirectTo;
            }).catch(function (jqXHR, textStatus) {
                //console.log("login error", jqXHR, textStatus);
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
                    console.log("success, ", data);
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

            this.socket.on("updateProjects", function () {
                _this4.populateProjectsPage();
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
                alert("Error fetching projects");
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
                    console.log("success, ", data);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRcXElzc3VlVHJhY2tlci5qcyIsInNjcmlwdFxcYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztJQ0FxQixZQUFZO0FBQzdCLGFBRGlCLFlBQVksR0FDZjs4QkFERyxZQUFZOztBQUV6QixZQUFJLE1BQU0sR0FBRyxtQkFBbUIsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztBQUN6RCxlQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BCLFlBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3pCLFlBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNqQixZQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7S0FDdkI7O2lCQVBnQixZQUFZOztvQ0FTakI7QUFDUixnQkFBSSxDQUFDLG1CQUFtQixHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUNoRixnQkFBSSxDQUFDLGtCQUFrQixHQUFHLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsa0JBQWtCLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDdkYsZ0JBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ3BFLGdCQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzdDLGdCQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDN0UsZ0JBQUks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Q0FBQztBQUNqRCwrQkFBTyxLQUFLLENBQUM7cUJBQ2hCO0FBQ0QsMkJBQUssUUFBUSxDQUFDLENBQUMsQ0FBRSxFQUFFLENBQUMsTUFBTSxDQUFFLENBQUMsQ0FBQztpQkFDakMsQ0FBQyxDQUFDO2FBQ047U0FDSjs7O1dBalVnQixZQUFZOzs7a0JBQVosWUFBWTs7Ozs7Ozs7Ozs7QUNFakMsSUFBSSxZQUFZLEdBQUcsNEJBQWtCOzs7QUFBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBJc3N1ZVRyYWNrZXIge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgbGV0IGlvUGF0aCA9ICdodHRwOi8vbG9jYWxob3N0OicgKyB3aW5kb3cucmVzb3VyY2VzLnBvcnQ7XHJcbiAgICAgICAgY29uc29sZS5sb2coaW9QYXRoKTtcclxuICAgICAgICB0aGlzLnNvY2tldCA9IGlvKGlvUGF0aCk7XHJcbiAgICAgICAgdGhpcy5pbml0Q2FjaGUoKTtcclxuICAgICAgICB0aGlzLnNldExpc3RlbmVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRDYWNoZSgpIHtcclxuICAgICAgICB0aGlzLmNyZWF0ZVByb2plY3RCdXR0b24gPSAkKFwiLmFkZC1wcm9qZWN0XCIpLmxlbmd0aCA/ICQoXCIuYWRkLXByb2plY3RcIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmNyZWF0ZVByb2plY3RNb2RhbCA9ICQoXCIjYWRkUHJvamVjdE1vZGFsXCIpLmxlbmd0aCA/ICQoXCIjYWRkUHJvamVjdE1vZGFsXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5sb2dpbkZvcm0gPSAkKFwiLmxvZ2luLWZvcm1cIikubGVuZ3RoID8gJChcIi5sb2dpbi1mb3JtXCIpIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5sb2dpbkVycm9yTW9kYWwgPSAkKFwiI0xvZ2luRXJyb3JNb2RhbFwiKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyRm9ybSA9ICQoXCIucmVnaXN0ZXItZm9ybVwiKS5sZW5ndGggPyAkKFwiLnJlZ2lzdGVyLWZvcm1cIikgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXJyb3JNb2RhbCA9ICQoXCIjUmVnaXN0cmF0aW9uRXJyb3JNb2RhbFwiKTtcclxuICAgICAgICB0aGlzLmFkZE5ld1Byb2plY3RGb3JtID0gJChcIiNhZGROZXdQcm9qZWN0XCIpLmxlbmd0aCA/ICQoXCIjYWRkTmV3UHJvamVjdFwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucHJvamVjdHNQYWdlID0gJChcIi5wcm9qZWN0cy1wYWdlXCIpLmxlbmd0aCA/ICQoXCIucHJvamVjdHMtcGFnZVwiKSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucHJvamVjdHNTZWN0aW9uID0gJChcIi5wcm9qZWN0cy1zZWN0aW9uXCIpO1xyXG4gICAgICAgIHRoaXMucHJvamVjdEVkaXRTZWxlY3RvciA9IFwiLnByb2plY3QtZWRpdFwiO1xyXG4gICAgICAgIHRoaXMucHJvamVjdERlbGV0ZVNlbGVjdG9yID0gXCIucHJvamVjdC1kZWxldGVcIjtcclxuICAgICAgICB0aGlzLmRlbGV0ZVByb2plY3RGb3JtU2VsZWN0b3IgPSBcIiNkZWxldGVQcm9qZWN0XCI7XHJcbiAgICAgICAgdGhpcy51cGRhdGVQcm9qZWN0Rm9ybVNlbGVjdG9yID0gXCIjdXBkYXRlUHJvamVjdFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ2luKCR0YXJnZXQpIHtcclxuICAgICAgICBsZXQgZGF0YSA9ICR0YXJnZXQuc2VyaWFsaXplKCk7XHJcbiAgICAgICAgLypsZXQgbmFtZSA9IGRhdGFbMF0udmFsdWU7XHJcbiAgICAgICAgbGV0IHBhc3N3b3JkID0gZGF0YVsxXS52YWx1ZTsqL1xyXG4gICAgICAgIGxldCBsb2dpblByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9sb2dpblwiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5kb25lKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MsIFwiLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxvZ2luUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGRhdGEucmVkaXJlY3RUbztcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImxvZ2luIGVycm9yXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgdGhpcy5sb2dpbkVycm9yTW9kYWwubW9kYWwoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZWdpc3RlcigkdGFyZ2V0KSB7XHJcbiAgICAgICAgbGV0IGRhdGEgPSAkdGFyZ2V0LnNlcmlhbGl6ZSgpO1xyXG4gICAgICAgIC8qbGV0IG5hbWUgPSBkYXRhWzBdLnZhbHVlO1xyXG4gICAgICAgIGxldCBwYXNzd29yZCA9IGRhdGFbMV0udmFsdWU7Ki9cclxuICAgICAgICBsZXQgcmVnaXN0ZXJQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvcmVnaXN0ZXJcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZWdpc3RlclByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MgcmVnOlwiLCBkYXRhKTtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gZGF0YS5yZWRpcmVjdFRvO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChqcVhIUiwgdGV4dFN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvZ2luIGVycm9yXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgdGhpcy5yZWdpc3RlckVycm9yTW9kYWwubW9kYWwoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgdGhpcy5sb2dpbkFuZFJlZ2lzdGVyTGlzdGVuZXJzKCk7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0c0xpc3RlbmVycygpO1xyXG5cclxuICAgICAgICAkKHdpbmRvdykubG9hZCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMucHJvamVjdHNQYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvcHVsYXRlUHJvamVjdHNQYWdlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm9qZWN0c0xpc3RlbmVycygpIHtcclxuICAgICAgICBpZih0aGlzLmNyZWF0ZVByb2plY3RCdXR0b24pIHtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVQcm9qZWN0QnV0dG9uLm9uKFwiY2xpY2tcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVQcm9qZWN0TW9kYWwubW9kYWwoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLmFkZE5ld1Byb2plY3RGb3JtKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkTmV3UHJvamVjdEZvcm0ub24oJ3N1Ym1pdCcsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUHJvamVjdCgkKGV2LnRhcmdldCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgdGhpcy5wcm9qZWN0RWRpdFNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGxldCAkcGFyZW50ID0gJChldi50YXJnZXQpLmNsb3Nlc3QoXCJ0clwiKTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3RJZCA9ICRwYXJlbnQuYXR0cihcImRhdGEtcHJvamVjdC1pZFwiKTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3ROYW1lID0gJHBhcmVudC5maW5kKFwiLnByLW5hbWVcIikuaHRtbCgpO1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdERlc2NyaXB0aW9uID0gJHBhcmVudC5maW5kKFwiLnByLWRlc2NyaXB0aW9uXCIpLmh0bWwoKTtcclxuXHJcbiAgICAgICAgICAgICQoXCIjZWRpdFByb2plY3RNb2RhbFwiKS5tb2RhbCgpO1xyXG4gICAgICAgICAgICAkKFwiI3VwZGF0ZWUtcHJvamVjdC1pZFwiKS52YWwocHJvamVjdElkKTtcclxuICAgICAgICAgICAgJChcIiNuZXctcHJvamVjdC1uYW1lXCIpLnZhbChwcm9qZWN0TmFtZSk7XHJcbiAgICAgICAgICAgICQoXCIjbmV3LWRlc2NyaXB0aW9uXCIpLnZhbChwcm9qZWN0RGVzY3JpcHRpb24pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIHRoaXMucHJvamVjdERlbGV0ZVNlbGVjdG9yLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0SWQgPSAkKGV2LnRhcmdldCkuY2xvc2VzdChcInRyXCIpLmF0dHIoXCJkYXRhLXByb2plY3QtaWRcIik7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlUHJvamVjdE1vZGFsXCIpLm1vZGFsKCk7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlLXByb2plY3QtaWRcIikudmFsKHByb2plY3RJZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwic3VibWl0XCIsIHRoaXMuZGVsZXRlUHJvamVjdEZvcm1TZWxlY3RvciwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlUHJvamVjdCgkKGV2LnRhcmdldCkuc2VyaWFsaXplKCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5vbihcInN1Ym1pdFwiLCB0aGlzLnVwZGF0ZVByb2plY3RGb3JtU2VsZWN0b3IsIChldikgPT4ge1xyXG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVByb2plY3QoJChldi50YXJnZXQpLnNlcmlhbGl6ZSgpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zb2NrZXQub24oXCJ1cGRhdGVQcm9qZWN0c1wiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVQcm9qZWN0c1BhZ2UoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVQcm9qZWN0KGRhdGEpIHtcclxuICAgICAgICBsZXQgZGVsZXRlUHJvamVjdFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9qZWN0XCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZWxldGVQcm9qZWN0UHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjZGVsZXRlUHJvamVjdE1vZGFsXCIpLm1vZGFsKFwiaGlkZVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciByZW1vdmluZyBwcm9qZWN0XCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgYWxlcnQoXCJFcnJvciBmZXRjaGluZyBwcm9qZWN0c1wiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVQcm9qZWN0KGRhdGEpIHtcclxuICAgICAgICBsZXQgdXBkYXRlUHJvamVjdFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9qZWN0XCIsXHJcbiAgICAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2VkaXRQcm9qZWN0TW9kYWxcIikubW9kYWwoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdXBkYXRlUHJvamVjdFByb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2RlbGV0ZVByb2plY3RNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgcmVtb3ZpbmcgcHJvamVjdFwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZmV0Y2hpbmcgcHJvamVjdHNcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcG9wdWxhdGVQcm9qZWN0c1BhZ2UoKSB7XHJcbiAgICAgICAgbGV0IHByb2plY3RzUHJvbWlzZSA9IHRoaXMuZ2V0UHJvamVjdHMoKTtcclxuICAgICAgICBsZXQgcHJvamVjdHM7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgICBwcm9qZWN0c1Byb21pc2UudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3M6XCIsIGRhdGEpO1xyXG4gICAgICAgICAgICBwb3B1bGF0ZVByb2plY3RzVGVtcGxhdGUoZGF0YSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZmV0Y2hpbmcgcHJvamVjdHNcIiwganFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICBhbGVydChcIkVycm9yIGZldGNoaW5nIHByb2plY3RzXCIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBwb3B1bGF0ZVByb2plY3RzVGVtcGxhdGUocHJvamVjdHNMaXN0KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHByb2plY3RzTGlzdClcclxuICAgICAgICAgICAgbGV0IGdldFByb2plY3RzUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgIHVybDogXCJ0ZW1wbGF0ZXMvdGVtcGxhdGVzLmh0bWxcIixcclxuICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnaHRtbCdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGdldFByb2plY3RzUHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc291cmNlID0gJChkYXRhKS5maW5kKFwiI3Byb2plY3RzLXRlbXBsYXRlXCIpLmh0bWwoKTtcclxuICAgICAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IEhhbmRsZWJhcnMuY29tcGlsZShzb3VyY2UpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbnRleHQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdHNMaXN0OiBwcm9qZWN0c0xpc3RcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBsZXQgaHRtbCA9IHRlbXBsYXRlKGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgdGhhdC5wcm9qZWN0c1NlY3Rpb24uaHRtbChodG1sKTtcclxuXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgZHVyaW5nIHByb2plY3RzIHRlbXBsYXRlIGZldGNoXCIsIGpxWEhSLCB0ZXh0U3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZHVyaW5nIHByb2plY3QgY3JlYXRpb25cIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVQcm9qZWN0KCR0YXJnZXQpIHtcclxuICAgICAgICBsZXQgZGF0YSA9ICR0YXJnZXQuc2VyaWFsaXplKCk7XHJcblxyXG4gICAgICAgIGxldCBjcmVhdGVQcm9qZWN0UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICB1cmw6IFwiL3Byb2plY3RcIixcclxuICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2FkZFByb2plY3RNb2RhbFwiKS5tb2RhbChcImhpZGVcIik7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjcmVhdGVQcm9qZWN0UHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcyByZWc6XCIsIGRhdGEpO1xyXG5cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoanFYSFIsIHRleHRTdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvciBkdXJpbmcgcHJvamVjdCBjcmVhdGlvblwiLCBqcVhIUiwgdGV4dFN0YXR1cyk7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3IgZHVyaW5nIHByb2plY3QgY3JlYXRpb25cIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UHJvamVjdHMoY2FsbGJhY2spIHtcclxuICAgICAgICBsZXQgZ2V0UHJvamVjdHNQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgIHVybDogXCIvcHJvamVjdHNJdGVtc1wiLFxyXG4gICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCJcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmRvbmUoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzcywgXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0LmZhaWwoKGpxWEhSLCB0ZXh0U3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoanFYSFIsIHRleHRTdGF0dXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZ2V0UHJvamVjdHNQcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ2luQW5kUmVnaXN0ZXJMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgaWYodGhpcy5sb2dpbkZvcm0pIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dpbkZvcm0ub24oXCJzdWJtaXRcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dpbigkKCBldi50YXJnZXQgKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5yZWdpc3RlckZvcm0pIHtcclxuICAgICAgICAgICAgdGhpcy5yZWdpc3RlckZvcm0ub24oXCJzdWJtaXRcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCQoXCIjcGFzc3dvcmQxXCIpLnZhbCgpICE9ICQoXCIjcGFzc3dvcmQyXCIpLnZhbCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcIi5mb3JtLWdyb3VwXCIpLmFkZENsYXNzKFwiaGFzLWVycm9yXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwicGFzc3dvcmRzIHlvdSBlbnRlcmVkIGFyZSBub3QgaWRlbnRpY2FsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMucmVnaXN0ZXIoJCggZXYudGFyZ2V0ICkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IElzc3VlVHJhY2tlciBmcm9tICcuL0lzc3VlVHJhY2tlcic7XHJcblxyXG5sZXQgaXNzdWVUcmFja2VyID0gbmV3IElzc3VlVHJhY2tlcigpO1xyXG4vL2NvbnNvbGUubG9nKElzc3VlVHJhY2tlcik7XHJcbi8vdmFyIFthLCBiLCBjXSA9IFsxICwgMiwgM107XHJcbiJdfQ==
