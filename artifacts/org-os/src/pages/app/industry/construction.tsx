import { HardHat, Users, FileWarning } from "lucide-react";
import { GenericEntityPage, type ColumnDef, type FormFieldDef } from "@/components/generic-entity-page";

const BASE = "/api/industries/construction";
const STATUS = [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }];
const SEVERITY = [{ value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }, { value: "critical", label: "Critical" }];

const projCols: ColumnDef[] = [
  { key: "name", header: "Name" },
  { key: "location", header: "Location" },
  { key: "budget", header: "Budget", render: v => v ? `$${Number(v).toLocaleString()}` : "—" },
  { key: "status", header: "Status" },
];
const projFields: FormFieldDef[] = [
  { key: "name", label: "Project Name", required: true },
  { key: "description", label: "Description" },
  { key: "location", label: "Location" },
  { key: "startDate", label: "Start Date", type: "date" },
  { key: "endDate", label: "End Date", type: "date" },
  { key: "budget", label: "Budget", type: "number" },
  { key: "status", label: "Status", type: "select", options: [...STATUS, { value: "planning", label: "Planning" }, { value: "in_progress", label: "In Progress" }, { value: "completed", label: "Completed" }, { value: "on_hold", label: "On Hold" }], defaultValue: "planning" },
];

const workerCols: ColumnDef[] = [
  { key: "lastName", header: "Name", render: (_, r) => `${r.lastName}, ${r.firstName}` },
  { key: "role", header: "Role" },
  { key: "certification", header: "Certification" },
  { key: "status", header: "Status" },
];
const workerFields: FormFieldDef[] = [
  { key: "firstName", label: "First Name", required: true },
  { key: "lastName", label: "Last Name", required: true },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone", type: "tel" },
  { key: "role", label: "Role", required: true },
  { key: "certification", label: "Certification" },
  { key: "status", label: "Status", type: "select", options: STATUS, defaultValue: "active" },
];

const safetyCols: ColumnDef[] = [
  { key: "date", header: "Date" },
  { key: "severity", header: "Severity" },
  { key: "description", header: "Description", render: v => v?.length > 50 ? `${v.slice(0, 50)}...` : v },
  { key: "status", header: "Status" },
];
const safetyFields: FormFieldDef[] = [
  { key: "projectId", label: "Project ID", type: "number" },
  { key: "reportedBy", label: "Reported By", required: true },
  { key: "date", label: "Date", type: "date", required: true },
  { key: "severity", label: "Severity", type: "select", options: SEVERITY, defaultValue: "low" },
  { key: "description", label: "Description", required: true },
  { key: "correctiveAction", label: "Corrective Action" },
  { key: "status", label: "Status", type: "select", options: [{ value: "open", label: "Open" }, { value: "investigating", label: "Investigating" }, { value: "resolved", label: "Resolved" }], defaultValue: "open" },
];

export function ConstructionProjects() { return <GenericEntityPage title="Projects" icon={<HardHat className="h-8 w-8 text-amber-500" />} description="Manage construction projects" entityLabel="Project" apiPath={`${BASE}/projects`} columns={projCols} formFields={projFields} searchFields={["name", "location"]} />; }
export function ConstructionWorkers() { return <GenericEntityPage title="Workers" icon={<Users className="h-8 w-8 text-amber-500" />} description="Manage construction workers" entityLabel="Worker" apiPath={`${BASE}/workers`} columns={workerCols} formFields={workerFields} searchFields={["firstName", "lastName", "role"]} />; }
export function ConstructionSafetyReports() { return <GenericEntityPage title="Safety Reports" icon={<FileWarning className="h-8 w-8 text-amber-500" />} description="Track safety incidents" entityLabel="Safety Report" apiPath={`${BASE}/safety-reports`} columns={safetyCols} formFields={safetyFields} searchFields={["description", "severity", "status"]} />; }
