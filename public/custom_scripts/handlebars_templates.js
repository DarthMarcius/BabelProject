window.templates = {
    projects:'
    <table class="projects-table table table-hover">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Creator</th>
                    <th>Change Date</th>
                </tr>
            </thead>
            <tbody>
                <tr data-project={id: {{id}}; href: {{href}}}>
                    <td>1</td>
                    <td>MyName</td>
                    <td>asda asd ada asd</td>
                    <td>Yoma</td>
                    <td>1.13.2015</td>
                    <td><button class="project-edit btn btn-info">Edit</button></td>
                    <td><button class="project-delete btn btn-danger">Delete</button></td>
                </tr>
            </tbody>
    </table>'
}
