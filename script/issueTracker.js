export default class IssueTracker {
    constructor() {
        let ioPath = window.location.hostname == "localhost" ? "http://localhost:" + resources.port : "https://" + window.location.hostname;
        this.socket = io(ioPath);
        this.initCache();
        this.initDom();
        this.setListeners();
    }

    initCache() {
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

    initDom() {
        if(this.dateTimePicker) {
            this.dateTimePicker.datetimepicker({
                defaultDate: new Date()
            });
            $("#date-time-picker-input").focus((ev) => {
                $(".input-group-addon").click();
            });
        }
    }

    login($target) {
        let data = $target.serialize();
        /*let name = data[0].value;
        let password = data[1].value;*/
        let loginPromise = new Promise((resolve, reject) => {
            let request = $.ajax({
               url: "/login",
               method: "POST",
               data: data
            });

            request.done((data) => {
                resolve(data);
            });

            request.fail((jqXHR, textStatus) => {
                reject(jqXHR, textStatus);
            });
        });

        loginPromise.then((data) => {
            window.location = data.redirectTo;
        })
        .catch((jqXHR, textStatus) => {
            this.loginErrorModal.modal();
        });
    }

    register($target) {
        let data = $target.serialize();
        /*let name = data[0].value;
        let password = data[1].value;*/
        let registerPromise = new Promise((resolve, reject) => {
            let request = $.ajax({
               url: "/register",
               method: "POST",
               data: data
            });

            request.done((data) => {
                resolve(data);
            });

            request.fail((jqXHR, textStatus) => {
                reject(jqXHR, textStatus);
            });
        });

        registerPromise.then((data) => {
            console.log("success reg:", data);
            window.location = data.redirectTo;
        })
        .catch((jqXHR, textStatus) => {
            console.log("login error", jqXHR, textStatus);
            this.registerErrorModal.modal();
        });
    }

    setListeners() {
        this.loginAndRegisterListeners();
        this.projectsListeners();
        this.issueListeners();

        $(window).load(() => {
            if(this.projectsPage) {
                this.populateProjectsPage();
            }

            if(this.projectPage) {
                this.populateProjectPage(window.resources.project);
            }

            if(this.issuePage) {
                this.populateIssuePage(window.resources.issue);
            }
        });
    }

    projectsListeners() {
        if(this.createProjectButton) {
            this.createProjectButton.on("click", (ev) => {
                ev.preventDefault();
                this.createProjectModal.modal();
            });
        }

        if(this.addNewProjectForm) {
            this.addNewProjectForm.on('submit', (ev) => {
                ev.preventDefault();
                this.createProject($(ev.target));
            });
        }

        $("body").on("click", this.projectEditSelector, (ev) => {
            ev.stopPropagation();
            let $parent = $(ev.target).closest("tr");
            let projectId = $parent.attr("data-project-id");
            let projectName = $parent.find(".pr-name").html();
            let projectDescription = $parent.find(".pr-description").html();

            $("#editProjectModal").modal();
            $("#updatee-project-id").val(projectId);
            $("#new-project-name").val(projectName);
            $("#new-description").val(projectDescription);
        });

        $("body").on("click", this.projectDeleteSelector, (ev) => {
            ev.stopPropagation();
            let projectId = $(ev.target).closest("tr").attr("data-project-id");
            $("#deleteProjectModal").modal();
            $("#delete-project-id").val(projectId);
        });

        $("body").on("submit", this.deleteProjectFormSelector, (ev) => {
            ev.preventDefault();
            this.removeProject($(ev.target).serialize());
        });

        $("body").on("submit", this.updateProjectFormSelector, (ev) => {
            ev.preventDefault();
            this.updateProject($(ev.target).serialize());
        });

        $("body").on("click", this.issueEditSelector, (ev) => {
            ev.stopPropagation();
            let $parent = $(ev.target).closest("tr");
            let issueId = $parent.attr("data-issue-id");
            let issueName = $parent.find(".issue-name").html();
            let issueDescription = $parent.find(".issue-description").html();

            $("#editIssueModal").modal();
            $("#updatee-issue-id").val(issueId);
            $("#new-issue-name").val(issueName);
            $("#new-description").val(issueDescription);
        });

        $("body").on("click", this.issueDeleteSelector, (ev) => {
            ev.stopPropagation();
            console.log("here")
            let issueId = $(ev.target).closest("tr").attr("data-issue-id");
            $("#deleteIssueModal").modal();
            $("#delete-issue-id").val(issueId);
        });

        if(this.deleteIssueForm) {
            this.deleteIssueForm.on("submit", (ev) => {
                ev.preventDefault();
                this.deleteIssue($(ev.target).serialize());
            });
        }

        if(this.updateIssueForm) {
            this.updateIssueForm.on("submit", (ev) => {
                ev.preventDefault();
                this.updateIssue($(ev.target).serialize());
            });
        }

        $("body").on("click", ".project-item", (ev) => {
            let $target = $(ev.target).closest(".project-item");
            window.location.href = "/project/" + $target.attr("data-project-id");
        });

        $("body").on("click", ".issue-item", (ev) => {
            let $target = $(ev.target).closest(".issue-item");
            window.location.href = "/issue/" + $target.attr("data-issue-id");
        });

        this.socket.on("updateProjects", () => {
            this.populateProjectsPage();
        });

        this.addIssue.on("click", (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            //console.log($("#addIssueModal"))
            $("#addIssueModal").modal();
        });

        if(this.addIssueForm) {
            this.addIssueForm.on("submit", (ev) => {
                ev.preventDefault();
                let serialized = $(ev.target).serialize();
                let deserializedData = this.deserializeForm(serialized);
                let estimatedMinutes = this.convertEstimate(deserializedData.originalEstimate);

                if(!estimatedMinutes) {
                    $(".original-estimate-group").addClass("has-error");
                    return;
                }

                deserializedData.originalEstimate = estimatedMinutes;
                this.createIssue(deserializedData);
                console.log(deserializedData)
            });
        }

        this.socket.on("updateIssues", (data) => {
            console.log(data);
            if(data.project == resources.project) {
                this.populateProjectPage(resources.project);
            }
        });
    }

    issueListeners() {
        if(this.addComment) {
            this.addComment.on("click", (ev) => {
                this.addCommentModal.modal();
            });
        }

        if(this.addWrokLog) {
            this.addWrokLog.on("click", (ev) => {
                this.addWorkLogModal.modal();
            });
        }

        $("body").on("submit", this.addNewCommentFormSelector, (ev) => {
            ev.preventDefault();
            this.createComment($(ev.target).serialize());
        });

        $("body").on("submit", this.addNewWorklogFormSelector, (ev) => {
            ev.preventDefault();
            let serialized = $(ev.target).serialize();
            let deserializedData = this.deserializeForm(serialized);
            let estimatedMinutes = this.convertEstimate(deserializedData.timeSpent);
            let logDateTime = new Date($("#date-time-picker-input").val());
            let result = new Object();

            if(!logDateTime || logDateTime === "Invalid Date") {
                $(".log-date-time").addClass("has-error");
                return;
            }

            if(!estimatedMinutes) {
                $(".time-spent-group").addClass("has-error");
                return;
            }

            result.estimatedMinutes = estimatedMinutes;
            result.logDateTime = logDateTime;
            result.text = deserializedData.text;
            result.creator = deserializedData.creator;
            result.issueId = deserializedData.issueId;

            this.createWorklog(result);
        });

        this.socket.on("updateComments", (data) => {
            if(data.issue == window.resources.issue) {
                this.populateIssueComments(window.resources.issue);
            }
        });

        this.socket.on("updateWorkLogs", (data) => {
            if(data.issue == window.resources.issue) {
                this.populateIssueWorklogs(window.resources.issue);
            }
        });

        $("body").on("click", this.deleteCommentThumbSelector, (ev) => {
            $("#deleteCommentModal").modal();
            $("#delete-comment-id").val($(ev.target).closest(".comment-item").attr("data-comment-id"));
        });

        $("body").on("click", this.editCommentThumbSelector, (ev) => {
            $("#editCommentModal").modal();
            $("#edit-comment-id").val($(ev.target).closest(".comment-item").attr("data-comment-id"));
            $("#comment-text").val($(ev.target).closest(".comment-item").find(".panel-body").text().trim());
        });

        if(this.deleteCommentForm) {
            this.deleteCommentForm.on("submit", (ev) => {
                ev.preventDefault();
                this.deleteComment($(ev.target).serialize());
            });
        }

        if(this.updateCommentForm) {
            this.updateCommentForm.on("submit", (ev) => {
                ev.preventDefault();
                this.updateComment($(ev.target).serialize());
            });
        }

        $("body").on("click", this.deleteWorklogButtonSelector, (ev) => {console.log("wha1")
            $("#deleteWorklogModal").modal();
            $("#delete-work-log-id").val($(ev.target).closest(".work-log-item").attr("data-work-log-id"));
        });

        $("body").on("click", this.ediWorklogButtonSelector, (ev) => {console.log("wha")
            $("#editWorklogModal").modal();
            $("#edit-work-log-id").val($(ev.target).closest(".work-log-item").attr("data-work-log-id"));
            $("#edit-work-log-text").val($(ev.target).closest(".work-log-item").find(".worklog-text").text().trim());
        });
    }

    deserializeForm(serializedFormData) {
        let serializedDataArray = serializedFormData.split("&");
        let deserializedData = new Object();
        let itemSplit;

        for(let length = serializedDataArray.length, i = 0; i < length; i++) {
            serializedDataArray[i] = serializedDataArray[i].replace(/\+/g, " ");

            itemSplit = serializedDataArray[i].split("=");
            deserializedData[itemSplit[0]] = itemSplit[1];
        }
        return deserializedData;
    }

    convertEstimate(estimateString) {
        let regexp = /(^\d*h \d*m$)|(^\d*(\.\d+)?h$)|(^\d*m$)/; /*e.g 1h 30m or 30m or 1.5h*/
        let match = estimateString.match(regexp);
        let matchSplit;
        let splitLength;
        let hours;
        let minutes = 0;
        let additionalMinutes = 0;

        if(!match) {
            return false;
        }

        match = match[0];
        matchSplit = match.split(" ");
        splitLength = matchSplit.length;

        if(splitLength == 1) {
            let indexOfM = matchSplit[0].indexOf("m");
            let indexOfH = matchSplit[0].indexOf("h");

            if(indexOfM != -1) {
                minutes = matchSplit[0].slice(0, indexOfM);
            }

            if(indexOfH != -1) {
                hours = matchSplit[0].slice(0, indexOfH);
            }
        }else {
            let indexOfH = matchSplit[0].indexOf("h");
            let indexOfM = matchSplit[1].indexOf("m");

            if(indexOfH != -1) {
                hours = matchSplit[0].slice(0, indexOfH);
            }

            if(indexOfM != -1) {
                minutes = matchSplit[1].slice(0, indexOfM);
            }
        }

        if(hours) {
            additionalMinutes = parseInt(60 * hours);
        }

        minutes = parseInt(minutes);
        minutes += additionalMinutes;

        return minutes;
    }

    minutesToString(minutes) {
        let hours = minutes / 60;
        let resultString = hours < 1 ? ( (minutes == 1) ? parseInt(minutes) + " minute" : parseInt(minutes) + " minutes" ) : ( (hours == 1) ? hours + " hour" : hours + " hours" );
        resultString = 'Time spent ' + resultString;

        return resultString;
    }

    createComment(data) {
        console.log(data)
        let createCommentPromise = new Promise((resolve, reject) => {
            let request = $.ajax({
               url: "/comment",
               method: "POST",
               data: data
            });

            request.done((data) => {
                console.log("success, ", data);
                resolve(data);
            });

            request.fail((jqXHR, textStatus) => {
                reject(jqXHR, textStatus);
            });
        });

        createCommentPromise.then((data) => {
            console.log("success creating comment:", data);
            $("#addCommentModal").modal("hide");
        })
        .catch((jqXHR, textStatus) => {
            console.log("Error during comment creation", jqXHR, textStatus);
            alert("Error during comment creation");
        });
    }

    createIssue(data) {
        let createIssuePromise = new Promise((resolve, reject) => {
            let request = $.ajax({
               url: "/issue",
               method: "POST",
               data: data
            });

            request.done((data) => {
                console.log("success, ", data);
                resolve(data);
            });

            request.fail((jqXHR, textStatus) => {
                reject(jqXHR, textStatus);
            });
        });

        createIssuePromise.then((data) => {
            console.log("success reg:", data);
            $("#addIssueModal").modal("hide");
        })
        .catch((jqXHR, textStatus) => {
            console.log("error during project creation", jqXHR, textStatus);
            alert("Error during issue creation");
        });
    }

    removeProject(data) {
        let deleteProjectPromise = new Promise((resolve, reject) => {
            let request = $.ajax({
               url: "/project",
               method: "DELETE",
               data: data
            });

            request.done((data) => {
                console.log("success, ", data);
                resolve(data);
            });

            request.fail((jqXHR, textStatus) => {
                reject(jqXHR, textStatus);
            });
        });

        deleteProjectPromise.then((data) => {
            $("#deleteProjectModal").modal("hide");
        })
        .catch((jqXHR, textStatus) => {
            console.log("error removing project", jqXHR, textStatus);
            alert("Error while removing project");
        });
    }

    updateProject(data) {
        let updateProjectPromise = new Promise((resolve, reject) => {
            let request = $.ajax({
               url: "/project",
               method: "PUT",
               data: data
            });

            request.done((data) => {
                console.log("success, ", data);
                $("#editProjectModal").modal("hide");
                resolve(data);
            });

            request.fail((jqXHR, textStatus) => {
                reject(jqXHR, textStatus);
            });
        });

        updateProjectPromise.then((data) => {
            $("#deleteProjectModal").modal("hide");
        })
        .catch((jqXHR, textStatus) => {
            console.log("error removing project", jqXHR, textStatus);
            alert("Error updating projects");
        });
    }

    deleteIssue(data) {
        let deleteIssuePromise = new Promise((resolve, reject) => {
            let request = $.ajax({
               url: "/issue",
               method: "DELETE",
               data: data
            });

            request.done((data) => {
                console.log("success, ", data);
                resolve(data);
            });

            request.fail((jqXHR, textStatus) => {
                reject(jqXHR, textStatus);
            });
        });

        deleteIssuePromise.then((data) => {
            $("#deleteIssueModal").modal("hide");
        })
        .catch((jqXHR, textStatus) => {
            console.log("error removing issue", jqXHR, textStatus);
            alert("Error removing issue");
        });
    }

    updateIssue(data) {
        let updateIssuePromise = new Promise((resolve, reject) => {
            let request = $.ajax({
               url: "/issue",
               method: "PUT",
               data: data
            });

            request.done((data) => {
                console.log("success, ", data);
                $("#editProjectModal").modal("hide");
                resolve(data);
            });

            request.fail((jqXHR, textStatus) => {
                reject(jqXHR, textStatus);
            });
        });

        updateIssuePromise.then((data) => {
            $("#deleteProjectModal").modal("hide");
        })
        .catch((jqXHR, textStatus) => {
            console.log("error updating issue", jqXHR, textStatus);
            alert("Error while updating issue");
        });
    }

    populateProjectPage(projectId) {
        let issuesPromise = this.getIssues(projectId, populateIssuesTemplate);
        let $issuesSection = $(".project-page .issues-section");

        issuesPromise.then((data) => {
            console.log("issues collection is::", data);
            populateIssuesTemplate(data);
        })

        function populateIssuesTemplate(issuesList) {
            let getProjectsPromise = new Promise((resolve, reject) => {
                let request = $.ajax({
                   url: "/templates/templates.html",
                   method: "GET",
                   dataType: 'html'
                });

                request.done((data) => {
                    resolve(data);
                });

                request.fail((jqXHR, textStatus) => {
                    reject(jqXHR, textStatus);
                });
            });

            getProjectsPromise.then((data) => {
                let source = $(data).find("#project-template").html();
                let template = Handlebars.compile(source);
                let context = {
                    issuesList: issuesList
                };
                let html = template(context);
                $issuesSection.html(html);
                $("#editIssueModal").modal("hide");
            })
            .catch((jqXHR, textStatus) => {
                console.log("error during issues template fetch", jqXHR, textStatus);
                alert("Error during project creation");
            });
        }
    }

    populateIssuePage(issueId) {
        this.populateIssueComments(issueId);
        this.populateIssueWorklogs(issueId);
    }

    populateIssueComments(issueId) {
        let commentsPromise = this.getComments(issueId);
        let $commentsSection = $(".issue-page .issue-comments");

        commentsPromise.then((data) => {
            console.log("issues comments is::", data);
            populateCommentsTemplate(data);
        })

        function populateCommentsTemplate(commentsList) {
            commentsList.forEach((comment) => {
                if(comment.creator._id === window.resources.user.id) {
                    comment.isCommentOwner = true;
                }else {
                    comment.isCommentOwner = false;
                }
            });

            let getCommentsPromise = new Promise((resolve, reject) => {
                let request = $.ajax({
                   url: "/templates/templates.html",
                   method: "GET",
                   dataType: 'html'
                });

                request.done((data) => {
                    resolve(data);
                });

                request.fail((jqXHR, textStatus) => {
                    reject(jqXHR, textStatus);
                });
            });

            getCommentsPromise.then((data) => {
                let source = $(data).find("#comments-template").html();
                let template = Handlebars.compile(source);
                let context = {
                    commentsList: commentsList,
                    currentUser: window.resources.user.id
                };
                let html = template(context);
                $commentsSection.html(html);
            })
            .catch((jqXHR, textStatus) => {
                console.log("error during comments template fetch", jqXHR, textStatus);
                alert("Error during project creation");
            });
        }
    }

    populateIssueWorklogs(issueId) {
        let workLogsPromise = this.getWorklogs(issueId);
        let $workLogsSection = $(".issue-page .issue-worklogs");

        workLogsPromise.then((data) => {
            console.log("issues logs is:", data);
            data.forEach((workLog) => {
                workLog.timeSpent = this.minutesToString(workLog.timeSpent);
            });

            populateWorklogsTemplate(data);
        })

        function populateWorklogsTemplate(workLogsList) {
            workLogsList.forEach((workLog) => {
                if(workLog.creator._id === window.resources.user.id) {
                    workLog.isWorkLogOwner = true;
                }else {
                    workLog.isWorkLogOwner = false;
                }
            });

            let getWorkLogsPromise = new Promise((resolve, reject) => {
                let request = $.ajax({
                   url: "/templates/templates.html",
                   method: "GET",
                   dataType: 'html'
                });

                request.done((data) => {
                    resolve(data);
                });

                request.fail((jqXHR, textStatus) => {
                    reject(jqXHR, textStatus);
                });
            });

            getWorkLogsPromise.then((data) => {
                let source = $(data).find("#work-logs-template").html();
                let template = Handlebars.compile(source);
                let context = {
                    workLogsList: workLogsList,
                    currentUser: window.resources.user.id
                };
                let html = template(context);
                $workLogsSection.html(html);
            })
            .catch((jqXHR, textStatus) => {
                console.log("error during comments template fetch", jqXHR, textStatus);
                alert("Error during project creation");
            });
        }
    }

    populateProjectsPage() {
        let projectsPromise = this.getProjects();
        let projects;
        let that = this;

        projectsPromise.then((data) => {
            console.log("fetched projects:", data);
            populateProjectsTemplate(data);
        })
        .catch((jqXHR, textStatus) => {
            console.log("error fetching projects", jqXHR, textStatus);
            alert("Error fetching projects");
        });

        function populateProjectsTemplate(projectsList) {
            console.log(projectsList)
            let getProjectsPromise = new Promise((resolve, reject) => {
                let request = $.ajax({
                   url: "/templates/templates.html",
                   method: "GET",
                   dataType: 'html'
                });

                request.done((data) => {
                    resolve(data);
                });

                request.fail((jqXHR, textStatus) => {
                    reject(jqXHR, textStatus);
                });
            });

            getProjectsPromise.then((data) => {
                let source = $(data).find("#projects-template").html();
                let template = Handlebars.compile(source);
                let context = {
                    projectsList: projectsList
                };
                let html = template(context);
                that.projectsSection.html(html);

            })
            .catch((jqXHR, textStatus) => {
                console.log("error during projects template fetch", jqXHR, textStatus);
                alert("Error during project creation");
            });
        }
    }

    createProject($target) {
        let data = $target.serialize();

        let createProjectPromise = new Promise((resolve, reject) => {
            let request = $.ajax({
               url: "/project",
               method: "POST",
               data: data
            });

            request.done((data) => {
                console.log("success, ", data);
                $("#addProjectModal").modal("hide");
                resolve(data);
            });

            request.fail((jqXHR, textStatus) => {
                reject(jqXHR, textStatus);
            });
        });

        createProjectPromise.then((data) => {
            console.log("success reg:", data);

        })
        .catch((jqXHR, textStatus) => {
            console.log("error during project creation", jqXHR, textStatus);
            alert("Error during project creation");
        });
    }

    getProjects(callback) {
        let getProjectsPromise = new Promise((resolve, reject) => {
            let request = $.ajax({
               url: "/projectsItems",
               method: "GET"
            });

            request.done((data) => {
                resolve(data);
            });

            request.fail((jqXHR, textStatus) => {
                reject(jqXHR, textStatus);
            });
        });
        return getProjectsPromise;
    }

    getIssues(projectId, callback) {
        console.log("pri:", projectId);
        let getIssuesPromise = new Promise((resolve, reject) => {
            let request = $.ajax({
               url: "/issues",
               method: "GET",
               data: {
                   projectId: projectId
               }
            });

            request.done((data) => {
                resolve(data);
            });

            request.fail((jqXHR, textStatus) => {
                reject(jqXHR, textStatus);
            });
        });
        return getIssuesPromise;
    }

    getComments(issueId) {
        console.log("issueIdl:", issueId);
        let getCommentsPromise = new Promise((resolve, reject) => {
            let request = $.ajax({
               url: "/comments",
               method: "GET",
               data: {
                   issueId: issueId
               }
            });

            request.done((data) => {
                resolve(data);
            });

            request.fail((jqXHR, textStatus) => {
                reject(jqXHR, textStatus);
            });
        });
        return getCommentsPromise;
    }

    getWorklogs(issueId) {
        let getWorkLogsPromise = new Promise((resolve, reject) => {
            let request = $.ajax({
               url: "/logs",
               method: "GET",
               data: {
                   issueId: issueId
               }
            });

            request.done((data) => {
                resolve(data);
            });

            request.fail((jqXHR, textStatus) => {
                reject(jqXHR, textStatus);
            });
        });
        return getWorkLogsPromise;
    }

    updateComment(data) {
        let deserializedData = this.deserializeForm(data)
        deserializedData.issueId = window.resources.issue;
        let updateCommentPromise = new Promise((resolve, reject) => {
            let request = $.ajax({
               url: "/comment",
               method: "PUT",
               data: deserializedData
            });

            request.done((data) => {
                console.log("success, ", data);
                $("#editCommentModal").modal("hide");
                resolve(data);
            });

            request.fail((jqXHR, textStatus) => {
                reject(jqXHR, textStatus);
            });
        });

        updateCommentPromise.then((data) => {
            $("#deleteProjectModal").modal("hide");
        })
        .catch((jqXHR, textStatus) => {
            console.log("error updating issue", jqXHR, textStatus);
            alert("Error while updating issue");
        });
    }

    deleteComment(data) {
        console.log(data);
        let deserializedData = this.deserializeForm(data)
        deserializedData.issueId = window.resources.issue;
        let deleteCommentPromise = new Promise((resolve, reject) => {
            let request = $.ajax({
               url: "/comment",
               method: "DELETE",
               data: deserializedData
            });

            request.done((data) => {
                console.log("success, ", data);
                resolve(data);
            });

            request.fail((jqXHR, textStatus) => {
                reject(jqXHR, textStatus);
            });
        });

        deleteCommentPromise.then((data) => {
            $("#deleteCommentModal").modal("hide");
        })
        .catch((jqXHR, textStatus) => {
            console.log("error removing comment", jqXHR, textStatus);
            alert("Error removing comment");
        });
    }

    createWorklog(data) {
        let createWorklogPromise = new Promise((resolve, reject) => {
            let request = $.ajax({
               url: "/log",
               method: "POST",
               data: data
            });

            request.done((data) => {
                console.log("success, ", data);
                resolve(data);
            });

            request.fail((jqXHR, textStatus) => {
                reject(jqXHR, textStatus);
            });
        });

        createWorklogPromise.then((data) => {
            console.log("success reg:", data);
            $("#addWorkLogModal").modal("hide");
        })
        .catch((jqXHR, textStatus) => {
            console.log("error during log creation", jqXHR, textStatus);
            alert("Error during log creation");
        });
    }

    loginAndRegisterListeners() {
        if(this.loginForm) {
            this.loginForm.on("submit", (ev) => {
                ev.preventDefault();
                this.login($( ev.target ));
            });
        }

        if(this.registerForm) {
            this.registerForm.on("submit", (ev) => {
                ev.preventDefault();

                if($("#password1").val() != $("#password2").val()) {
                    $(".form-group").addClass("has-error");
                    alert("passwords you entered are not identical");
                    return false;
                }
                this.register($( ev.target ));
            });
        }
    }
}
