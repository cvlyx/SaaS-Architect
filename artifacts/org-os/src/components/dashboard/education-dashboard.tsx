import { GraduationCap, Users, BookOpen, UserCheck } from "lucide-react";
import { IndustryDashboardShell } from "./industry-dashboard-shell";

export function EducationDashboard() {
  return (
    <IndustryDashboardShell
      icon={GraduationCap}
      title="Education Dashboard"
      description="Manage classes, students, and academic operations."
      slug="education"
      stats={[
        { key: "totalStudents", label: "Students", color: "yellow", icon: Users },
        { key: "totalTeachers", label: "Teachers", color: "blue", icon: UserCheck },
        { key: "totalClasses", label: "Classes", color: "purple", icon: BookOpen },
      ]}
    />
  );
}
