import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useListOrganizations, useListIndustryPacks, useCreateOrganization } from "@workspace/api-client-react";
import { IndustryIcon } from "@/components/industry-icon";
import type { Organization, IndustryPack } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Building2, Plus, Search, Globe, Users, Calendar, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  trial: "bg-blue-100 text-blue-700 border-blue-200",
  suspended: "bg-amber-100 text-amber-700 border-amber-200",
  expired: "bg-red-100 text-red-700 border-red-200",
};

const ORG_TYPES = ["Private", "Public", "Non-profit", "Government", "Startup"];
const ORG_SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"];

function CreateOrgDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const { data: packs } = useListIndustryPacks();
  const queryClient = useQueryClient();
  const createOrg = useCreateOrganization({
    mutation: {
      onMutate: async (orgData) => {
        await queryClient.cancelQueries({ queryKey: ["/api/organizations"] });
        const prev = queryClient.getQueryData(["/api/organizations"]);
        const optimistic = { id: Date.now(), ...orgData.data, status: "trial", createdAt: new Date().toISOString(), logoUrl: null, website: orgData.data.website || null };
        queryClient.setQueryData(["/api/organizations"], (old: any) => [...(old || []), optimistic]);
        return { prev };
      },
      onError: (_err, _vars, ctx) => {
        if (ctx?.prev) queryClient.setQueryData(["/api/organizations"], ctx.prev);
        toast.error("Failed to create organization");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/organizations"] });
        toast.success("Organization created");
      },
    },
  });
  const [form, setForm] = useState({
    name: "", type: "Private", country: "United States",
    city: "", size: "11-50", industryPackId: 1, website: "",
  });

  const handleSubmit = async () => {
    await createOrg.mutateAsync({
      data: { ...form, industryPackId: Number(form.industryPackId) }
    });
    setOpen(false);
    setForm({ name: "", type: "Private", country: "United States", city: "", size: "11-50", industryPackId: 1, website: "" });
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-1.5" /> New Organization</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create organization</DialogTitle>
          <DialogDescription>Add a new organization to the platform.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label>Name *</Label>
            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Acme Corp" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label>Type</Label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                {ORG_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label>Size</Label>
              <select value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                {ORG_SIZES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label>Country</Label>
              <Input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} />
            </div>
            <div className="grid gap-1.5">
              <Label>City *</Label>
              <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="San Francisco" />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Industry Pack</Label>
            <select value={form.industryPackId} onChange={e => setForm(f => ({ ...f, industryPackId: Number(e.target.value) }))}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              {(packs || []).map((p: IndustryPack) => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
            </select>
          </div>
          <div className="grid gap-1.5">
            <Label>Website</Label>
            <Input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://acme.com" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!form.name || !form.city || createOrg.isPending}>
            {createOrg.isPending ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : null}
            Create organization
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Organizations() {
  const [search, setSearch] = useState("");
  const { data: orgs, isLoading, refetch } = useListOrganizations();
  const { data: packs } = useListIndustryPacks();

  const packMap = (packs || []).reduce((acc: Record<number, IndustryPack>, p: IndustryPack) => {
    acc[p.id] = p;
    return acc;
  }, {});

  const filtered = (orgs || []).filter((o: Organization) =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.city.toLowerCase().includes(search.toLowerCase()) ||
    o.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">Manage all organizations on the platform.</p>
        </div>
        <CreateOrgDialog onCreated={refetch} />
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total", value: orgs?.length ?? 0, color: "text-foreground" },
          { label: "Active", value: orgs?.filter((o: Organization) => o.status === "active").length ?? 0, color: "text-emerald-600" },
          { label: "Trial", value: orgs?.filter((o: Organization) => o.status === "trial").length ?? 0, color: "text-blue-600" },
          { label: "Suspended", value: orgs?.filter((o: Organization) => o.status === "suspended").length ?? 0, color: "text-amber-600" },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="pt-5 pb-4">
              <div className={`text-3xl font-bold ${color}`}>{value}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search organizations..."
                className="pl-8"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-3">
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-4 w-20 hidden md:block" />
                  <Skeleton className="h-4 w-16 hidden sm:block" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <Skeleton className="h-4 w-24 hidden lg:block" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead className="hidden sm:table-cell">Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((org: Organization) => {
                  const pack = packMap[org.industryPackId];
                  return (
                    <TableRow key={org.id} className="cursor-pointer hover:bg-muted/40">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                            {org.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium leading-tight">{org.name}</div>
                            {org.website && (
                              <a href={org.website} target="_blank" rel="noreferrer"
                                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                <Globe className="h-3 w-3" />
                                {org.website.replace(/^https?:\/\//, "")}
                              </a>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {pack ? (
                          <span className="flex items-center gap-1.5 text-sm">
                            <IndustryIcon icon={pack.icon} className="h-4 w-4 flex-shrink-0" style={{ color: pack.color }} />
                            <span className="hidden sm:inline">{pack.name}</span>
                          </span>
                        ) : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {org.city}, {org.country}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {org.size}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[org.status] || "bg-muted text-muted-foreground"}`}>
                          {org.status}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(org.createdAt), { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      <Building2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      No organizations found
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
