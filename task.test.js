import Task from "./task.js";
import path from "path";
import fs from "fs";
const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");

/*
TASK Class Testing Suite
~~~~~~~~~~~~~~~~~~~~~~~~
The following methods are tested in Task Class:
1. constructor(id, name, details, assignee, duedate, status)
2. buildTask(parentElement)
*/

let taskTable;

beforeEach(() => {
  document.documentElement.innerHTML = html.toString();
  taskTable = document.querySelector("#taskTableBody");
});

// 1. TEST constructor
// ~~~~~~~~~~~~~~~~~~~
test("A new task is created correctly", () => {
  let task = new Task(
    "1",
    "Task name",
    "Task details",
    "Task assignee",
    "2020-08-17",
    "Overdue"
  );

  expect(task.id).toBe("1");
  expect(task.name).toBe("Task name");
  expect(task.details).toBe("Task details");
  expect(task.assignee).toBe("Task assignee");
  expect(task.duedate).toBe("2020-08-17");
  expect(task.status).toBe("Overdue");
});

// 2. TEST buildTask(parentElement)
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
test("A new task is appended correctly to the HTML webpage", () => {
  let task = new Task(
    "1",
    "Task name",
    "Task details",
    "Task assignee",
    "2020-08-17",
    "Overdue"
  );

  // no tasks have been added yet to the HTML document
  expect(taskTable.children.length).toBe(0);
  task.buildTask(taskTable);
  // adds two rows to task table (task row and task detail row, expect number of children to increase by two for each task added)
  expect(taskTable.children.length).toBe(2);
  // expect 6 columns in the first row (task row)
  expect(taskTable.firstChild.children.length).toBe(6);

  // expect the task table to contain all the information from the new task
  expect(taskTable.innerHTML).toContain(task.name);
  expect(taskTable.innerHTML).toContain(task.details);
  expect(taskTable.innerHTML).toContain(task.assignee);
  expect(taskTable.innerHTML).toContain(task.duedate);
  expect(taskTable.innerHTML).toContain(task.status);
});
