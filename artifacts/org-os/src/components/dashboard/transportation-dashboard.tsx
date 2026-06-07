import { Truck, Package, Users, MapPin } from "lucide-react";
import { IndustryDashboardShell } from "./industry-dashboard-shell";

export function TransportationDashboard() {
  return (
    <IndustryDashboardShell
      icon={Truck}
      title="Transportation Dashboard"
      description="Track deliveries, vehicles, and drivers."
      slug="transportation"
      stats={[
        { key: "totalVehicles", label: "Vehicles", color: "green", icon: Truck },
        { key: "totalDrivers", label: "Drivers", color: "purple", icon: Users },
        { key: "totalShipments", label: "Shipments", color: "amber", icon: Package },
      ]}
    />
  );
}
