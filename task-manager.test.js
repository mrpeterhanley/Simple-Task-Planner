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
  parent = document.querySelector("#taskTableBody");
  taskManager = new TaskManager("personaltaskManager");
});

test("Tasks should be correctly added to DOM", () => {
  expect(taskManager).toBeDefined();
  expect(parent).toBeDefined();
  expect(taskManager.tasks.length).toBe(0);
  expect(parent.children.length).toBe(0);

  taskManager.addTask(
    "task Name 1",
    "task Details 1",
    "task Assignee 1",
    "2020-08-04",
    "In Progress"
  );

  taskManager.refreshTaskTable();

  expect(taskManager.tasks.length).toBe(1);
  expect(parent.children.length).toBe(2);

  expect(taskManager.tasks[0].id).toBe(1);
  expect(taskManager.tasks[0].name).toBe("task Name 1");
  expect(taskManager.tasks[0].details).toBe("task Details 1");
  expect(taskManager.tasks[0].assignee).toBe("task Assignee 1");
  expect(taskManager.tasks[0].duedate).toBe("2020-08-04");
  expect(taskManager.tasks[0].status).toBe("In Progress");

  taskManager.addTask(
    "task Name 2",
    "task Details 2",
    "task Assignee 2",
    "2020-09-27",
    "Not started"
  );
  taskManager.refreshTaskTable();
  expect(taskManager.tasks.length).toBe(2);
  expect(parent.children.length).toBe(4);

  expect(taskManager.tasks[1].id).toBe(2);
  expect(taskManager.tasks[1].name).toBe("task Name 2");
  expect(taskManager.tasks[1].details).toBe("task Details 2");
  expect(taskManager.tasks[1].assignee).toBe("task Assignee 2");
  expect(taskManager.tasks[1].duedate).toBe("2020-09-27");
  expect(taskManager.tasks[1].status).toBe("Not started");
});
