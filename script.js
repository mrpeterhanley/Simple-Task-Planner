class TaskManager {
  constructor(name) {
    this.tasks = [];
    this.currentId = 1;

    this.assigneeList = new AssigneeList();
    this.modal = new Modal(name, this.assigneeList);
  }

  saveToStorage() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
    localStorage.setItem("currentId", this.currentId);
    localStorage.setItem("assigneeList", JSON.stringify(this.assigneeList));
  }

  loadFromStorage() {
    if (localStorage.getItem("tasks")) {
      console.log("Storage exists. Loading from storage");

      const storageTasks = JSON.parse(localStorage.getItem("tasks"));
      this.tasks = storageTasks.map(
        (task) =>
          new Task(
            task.id,
            task.name,
            task.details,
            task.assignee,
            task.duedate,
            task.status
          )
      );

      this.currentId = localStorage.getItem("currentId");

      const storageAssignees = JSON.parse(localStorage.getItem("assigneeList"));

      storageAssignees.list.forEach((assignee) =>
        this.assigneeList.addAssignee(assignee)
      );
    } else {
      console.log("No storage exists. creating some sample tasks & assignees");

      this.modal.buildFirstTimeAlerts();

      this.assigneeList.addAssignee("Sample Assignee");

      this.addTask(
        "Sample Task 1",
        "Withdraw $500 and apply for credit card",
        this.assigneeList.list[0],
        "2020-08-11",
        "Not started"
      );
      taskManager.addTask(
        "Sample Task 2",
        "Go to Woolworths to buy groceries: vegetables, fruit, toilet paper",
        this.assigneeList.list[0],
        "2020-08-12",
        "Not started"
      );
    }
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
    this.saveToStorage();
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
    this.saveToStorage();
  }

  getTask(id) {
    return this.tasks.find((task) => task.id == id);
  }

  buildTaskTable() {
    this.loadFromStorage();

    const addTaskButton = document.querySelector("#addTaskButton");

    addTaskButton.addEventListener("click", (e) => {
      this.modal.buildTaskModal(
        this.assigneeList.list[0],
        "Add Task",
        "Add Task"
      );

      let modalSubmitButton = document.getElementById("modal-submit-button");

      modalSubmitButton.addEventListener("click", (e) => {
        let taskName = document.getElementById("taskNameInput");
        let taskDetails = document.getElementById("detailInput");
        let taskAssignee = document.getElementById("assigneeSelect");
        let taskDueDate = document.getElementById("dueDateInput");
        let taskStatus = document.getElementById("statusSelect");

        if (
          !taskName.checkValidity() ||
          !taskDetails.checkValidity() ||
          !taskDueDate.checkValidity()
        ) {
          modalSubmitButton.setAttribute("data-dismiss", "");
        } else {
          modalSubmitButton.setAttribute("data-dismiss", "modal");
          this.addTask(
            taskName.value,
            taskDetails.value,
            taskAssignee.value,
            taskDueDate.value,
            taskStatus.value
          );
          this.refreshTaskTable();
        }
      });

      this.modal.showTaskModal(e);
    });

    let deletebutton = document.querySelector("#deletebutton");

    deletebutton.addEventListener("click", (e) => {
      let checkBoxList = document.getElementsByClassName("checkbox");

      for (let i = 0; i < checkBoxList.length; i++) {
        if (checkBoxList[i].checked == true) {
          let id = checkBoxList[i].getAttribute("data-id");
          this.deleteTask(id);
          this.saveToStorage();
        }
      }
      this.refreshTaskTable();
    });

    let addAssigneeDropDown = document.querySelector("#addAssigneeDropDown");

    addAssigneeDropDown.addEventListener("click", (e) => {
      this.modal.buildAddAssigneeModal();
      this.modal.showAddAssigneeModal();

      let assigneeInput = document.querySelector("#addAssigneeInput");
      assigneeInput.classList.add("is-invalid");

      assigneeInput.addEventListener("input", (e) => {
        if (!assigneeInput.checkValidity()) {
          assigneeInput.classList.remove("is-valid");
          assigneeInput.classList.add("is-invalid");
        } else {
          assigneeInput.classList.remove("is-invalid");
          assigneeInput.classList.add("is-valid");
        }
      });

      let assigneeSubmitButton = document.querySelector(
        "#add-assignee-submit-button"
      );

      assigneeSubmitButton.addEventListener("click", (e) => {
        if (!assigneeInput.checkValidity()) {
          assigneeSubmitButton.setAttribute("data-dismiss", "");
        } else {
          assigneeSubmitButton.setAttribute("data-dismiss", "modal");
          this.assigneeList.addAssignee(assigneeInput.value);
          this.saveToStorage();
        }
      });
    });

    let deleteAssigneeDropDown = document.querySelector(
      "#deleteAssigneeDropDown"
    );

    deleteAssigneeDropDown.addEventListener("click", (e) => {
      this.modal.buildDeleteAssigneeModal();

      this.modal.showDeleteAssigneeModal();

      let assigneeSubmitButton = document.querySelector(
        "#delete-assignee-submit-button"
      );

      assigneeSubmitButton.addEventListener("click", (e) => {
        let assigneeInput = document.querySelector("#deleteAssigneeInput");

        if (this.assigneeList.list.length <= 1) {
          assigneeInput.classList.add("is-invalid");
          assigneeSubmitButton.setAttribute("data-dismiss", "");
        } else {
          this.assigneeList.deleteAssignee(assigneeInput.value);
          this.saveToStorage();
        }
      });
    });

    let filterReset = document.querySelector("#filter-reset");
    filterReset.addEventListener("click", (e) => {
      this.refreshTaskTable();
    });

    let filterNotStarted = document.querySelector("#filter-not-started");
    filterNotStarted.addEventListener("click", (e) => {
      this.refreshTaskTable("Not started");
    });

    let filterInProgress = document.querySelector("#filter-in-progress");
    filterInProgress.addEventListener("click", (e) => {
      this.refreshTaskTable("In progress");
    });

    let filterCompleted = document.querySelector("#filter-completed");
    filterCompleted.addEventListener("click", (e) => {
      this.refreshTaskTable("Completed");
    });

    let filterOverdue = document.querySelector("#filter-overdue");
    filterOverdue.addEventListener("click", (e) => {
      this.refreshTaskTable("Overdue");
    });

    this.refreshTaskTable();
  }

  refreshTaskTable(filter) {
    let taskTableBody = document.querySelector("#taskTableBody");

    taskTableBody.innerHTML = "";

    if (filter) {
      let filteredTasks = this.tasks.filter((task) => task.status == filter);
      filteredTasks.forEach((task) => {
        task.buildTask(taskTableBody);
      });
    } else {
      this.tasks.forEach((task) => {
        task.buildTask(taskTableBody);
      });
    }

    const editButtons = document.querySelectorAll(".editButton");

    editButtons.forEach((editButton) => {
      editButton.addEventListener("click", (e) => {
        let taskId = e.target.getAttribute("data-id");

        let task = this.getTask(taskId);

        this.modal.buildTaskModal(
          task.assignee,
          "Edit Task",
          "Update Task",
          task.name,
          task.details,
          task.duedate,
          task.status,
          false
        );

        let modalSubmitButton = document.getElementById("modal-submit-button");

        modalSubmitButton.addEventListener("click", (e) => {
          let taskName = document.getElementById("taskNameInput");
          let taskDetails = document.getElementById("detailInput");
          let taskAssignee = document.getElementById("assigneeSelect");
          let taskDueDate = document.getElementById("dueDateInput");
          let taskStatus = document.getElementById("statusSelect");

          if (
            !taskName.checkValidity() ||
            !taskDetails.checkValidity() ||
            !taskDueDate.checkValidity()
          ) {
            modalSubmitButton.setAttribute("data-dismiss", "");
          } else {
            modalSubmitButton.setAttribute("data-dismiss", "modal");
            this.updateTask(
              taskId,
              taskName.value,
              taskDetails.value,
              taskAssignee.value,
              taskDueDate.value,
              taskStatus.value
            );
            this.saveToStorage();
          }
        });

        this.modal.showTaskModal(e);
      });
    });
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id != id);
    this.saveToStorage();
  }
}

class AssigneeList {
  constructor() {
    this.list = [];
  }

  addAssignee(assignee) {
    // add a name to the assignee list
    this.list.push(assignee);
  }
  deleteAssignee(assignee) {
    // remove a name from the assignee list

    //this.list = this.list.filter((assignee) => this.list != assignee);

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

class Modal {
  constructor(name, assigneeList) {
    this.taskModalId = `${name}-task-modal`;
    this.addAssigneeModalId = `${name}-add-assignee-modal`;
    this.deleteAssigneeModalId = `${name}-delete-assignee-modal`;
    this.assigneeList = assigneeList;
    this.taskModalTitle;
    this.submitButton;
  }

  buildFirstTimeAlerts() {
    let alertHtml = `<div
    class="alert alert-primary alert-dismissible fade show"
    role="alert"
  >
    <p>
      Welcome to your Simple Task Planner, designed to make planning
      your daily life easier!
    </p>
    <button
      type="button"
      class="close"
      data-dismiss="alert"
      aria-label="Close"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div
    class="alert alert-warning alert-dismissible fade show"
    role="alert"
  >
    <p>
      Please start by clicking "Assignee > Add Assignee" to add one or
      more assignees to your planner.
    </p>
    <p>
      Then add your first task by clicking the "Add Task" button.
      Simple!
    </p>
    <button
      type="button"
      class="close"
      data-dismiss="alert"
      aria-label="Close"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div
    class="alert alert-warning alert-dismissible fade show"
    role="alert"
  >
    <p>
      We've added a few sample tasks & assignees to show you how this
      planner works. Please feel free to delete them when ready.
    </p>
    <button
      type="button"
      class="close"
      data-dismiss="alert"
      aria-label="Close"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>`;

    let alertElement = document
      .createRange()
      .createContextualFragment(alertHtml);

    let alertContainer = document.querySelector("#alert-container");

    alertContainer.innerHTML = "";
    alertContainer.appendChild(alertElement);
  }

  buildAddAssigneeModal() {
    let modalHtml = `<div class="modal fade" id="${this.addAssigneeModalId}" tabindex="-1" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Assignee</h5>
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
              <label for="#assigneeInput">Assignee Name</label>
              <input
                type="text"
                class="form-control"
                id="addAssigneeInput"
                minlength="1"
                value="" required
              />
              <div class="valid-feedback">Looks good!</div>
              <div class="invalid-feedback">Assignee name should have a minimum of 1 character</div>
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
          <button type="button" class="btn btn-primary" id="add-assignee-submit-button" data-dismiss="modal">Add Assignee</button>
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
  }

  showAddAssigneeModal() {
    $(`#${this.addAssigneeModalId}`).modal("show");
  }

  buildDeleteAssigneeModal() {
    let assigneeHtml = this.assigneeList.getHtml(this.assigneeList[0]);

    let modalHtml = `<div class="modal fade" id="${this.deleteAssigneeModalId}" tabindex="-1" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete Assignee</h5>
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
              <label for="#assigneeSelect">Assignee</label>
              <select class="form-control" id="deleteAssigneeInput">
              ${assigneeHtml}
              </select>
              <div class="invalid-feedback">Your task planner should have at least 1 assignee!</div>
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
          <button type="button" class="btn btn-primary" id="delete-assignee-submit-button" data-dismiss="modal">Delete Assignee</button>
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
  }

  showDeleteAssigneeModal() {
    $(`#${this.deleteAssigneeModalId}`).modal("show");
  }

  buildTaskModal(
    selectedAssignee,
    modalTitle,
    submitButtonTitle,
    name = "",
    details = "",
    duedate = "",
    status = "Not started",
    newTask = true
  ) {
    let taskStatus = new Status(status);
    let assigneeHtml = this.assigneeList.getHtml(selectedAssignee);
    let statusHtml = taskStatus.getHtml();

    let modalHtml = `<div class="modal fade" id="${this.taskModalId}" tabindex="-1" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${modalTitle}</h5>
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
                minlength="8"
                value="${name}" required
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
                minlength="15" required
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
                value="${duedate}" required
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
          <button type="button" class="btn btn-primary" id="modal-submit-button" data-dismiss="modal">${submitButtonTitle}</button>
        </div>
      </div>
    </div>
  </div>`;

    let modalElement = document
      .createRange()
      .createContextualFragment(modalHtml);

    let modalTaskNameInput = modalElement.getElementById("taskNameInput");
    let modalTaskDetailInput = modalElement.getElementById("detailInput");
    let modalDateInput = modalElement.getElementById("dueDateInput");

    if (newTask == false) {
      modalTaskNameInput.classList.add("is-valid");
      modalTaskDetailInput.classList.add("is-valid");
      modalDateInput.classList.add("is-valid");
    } else {
      modalTaskNameInput.classList.add("is-invalid");
      modalTaskDetailInput.classList.add("is-invalid");
      modalDateInput.classList.add("is-invalid");
    }

    modalTaskNameInput.addEventListener("input", this.checkIfValidInput);
    modalTaskDetailInput.addEventListener("input", this.checkIfValidInput);
    modalDateInput.addEventListener("input", this.checkIfValidInput);

    let modalContainer = document.querySelector("#modalContainer");

    modalContainer.innerHTML = "";
    modalContainer.appendChild(modalElement);
  }

  showTaskModal() {
    $(`#${this.taskModalId}`).modal("show");
  }

  checkIfValidInput(event) {
    if (event.target.checkValidity()) {
      event.target.classList.remove("is-invalid");
      event.target.classList.add("is-valid");
    } else {
      event.target.classList.remove("is-valid");
      event.target.classList.add("is-invalid");
    }
  }
}

const taskManager = new TaskManager("personal-tasks");

taskManager.buildTaskTable();
