export default class Task {
  constructor(id, name, details, assignee, duedate, status) {
    this.id = id;
    this.detailId = "d" + id;
    this.name = name;
    this.details = details;
    this.assignee = assignee;
    this.duedate = duedate;
    this.status = status;
  }

  buildColumn(alignment) {
    let col = document.createElement("td");
    col.setAttribute("scope", "col");
    col.classList.add(alignment);
    return col;
  }

  buildBadge(text, badgeClass = "badge-secondary") {
    let badge = document.createElement("span");
    badge.classList.add("badge", "m-1", badgeClass);
    badge.innerHTML = text;
    return badge;
  }

  buildTask(parentElement) {
    let newTaskRow = document.createElement("tr");

    // create the checkbox column
    let input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("data-id", this.id);
    input.classList.add("checkbox", "m-1");

    let col1 = this.buildColumn("center");
    col1.appendChild(input);
    newTaskRow.appendChild(col1);

    // create the task name column
    let col2 = this.buildColumn();
    col2.classList.add("truncate");
    col2.innerHTML = this.name;
    newTaskRow.appendChild(col2);

    // create the task assignee column
    let col3 = this.buildColumn("center");
    col3.appendChild(this.buildBadge(this.assignee));
    newTaskRow.appendChild(col3);

    // create the due date column
    let dueDateBadge;
    let taskDate = new Date(this.duedate);
    let currentDate = new Date();

    // compare the task due date to the current date
    if (
      taskDate.getFullYear() == currentDate.getFullYear() &&
      taskDate.getMonth() == currentDate.getMonth() &&
      taskDate.getDate() == currentDate.getDate()
    ) {
      // task due today, set due date badge color to yellow

      dueDateBadge = this.buildBadge(this.duedate, "badge-warning");
    } else if (taskDate.getTime() < currentDate.getTime()) {
      // task overdue at least 1 day, set due date badge color to red
      dueDateBadge = this.buildBadge(this.duedate, "badge-danger");

      if (this.status == "Not started") {
        // task status is not completed or in progress, switch task status to overdue
        this.status = "Overdue";
      }
    } else {
      // task is due in the future, set due date badge color to grey
      dueDateBadge = this.buildBadge(this.duedate);
    }

    let col4 = this.buildColumn("center");
    col4.appendChild(dueDateBadge);
    newTaskRow.appendChild(col4);

    // create the task status column
    let statusBadge;

    // set task status badge color according to status
    switch (this.status) {
      case "In progress":
        statusBadge = this.buildBadge(this.status, "badge-warning");
        break;
      case "Completed":
        statusBadge = this.buildBadge(this.status, "badge-success");
        break;
      case "Overdue":
        statusBadge = this.buildBadge(this.status, "badge-danger");
        break;
      default:
        statusBadge = this.buildBadge(this.status);
        break;
    }

    // add task status badge to the column, add column to the row
    let col5 = this.buildColumn("center");
    col5.appendChild(statusBadge);
    newTaskRow.appendChild(col5);

    // create the drop down detail button
    let detailBadge = this.buildBadge("Details");
    detailBadge.classList.add("dropdown-toggle", "mx-1");

    // link the drop down detail button to the collapsible detail row
    detailBadge.setAttribute("data-toggle", "collapse");
    detailBadge.setAttribute("data-target", "#" + this.detailId);

    //add the detail button to the column
    let col6 = this.buildColumn("center");
    col6.appendChild(detailBadge);

    //add the edit button to the column

    let editBadge = this.buildBadge("Edit", "badge-info");
    editBadge.classList.add("editButton");
    editBadge.setAttribute("data-id", this.id);
    col6.appendChild(editBadge);

    // add the buttons column to the row
    newTaskRow.appendChild(col6);

    //create a new task detail row
    var newTaskDetailRow = document.createElement("tr");

    newTaskDetailRow.setAttribute("id", this.detailId);
    newTaskDetailRow.classList.add("bg-light", "collapse");
    newTaskDetailRow.setAttribute("data-parent", "#taskTableBody");

    // create a blank column (Column 7) & add to row
    newTaskDetailRow.appendChild(this.buildColumn());

    // create the task detail column
    let col8 = this.buildColumn();
    col8.setAttribute("colspan", "5");
    col8.classList.add("truncate");
    col8.innerHTML = this.details;
    newTaskDetailRow.appendChild(col8);

    parentElement.appendChild(newTaskRow);
    parentElement.appendChild(newTaskDetailRow);
  }
}
