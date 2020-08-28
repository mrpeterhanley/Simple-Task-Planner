// Task Manager Testing

import TaskManager from "./task-manager.js";
import Task from "./task.js";
import path from "path";
import fs from "fs";
const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");

// Test 1 - Object creation

const task = new Task(
  "task1",
  "task Name",
  "task Details",
  "task Assignee",
  "2020-08-04",
  "In Progress"
);

test("Object creation", () => {
  expect(task.id).toBe("task1");
  expect(task.name).toBe("task Name");
  expect(task.details).toBe("task Details");
  expect(task.assignee).toBe("task Assignee");
  expect(task.duedate).toBe("2020-08-04");
  expect(task.status).toBe("In Progress");
});

// Test 2 - addTask

let taskManager;
let taskTable;
beforeEach(() => {
  taskManager = new TaskManager("personaltaskManager");
  document.documentElement.innerHTML = html.toString();
  taskTable = document.querySelector("#taskTableBody");
  localStorage.clear();
});

test("Tasks should be correctly added to DOM", () => {
  expect(taskManager).toBeDefined();
  expect(taskTable).toBeDefined();
  expect(taskManager.tasks.length).toBe(0);
  expect(taskTable.children.length).toBe(0);

  let task1 = taskManager.addTask(
    "Task name 1",
    "Task details 1",
    "Task assignee 1",
    "2020-08-04",
    "Completed"
  );
  expect(taskManager.tasks.length).toBe(1);
  taskManager.refreshTaskTable();
  expect(taskTable.children.length).toBe(2);
  expect(taskManager.tasks).toContain(task1);
  expect(taskManager.tasks[0].id).toBe(1);
  expect(taskManager.tasks[0].name).toBe("Task name 1");
  expect(taskManager.tasks[0].details).toBe("Task details 1");
  expect(taskManager.tasks[0].assignee).toBe("Task assignee 1");
  expect(taskManager.tasks[0].duedate).toBe("2020-08-04");
  expect(taskManager.tasks[0].status).toBe("Completed");

  let task2 = taskManager.addTask(
    "Task name 2",
    "Task details 2",
    "Task assignee 2",
    "2020-09-27",
    "Not started"
  );
  expect(taskManager.tasks.length).toBe(2);
  taskManager.refreshTaskTable();
  expect(taskTable.children.length).toBe(4);
  expect(taskManager.tasks).toContain(task2);
  expect(taskManager.tasks[1].id).toBe(2);
  expect(taskManager.tasks[1].name).toBe("Task name 2");
  expect(taskManager.tasks[1].details).toBe("Task details 2");
  expect(taskManager.tasks[1].assignee).toBe("Task assignee 2");
  expect(taskManager.tasks[1].duedate).toBe("2020-09-27");
  expect(taskManager.tasks[1].status).toBe("Not started");

  expect(taskManager.tasks).toContain(task1);
  expect(taskManager.tasks).toContain(task2);
});

// Test 3 - getTask

test("Correct task from the array should be returned", () => {
  expect(taskManager.tasks.length).toBe(0);

  let task1 = taskManager.addTask(
    "Task name 1",
    "Task details 1",
    "Task assignee 1",
    "2020-08-04",
    "Completed"
  );
  let task2 = taskManager.addTask(
    "Task name 2",
    "Task details 2",
    "Task assignee 2",
    "2020-09-27",
    "Not started"
  );

  let task3 = taskManager.addTask(
    "Task name 3",
    "Task details 3",
    "Task assignee 3",
    "2020-06-09",
    "Overdue"
  );
  expect(taskManager.tasks.length).toBe(3);
  let returnedTask = taskManager.getTask(task3.id);
  expect(returnedTask).toBe(task3);
});

// Test 4 - deleteTask

test("Task should be deleted correctly from DOM and from the array", () => {
  expect(taskManager.tasks.length).toBe(0);

  let task1 = taskManager.addTask(
    "Task name 1",
    "Task details 1",
    "Task assignee 1",
    "2020-08-04",
    "Completed"
  );

  let task2 = taskManager.addTask(
    "Task name 2",
    "Task details 2",
    "Task assignee 2",
    "2020-09-27",
    "Not started"
  );

  let task3 = taskManager.addTask(
    "Task name 3",
    "Task details 3",
    "Task assignee 3",
    "2020-06-09",
    "Overdue"
  );
  expect(taskManager.tasks.length).toBe(3);
  taskManager.deleteTask(task2.id);
  expect(taskManager.tasks.length).toBe(2);
  expect(taskManager.tasks).not.toContain(task2);
  expect(taskManager.tasks).toContain(task1);
  expect(taskManager.tasks).toContain(task3);
});

// Test 5 - updateTask

test("Correct task from the array should be updated", () => {
  expect(taskManager.tasks.length).toBe(0);

  let task1 = taskManager.addTask(
    "Task name 1",
    "Task details 1",
    "Task assignee 1",
    "2020-08-04",
    "Completed"
  );

  let task2 = taskManager.addTask(
    "Task name 2",
    "Task details 2",
    "Task assignee 2",
    "2020-09-27",
    "Not started"
  );
  expect(taskManager.tasks.length).toBe(2);
  let updatedTask = taskManager.updateTask(
    task2.id,
    "updated task name 2",
    "updated task details 2",
    "updated assignee 2",
    "2020-07-20",
    "Completed"
  );
  expect(task2).toBe(updatedTask);
  expect(task1).not.toBe(updatedTask);
});

// Test 6 - loadFromStorage

test("Tasks should be loaded from local storage", () => {
  // Sample tasks
  taskManager.addTask(
    "Task name sample 1",
    "Task details sample 1",
    "Task assignee sample 1",
    "2020-08-02",
    "Overdue"
  );
  taskManager.addTask(
    "Task name sample 2",
    "Task details sample 2",
    "Task assignee sample 2",
    "2020-12-18",
    "Not started"
  );
  // Sample assignee
  taskManager.assigneeList.addAssignee("Catalina");
  // Save to local storage
  taskManager.saveToStorage();
  // Clear local storage
  taskManager.tasks = [];
  taskManager.assigneeList.list = [];
  taskManager.currentId = "1";
  expect(taskManager.tasks.length).toBe(0);
  expect(taskManager.assigneeList.list.length).toBe(0);
  // Load back from local storage
  taskManager.loadFromStorage();
  // New task and assignee should be loaded back into local storage
  expect(taskManager.tasks.length).toBe(2);
  expect(taskManager.currentId).toBe("3");
  expect(taskManager.assigneeList.list.length).toBe(1);
});

// Test 7 - saveToStorage

test("A new task and assignee should be correctly saved to local storage", () => {
  // Sample task
  let task1 = taskManager.addTask(
    "Task name sample 1",
    "Task details sample 1",
    "Task assignee sample 1",
    "2020-08-02",
    "Overdue"
  );
  // Sample assignee
  taskManager.assigneeList.addAssignee("Catalina");
  // Save to local storage
  taskManager.saveToStorage();

  // Tasks, currentId and assigneeList should now be displayed in local storage
  // and match the task and assignee that were added
  expect(localStorage.getItem("tasks")).toContain(task1.name);
  expect(localStorage.getItem("tasks")).toContain(task1.details);
  expect(localStorage.getItem("tasks")).toContain(task1.assignee);
  expect(localStorage.getItem("tasks")).toContain(task1.duedate);
  expect(localStorage.getItem("tasks")).toContain(task1.status);
  expect(localStorage.getItem("assigneeList")).toContain("Catalina");
  // the current ID now should be "2" since one task has already been added
  expect(localStorage.getItem("currentId")).toBe("2");
});

// End of testing
