import Status from "./status.js";

export default class FormManager {
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
        Welcome to your Task Planner Pro, designed to make planning
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

  buildOverdueAlert(overdueNum) {
    let alertHtml = `<div
      class="alert alert-danger alert-dismissible fade show"
      role="alert"
    >
      <p>
        Attention! You currently have <strong>${overdueNum} ${
      overdueNum > 1 ? "tasks" : "task"
    }</strong> that ${overdueNum > 1 ? "are" : "is"} overdue.
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
