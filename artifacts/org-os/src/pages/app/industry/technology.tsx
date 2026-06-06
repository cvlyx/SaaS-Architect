import { Monitor, CheckSquare, Users } from "lucide-react";
import { GenericEntityPage, type ColumnDef, type FormFieldDef } from "@/components/generic-entity-page";

const BASE = "/api/industries/technology";
const PRIORITY = [{ value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }, { value: "critical", label: "Critical" }];

const projCols: ColumnDef[] = [
  { key: "name", header: "Project" },
  { key: "repository", header: "Repository" },
  { key: "status", header: "Status" },
];
const projFields: FormFieldDef[] = [
  { key: "name", label: "Project Name", required: true },
  { key: "description", label: "Description" },
  { key: "repository", label: "Repository URL" },
  { key: "startDate", label: "Start Date", type: "date" },
  { key: "endDate", label: "End Date", type: "date" },
  { key: "status", label: "Status", type: "select", options: [{ value: "planning", label: "Planning" }, { value: "in_progress", label: "In Progress" }, { value: "completed", label: "Completed" }, { value: "on_hold", label: "On Hold" }], defaultValue: "planning" },
];

const taskCols: ColumnDef[] = [
  { key: "title", header: "Task" },
  { key: "projectId", header: "Project ID" },
  { key: "assignee", header: "Assignee" },
  { key: "priority", header: "Priority" },
  { key: "status", header: "Status" },
  { key: "dueDate", header: "Due Date" },
];
const taskFields: FormFieldDef[] = [
  { key: "projectId", label: "Project ID", type: "number" },
  { key: "title", label: "Title", required: true },
  { key: "description", label: "Description" },
  { key: "assignee", label: "Assignee" },
  { key: "priority", label: "Priority", type: "select", options: PRIORITY, defaultValue: "medium" },
  { key: "dueDate", label: "Due Date", type: "date" },
  { key: "status", label: "Status", type: "select", options: [{ value: "todo", label: "To Do" }, { value: "in_progress", label: "In Progress" }, { value: "review", label: "Review" }, { value: "done", label: "Done" }], defaultValue: "todo" },
];

const memCols: ColumnDef[] = [
  { key: "lastName", header: "Name", render: (_, r) => `${r.lastName}, ${r.firstName}` },
  { key: "email", header: "Email" },
  { key: "role", header: "Role" },
  { key: "department", header: "Department" },
];
const memFields: FormFieldDef[] = [
  { key: "firstName", label: "First Name", required: true },
  { key: "lastName", label: "Last Name", required: true },
  { key: "email", label: "Email", type: "email" },
  { key: "role", label: "Role", required: true },
  { key: "department", label: "Department" },
  { key: "status", label: "Status", type: "select", options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }], defaultValue: "active" },
];

export function TechnologyProjects() { return <GenericEntityPage title="Projects" icon={<Monitor className="h-8 w-8 text-violet-500" />} description="Manage technology projects" entityLabel="Project" apiPath={`${BASE}/projects`} columns={projCols} formFields={projFields} searchFields={["name", "repository"]} />; }
export function TechnologyTasks() { return <GenericEntityPage title="Tasks" icon={<CheckSquare className="h-8 w-8 text-violet-500" />} description="Track development tasks" entityLabel="Task" apiPath={`${BASE}/tasks`} columns={taskCols} formFields={taskFields} searchFields={["title", "assignee", "status"]} />; }
export function TechnologyTeamMembers() { return <GenericEntityPage title="Team Members" icon={<Users className="h-8 w-8 text-violet-500" />} description="Manage team members" entityLabel="Team Member" apiPath={`${BASE}/team-members`} columns={memCols} formFields={memFields} searchFields={["firstName", "lastName", "email", "role"]} />; }
