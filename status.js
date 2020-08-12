export default class Status {
  constructor(status) {
    this.status = status;
  }

  getHtml() {
    let statusHtml;

    switch (this.status) {
      case "In progress":
        statusHtml = `<option value="Not started">Not started</option>
            <option value="In progress" selected>In progress</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>`;

        return statusHtml;

      case "Completed":
        statusHtml = `<option value="Not started">Not started</option>
            <option value="In progress">In progress</option>
            <option value="Completed" selected>Completed</option>
            <option value="Overdue">Overdue</option>`;

        return statusHtml;

      case "Overdue":
        statusHtml = `<option value="Not started">Not started</option>
            <option value="In progress">In progress</option>
            <option value="Completed">Completed</option>
            <option value="Overdue" selected>Overdue</option>`;

        return statusHtml;

      default:
        statusHtml = `<option value="Not started" selected>Not started</option>
            <option value="In progress">In progress</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>`;

        return statusHtml;
    }
  }
}
