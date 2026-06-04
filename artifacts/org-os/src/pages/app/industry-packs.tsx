import { useState } from "react";
import { useListIndustryPacks } from "@workspace/api-client-react";
import type { IndustryPack } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Package, Users, Wrench } from "lucide-react";
import { IndustryIcon } from "@/components/industry-icon";

export default function IndustryPacksPage() {
  const [search, setSearch] = useState("");
  const { data: packs, isLoading } = useListIndustryPacks();

  const filtered = (packs || []).filter((p: IndustryPack) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Industry Packs</h1>
        <p className="text-muted-foreground">Pre-configured workspaces tailored to each industry's unique needs.</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search industry packs..."
            className="pl-8"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Badge variant="secondary" className="text-sm px-3 py-1">
          {filtered.length} packs
        </Badge>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-14 w-14 rounded-xl bg-muted mb-2" />
                <div className="h-5 w-32 bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded mt-1" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pack: IndustryPack) => (
            <Card key={pack.id} className="group hover:shadow-md transition-all hover:border-primary/30 flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: `${pack.color}20`, color: pack.color }}
                  >
                    <IndustryIcon icon={pack.icon} className="h-7 w-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg">{pack.name}</CardTitle>
                    <CardDescription className="text-sm mt-1 line-clamp-2">{pack.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                {pack.features && pack.features.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      <Wrench className="h-3 w-3" />
                      Features
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {pack.features.slice(0, 4).map((f: string) => (
                        <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                      ))}
                      {pack.features.length > 4 && (
                        <Badge variant="outline" className="text-xs">+{pack.features.length - 4} more</Badge>
                      )}
                    </div>
                  </div>
                )}
                {pack.roles && pack.roles.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      <Users className="h-3 w-3" />
                      Roles included
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {pack.roles.slice(0, 4).map((r: string) => (
                        <span key={r} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-muted border font-medium">
                          {r}
                        </span>
                      ))}
                      {pack.roles.length > 4 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-muted border">
                          +{pack.roles.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <div className="pt-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      Slug: <code className="font-mono bg-muted px-1 py-0.5 rounded ml-1">{pack.slug}</code>
                    </span>
                    <div
                      className="h-3 w-3 rounded-full border border-white/50"
                      style={{ backgroundColor: pack.color }}
                      title={pack.color}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>No industry packs match your search.</p>
        </div>
      )}
    </div>
  );
}
