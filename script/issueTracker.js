export default class IssueTracker {
    constructor() {
        let ioPath = 'http://localhost:' + window.resources.port;
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
                this.populateProjectPage();
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

        $("body").on("click", ".project-item", (ev) => {
            let $target = $(ev.target).closest(".project-item");
            window.location.href = "project/" + $target.attr("data-project-id");
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
                console.log(estimatedMinutes)
            });
        }
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
            alert("Error fetching projects");
        });
    }

    deserializeForm(serializedFormData) {
        let serializedDataArray = serializedFormData.split("&");
        let deserializeddData = new Object();
        let itemSplit;

        for(let length = serializedDataArray.length, i = 0; i < length; i++) {
            itemSplit = serializedDataArray[i].split("=");
            deserializeddData[itemSplit[0]] = itemSplit[1];
        }
        return deserializeddData;
    }

    convertEstimate(estimateString) {
        estimateString = estimateString.replace("+", " ");

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
            alert("Error fetching projects");
        });
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
                   url: "templates/templates.html",
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

    populateProjectPage() {
        let $issueSection = $(".project-page .issues-section");
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
