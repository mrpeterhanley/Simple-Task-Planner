export default class AssigneeList {
  constructor() {
    this.list = [];
  }

  addAssignee(assignee) {
    // add a name to the assignee list
    this.list.push(assignee);
  }
  deleteAssignee(assignee) {
    // remove a name from the assignee list
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i] == assignee) {
        this.list.splice(i, 1);
      }
    }
  }

  getHtml(assignee) {
    let assigneeHtml = "";

    for (let i = 0; i < this.list.length; i++) {
      if (assignee == this.list[i]) {
        assigneeHtml += `<option value="${this.list[i]}" selected>${this.list[i]}</option>`;
      } else {
        assigneeHtml += `<option value="${this.list[i]}">${this.list[i]}</option>`;
      }
    }

    return assigneeHtml;
  }
}
