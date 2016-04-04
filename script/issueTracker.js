export default class IssueTracker {
    constructor() {
        let ioPath = "https://" + window.location.hostname + ":" + window.resources.port;
        this.socket = io(ioPath);
        this.initCache();
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
        this.addIssue = $(".add-issue");
        this.addIssueForm = $("#addNewIssue").length ? $("#addNewIssue") : false;
        this.updateIssueForm = $("#updateIssue").length ? $("#updateIssue") : false;
        this.deleteIssueForm = $("#deleteIssue").length ? $("#deleteIssue") : false;
        this.issueEditSelector = ".issue-edit";
        this.issueDeleteSelector = ".issue-delete";
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

        $(window).load(() => {
            if(this.projectsPage) {
                this.populateProjectsPage();
            }

            if(this.projectPage) {
                this.populateProjectPage(window.resources.project);
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
            console.log($("#addIssueModal"))
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

    deserializeForm(serializedFormData) {
        let serializedDataArray = serializedFormData.split("&");
        let deserializeddData = new Object();
        let itemSplit;

        for(let length = serializedDataArray.length, i = 0; i < length; i++) {
            serializedDataArray[i] = serializedDataArray[i].replace(/\+/g, " ");

            itemSplit = serializedDataArray[i].split("=");
            deserializeddData[itemSplit[0]] = itemSplit[1];
        }
        return deserializeddData;
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

    populateProjectsPage() {
        let projectsPromise = this.getProjects();
        let projects;
        let that = this;

        projectsPromise.then((data) => {
            console.log("success:", data);
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
        let getProjectsPromise = new Promise((resolve, reject) => {
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
        return getProjectsPromise;
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
