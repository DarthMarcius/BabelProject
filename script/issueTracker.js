export default class IssueTracker {
    constructor() {
        this.initOptions();
        this.setListeners();
    }

    initOptions() {
        this.createProjectButton = $(".add-project");
        this.createProjectModal = $("#addProjectModal");
    }

    setListeners() {
        this.createProjectButton.on("click", (ev) => {
            ev.preventDefault();
            this.createProjectModal.modal();
        });
    }
}
