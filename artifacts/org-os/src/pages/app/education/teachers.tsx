import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth-provider";
import { Plus, Search, Pencil, Trash2, Users, Loader2 } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function Teachers() {
  const { user, token } = useAuth();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", subject: "" });

  const fetch = useCallback(async () => {
    if (!user?.organizationId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/education/teachers?organizationId=${user.organizationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) { const j = await res.json(); setTeachers(Array.isArray(j) ? j : (j.data || [])); }
    } catch { toast.error("Failed to load teachers"); }
    finally { setLoading(false); }
  }, [user?.organizationId, token]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleSave = async () => {
    if (!user?.organizationId) return;
    const body = { ...form, organizationId: user.organizationId };
    try {
      const res = editing
        ? await fetch(`${API}/api/education/teachers/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(body) })
        : await fetch(`${API}/api/education/teachers`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
      if (res.ok) { toast.success(editing ? "Teacher updated" : "Teacher created"); setDialogOpen(false); setEditing(null); setForm({ firstName: "", lastName: "", email: "", phone: "", subject: "" }); fetch(); }
      else toast.error("Failed to save");
    } catch { toast.error("Failed to save"); }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API}/api/education/teachers/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { toast.success("Teacher deleted"); fetch(); }
    } catch { toast.error("Failed to delete"); }
  };

  const filtered = teachers.filter((t: any) =>
    `${t.firstName} ${t.lastName} ${t.subject || ""} ${t.email || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-500" /> Teachers
          </h1>
          <p className="text-muted-foreground">Manage faculty and staff</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditing(null); setForm({ firstName: "", lastName: "", email: "", phone: "", subject: "" }); }}>
              <Plus className="h-4 w-4 mr-1.5" /> Add Teacher
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit Teacher" : "Add Teacher"}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label>First Name</Label><Input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} /></div>
                <div className="grid gap-2"><Label>Last Name</Label><Input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} /></div>
              </div>
              <div className="grid gap-2"><Label>Email</Label><Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
              <div className="grid gap-2"><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
              <div className="grid gap-2"><Label>Subject</Label><Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g. Mathematics, Physics" /></div>
            </div>
            <DialogFooter><Button onClick={handleSave}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative w-full md:w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search teachers..." className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Subject</TableHead><TableHead>Status</TableHead><TableHead>Hired</TableHead><TableHead className="w-20">Actions</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No teachers found</TableCell></TableRow>
              ) : filtered.map((t: any) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.lastName}, {t.firstName}</TableCell>
                  <TableCell>{t.email || "—"}</TableCell>
                  <TableCell><Badge variant="outline">{t.subject}</Badge></TableCell>
                  <TableCell><Badge variant={t.status === "active" ? "default" : "secondary"}>{t.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(t.hireDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditing(t); setForm({ firstName: t.firstName, lastName: t.lastName, email: t.email || "", phone: t.phone || "", subject: t.subject }); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
