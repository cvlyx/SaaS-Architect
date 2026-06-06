import { ShoppingCart, Package, Users } from "lucide-react";
import { GenericEntityPage, type ColumnDef, type FormFieldDef } from "@/components/generic-entity-page";

const BASE = "/api/industries/retail";
const STATUS = [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }];

const prodCols: ColumnDef[] = [
  { key: "name", header: "Product" },
  { key: "sku", header: "SKU" },
  { key: "price", header: "Price", render: v => `$${Number(v).toFixed(2)}` },
  { key: "category", header: "Category" },
  { key: "status", header: "Status" },
];
const prodFields: FormFieldDef[] = [
  { key: "name", label: "Product Name", required: true },
  { key: "sku", label: "SKU", required: true },
  { key: "description", label: "Description" },
  { key: "price", label: "Price", type: "number", required: true },
  { key: "category", label: "Category" },
  { key: "status", label: "Status", type: "select", options: STATUS, defaultValue: "active" },
];

const invCols: ColumnDef[] = [
  { key: "productId", header: "Product ID" },
  { key: "quantity", header: "Qty" },
  { key: "reorderLevel", header: "Reorder At" },
  { key: "location", header: "Location" },
  { key: "lastRestocked", header: "Last Restocked" },
];
const invFields: FormFieldDef[] = [
  { key: "productId", label: "Product ID", type: "number", required: true },
  { key: "quantity", label: "Quantity", type: "number", required: true },
  { key: "reorderLevel", label: "Reorder Level", type: "number" },
  { key: "location", label: "Location" },
  { key: "lastRestocked", label: "Last Restocked", type: "date" },
];

const custCols: ColumnDef[] = [
  { key: "lastName", header: "Name", render: (_, r) => `${r.lastName}, ${r.firstName}` },
  { key: "email", header: "Email" },
  { key: "loyaltyPoints", header: "Loyalty Pts" },
  { key: "status", header: "Status" },
];
const custFields: FormFieldDef[] = [
  { key: "firstName", label: "First Name", required: true },
  { key: "lastName", label: "Last Name", required: true },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone", type: "tel" },
  { key: "loyaltyPoints", label: "Loyalty Points", type: "number" },
  { key: "status", label: "Status", type: "select", options: STATUS, defaultValue: "active" },
];

export function RetailProducts() { return <GenericEntityPage title="Products" icon={<Package className="h-8 w-8 text-green-500" />} description="Manage product catalog" entityLabel="Product" apiPath={`${BASE}/products`} columns={prodCols} formFields={prodFields} searchFields={["name", "sku", "category"]} />; }
export function RetailInventory() { return <GenericEntityPage title="Inventory" icon={<ShoppingCart className="h-8 w-8 text-green-500" />} description="Track inventory levels" entityLabel="Inventory Item" apiPath={`${BASE}/inventory`} columns={invCols} formFields={invFields} searchFields={["location"]} />; }
export function RetailCustomers() { return <GenericEntityPage title="Customers" icon={<Users className="h-8 w-8 text-green-500" />} description="Manage customer relationships" entityLabel="Customer" apiPath={`${BASE}/customers`} columns={custCols} formFields={custFields} searchFields={["firstName", "lastName", "email"]} />; }
