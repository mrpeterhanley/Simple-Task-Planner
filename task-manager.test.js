import TaskManager from "./task-manager.js";
import path from "path";
import fs from "fs";
const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");

/*
TASK MANAGER Class Testing Suite
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
The following methods are tested in Task Manager Class:
1. addTask(name, details, assignee, duedate, status)
2. deleteTask(id)
3. getTask(id)
4. updateTask(id, name, details, assignee, duedate, status)
5. refreshTaskTable(filter)
6. saveToStorage()
7. loadFromStorage()
*/

let taskManager;
let taskTable;

beforeEach(() => {
  taskManager = new TaskManager("myTaskManager");
  document.documentElement.innerHTML = html.toString();
  taskTable = document.querySelector("#taskTableBody");
  localStorage.clear();
});

// 1. TEST addTask(name, details, assignee, duedate, status)
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
test("A new task is added correctly into the task list array, all values are correct, and added correctly to the HTML", () => {
  expect(taskManager.tasks.length).toBe(0);

  let task1 = taskManager.addTask(
    "Task name 1",
    "Task details 1",
    "Task assignee",
    "2020-08-17",
    "Overdue"
  );

  expect(taskManager.tasks.length).toBe(1);
  expect(taskManager.tasks).toContain(task1);

  expect(taskManager.tasks[0].id).toBe(1);
  expect(taskManager.tasks[0].name).toBe("Task name 1");
  expect(taskManager.tasks[0].details).toBe("Task details 1");
  expect(taskManager.tasks[0].assignee).toBe("Task assignee");
  expect(taskManager.tasks[0].duedate).toBe("2020-08-17");
  expect(taskManager.tasks[0].status).toBe("Overdue");

  let task2 = taskManager.addTask(
    "Task name 2",
    "Task details 2",
    "Task assignee 2",
    "2020-08-17",
    "Overdue"
  );

  expect(taskManager.tasks.length).toBe(2);
  expect(taskManager.tasks).toContain(task1);
  expect(taskManager.tasks).toContain(task2);
});

// 2. TEST deleteTask(id)
// ~~~~~~~~~~~~~~~~~~~~~~
test("A task is deleted correctly from the task list array, and from the HTML", () => {
  expect(taskManager.tasks.length).toBe(0);

  let task1 = taskManager.addTask(
    "Task name 1",
    "Task details 1",
    "Task assignee",
    "2020-08-17",
    "Overdue"
  );

  let task2 = taskManager.addTask(
    "Task name 2",
    "Task details 2",
    "Task assignee",
    "2020-08-17",
    "Overdue"
  );

  let task3 = taskManager.addTask(
    "Task name 3",
    "Task details 3",
    "Task assignee",
    "2020-08-17",
    "Overdue"
  );

  expect(taskManager.tasks.length).toBe(3);

  taskManager.deleteTask(task1.id);

  expect(taskManager.tasks.length).toBe(2);
  expect(taskManager.tasks).not.toContain(task1);
  expect(taskManager.tasks).toContain(task2);
  expect(taskManager.tasks).toContain(task3);
});

// 3. TEST getTask(id)
// ~~~~~~~~~~~~~~~~~~~
test("The correct task from task list array is returned using the id value", () => {
  expect(taskManager.tasks.length).toBe(0);

  let task1 = taskManager.addTask(
    "Task name 1",
    "Task details 1",
    "Task assignee",
    "2020-08-17",
    "Overdue"
  );

  let task2 = taskManager.addTask(
    "Task name 2",
    "Task details 2",
    "Task assignee",
    "2020-08-17",
    "Overdue"
  );

  let task3 = taskManager.addTask(
    "Task name 3",
    "Task details 3",
    "Task assignee",
    "2020-08-17",
    "Overdue"
  );

  expect(taskManager.tasks.length).toBe(3);

  let returnedTask = taskManager.getTask(task2.id);

  expect(returnedTask).toBe(task2);
});

// 4. TEST updateTask(id, name, details, assignee, duedate, status)
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
test("A task from task list array is updated with correct values", () => {
  expect(taskManager.tasks.length).toBe(0);

  let task1 = taskManager.addTask(
    "Task name 1",
    "Task details 1",
    "Task assignee",
    "2020-08-17",
    "Overdue"
  );

  let task2 = taskManager.addTask(
    "Task name 2",
    "Task details 2",
    "Task assignee",
    "2020-01-01",
    "In progress"
  );

  expect(taskManager.tasks.length).toBe(2);

  let updatedTask = taskManager.updateTask(
    task1.id,
    "NEW task name 1",
    "NEW task details 1",
    "NEW assignee",
    "2020-01-01",
    "Completed"
  );

  expect(task1).toBe(updatedTask);
  expect(task2).not.toBe(updatedTask);
});

// 5. TEST refreshTaskTable(filter)
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
test("New tasks are correctly displayed on the index.html task table", () => {
  expect(taskManager.tasks.length).toBe(0);
  expect(taskTable.children.length).toBe(0);

  let task1 = taskManager.addTask(
    "Task name 22",
    "Task details 22",
    "Task assignee 22",
    "2020-08-08",
    "Completed"
  );

  expect(taskManager.tasks.length).toBe(1);

  taskManager.refreshTaskTable();
  // expect TWO new children rows in the task table (task row & task detail row)
  expect(taskTable.children.length).toBe(2);

  expect(taskTable.innerHTML).toContain(task1.name);
  expect(taskTable.innerHTML).toContain(task1.details);
  expect(taskTable.innerHTML).toContain(task1.assignee);
  expect(taskTable.innerHTML).toContain(task1.duedate);
  expect(taskTable.innerHTML).toContain(task1.status);

  let task2 = taskManager.addTask(
    "AAAAAAAAAA",
    "AAAAAAAAAAAAAAAAAAAAA",
    "AAAAAAAAAA",
    "2020-11-11",
    "In Progress"
  );

  expect(taskManager.tasks.length).toBe(2);

  // Task 2 has been added to the tasklist array but not yet added to the HTML page table. Check that it doesn't yet exist on the HTML page table
  expect(taskTable.innerHTML).not.toContain(task2.name);
  expect(taskTable.innerHTML).not.toContain(task2.details);
  expect(taskTable.innerHTML).not.toContain(task2.assignee);
  expect(taskTable.innerHTML).not.toContain(task2.duedate);
  expect(taskTable.innerHTML).not.toContain(task2.status);

  taskManager.refreshTaskTable();
  // expect TWO more new children rows in the task table (task row & task detail row)
  expect(taskTable.children.length).toBe(4);

  // Check that task 2 has now been added onto the HTML page table
  expect(taskTable.innerHTML).toContain(task2.name);
  expect(taskTable.innerHTML).toContain(task2.details);
  expect(taskTable.innerHTML).toContain(task2.assignee);
  expect(taskTable.innerHTML).toContain(task2.duedate);
  expect(taskTable.innerHTML).toContain(task2.status);
});

test("A deleted task is correctly removed from index.html task table", () => {
  expect(taskManager.tasks.length).toBe(0);
  expect(taskTable.children.length).toBe(0);

  let task1 = taskManager.addTask(
    "Task name 22",
    "Task details 22",
    "Task assignee 22",
    "2020-08-08",
    "Completed"
  );

  let task2 = taskManager.addTask(
    "AAAAAAAAAA",
    "AAAAAAAAAAAAAAAAAAAAA",
    "AAAAAAAAAA",
    "2020-11-11",
    "In Progress"
  );

  taskManager.refreshTaskTable();
  expect(taskManager.tasks.length).toBe(2);
  expect(taskTable.children.length).toBe(4);

  expect(taskTable.innerHTML).toContain(task1.name);
  expect(taskTable.innerHTML).toContain(task1.details);
  expect(taskTable.innerHTML).toContain(task1.assignee);
  expect(taskTable.innerHTML).toContain(task1.duedate);
  expect(taskTable.innerHTML).toContain(task1.status);

  expect(taskTable.innerHTML).toContain(task2.name);
  expect(taskTable.innerHTML).toContain(task2.details);
  expect(taskTable.innerHTML).toContain(task2.assignee);
  expect(taskTable.innerHTML).toContain(task2.duedate);
  expect(taskTable.innerHTML).toContain(task2.status);

  taskManager.deleteTask(task1.id);

  taskManager.refreshTaskTable();

  expect(taskTable.children.length).toBe(2);

  // Task 2 has been deleted. Expect it to no longer exist on the HTML page table
  expect(taskTable.innerHTML).not.toContain(task1.name);
  expect(taskTable.innerHTML).not.toContain(task1.details);
  expect(taskTable.innerHTML).not.toContain(task1.assignee);
  expect(taskTable.innerHTML).not.toContain(task1.duedate);
  expect(taskTable.innerHTML).not.toContain(task1.status);

  // Expect task 2 to still exist on the HTML page table
  expect(taskTable.innerHTML).toContain(task2.name);
  expect(taskTable.innerHTML).toContain(task2.details);
  expect(taskTable.innerHTML).toContain(task2.assignee);
  expect(taskTable.innerHTML).toContain(task2.duedate);
  expect(taskTable.innerHTML).toContain(task2.status);
});

test("Only filtered tasks are correctly displayed on the index.html task table", () => {
  expect(taskManager.tasks.length).toBe(0);
  expect(taskTable.children.length).toBe(0);

  let task1 = taskManager.addTask(
    "Task name 11",
    "Task details 11",
    "Task assignee 11",
    "2020-08-08",
    "Completed"
  );

  let task2 = taskManager.addTask(
    "Task name 22",
    "Task details 22",
    "Task assignee 22",
    "1999-09-09",
    "In progress"
  );

  let task3 = taskManager.addTask(
    "AAAAAAAAAA",
    "AAAAAAAAAAAAAAAAAAAAA",
    "AAAAAAAAAA",
    "2020-11-11",
    "Completed"
  );

  // expect 3 tasks in the task list array
  expect(taskManager.tasks.length).toBe(3);

  // only show tasks on the HTML page that have a status of "Completed" (task 1 and task 3)
  taskManager.refreshTaskTable("Completed");

  // expect FOUR new children rows in the task table (task row & task detail row) - 2 for each task shown on the HTML page
  expect(taskTable.children.length).toBe(4);

  // expect all task 1 information to be shown on the HTML page
  expect(taskTable.innerHTML).toContain(task1.name);
  expect(taskTable.innerHTML).toContain(task1.details);
  expect(taskTable.innerHTML).toContain(task1.assignee);
  expect(taskTable.innerHTML).toContain(task1.duedate);
  expect(taskTable.innerHTML).toContain(task1.status);

  // expect all task 2 information NOT to be shown on the HTML page (since it does not have a status of "Completed")
  expect(taskTable.innerHTML).not.toContain(task2.name);
  expect(taskTable.innerHTML).not.toContain(task2.details);
  expect(taskTable.innerHTML).not.toContain(task2.assignee);
  expect(taskTable.innerHTML).not.toContain(task2.duedate);
  expect(taskTable.innerHTML).not.toContain(task2.status);

  // expect all task 3 information to be shown on the HTML page
  expect(taskTable.innerHTML).toContain(task3.name);
  expect(taskTable.innerHTML).toContain(task3.details);
  expect(taskTable.innerHTML).toContain(task3.assignee);
  expect(taskTable.innerHTML).toContain(task3.duedate);
  expect(taskTable.innerHTML).toContain(task3.status);
});

// 5. TEST saveToStorage()
// ~~~~~~~~~~~~~~~~~~~~~~~
test("A new task & assignee are saved to local storage correctly", () => {
  // expect there to be no tasks, current ID or assignees in local storage
  expect(localStorage.getItem("tasks")).toBeFalsy();
  expect(localStorage.getItem("currentId")).toBeFalsy();
  expect(localStorage.getItem("assigneeList")).toBeFalsy();

  // add a sample task
  let task1 = taskManager.addTask(
    "Task name 11",
    "Task details 11",
    "Task assignee 11",
    "2020-08-08",
    "Completed"
  );

  // add a sample assignee
  taskManager.assigneeList.addAssignee("Peter");

  // save them to storage
  taskManager.saveToStorage();

  // check that tasks, currentId and assigneeList now exist in local storage
  expect(localStorage.getItem("tasks")).toBeTruthy();
  expect(localStorage.getItem("currentId")).toBeTruthy();
  expect(localStorage.getItem("assigneeList")).toBeTruthy();

  // check the values in local storage match the task and assignee that was added
  expect(localStorage.getItem("tasks")).toContain(task1.name);
  expect(localStorage.getItem("tasks")).toContain(task1.details);
  expect(localStorage.getItem("tasks")).toContain(task1.assignee);
  expect(localStorage.getItem("tasks")).toContain(task1.duedate);
  expect(localStorage.getItem("tasks")).toContain(task1.status);
  expect(localStorage.getItem("assigneeList")).toContain("Peter");

  // the current ID now should be "2" since one task has already been added
  expect(localStorage.getItem("currentId")).toBe("2");
});

// 5. TEST loadFromStorage()
// ~~~~~~~~~~~~~~~~~~~~~~~
test("Tasks & assignees are loaded from storage and displayed on the HTML page correctly", () => {
  // expect there to be no tasks, current ID or assignees in local storage
  expect(localStorage.getItem("tasks")).toBeFalsy();
  expect(localStorage.getItem("currentId")).toBeFalsy();
  expect(localStorage.getItem("assigneeList")).toBeFalsy();

  // add some sample tasks
  taskManager.addTask(
    "Task name 11",
    "Task details 11",
    "Task assignee 11",
    "2020-08-08",
    "Completed"
  );

  taskManager.addTask(
    "AAAAAAAAAA",
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "Sample assignee",
    "2020-12-12",
    "In progress"
  );

  // add a sample assignee
  taskManager.assigneeList.addAssignee("Peter");

  // save them to storage
  taskManager.saveToStorage();

  // reset and check all tasks & assignees in memory have been cleared
  taskManager.tasks = [];
  taskManager.assigneeList.list = [];
  taskManager.currentId = "1";
  expect(taskManager.tasks.length).toBe(0);
  expect(taskManager.assigneeList.list.length).toBe(0);

  // load back from local storage
  taskManager.loadFromStorage();

  // check the new task & assignee have been loaded back into memory
  expect(taskManager.tasks.length).toBe(2);
  expect(taskManager.currentId).toBe("3");
  expect(taskManager.assigneeList.list.length).toBe(1);
});

// loadFromStorage() {
//   if (localStorage.getItem("tasks")) {
//     // Local storage exists. Loading tasks & assignees from storage

//     const storageTasks = JSON.parse(localStorage.getItem("tasks"));
//     this.tasks = storageTasks.map(
//       (task) =>
//         new Task(
//           task.id,
//           task.name,
//           task.details,
//           task.assignee,
//           task.duedate,
//           task.status
//         )
//     );

//     let overdueTasks = this.tasks.filter((task) => task.status == "Overdue");

//     if (overdueTasks.length > 0) {
//       this.formManager.buildOverdueAlert(overdueTasks.length);
//     }

//     this.currentId = localStorage.getItem("currentId");

//     const storageAssignees = JSON.parse(localStorage.getItem("assigneeList"));

//     storageAssignees.list.forEach((assignee) =>
//       this.assigneeList.addAssignee(assignee)
//     );
//   } else {
//     //No local storage exists = new user. Create first time alerts and some sample tasks & assignee

//     this.formManager.buildFirstTimeAlerts();

//     this.assigneeList.addAssignee("Sample Assignee");

//     this.addTask(
//       "Sample Task 1",
//       "Put more detailed information about your task here",
//       this.assigneeList.list[0],
//       "2020-08-11",
//       "Not started"
//     );
//     this.addTask(
//       "Sample Task 2",
//       "Put more detailed information about your task here",
//       this.assigneeList.list[0],
//       "2020-09-12",
//       "Not started"
//     );
//   }
// }
