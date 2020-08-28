import FormManager from "./form-manager.js";
import AssigneeList from "./assignee.js";
import Task from "./task.js";

export default class TaskManager {
  constructor(name) {
    this.tasks = [];
    this.currentId = 1;

    this.assigneeList = new AssigneeList();
    this.formManager = new FormManager(name, this.assigneeList);
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
    return task;
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id != id);
    this.saveToStorage();
  }

  getTask(id) {
    return this.tasks.find((task) => task.id == id);
  }

  updateTask(id, name, details, assignee, duedate, status) {
    let updatedTask;

    this.tasks.forEach((task) => {
      if (task.id == id) {
        task.name = name;
        task.details = details;
        task.assignee = assignee;
        task.duedate = duedate;
        task.status = status;
        updatedTask = task;
      }
    });

    return updatedTask;
  }

  buildTaskTable() {
    this.loadFromStorage();

    const addTaskButton = document.querySelector("#addTaskButton");

    addTaskButton.addEventListener("click", (e) => {
      this.formManager.buildTaskModal(
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

      this.formManager.showTaskModal(e);
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

    let addAssigneeDropDown = document.querySelector("#addAssigneeDropDown");

    addAssigneeDropDown.addEventListener("click", (e) => {
      this.formManager.buildAddAssigneeModal();
      this.formManager.showAddAssigneeModal();

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
      this.formManager.buildDeleteAssigneeModal();

      this.formManager.showDeleteAssigneeModal();

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

    this.saveToStorage();

    const editButtons = document.querySelectorAll(".editButton");

    editButtons.forEach((editButton) => {
      editButton.addEventListener("click", (e) => {
        let taskId = e.target.getAttribute("data-id");

        let task = this.getTask(taskId);

        this.formManager.buildTaskModal(
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
            this.refreshTaskTable();
            this.saveToStorage();
          }
        });

        this.formManager.showTaskModal(e);
      });
    });
  }

  saveToStorage() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
    localStorage.setItem("currentId", this.currentId);
    localStorage.setItem("assigneeList", JSON.stringify(this.assigneeList));
  }

  loadFromStorage() {
    if (localStorage.getItem("tasks")) {
      // Local storage exists. Loading tasks & assignees from storage

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

      let overdueTasks = this.tasks.filter((task) => task.status == "Overdue");

      if (overdueTasks.length > 0) {
        this.formManager.buildOverdueAlert(overdueTasks.length);
      }

      this.currentId = localStorage.getItem("currentId");

      const storageAssignees = JSON.parse(localStorage.getItem("assigneeList"));

      storageAssignees.list.forEach((assignee) =>
        this.assigneeList.addAssignee(assignee)
      );
    } else {
      //No local storage exists = new user. Create first time alerts and some sample tasks & assignee

      this.formManager.buildFirstTimeAlerts();

      this.assigneeList.addAssignee("Sample Assignee");

      this.addTask(
        "Sample Task 1",
        "Put more detailed information about your task here",
        this.assigneeList.list[0],
        "2020-08-11",
        "Not started"
      );
      this.addTask(
        "Sample Task 2",
        "Put more detailed information about your task here",
        this.assigneeList.list[0],
        "2020-09-12",
        "Not started"
      );
    }
  }
}
