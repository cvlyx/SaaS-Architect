import { useState } from "react";
import { useListModules } from "@workspace/api-client-react";
import type { Module } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Blocks, DollarSign, Grid3X3 } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  analytics: "bg-blue-100 text-blue-700 border-blue-200",
  collaboration: "bg-purple-100 text-purple-700 border-purple-200",
  communication: "bg-indigo-100 text-indigo-700 border-indigo-200",
  productivity: "bg-amber-100 text-amber-700 border-amber-200",
  finance: "bg-emerald-100 text-emerald-700 border-emerald-200",
  hr: "bg-rose-100 text-rose-700 border-rose-200",
  operations: "bg-orange-100 text-orange-700 border-orange-200",
  security: "bg-red-100 text-red-700 border-red-200",
  integrations: "bg-cyan-100 text-cyan-700 border-cyan-200",
  ai: "bg-violet-100 text-violet-700 border-violet-200",
};

export default function ModulesPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { data: modules, isLoading } = useListModules();

  const categories = Array.from(new Set((modules || []).map((m: Module) => m.category)));

  const filtered = (modules || []).filter((m: Module) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || m.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const groupedByCategory = filtered.reduce((acc: Record<string, Module[]>, m: Module) => {
    if (!acc[m.category]) acc[m.category] = [];
    acc[m.category].push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Modules</h1>
        <p className="text-muted-foreground">Browse and manage add-on modules available for organizations.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search modules..."
            className="pl-8"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              categoryFilter === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-primary/50"
            }`}
          >
            <Grid3X3 className="h-3.5 w-3.5 mr-1.5" /> All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors capitalize ${
                categoryFilter === cat ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-primary/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="text-3xl font-bold">{modules?.length ?? 0}</div>
            <div className="text-sm text-muted-foreground mt-0.5">Total modules</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="text-3xl font-bold">{categories.length}</div>
            <div className="text-sm text-muted-foreground mt-0.5">Categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="text-3xl font-bold">
              {(modules || []).filter((m: Module) => m.priceMonthly !== null && m.priceMonthly !== undefined).length}
            </div>
            <div className="text-sm text-muted-foreground mt-0.5">Paid modules</div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-muted" />
                  <div className="h-5 w-24 bg-muted rounded" />
                </div>
                <div className="h-4 w-full bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : categoryFilter === "all" ? (
        Object.entries(groupedByCategory).map(([category, mods]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold capitalize">{category}</h2>
              <Badge variant="secondary">{mods.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mods.map(mod => (
                <ModuleCard key={mod.id} module={mod} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((mod: Module) => (
            <ModuleCard key={mod.id} module={mod} />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Blocks className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>No modules match your search.</p>
        </div>
      )}
    </div>
  );
}

function ModuleCard({ module: mod }: { module: Module }) {
  const categoryStyle = CATEGORY_COLORS[mod.category.toLowerCase()] || "bg-muted text-muted-foreground border-border";

  return (
    <Card className="group hover:shadow-md hover:border-primary/30 transition-all">
      <CardContent className="pt-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-primary/15 transition-colors">
              {mod.icon}
            </div>
            <div>
              <div className="font-semibold text-sm leading-tight">{mod.name}</div>
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border capitalize mt-1 ${categoryStyle}`}>
                {mod.category}
              </span>
            </div>
          </div>
          {mod.priceMonthly !== null && mod.priceMonthly !== undefined ? (
            <div className="flex items-center gap-1 text-sm font-semibold text-primary flex-shrink-0">
              <DollarSign className="h-3.5 w-3.5" />
              {mod.priceMonthly}/mo
            </div>
          ) : (
            <Badge variant="secondary" className="text-xs flex-shrink-0">Free</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{mod.description}</p>
      </CardContent>
    </Card>
  );
}
