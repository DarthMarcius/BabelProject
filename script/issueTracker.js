export default class IssueTracker {
    constructor() {
        let ioPath = 'http://localhost:' + window.resources.port;
        console.log(ioPath);
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
                console.log("success, ", data);
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
            //console.log("login error", jqXHR, textStatus);
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
                console.log("success, ", data);
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

        this.socket.on("updateProjects", () => {
            this.populateProjectsPage();
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
            alert("Error fetching projects");
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
                console.log("success, ", data);
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
