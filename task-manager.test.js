import TaskManager from "./task-manager.js";
import path from "path";
import fs from "fs";

const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");

let taskManager;
let parent;

beforeEach(() => {
  document.documentElement.innerHTML = html.toString();
  localStorage.clear();
  const formManager = {};
  parent = document.querySelector("#personal-tasks > .tasks");
  const taskFilter = document.querySelector("#personal-tasks .task-filter");
  taskManager = new TaskManager(parent, formManager, taskFilter);
});

test("Tasks should be correctly added to DOM", () => {
  expect(taskManager.tasks.length).toBe(0);
  expect(parent.children.length).toBe(0);

  taskManager.addTask(
    "task Name 1",
    "task Details 1",
    "task Assignee 1",
    "2020-08-04",
    "In Progress"
  );

  expect(taskManager.tasks.length).toBe(1);
  expect(parent.children.length).toBe(1);

  taskManager.addTask(
    "task Name 2",
    "task Details 2",
    "task Assignee 2",
    "2020-09-27",
    "Not started"
  );

  expect(taskManager.tasks.length).toBe(2);
  expect(parent.children.length).toBe(2);
});
