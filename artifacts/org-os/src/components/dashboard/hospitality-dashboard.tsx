import { Hotel, Users, Calendar, Building } from "lucide-react";
import { IndustryDashboardShell } from "./industry-dashboard-shell";

export function HospitalityDashboard() {
  return (
    <IndustryDashboardShell
      icon={Hotel}
      title="Hospitality Dashboard"
      description="Manage bookings, guests, and rooms."
      slug="hospitality"
      stats={[
        { key: "totalRooms", label: "Rooms", color: "amber", icon: Building },
        { key: "totalGuests", label: "Guests", color: "blue", icon: Users },
        { key: "totalBookings", label: "Bookings", color: "purple", icon: Calendar },
      ]}
    />
  );
}
