export default class IssueTracker {
    constructor() {
        this.socket = io('http://localhost:' + window.resources.port);
        this.initOptions();
        this.setListeners();
    }

    initOptions() {
        this.createProjectButton = $(".add-project").length ? $(".add-project") : false;
        this.createProjectModal = $("#addProjectModal").length ? $("#addProjectModal") : false;
        this.loginForm = $(".login-form").length ? $(".login-form") : false;
        this.loginErrorModal = $("#LoginErrorModal");
        this.registerForm = $(".register-form").length ? $(".register-form") : false;
        this.registerErrorModal = $("#RegistrationErrorModal");
        this.addNewProjectForm = $("#addNewProject").length ? $("#addNewProject") : false;
        this.projectsPage = $(".projects-page").length ? $(".projects-page") : false;
        this.projectsSection = $(".projects-section");
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
