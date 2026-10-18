export const destinations = [
  ["overview", "Overview", "Review the workspace and open your task queue."],
  ["tasks", "Tasks", "Find a task and review its current status."],
  [
    "projects",
    "Projects",
    "Review project context before opening related tasks.",
  ],
  ["inbox", "Inbox", "Review incoming work in the task queue."],
  ["calendar", "Calendar", "Review task context before planning dates."],
  ["documents", "Documents", "Use task details to locate document context."],
  ["reports", "Reports", "Review task statuses before preparing a report."],
  ["team", "Team", "Review work context before coordinating with the team."],
  ["time", "Time", "Review the task before recording time elsewhere."],
  ["billing", "Billing", "Editor workspace billing context.", true],
  ["settings", "Settings", "Review local workspace navigation settings."],
  ["admin", "Administration", "Editor workspace administration context.", true],
].map(([id, label, purpose, editorOnly = false]) => ({
  id,
  label,
  purpose,
  editorOnly,
}));
export const initialTasks = [
  {
    id: "TASK-01",
    title: "Warehouse handover checklist — distinguishing suffix North",
    status: "Open",
  },
  {
    id: "TASK-02",
    title: "Procurement review — distinguishing suffix South",
    status: "In progress",
  },
];
export const statuses = ["Open", "In progress", "Done"];
