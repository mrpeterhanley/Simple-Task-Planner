// let editButton1 = document.querySelector("#editButton1");
// let modalTitle = document.querySelector("#exampleModalLabel");
// let exampleFormControlInput1 = document.querySelector(
//   "#exampleFormControlInput1"
// );
// let taskName1 = document.querySelector("#taskName1");
// let addTaskButton = document.querySelector("#addTaskButton");

// let output = document.querySelector("#taskTable");

// editButton1.onclick = function () {
//   modalTitle.innerText = "Edit Task";
//   exampleFormControlInput1.value = taskName1.innerText;
// };

let assigneeList = ["Myself", "Peter", "Catalina"]; // dynamic - can add or remove items

const statusList = ["Not started", "In progress", "Completed", "Overdue"]; // fixed

let taskList = [
  {
    name: "Go shopping",
    details: "Buy milk, eggs, bread, fruit and toilet paper.",
    assignee: "Myself",
    dueDate: new Date("2020-08-01"),
    status: "Not started",
  },
  {
    name: "Go shopping",
    details: "Buy milk, eggs, bread, fruit and toilet paper.",
    assignee: "Myself",
    dueDate: new Date("2020-08-01"),
    status: "Not started",
  },
];

let addTaskButton = document.querySelector("#addAssigneeButton");
let taskNameInput;
let taskDetailInput;
let taskAssigneeInput;
let taskDueDateInput;
let taskStatusInput;

let addNewTask = function (
  newName,
  newDetails,
  newAssignee,
  newDate,
  newStatus
) {
  var newTask = {
    name: newName,
    details: newDetails,
    assignee: newAssignee,
    dueDate: newDate,
    status: newStatus,
  };
};
