import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Users as UsersIcon, Plus, Search, Loader2, Mail, UserPlus, Copy, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  inactive: "bg-gray-100 text-gray-600 border-gray-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
};

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "member", label: "Member" },
  { value: "viewer", label: "Viewer" },
];

function InviteDialog({ onCreated }: { onCreated: () => void }) {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", role: "member" });

  const handleSend = async () => {
    if (!form.fullName || !form.email) { toast.error("Name and email required"); return; }
    setSending(true);
    try {
      const res = await fetch(`${API}/api/users/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fullName: form.fullName, email: form.email, role: form.role, organizationId: 1 }),
      });
      const data = await res.json();
      if (res.ok) {
        setInviteLink(data.inviteLink);
        toast.success("Invitation sent");
        onCreated();
      } else {
        toast.error(data.error || "Failed to invite");
      }
    } catch { toast.error("Failed to send invitation"); }
    finally { setSending(false); }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setForm({ fullName: "", email: "", role: "member" });
    setInviteLink("");
    setCopied(false);
  };

  return (
    <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) resetForm(); }}>
      <DialogTrigger asChild>
        <Button><UserPlus className="h-4 w-4 mr-1.5" /> Invite Member</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{inviteLink ? "Invitation created" : "Invite team member"}</DialogTitle>
        </DialogHeader>
        {inviteLink ? (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950 border text-sm">
              <Mail className="h-5 w-5 text-amber-500 shrink-0" />
              <span>Share this link with {form.fullName} to join your organization.</span>
            </div>
            <div className="flex items-center gap-2">
              <Input value={inviteLink} readOnly className="text-xs" />
              <Button variant="outline" size="icon" onClick={copyLink}>
                {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button variant="outline" className="w-full" onClick={() => { resetForm(); setInviteLink(""); }}>Invite another</Button>
          </div>
        ) : (
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label>Full name *</Label>
              <Input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Jane Smith" />
            </div>
            <div className="grid gap-1.5">
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jane@company.com" />
            </div>
            <div className="grid gap-1.5">
              <Label>Role</Label>
              <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSend} disabled={sending}>
                {sending && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
                Send invitation
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function UsersPage() {
  const { user: currentUser, token } = useAuth();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    if (!currentUser?.organizationId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/users?organizationId=${currentUser.organizationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setUsers(await res.json());
    } catch { toast.error("Failed to load team"); }
    finally { setLoading(false); }
  }, [currentUser?.organizationId, token]);

  const filtered = users.filter((u: any) =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground">Manage your organization's team members.</p>
        </div>
        <InviteDialog onCreated={fetchUsers} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Team members", value: users.length },
          { label: "Active", value: users.filter((u: any) => u.status === "active").length },
          { label: "Pending", value: users.filter((u: any) => u.status === "pending").length },
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
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search team..." className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-56" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-md" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <Skeleton className="h-4 w-24 hidden lg:block" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Joined</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatarUrl || ""} />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {user.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
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
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[user.status] || "bg-muted text-muted-foreground"}`}>
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      {user.status === "pending" && (
                        <Button variant="ghost" size="sm" className="text-xs" onClick={() => toast.info("Resend invite - feature coming soon")}>
                          <Mail className="h-3 w-3 mr-1" /> Resend
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      <UsersIcon className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      No team members found
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
