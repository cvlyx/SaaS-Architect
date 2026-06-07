import { DollarSign, Landmark, ArrowRightLeft, CreditCard } from "lucide-react";
import { IndustryDashboardShell } from "./industry-dashboard-shell";

export function FinanceDashboard() {
  return (
    <IndustryDashboardShell
      icon={DollarSign}
      title="Finance Dashboard"
      description="Track budgets, transactions, and accounts."
      slug="finance"
      stats={[
        { key: "totalAccounts", label: "Accounts", color: "blue", icon: Landmark },
        { key: "totalTransactions", label: "Transactions", color: "green", icon: ArrowRightLeft },
        { key: "totalBudgets", label: "Budgets", color: "purple", icon: CreditCard },
      ]}
    />
  );
}
