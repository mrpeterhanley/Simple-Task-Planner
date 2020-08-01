// Create the task list object array
let taskList = [];
let idCounter = 1;
let dateobj = new Date();
let date = dateobj.toDateString();

// Make a function to create a new task object
function createTask(taskName, taskDetails, taskAssignee, taskDate, taskStatus) {
  var task = {
    taskid: idCounter,
    name: taskName,
    details: taskDetails,
    assignee: taskAssignee,
    duedate: taskDate,
    status: taskStatus,
  };
  idCounter++;
  return task;
}

//create some sample tasks and add them to the task list array
let task1 = createTask(
  "Go to bank",
  "Apply for new credit card",
  "Peter",
  "2020-07-01",
  "Not started"
);

let task2 = createTask(
  "Buy groceries",
  "Milk, cheese, fruit, bread, vegetables",
  "Catalina",
  "2020-08-01",
  "Not started"
);

taskList.push(task1, task2);

// Cycle through the task list array and build the table body

function buildTaskTable() {
  // cycle through each task object in task list array

  // get the task table body element
  let taskTableBody = document.querySelector("#taskTableBody");

  while (taskTableBody.firstChild) {
    taskTableBody.removeChild(taskTableBody.firstChild);
  }

  for (var i = 0; i < taskList.length; i++) {
    //create a new task row
    var newTaskRow = document.createElement("tr");
    var taskID = taskList[i].taskid; // = "1"
    var taskDetailId = "detail" + taskList[i].taskid; // = "detail1"
    newTaskRow.setAttribute("id", taskID);

    // create the checkbox column
    var col0 = document.createElement("td");
    col0.setAttribute("scope", "col");
    var input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("data-id", taskID);
    input.classList.add("checkbox");
    col0.appendChild(input);

    //add to the row
    newTaskRow.appendChild(col0);

    // create the task name column
    var col1 = document.createElement("td");
    col1.setAttribute("scope", "col");
    col1.innerHTML = taskList[i].name;

    // add to the row
    newTaskRow.appendChild(col1);

    // create the task assignee column
    var col2 = document.createElement("td");
    col2.setAttribute("scope", "col");

    var col2span = document.createElement("span");
    col2span.classList.add("badge", "badge-secondary");
    col2span.innerHTML = taskList[i].assignee;
    col2.appendChild(col2span);

    // add to the row
    newTaskRow.appendChild(col2);

    // create the due date column
    var col3 = document.createElement("td");
    col3.setAttribute("scope", "col");

    var col3span = document.createElement("span");
    col3span.classList.add("badge");
    col3span.innerHTML = taskList[i].duedate;

    let taskDate = new Date(taskList[i].duedate);

    if (
      taskDate.getFullYear() == dateobj.getFullYear() &&
      taskDate.getMonth() == dateobj.getMonth() &&
      taskDate.getUTCDate() == dateobj.getUTCDate()
    ) {
      // task due today
      col3span.classList.add("badge-warning");
    } else if (taskDate.getTime() < dateobj.getTime()) {
      // overdue at least 1 day
      col3span.classList.add("badge-danger");

      if (taskList[i].status !== ("In progress" || "Completed")) {
        // task is not completed or in progress, switch status to overdue
        taskList[i].status = "Overdue";
      }
    } else {
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
    col4span.innerHTML = taskList[i].status;

    if (taskList[i].status == "In progress") {
      col4span.classList.add("badge-warning");
    } else if (taskList[i].status == "Completed") {
      col4span.classList.add("badge-success");
    } else if (taskList[i].status == "Overdue") {
      col4span.classList.add("badge-danger");
    } else {
      col4span.classList.add("badge-secondary");
    }

    col4.appendChild(col4span);

    // add to the row
    newTaskRow.appendChild(col4);

    // create the edit button column
    var col5 = document.createElement("td");
    col5.setAttribute("scope", "col");

    var col5span = document.createElement("span");
    col5span.classList.add(
      "badge",
      "badge-secondary",
      "dropdown-toggle",
      "mx-1"
    );

    col5span.setAttribute("data-toggle", "collapse");
    col5span.setAttribute("data-target", "#" + taskDetailId);
    col5span.innerHTML = "Details";
    col5.appendChild(col5span);

    var col5span2 = document.createElement("span");
    col5span2.classList.add("badge", "badge-info");
    col5span2.innerHTML = "Edit";
    col5.appendChild(col5span2);

    // add to the row
    newTaskRow.appendChild(col5);

    // add the new task row to the table
    taskTableBody.appendChild(newTaskRow);

    //create a new task detail row
    var newTaskDetailRow = document.createElement("tr");

    newTaskDetailRow.setAttribute("id", taskDetailId);
    newTaskDetailRow.classList.add("bg-light");
    newTaskDetailRow.classList.add("collapse");

    // create the blank column
    var col6 = document.createElement("td");
    col6.setAttribute("scope", "col");

    //add to the row
    newTaskDetailRow.appendChild(col6);

    // create the task detail column
    var col7 = document.createElement("td");
    col7.setAttribute("scope", "col");
    col7.setAttribute("colspan", "5");
    col7.innerHTML = taskList[i].details;

    // add to the row
    newTaskDetailRow.appendChild(col7);

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
let modalStatusInput = document.getElementById("statusSelect");

// set the default value of the modal date input to today's date
modalDateInput.value.innerHTML = date;

function checkIfValidName(event) {
  if (event.target.value && event.target.value.length >= 8) {
    event.target.classList.remove("is-invalid");
    event.target.classList.add("is-valid");
  } else {
    event.target.classList.remove("is-valid");
    event.target.classList.add("is-invalid");
  }
}

function checkIfValidDesc(event) {
  if (event.target.value && event.target.value.length >= 15) {
    event.target.classList.remove("is-invalid");
    event.target.classList.add("is-valid");
  } else {
    event.target.classList.remove("is-valid");
    event.target.classList.add("is-invalid");
  }
}

modalTaskNameInput.addEventListener("input", checkIfValidName);
modalTaskDetailInput.addEventListener("input", checkIfValidDesc);

// add a new task and refresh the task table when the modal is submitted
modalButton.onclick = function () {
  modalButton.setAttribute("data-dismiss", "modal");
  if (
    modalTaskNameInput.value.length < 8 ||
    modalTaskDetailInput.value.length < 15
  ) {
    modalButton.setAttribute("data-dismiss", "");
  } else {
    taskList.push(
      createTask(
        modalTaskNameInput.value,
        modalTaskDetailInput.value,
        modalAssigneeInput.value,
        modalDateInput.value,
        modalStatusInput.value
      )
    );
    modalTaskNameInput.value = null;
    modalTaskDetailInput.value = null;
    modalAssigneeInput.value = "Myself";
    modalStatusInput.value = "Not started";

    modalTaskNameInput.classList.toggle("is-valid");
    modalTaskDetailInput.classList.toggle("is-valid");
    modalTaskNameInput.classList.toggle("is-invalid");
    modalTaskDetailInput.classList.toggle("is-invalid");

    buildTaskTable();
  }
};

deleteTaskObjectById = function (id) {
  for (let i = 0; i < taskList.length; i++) {
    if (id == taskList[i].taskid) {
      taskList.splice(i, 1);
    }
  }
};

deleteButtonClick = function () {
  let checkBoxList = document.getElementsByClassName("checkbox");

  for (let i = 0; i < checkBoxList.length; i++) {
    if (checkBoxList[i].checked == true) {
      let id = checkBoxList[i].getAttribute("data-id");
      deleteTaskObjectById(id);
    }
  }

  buildTaskTable();
};

let deletebutton = document.querySelector("#deletebutton");
deletebutton.addEventListener("click", deleteButtonClick);
