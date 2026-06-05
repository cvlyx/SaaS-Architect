import { useState } from "react";
import {
  useListSubscriptions,
  useListOrganizations,
  useGetPaymentHistory,
} from "@workspace/api-client-react";
import type { SubscriptionPlan, Organization, PaymentRecord } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, CheckCircle2, TrendingUp, DollarSign } from "lucide-react";
import { format } from "date-fns";

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  failed: "bg-red-100 text-red-700 border-red-200",
};

function PlansOverview() {
  const { data: plans, isLoading } = useListSubscriptions();

  const totalMRR = (plans || []).reduce((sum: number, p: SubscriptionPlan) => sum + (p.priceMonthly || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between mb-1">
              <div className="text-3xl font-bold">{plans?.length ?? 0}</div>
              <CreditCard className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-sm text-muted-foreground">Total plans</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between mb-1">
              <div className="text-3xl font-bold text-primary">${Math.round(totalMRR)}</div>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div className="text-sm text-muted-foreground">Combined plan value/mo</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between mb-1">
              <div className="text-3xl font-bold text-emerald-600">
                {(plans || []).filter((p: SubscriptionPlan) => p.isPopular).length}
              </div>
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="text-sm text-muted-foreground">Featured plans</div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader><div className="h-6 w-24 bg-muted rounded" /></CardHeader>
              <CardContent><div className="h-10 w-20 bg-muted rounded" /></CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(plans || []).map((plan: SubscriptionPlan) => (
            <Card key={plan.id} className={`relative flex flex-col ${plan.isPopular ? "border-primary ring-1 ring-primary shadow-lg shadow-primary/10" : ""}`}>
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="px-3 py-0.5 text-xs">Most popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-3">
                  <span className="text-4xl font-bold">${plan.priceMonthly}</span>
                  <span className="text-muted-foreground text-sm">/mo</span>
                </div>
                {plan.priceYearly && (
                  <p className="text-xs text-muted-foreground">
                    ${plan.priceYearly}/yr — save {Math.round(100 - (plan.priceYearly / (plan.priceMonthly * 12)) * 100)}%
                  </p>
                )}
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    Up to {plan.maxUsers === 9999 ? "unlimited" : plan.maxUsers} users
                  </li>
                  {plan.features.map((f: string) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function PaymentHistory() {
  const { data: orgs } = useListOrganizations();
  const [selectedOrgId, setSelectedOrgId] = useState<number>(0);

  const orgId = selectedOrgId || orgs?.[0]?.id || 1;

  const { data: payments, isLoading } = useGetPaymentHistory(
    { organizationId: orgId },
    { query: { queryKey: [`/api/subscriptions/history`, orgId], enabled: !!orgId } }
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <select
          value={selectedOrgId || orgId}
          onChange={e => setSelectedOrgId(Number(e.target.value))}
          className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-w-[220px]"
        >
          {(orgs || []).map((o: Organization) => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment records</CardTitle>
          <CardDescription>Payment history for the selected organization.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-4 w-48 flex-1" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <Skeleton className="h-4 w-28 hidden md:block" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(payments || []).map((p: PaymentRecord) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm">{p.description}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${p.amount.toLocaleString()} {p.currency.toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${PAYMENT_STATUS_COLORS[p.status] || "bg-muted text-muted-foreground"}`}>
                        {p.status}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {format(new Date(p.paidAt), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
                {(!payments || payments.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                      <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      No payment records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscriptions & Billing</h1>
        <p className="text-muted-foreground">Manage subscription plans and payment history.</p>
      </div>

      <Tabs defaultValue="plans">
        <TabsList className="mb-6">
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
        </TabsList>
        <TabsContent value="plans"><PlansOverview /></TabsContent>
        <TabsContent value="payments"><PaymentHistory /></TabsContent>
      </Tabs>
    </div>
  );
}
