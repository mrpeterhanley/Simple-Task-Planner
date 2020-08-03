// Create the task list object array
let dateobj = new Date();
let date = dateobj.toDateString();

class TaskManager {
  constructor(parent) {
    this.tasks = [];
    this.currentId = 1;
    this.parent = parent;
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

  deleteTask(id) {
    //this.tasks = this.tasks.filter((task) => task.id !== id);

    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].id == id) {
        // delete the task
        this.tasks.splice(i, 1);
      }
    }
  }
}

class Task {
  constructor(id, name, details, assignee, duedate, status) {
    this.id = id;
    this.name = name;
    this.details = details;
    this.assignee = assignee;
    this.duedate = duedate;
    this.status = status;
  }
}

const taskManager = new TaskManager();

//taskManager.addTask();

// Cycle through the task list array and build the table body

function buildTaskTable() {
  // cycle through each task object in task list array

  // get the task table body element
  let taskTableBody = document.querySelector("#taskTableBody");

  while (taskTableBody.firstChild) {
    taskTableBody.removeChild(taskTableBody.firstChild);
  }

  for (var i = 0; i < taskManager.tasks.length; i++) {
    //create a new task row
    var newTaskRow = document.createElement("tr");

    var taskID = taskManager.tasks[i].id;

    var taskDetailId = "detail" + taskID;
    // e.g. "detail1"
    newTaskRow.setAttribute("id", taskID);

    // create the checkbox column
    var col0 = document.createElement("td");
    col0.setAttribute("scope", "col");
    var input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("data-id", taskID);

    console.log("Checkbox ID " + input.getAttribute("data-id"));

    input.classList.add("checkbox");
    col0.appendChild(input);

    //add to the row
    newTaskRow.appendChild(col0);

    // create the task name column
    var col1 = document.createElement("td");
    col1.setAttribute("scope", "col");
    col1.innerHTML = taskManager.tasks[i].name;

    // add to the row
    newTaskRow.appendChild(col1);

    // create the task assignee column
    var col2 = document.createElement("td");
    col2.setAttribute("scope", "col");

    var col2span = document.createElement("span");
    col2span.classList.add("badge", "badge-secondary");
    col2span.innerHTML = taskManager.tasks[i].assignee;
    col2.appendChild(col2span);

    // add to the row
    newTaskRow.appendChild(col2);

    // create the due date column
    var col3 = document.createElement("td");
    col3.setAttribute("scope", "col");

    var col3span = document.createElement("span");
    col3span.classList.add("badge");
    col3span.innerHTML = taskManager.tasks[i].duedate;

    let taskDate = new Date(taskManager.tasks[i].duedate);

    // compare the task due date to the current date
    if (
      taskDate.getFullYear() == dateobj.getFullYear() &&
      taskDate.getMonth() == dateobj.getMonth() &&
      taskDate.getDate() == dateobj.getDate()
    ) {
      // task due today, set due date badge color to yellow
      col3span.classList.add("badge-warning");
    } else if (taskDate.getTime() < dateobj.getTime()) {
      // task overdue at least 1 day, set due date badge color to red
      col3span.classList.add("badge-danger");

      if (taskManager.tasks[i].status == "Not started") {
        // task status is not completed or in progress, switch task status to overdue
        taskManager.tasks[i].status = "Overdue";
      }
    } else {
      // task is due in the future, set due date badge color to grey
      col3span.classList.add("badge-secondary");
    }

    col3.appendChild(col3span);

    // add to the row
    newTaskRow.appendChild(col3);

    // create the task status column
    var col4 = document.createElement("td");
    col4.setAttribute("scope", "col");

    var col4span = document.createElement("span");
    col4span.classList.add("badge");
    col4span.innerHTML = taskManager.tasks[i].status;

    // set task status badge color according to status
    switch (taskManager.tasks[i].status) {
      case "In progress":
        col4span.classList.add("badge-warning");
        break;
      case "Completed":
        col4span.classList.add("badge-success");
        break;
      case "Overdue":
        col4span.classList.add("badge-danger");
        break;
      default:
        col4span.classList.add("badge-secondary");
        break;
    }

    // add task status badge to the column
    col4.appendChild(col4span);

    // add task status column to the row
    newTaskRow.appendChild(col4);

    // create the detail / edit button column
    var col5 = document.createElement("td");
    col5.setAttribute("scope", "col");

    // create the drop down detail button
    var col5span = document.createElement("span");
    col5span.classList.add(
      "badge",
      "badge-secondary",
      "dropdown-toggle",
      "mx-1"
    );

    // link the drop down detail button to the collapsible detail row
    col5span.setAttribute("data-toggle", "collapse");
    col5span.setAttribute("data-target", "#" + taskDetailId);
    col5span.innerHTML = "Details";

    //add the detail button to the column
    col5.appendChild(col5span);

    // create the edit button
    var col5span2 = document.createElement("span");
    col5span2.classList.add("badge", "badge-info");
    col5span2.innerHTML = "Edit";

    //add the edit button to the column
    col5.appendChild(col5span2);

    // add the buttons column to the row
    newTaskRow.appendChild(col5);

    // add the new task row to the table
    taskTableBody.appendChild(newTaskRow);

    //create a new task detail row
    var newTaskDetailRow = document.createElement("tr");

    newTaskDetailRow.setAttribute("id", taskDetailId);
    newTaskDetailRow.classList.add("bg-light");
    newTaskDetailRow.classList.add("collapse");
    newTaskDetailRow.setAttribute("data-parent", "#taskTableBody");

    // create a blank column
    var col6 = document.createElement("td");
    col6.setAttribute("scope", "col");

    //add to the row
    newTaskDetailRow.appendChild(col6);

    // create the task detail column
    var col7 = document.createElement("td");
    col7.setAttribute("scope", "col");
    col7.setAttribute("colspan", "5");
    col7.innerHTML = taskManager.tasks[i].details;

    // add to the row
    newTaskDetailRow.appendChild(col7);

    // add the task detail row to the table
    taskTableBody.appendChild(newTaskDetailRow);
  }
}

buildTaskTable(); // Build out the task table from the task list array

// get the add task modal elements
let modalButton = document.getElementById("addTaskModalButton");
let modalTaskNameInput = document.getElementById("taskNameInput");
modalTaskNameInput.classList.add("is-invalid");
let modalTaskDetailInput = document.getElementById("detailInput");
modalTaskDetailInput.classList.add("is-invalid");
let modalAssigneeInput = document.getElementById("assigneeSelect");
let modalDateInput = document.getElementById("dueDateInput");
modalDateInput.classList.add("is-invalid");
let modalStatusInput = document.getElementById("statusSelect");

// validate task name input of modal
function checkIfValidName(event) {
  if (event.target.value && event.target.value.length >= 8) {
    event.target.classList.remove("is-invalid");
    event.target.classList.add("is-valid");
  } else {
    event.target.classList.remove("is-valid");
    event.target.classList.add("is-invalid");
  }
}

//validate task description input of modal
function checkIfValidDesc(event) {
  if (event.target.value && event.target.value.length >= 15) {
    event.target.classList.remove("is-invalid");
    event.target.classList.add("is-valid");
  } else {
    event.target.classList.remove("is-valid");
    event.target.classList.add("is-invalid");
  }
}

//validate task due date input of modal
function checkIfValidDate(event) {
  if (event.target.value) {
    event.target.classList.remove("is-invalid");
    event.target.classList.add("is-valid");
  } else {
    event.target.classList.remove("is-valid");
    event.target.classList.add("is-invalid");
  }
}

modalTaskNameInput.addEventListener("input", checkIfValidName);
modalTaskDetailInput.addEventListener("input", checkIfValidDesc);
modalDateInput.addEventListener("input", checkIfValidDate);

// add a new task and refresh the task table when the modal is submitted
modalButton.onclick = function () {
  modalButton.setAttribute("data-dismiss", "modal");
  if (
    modalTaskNameInput.value.length < 8 ||
    modalTaskDetailInput.value.length < 15 ||
    modalDateInput.value === ""
  ) {
    modalButton.setAttribute("data-dismiss", "");
  } else {
    taskManager.addTask(
      modalTaskNameInput.value,
      modalTaskDetailInput.value,
      modalAssigneeInput.value,
      modalDateInput.value,
      modalStatusInput.value
    );

    modalTaskNameInput.value = null;
    modalTaskDetailInput.value = null;
    modalAssigneeInput.value = "Myself";
    modalDateInput.value = null;
    modalStatusInput.value = "Not started";

    modalTaskNameInput.classList.toggle("is-valid");
    modalTaskDetailInput.classList.toggle("is-valid");
    modalDateInput.classList.toggle("is-valid");
    modalTaskNameInput.classList.toggle("is-invalid");
    modalTaskDetailInput.classList.toggle("is-invalid");
    modalDateInput.classList.toggle("is-invalid");

    buildTaskTable();
  }
};

deleteButtonClick = function () {
  let checkBoxList = document.getElementsByClassName("checkbox");

  for (let i = 0; i < checkBoxList.length; i++) {
    if (checkBoxList[i].checked == true) {
      let id = checkBoxList[i].getAttribute("data-id");

      console.log("Deleting this task: " + id);

      taskManager.deleteTask(id);

      console.log("Deleted checkbox id: " + id);
    }
  }

  buildTaskTable();
};

let deletebutton = document.querySelector("#deletebutton");
deletebutton.addEventListener("click", deleteButtonClick);

// Anindha's code

// function addTask(name, date, time, assigned, description) {
// 	let html = `
// 		<tr>
// 			<td>test</td>
// 			<td>${name}</td>
// 			<td>${description}</td>
// 			<td>${assigned}</td>
// 			<td>${date}</td>
// 			<td>${time}</td>
// 			<td>test</td>
// 		</tr>
// 	`;
// 	const table = document.createElement(`table`);
// 	const tbody = document.createElement(`tbody`);
// 	table.appendChild(tbody);
// 	const range = document.createRange();
// 	range.selectNodeContents(tbody);
// 	const taskElement = range.createContextualFragment(html);
// 	console.log(taskElement);
// 	tableBody.append(taskElement);
// }
