class TaskManager {
  constructor(modalName) {
    this.tasks = [];
    this.currentId = 1;
    this.modal = new Modal(modalName);
  }

  addTask(name, details, assignee, duedate, status) {
    const task = new Task(
      this.currentId++,
      name,
      details,
      assignee,
      duedate,
      status
    );

    this.tasks.push(task);
  }

  updateTask(id, name, details, assignee, duedate, status) {
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].id == id) {
        this.tasks[i].name = name;
        this.tasks[i].details = details;
        this.tasks[i].assignee = assignee;
        this.tasks[i].duedate = duedate;
        this.tasks[i].status = status;
      }
    }

    this.refreshTaskTable();
  }

  getTask(id) {
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].id == id) {
        return this.tasks[i];
      }
    }
  }

  buildTaskTable() {
    const addTaskButton = document.querySelector("#addTaskButton");

    addTaskButton.addEventListener("click", (e) => {
      this.modal.modalTitle = "Add Task";
      this.modal.submitButton = "Add Task";

      this.modal.buildModal();

      let modalSubmitButton = document.getElementById("modal-submit-button");

      modalSubmitButton.addEventListener("click", (e) => {
        let taskName = document.getElementById("taskNameInput").value;
        let taskDetails = document.getElementById("detailInput").value;
        let taskAssignee = document.getElementById("assigneeSelect").value;
        let taskDueDate = document.getElementById("dueDateInput").value;
        let taskStatus = document.getElementById("statusSelect").value;

        this.addTask(
          taskName,
          taskDetails,
          taskAssignee,
          taskDueDate,
          taskStatus
        );

        this.refreshTaskTable();
      });

      this.modal.showModal(e);
    });

    let deletebutton = document.querySelector("#deletebutton");

    deletebutton.addEventListener("click", (e) => {
      let checkBoxList = document.getElementsByClassName("checkbox");

      for (let i = 0; i < checkBoxList.length; i++) {
        if (checkBoxList[i].checked == true) {
          let id = checkBoxList[i].getAttribute("data-id");
          this.deleteTask(id);
        }
      }
      this.refreshTaskTable();
    });

    this.refreshTaskTable();
  }

  refreshTaskTable() {
    let taskTableBody = document.querySelector("#taskTableBody");

    taskTableBody.innerHTML = "";

    this.tasks.forEach((task) => {
      task.buildTask(taskTableBody);
    });

    const editButtons = document.querySelectorAll(".editButton");

    editButtons.forEach((editButton) => {
      editButton.addEventListener("click", (e) => {
        let taskId = e.target.getAttribute("data-id");

        let task = this.getTask(taskId);

        this.modal.modalTitle = "Edit Task";
        this.modal.submitButton = "Update Task";

        this.modal.buildModal(
          task.name,
          task.details,
          task.duedate,
          task.assignee,
          task.status
        );

        let modalSubmitButton = document.getElementById("modal-submit-button");

        modalSubmitButton.addEventListener("click", (e) => {
          let taskName = document.getElementById("taskNameInput").value;
          let taskDetails = document.getElementById("detailInput").value;
          let taskAssignee = document.getElementById("assigneeSelect").value;
          let taskDueDate = document.getElementById("dueDateInput").value;
          let taskStatus = document.getElementById("statusSelect").value;

          this.updateTask(
            taskId,
            taskName,
            taskDetails,
            taskAssignee,
            taskDueDate,
            taskStatus
          );
        });

        this.modal.showModal(e);
      });
    });
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id != id);
  }
}

class Assignee {
  constructor() {
    this.assigneeList = ["Myself", "Peter", "Catalina"];
  }

  addAssignee() {}

  deleteAssignee() {}

  getHtml(assignee = "Myself") {
    let assigneeHtml = "";

    for (let i = 0; i < this.assigneeList.length; i++) {
      if (assignee == this.assigneeList[i]) {
        assigneeHtml += `<option value="${this.assigneeList[i]}" selected>${this.assigneeList[i]}</option>`;
      } else {
        assigneeHtml += `<option value="${this.assigneeList[i]}">${this.assigneeList[i]}</option>`;
      }
    }

    return assigneeHtml;
  }
}

class Status {
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

class Task {
  constructor(id, name, details, assignee, duedate, status) {
    this.id = id;
    this.detailId = "d" + id;
    this.name = name;
    this.details = details;
    this.assignee = assignee;
    this.duedate = duedate;
    this.status = status;
  }

  buildColumn() {
    let col = document.createElement("td");
    col.setAttribute("scope", "col");
    return col;
  }

  buildBadge(text, badgeClass = "badge-secondary") {
    let badge = document.createElement("span");
    badge.classList.add("badge", "m-1");
    badge.classList.add(badgeClass);
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

    let col1 = this.buildColumn();
    col1.appendChild(input);
    newTaskRow.appendChild(col1);

    // create the task name column
    let col2 = this.buildColumn();
    col2.innerHTML = this.name;
    newTaskRow.appendChild(col2);

    // create the task assignee column
    let col3 = this.buildColumn();
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

    let col4 = this.buildColumn();
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
    let col5 = this.buildColumn();
    col5.appendChild(statusBadge);
    newTaskRow.appendChild(col5);

    // create the drop down detail button
    let detailBadge = this.buildBadge("Details");
    detailBadge.classList.add("dropdown-toggle", "mx-1");

    // link the drop down detail button to the collapsible detail row
    detailBadge.setAttribute("data-toggle", "collapse");
    detailBadge.setAttribute("data-target", "#" + this.detailId);

    //add the detail button to the column
    let col6 = this.buildColumn();
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
    col8.innerHTML = this.details;
    newTaskDetailRow.appendChild(col8);

    parentElement.appendChild(newTaskRow);
    parentElement.appendChild(newTaskDetailRow);
  }
}

class Modal {
  constructor(modalId) {
    this.modalId = modalId;
    this.modalTitle;
    this.submitButton;
  }

  buildModal(
    name = "",
    details = "",
    duedate = "",
    assignee,
    status = "Not started"
  ) {
    let taskStatus = new Status(status);

    let taskAssignee = new Assignee();

    let assigneeHtml = taskAssignee.getHtml(assignee);
    let statusHtml = taskStatus.getHtml();

    let modalHtml = `<div class="modal fade" id="${this.modalId}" tabindex="-1" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${this.modalTitle}</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label for="#taskNameInput">Task Name</label>
              <input
                type="text"
                class="form-control"
                id="taskNameInput"
                value="${name}"
              />
              <div class="valid-feedback">Looks good!</div>
              <div class="invalid-feedback">Task name should be a minimum of 8 characters</div>
            </div>
            <div class="form-group">
              <label for="#detailInput">Task Details</label>
              <textarea
                class="form-control"
                id="detailInput"
                rows="3"
              >${details}</textarea>
              <div class="valid-feedback">Looks good!</div>
              <div class="invalid-feedback">Task description should be a minimum of 15 characters</div>
            </div>
            <div class="form-group">
              <label for="#assigneeSelect">Assignee</label>
              <select class="form-control" id="assigneeSelect">
              ${assigneeHtml}
              </select>
            </div>
            <div class="form-group">
              <label for="#dueDateInput">Due Date</label>
              <input
                type="date"
                class="form-control"
                id="dueDateInput"
                value="${duedate}"
              />
              <div class="valid-feedback">Looks good!</div>
              <div class="invalid-feedback">Please select your task due date</div>
            </div>
            <div class="form-group">
              <label for="#statusSelect">Status</label>
              <select class="form-control" id="statusSelect">
                ${statusHtml}
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal"
          >
            Cancel
          </button>
          <button type="button" class="btn btn-primary" id="modal-submit-button" data-dismiss="modal">${this.submitButton}</button>
        </div>
      </div>
    </div>
  </div>`;

    let modalElement = document
      .createRange()
      .createContextualFragment(modalHtml);

    let modalContainer = document.querySelector("#modalContainer");

    modalContainer.innerHTML = "";
    modalContainer.appendChild(modalElement);

    // let modalTaskNameInput = modalElement.getElementById("taskNameInput");
    // let modalTaskDetailInput = modalElement.getElementById("detailInput");
    // let modalDateInput = modalElement.getElementById("dueDateInput");

    // modalTaskNameInput.addEventListener("input", checkIfValidName);
    // modalTaskDetailInput.addEventListener("input", checkIfValidDesc);
    // modalDateInput.addEventListener("input", checkIfValidDate);
  }

  showModal() {
    $(`#${this.modalId}`).modal("show");
  }
}

const taskManager = new TaskManager("taskModal");

taskManager.addTask(
  "Go to bank",
  "Withdraw $500",
  "Peter",
  "2020-08-10",
  "Not started"
);

taskManager.addTask(
  "Go shopping",
  "Buy fresh vegetables, fruit. Make sure to go before 8pm",
  "Catalina",
  "2020-08-03",
  "Not started"
);

taskManager.buildTaskTable();

// validate task name input of modal
// function checkIfValidName(event) {
//   if (event.target.value && event.target.value.length >= 8) {
//     event.target.classList.remove("is-invalid");
//     event.target.classList.add("is-valid");
//   } else {
//     event.target.classList.remove("is-valid");
//     event.target.classList.add("is-invalid");
//   }
// }

// //validate task description input of modal
// function checkIfValidDesc(event) {
//   if (event.target.value && event.target.value.length >= 15) {
//     event.target.classList.remove("is-invalid");
//     event.target.classList.add("is-valid");
//   } else {
//     event.target.classList.remove("is-valid");
//     event.target.classList.add("is-invalid");
//   }
// }

// //validate task due date input of modal
// function checkIfValidDate(event) {
//   if (event.target.value) {
//     event.target.classList.remove("is-invalid");
//     event.target.classList.add("is-valid");
//   } else {
//     event.target.classList.remove("is-valid");
//     event.target.classList.add("is-invalid");
//   }
// }

// add a new task and refresh the task table when the modal is submitted
// modalButton.onclick = function () {
//   modalButton.setAttribute("data-dismiss", "modal");
//   if (
//     modalTaskNameInput.value.length < 8 ||
//     modalTaskDetailInput.value.length < 15 ||
//     modalDateInput.value === ""
//   ) {
//     modalButton.setAttribute("data-dismiss", "");
//   } else {
//     taskManager.addTask(
//       modalTaskNameInput.value,
//       modalTaskDetailInput.value,
//       modalAssigneeInput.value,
//       modalDateInput.value,
//       modalStatusInput.value
//     );

//     modalTaskNameInput.value = nulgit l;
//     modalTaskDetailInput.value = null;
//     modalAssigneeInput.value = "Myself";
//     modalDateInput.value = null;
//     modalStatusInput.value = "Not started";

//     modalTaskNameInput.classList.toggle("is-valid");
//     modalTaskDetailInput.classList.toggle("is-valid");
//     modalDateInput.classList.toggle("is-valid");
//     modalTaskNameInput.classList.toggle("is-invalid");
//     modalTaskDetailInput.classList.toggle("is-invalid");
//     modalDateInput.classList.toggle("is-invalid");

//     taskManager.buildTaskTable();
//   }
// };
