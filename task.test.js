import Task from "./task.js";
import path from "path";
import fs from "fs";
const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");

/*
TASK Class Testing Suite
~~~~~~~~~~~~~~~~~~~~~~~~
Task Class has the following methods that need to be tested:
1. constructor(id, name, details, assignee, duedate, status)
2. buildColumn(alignment)
3. buildBadge(text, badgeClass = "badge-secondary")
4. buildTask(parentElement)
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

// 4. TEST buildTask(parentElement)
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
});
