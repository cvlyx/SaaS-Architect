import { HeartPulse, Users, Stethoscope, Calendar } from "lucide-react";
import { IndustryDashboardShell } from "./industry-dashboard-shell";

export function HealthcareDashboard() {
  return (
    <IndustryDashboardShell
      icon={HeartPulse}
      title="Healthcare Dashboard"
      description="Manage patient care, appointments, and medical operations in one place."
      slug="healthcare"
      stats={[
        { key: "totalPatients", label: "Total Patients", color: "red", icon: Users },
        { key: "totalStaff", label: "Total Staff", color: "blue", icon: Stethoscope },
        { key: "totalAppointments", label: "Appointments", color: "emerald", icon: Calendar },
      ]}
    />
  );
}
