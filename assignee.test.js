import AssigneeList from "./assignee.js";

/*
ASSIGNEE Class Testing Suite
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
The following methods are tested in Assignee Class:
1. addAssignee(assignee)
2. deleteAssignee(assignee)
*/

let assigneeList;

beforeEach(() => {
  assigneeList = new AssigneeList();
});

// 1. + 2. TEST addAssignee(assignee) & deleteAssignee(assignee)
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
test("New assignees are added & deleted correctly into the assignee list", () => {
  expect(assigneeList.list.length).toBe(0);

  assigneeList.addAssignee("Peter");
  expect(assigneeList.list.length).toBe(1);
  expect(assigneeList.list[0]).toBe("Peter");

  assigneeList.addAssignee("Catalina");
  expect(assigneeList.list.length).toBe(2);
  expect(assigneeList.list[1]).toBe("Catalina");

  assigneeList.deleteAssignee("Peter");
  expect(assigneeList.list.length).toBe(1);
  expect(assigneeList.list[0]).toBe("Catalina");
  expect(assigneeList.list[0]).not.toBe("Peter");
});
