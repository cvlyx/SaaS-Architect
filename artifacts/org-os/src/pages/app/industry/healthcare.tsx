import { HeartPulse, Stethoscope, CalendarClock } from "lucide-react";
import { GenericEntityPage, type ColumnDef, type FormFieldDef } from "@/components/generic-entity-page";

const BASE = "/api/industries/healthcare";
const STATUS_OPTIONS = [
  { value: "active", label: "Active" }, { value: "inactive", label: "Inactive" },
];

const patientCols: ColumnDef[] = [
  { key: "lastName", header: "Name", render: (_, r) => `${r.lastName}, ${r.firstName}` },
  { key: "email", header: "Email" },
  { key: "gender", header: "Gender" },
  { key: "bloodType", header: "Blood Type" },
  { key: "status", header: "Status", render: v => <span className={`px-2 py-0.5 rounded text-xs font-medium ${v === "active" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"}`}>{v}</span> },
];
const patientFields: FormFieldDef[] = [
  { key: "firstName", label: "First Name", required: true },
  { key: "lastName", label: "Last Name", required: true },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone", type: "tel" },
  { key: "dateOfBirth", label: "Date of Birth", type: "date" },
  { key: "gender", label: "Gender", type: "select", options: [{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }, { value: "Other", label: "Other" }] },
  { key: "bloodType", label: "Blood Type", type: "select", options: [{ value: "A+", label: "A+" }, { value: "A-", label: "A-" }, { value: "B+", label: "B+" }, { value: "B-", label: "B-" }, { value: "AB+", label: "AB+" }, { value: "AB-", label: "AB-" }, { value: "O+", label: "O+" }, { value: "O-", label: "O-" }] },
  { key: "allergies", label: "Allergies" },
  { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: "active" },
];

const staffCols: ColumnDef[] = [
  { key: "lastName", header: "Name", render: (_, r) => `${r.lastName}, ${r.firstName}` },
  { key: "email", header: "Email" },
  { key: "role", header: "Role" },
  { key: "department", header: "Department" },
  { key: "status", header: "Status" },
];
const staffFields: FormFieldDef[] = [
  { key: "firstName", label: "First Name", required: true },
  { key: "lastName", label: "Last Name", required: true },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone", type: "tel" },
  { key: "role", label: "Role", required: true, type: "select", options: [{ value: "Doctor", label: "Doctor" }, { value: "Nurse", label: "Nurse" }, { value: "Admin", label: "Admin" }, { value: "Receptionist", label: "Receptionist" }, { value: "Technician", label: "Technician" }] },
  { key: "department", label: "Department", required: true },
  { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS, defaultValue: "active" },
];

const apptCols: ColumnDef[] = [
  { key: "date", header: "Date" },
  { key: "time", header: "Time" },
  { key: "reason", header: "Reason" },
  { key: "patientId", header: "Patient ID" },
  { key: "status", header: "Status" },
];
const apptFields: FormFieldDef[] = [
  { key: "patientId", label: "Patient ID", type: "number", required: true },
  { key: "staffId", label: "Staff ID", type: "number" },
  { key: "date", label: "Date", type: "date", required: true },
  { key: "time", label: "Time", required: true },
  { key: "reason", label: "Reason", required: true },
  { key: "notes", label: "Notes" },
  { key: "status", label: "Status", type: "select", options: [...STATUS_OPTIONS, { value: "scheduled", label: "Scheduled" }, { value: "completed", label: "Completed" }, { value: "cancelled", label: "Cancelled" }], defaultValue: "scheduled" },
];

export function HealthcarePatients() { return <GenericEntityPage title="Patients" icon={<HeartPulse className="h-8 w-8 text-red-500" />} description="Manage patient records" entityLabel="Patient" apiPath={`${BASE}/patients`} columns={patientCols} formFields={patientFields} searchFields={["firstName", "lastName", "email"]} />; }
export function HealthcareStaff() { return <GenericEntityPage title="Staff" icon={<Stethoscope className="h-8 w-8 text-red-500" />} description="Manage healthcare staff" entityLabel="Staff" apiPath={`${BASE}/staff`} columns={staffCols} formFields={staffFields} searchFields={["firstName", "lastName", "email", "role"]} />; }
export function HealthcareAppointments() { return <GenericEntityPage title="Appointments" icon={<CalendarClock className="h-8 w-8 text-red-500" />} description="Manage patient appointments" entityLabel="Appointment" apiPath={`${BASE}/appointments`} columns={apptCols} formFields={apptFields} searchFields={["reason", "status"]} />; }
