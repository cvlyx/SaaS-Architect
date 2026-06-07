import { ShoppingBag, Package, ShoppingCart, Users } from "lucide-react";
import { IndustryDashboardShell } from "./industry-dashboard-shell";

export function RetailDashboard() {
  return (
    <IndustryDashboardShell
      icon={ShoppingBag}
      title="Retail Dashboard"
      description="Track sales, inventory, and customers."
      slug="retail"
      stats={[
        { key: "totalProducts", label: "Products", color: "green", icon: Package },
        { key: "totalInventoryItems", label: "Inventory Items", color: "amber", icon: ShoppingCart },
        { key: "totalCustomers", label: "Customers", color: "blue", icon: Users },
      ]}
    />
  );
}
