import { Landmark, ArrowRightLeft, PiggyBank } from "lucide-react";
import { GenericEntityPage, type ColumnDef, type FormFieldDef } from "@/components/generic-entity-page";

const BASE = "/api/industries/finance";

const acctCols: ColumnDef[] = [
  { key: "name", header: "Account" },
  { key: "accountNumber", header: "Account #" },
  { key: "type", header: "Type" },
  { key: "balance", header: "Balance", render: v => `$${Number(v).toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
  { key: "status", header: "Status" },
];
const acctFields: FormFieldDef[] = [
  { key: "name", label: "Account Name", required: true },
  { key: "accountNumber", label: "Account Number" },
  { key: "type", label: "Type", type: "select", required: true, options: [{ value: "checking", label: "Checking" }, { value: "savings", label: "Savings" }, { value: "credit", label: "Credit" }, { value: "investment", label: "Investment" }], defaultValue: "checking" },
  { key: "balance", label: "Balance", type: "number" },
  { key: "currency", label: "Currency", defaultValue: "USD" },
  { key: "status", label: "Status", type: "select", options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }], defaultValue: "active" },
];

const txnCols: ColumnDef[] = [
  { key: "date", header: "Date" },
  { key: "type", header: "Type" },
  { key: "amount", header: "Amount", render: v => `$${Number(v).toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
  { key: "description", header: "Description" },
  { key: "category", header: "Category" },
  { key: "status", header: "Status" },
];
const txnFields: FormFieldDef[] = [
  { key: "accountId", label: "Account ID", type: "number", required: true },
  { key: "type", label: "Type", type: "select", required: true, options: [{ value: "credit", label: "Credit" }, { value: "debit", label: "Debit" }, { value: "transfer", label: "Transfer" }] },
  { key: "amount", label: "Amount", type: "number", required: true },
  { key: "description", label: "Description" },
  { key: "date", label: "Date", type: "date", required: true },
  { key: "category", label: "Category" },
  { key: "status", label: "Status", type: "select", options: [{ value: "completed", label: "Completed" }, { value: "pending", label: "Pending" }, { value: "failed", label: "Failed" }], defaultValue: "completed" },
];

const budCols: ColumnDef[] = [
  { key: "name", header: "Budget" },
  { key: "amount", header: "Amount", render: v => `$${Number(v).toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
  { key: "spent", header: "Spent", render: v => `$${Number(v).toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
  { key: "category", header: "Category" },
  { key: "status", header: "Status" },
];
const budFields: FormFieldDef[] = [
  { key: "name", label: "Budget Name", required: true },
  { key: "amount", label: "Amount", type: "number", required: true },
  { key: "spent", label: "Spent", type: "number" },
  { key: "startDate", label: "Start Date", type: "date" },
  { key: "endDate", label: "End Date", type: "date" },
  { key: "category", label: "Category" },
  { key: "status", label: "Status", type: "select", options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }], defaultValue: "active" },
];

export function FinanceAccounts() { return <GenericEntityPage title="Accounts" icon={<Landmark className="h-8 w-8 text-cyan-500" />} description="Manage financial accounts" entityLabel="Account" apiPath={`${BASE}/accounts`} columns={acctCols} formFields={acctFields} searchFields={["name", "accountNumber", "type"]} />; }
export function FinanceTransactions() { return <GenericEntityPage title="Transactions" icon={<ArrowRightLeft className="h-8 w-8 text-cyan-500" />} description="Track financial transactions" entityLabel="Transaction" apiPath={`${BASE}/transactions`} columns={txnCols} formFields={txnFields} searchFields={["description", "category", "type"]} />; }
export function FinanceBudgets() { return <GenericEntityPage title="Budgets" icon={<PiggyBank className="h-8 w-8 text-cyan-500" />} description="Manage budgets and spending" entityLabel="Budget" apiPath={`${BASE}/budgets`} columns={budCols} formFields={budFields} searchFields={["name", "category"]} />; }
