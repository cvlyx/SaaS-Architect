import { useState } from "react";
import { useListUsers, useListOrganizations, useCreateUser } from "@workspace/api-client-react";
import type { User, Organization } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Plus, Search, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  inactive: "bg-gray-100 text-gray-600 border-gray-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
};

const ROLES = ["admin", "member", "viewer", "manager", "super_admin"];

function CreateUserDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const { data: orgs } = useListOrganizations();
  const createUser = useCreateUser();
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "",
    role: "member", organizationId: 1, password: "",
  });

  const handleSubmit = async () => {
    await createUser.mutateAsync({
      data: {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone || undefined,
        role: form.role,
        organizationId: Number(form.organizationId),
        password: form.password || undefined,
      },
    });
    setOpen(false);
    setForm({ fullName: "", email: "", phone: "", role: "member", organizationId: 1, password: "" });
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-1.5" /> New User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create user</DialogTitle>
          <DialogDescription>Add a new user to the platform.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label>Full name *</Label>
            <Input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Jane Smith" />
          </div>
          <div className="grid gap-1.5">
            <Label>Email *</Label>
            <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jane@example.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label>Role</Label>
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 555 0000" />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Organization</Label>
            <select value={form.organizationId} onChange={e => setForm(f => ({ ...f, organizationId: Number(e.target.value) }))}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              {(orgs || []).map((o: Organization) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
          <div className="grid gap-1.5">
            <Label>Password</Label>
            <Input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Leave blank to auto-generate" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!form.fullName || !form.email || createUser.isPending}>
            {createUser.isPending && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
            Create user
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [orgFilter, setOrgFilter] = useState<number | "all">("all");
  const { data: users, isLoading, refetch } = useListUsers();
  const { data: orgs } = useListOrganizations();

  const orgMap = (orgs || []).reduce((acc: Record<number, Organization>, o: Organization) => {
    acc[o.id] = o;
    return acc;
  }, {});

  const filtered = (users || []).filter((u: User) => {
    const matchSearch = u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchOrg = orgFilter === "all" || u.organizationId === orgFilter;
    return matchSearch && matchOrg;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage all platform users across organizations.</p>
        </div>
        <CreateUserDialog onCreated={refetch} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Total users", value: users?.length ?? 0 },
          { label: "Active", value: users?.filter((u: User) => u.status === "active").length ?? 0 },
          { label: "Pending", value: users?.filter((u: User) => u.status === "pending").length ?? 0 },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="pt-5 pb-4">
              <div className="text-3xl font-bold">{value}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              value={orgFilter === "all" ? "all" : String(orgFilter)}
              onChange={e => setOrgFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-w-[180px]"
            >
              <option value="all">All organizations</option>
              {(orgs || []).map((o: Organization) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Organization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatarUrl || ""} />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {user.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{user.fullName}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-muted border capitalize">
                        {user.role.replace("_", " ")}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {orgMap[user.organizationId]?.name ?? `Org #${user.organizationId}`}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[user.status] || "bg-muted text-muted-foreground"}`}>
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      No users found
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
