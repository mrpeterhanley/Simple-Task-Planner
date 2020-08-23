import Task from "./task.js";

const task = new Task(
  "task1",
  "task Name",
  "task Details",
  "task Assignee",
  "2020-08-04",
  "In Progress"
);

test("object creation", () => {
  expect(task.id).toBe("task1");
  expect(task.name).toBe("task Name");
  expect(task.details).toBe("task Details");
  expect(task.assignee).toBe("task Assignee");
  expect(task.duedate).toBe("2020-08-04");
  expect(task.status).toBe("In Progress");
});
