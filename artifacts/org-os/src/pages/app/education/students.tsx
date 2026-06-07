import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth-provider";
import { Plus, Search, Pencil, Trash2, GraduationCap, Loader2 } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
const GRADE_LEVELS = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];
const STATUSES = ["active", "inactive", "graduated"];

interface Student {
  id: number; firstName: string; lastName: string; email: string | null;
  phone: string | null; dateOfBirth: string | null; gradeLevel: string;
  enrollmentDate: string; status: string;
}

export default function Students() {
  const { user, token } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", dateOfBirth: "", gradeLevel: "Freshman" });

  const fetchStudents = useCallback(async () => {
    if (!user?.organizationId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/education/students?organizationId=${user.organizationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) { const j = await res.json(); setStudents(Array.isArray(j) ? j : (j.data || [])); }
    } catch { toast.error("Failed to load students"); }
    finally { setLoading(false); }
  }, [user?.organizationId, token]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const handleSave = async () => {
    if (!user?.organizationId) return;
    const body = { ...form, organizationId: user.organizationId };
    try {
      const res = editing
        ? await fetch(`${API}/api/education/students/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(body) })
        : await fetch(`${API}/api/education/students`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
      if (res.ok) {
        toast.success(editing ? "Student updated" : "Student created");
        setDialogOpen(false);
        setEditing(null);
        setForm({ firstName: "", lastName: "", email: "", phone: "", dateOfBirth: "", gradeLevel: "Freshman" });
        fetchStudents();
      } else { toast.error("Failed to save"); }
    } catch { toast.error("Failed to save"); }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API}/api/education/students/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { toast.success("Student deleted"); fetchStudents(); }
      else { toast.error("Failed to delete"); }
    } catch { toast.error("Failed to delete"); }
  };

  const openEdit = (s: Student) => {
    setEditing(s);
    setForm({ firstName: s.firstName, lastName: s.lastName, email: s.email || "", phone: s.phone || "", dateOfBirth: s.dateOfBirth || "", gradeLevel: s.gradeLevel });
    setDialogOpen(true);
  };

  const filtered = students.filter(s =>
    `${s.firstName} ${s.lastName} ${s.email || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-yellow-500" /> Students
          </h1>
          <p className="text-muted-foreground">Manage student records</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditing(null); setForm({ firstName: "", lastName: "", email: "", phone: "", dateOfBirth: "", gradeLevel: "Freshman" }); }}>
              <Plus className="h-4 w-4 mr-1.5" /> Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Student" : "Add Student"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label>First Name</Label><Input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} /></div>
                <div className="grid gap-2"><Label>Last Name</Label><Input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} /></div>
              </div>
              <div className="grid gap-2"><Label>Email</Label><Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
              <div className="grid gap-2"><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label>Date of Birth</Label><Input type="date" value={form.dateOfBirth} onChange={e => setForm(f => ({ ...f, dateOfBirth: e.target.value }))} /></div>
                <div className="grid gap-2"><Label>Grade Level</Label>
                  <Select value={form.gradeLevel} onValueChange={v => setForm(f => ({ ...f, gradeLevel: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{GRADE_LEVELS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter><Button onClick={handleSave}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative w-full md:w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search students..." className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Grade Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No students found</TableCell></TableRow>
              ) : filtered.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.lastName}, {s.firstName}</TableCell>
                  <TableCell>{s.email || "—"}</TableCell>
                  <TableCell><Badge variant="outline">{s.gradeLevel}</Badge></TableCell>
                  <TableCell><Badge variant={s.status === "active" ? "default" : "secondary"}>{s.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(s.enrollmentDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
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
