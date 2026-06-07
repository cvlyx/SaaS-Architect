import { Factory, Package, Box, Truck } from "lucide-react";
import { IndustryDashboardShell } from "./industry-dashboard-shell";

export function ManufacturingDashboard() {
  return (
    <IndustryDashboardShell
      icon={Factory}
      title="Manufacturing Dashboard"
      description="Track production, inventory, and supply chain."
      slug="manufacturing"
      stats={[
        { key: "totalProducts", label: "Products", color: "teal", icon: Package },
        { key: "totalProductionRuns", label: "Production Runs", color: "amber", icon: Box },
        { key: "totalSuppliers", label: "Suppliers", color: "blue", icon: Truck },
      ]}
    />
  );
}
