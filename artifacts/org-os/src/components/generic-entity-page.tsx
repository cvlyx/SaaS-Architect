import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth-provider";
import { Plus, Search, Pencil, Trash2, Loader2 } from "lucide-react";

export interface ColumnDef {
  key: string;
  header: string;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface FormFieldDef {
  key: string;
  label: string;
  type?: "text" | "number" | "email" | "date" | "select" | "tel";
  required?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: string;
}

interface Props {
  title: string;
  icon?: React.ReactNode;
  description: string;
  entityLabel: string;
  apiPath: string;
  columns: ColumnDef[];
  formFields: FormFieldDef[];
  searchFields?: string[];
}

export function GenericEntityPage({ title, icon, description, entityLabel, apiPath, columns, formFields, searchFields }: Props) {
  const { user, token } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const fetchItems = useCallback(async () => {
    if (!user?.organizationId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}${apiPath}?organizationId=${user.organizationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setItems(await res.json());
    } catch { toast.error(`Failed to load ${entityLabel.toLowerCase()}s`); }
    finally { setLoading(false); }
  }, [user?.organizationId, token, apiPath, entityLabel]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  useEffect(() => {
    if (dialogOpen && !editing) {
      const defaults: Record<string, string> = {};
      formFields.forEach(f => { defaults[f.key] = f.defaultValue || ""; });
      setForm(defaults);
    }
  }, [dialogOpen, editing, formFields]);

  const handleSave = async () => {
    if (!user?.organizationId) return;
    const body = { ...form, organizationId: user.organizationId };
    try {
      const url = editing ? `${API}${apiPath}/${editing.id}` : `${API}${apiPath}`;
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
      if (res.ok) {
        toast.success(editing ? `${entityLabel} updated` : `${entityLabel} created`);
        setDialogOpen(false);
        setEditing(null);
        fetchItems();
      } else { toast.error("Failed to save"); }
    } catch { toast.error("Failed to save"); }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API}${apiPath}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { toast.success(`${entityLabel} deleted`); fetchItems(); }
      else { toast.error("Failed to delete"); }
    } catch { toast.error("Failed to delete"); }
  };

  const openEdit = (item: any) => {
    setEditing(item);
    const vals: Record<string, string> = {};
    formFields.forEach(f => { vals[f.key] = String(item[f.key] ?? ""); });
    setForm(vals);
    setDialogOpen(true);
  };

  const filtered = items.filter(item => {
    if (!search) return true;
    const q = search.toLowerCase();
    const fields = searchFields || formFields.map(f => f.key);
    return fields.some(f => String(item[f] || "").toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            {icon} {title}
          </h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditing(null); setForm({}); }}>
              <Plus className="h-4 w-4 mr-1.5" /> Add {entityLabel}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? `Edit ${entityLabel}` : `Add ${entityLabel}`}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {formFields.map(f => (
                f.type === "select" ? (
                  <div key={f.key} className="grid gap-2">
                    <Label>{f.label}</Label>
                    <Select value={form[f.key] || ""} onValueChange={v => setForm(p => ({ ...p, [f.key]: v }))}>
                      <SelectTrigger><SelectValue placeholder={`Select ${f.label.toLowerCase()}`} /></SelectTrigger>
                      <SelectContent>
                        {f.options?.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div key={f.key} className="grid gap-2">
                    <Label>{f.label}{f.required && <span className="text-red-500 ml-1">*</span>}</Label>
                    <Input type={f.type || "text"} value={form[f.key] || ""} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                  </div>
                )
              ))}
            </div>
            <DialogFooter><Button onClick={handleSave}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative w-full md:w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder={`Search ${entityLabel.toLowerCase()}s...`} className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map(col => <TableHead key={col.key}>{col.header}</TableHead>)}
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={columns.length + 1} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">No {entityLabel.toLowerCase()}s found</TableCell></TableRow>
              ) : filtered.map((item: any) => (
                <TableRow key={item.id}>
                  {columns.map(col => (
                    <TableCell key={col.key}>
                      {col.render ? col.render(item[col.key], item) : String(item[col.key] ?? "—")}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
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
