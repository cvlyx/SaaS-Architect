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
import { Plus, Search, BookOpen, Loader2, Trash2 } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function Classes() {
  const { user, token } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", subject: "", teacherId: "", room: "", schedule: "", maxCapacity: "30" });

  const fetch = useCallback(async () => {
    if (!user?.organizationId) return;
    setLoading(true);
    try {
      const h = { headers: { Authorization: `Bearer ${token}` } };
      const [cRes, tRes] = await Promise.all([
        fetch(`${API}/api/education/classes?organizationId=${user.organizationId}`, h),
        fetch(`${API}/api/education/teachers?organizationId=${user.organizationId}`, h),
      ]);
      if (cRes.ok) { const j = await cRes.json(); setClasses(Array.isArray(j) ? j : (j.data || [])); }
      if (tRes.ok) { const j = await tRes.json(); setTeachers(Array.isArray(j) ? j : (j.data || [])); }
    } catch { toast.error("Failed to load classes"); }
    finally { setLoading(false); }
  }, [user?.organizationId, token]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleSave = async () => {
    if (!user?.organizationId) return;
    const body = { ...form, organizationId: user.organizationId, teacherId: form.teacherId ? Number(form.teacherId) : null, maxCapacity: Number(form.maxCapacity) };
    try {
      const res = await fetch(`${API}/api/education/classes`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
      if (res.ok) { toast.success("Class created"); setDialogOpen(false); setForm({ name: "", subject: "", teacherId: "", room: "", schedule: "", maxCapacity: "30" }); fetch(); }
      else toast.error("Failed to save");
    } catch { toast.error("Failed to save"); }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API}/api/education/classes/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { toast.success("Class deleted"); fetch(); }
    } catch { toast.error("Failed to delete"); }
  };

  const getTeacherName = (id: number | null) => {
    if (!id) return "—";
    const t = teachers.find((t: any) => t.id === id);
    return t ? `${t.firstName} ${t.lastName}` : "—";
  };

  const filtered = classes.filter((c: any) =>
    `${c.name} ${c.subject} ${c.room || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-purple-500" /> Classes
          </h1>
          <p className="text-muted-foreground">Manage courses and schedules</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1.5" /> Add Class</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Class</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label>Class Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                <div className="grid gap-2"><Label>Subject</Label><Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} /></div>
              </div>
              <div className="grid gap-2"><Label>Teacher</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.teacherId} onChange={e => setForm(f => ({ ...f, teacherId: e.target.value }))}>
                  <option value="">Select teacher...</option>
                  {teachers.map((t: any) => <option key={t.id} value={t.id}>{t.firstName} {t.lastName} - {t.subject}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label>Room</Label><Input value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))} /></div>
                <div className="grid gap-2"><Label>Max Capacity</Label><Input type="number" value={form.maxCapacity} onChange={e => setForm(f => ({ ...f, maxCapacity: e.target.value }))} /></div>
              </div>
              <div className="grid gap-2"><Label>Schedule</Label><Input value={form.schedule} onChange={e => setForm(f => ({ ...f, schedule: e.target.value }))} placeholder="e.g. Mon/Wed 10:00-11:30" /></div>
            </div>
            <DialogFooter><Button onClick={handleSave}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative w-full md:w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search classes..." className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Name</TableHead><TableHead>Subject</TableHead><TableHead>Teacher</TableHead><TableHead>Room</TableHead><TableHead>Schedule</TableHead><TableHead>Capacity</TableHead><TableHead className="w-20">Actions</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No classes found</TableCell></TableRow>
              ) : filtered.map((c: any) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell><Badge variant="outline">{c.subject}</Badge></TableCell>
                  <TableCell>{getTeacherName(c.teacherId)}</TableCell>
                  <TableCell>{c.room || "—"}</TableCell>
                  <TableCell className="text-sm">{c.schedule || "—"}</TableCell>
                  <TableCell>{c.maxCapacity || "—"}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
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
