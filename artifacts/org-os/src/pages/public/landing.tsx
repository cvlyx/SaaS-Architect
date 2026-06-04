import { useState } from "react";
import { Link } from "wouter";
import { useListIndustryPacks, useListSubscriptions } from "@workspace/api-client-react";
import { IndustryIcon } from "@/components/industry-icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2, Users, LayoutDashboard, Zap, Shield, Globe,
  CheckCircle2, ArrowRight, Star, Menu, X, ChevronRight
} from "lucide-react";

function PublicNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-primary text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <span>Organization OS</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#industries" className="text-muted-foreground hover:text-foreground transition-colors">Industries</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get started free</Button>
            </Link>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-2">
          <a href="#features" className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#industries" className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Industries</a>
          <a href="#pricing" className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Pricing</a>
          <div className="flex flex-col gap-2 pt-2">
            <Link href="/login"><Button variant="outline" className="w-full" onClick={() => setMobileOpen(false)}>Sign in</Button></Link>
            <Link href="/register"><Button className="w-full" onClick={() => setMobileOpen(false)}>Get started free</Button></Link>
          </div>
        </div>
      )}
    </nav>
  );
}

const FEATURE_LIST = [
  { icon: Building2, title: "Multi-tenant architecture", desc: "Each organization gets its own isolated workspace with custom branding and settings." },
  { icon: Zap, title: "Industry-specific packs", desc: "15 pre-configured industry packs with role templates, workflows, and tools out of the box." },
  { icon: Users, title: "Team management", desc: "Manage unlimited members with role-based access control and department hierarchies." },
  { icon: Shield, title: "Enterprise-grade security", desc: "SOC2-compliant infrastructure with SSO, audit logs, and data encryption at rest." },
  { icon: Globe, title: "Global-ready", desc: "Multi-language support, region-based data residency, and local compliance features." },
  { icon: LayoutDashboard, title: "Unified dashboard", desc: "Real-time analytics, task tracking, and cross-team reporting in one command center." },
];

const TESTIMONIALS = [
  { name: "Sarah Chen", role: "COO, MediCore Health", text: "We went from spreadsheets to a fully-configured healthcare workspace in under 24 hours. The industry pack had everything we needed.", avatar: "SC" },
  { name: "James Okafor", role: "CEO, BuildRight Construction", text: "The construction pack includes project timelines, vendor management, and safety checklists. It's like it was built specifically for us.", avatar: "JO" },
  { name: "Priya Sharma", role: "Director of Ops, EduLearn", text: "Onboarding our 200-person education team took one afternoon. The roles and permissions were exactly right for our structure.", avatar: "PS" },
];

export default function Landing() {
  const { data: industryPacks } = useListIndustryPacks();
  const { data: plans } = useListSubscriptions();

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(162_73%_46%/0.12),transparent)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium">
            <Star className="h-3 w-3 mr-1.5 fill-primary text-primary" />
            Trusted by 500+ organizations worldwide
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground">
            Your Industry,{" "}
            <span className="text-primary">Your Workspace</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Organization OS gives your team a fully configured digital workspace built for your industry.
            Pick your pack, invite your team, and start working in minutes — not months.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-base px-8 h-12 gap-2">
                Start free trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#industries">
              <Button size="lg" variant="outline" className="text-base px-8 h-12">
                Browse industry packs
              </Button>
            </a>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">No credit card required · 14-day free trial · Cancel anytime</p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "500+", label: "Organizations" },
              { value: "15", label: "Industry packs" },
              { value: "12k+", label: "Active users" },
              { value: "99.9%", label: "Uptime SLA" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl font-bold text-primary">{value}</div>
                <div className="text-sm text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Platform capabilities</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything your organization needs</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete operating system for modern organizations — from onboarding to day-to-day operations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURE_LIST.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group relative rounded-2xl border bg-card p-6 hover:shadow-md transition-all hover:border-primary/30">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary/15 transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Packs */}
      <section id="industries" className="py-20 sm:py-28 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Industry packs</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Built for your sector</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Each pack comes pre-loaded with the roles, workflows, and tools your industry actually uses.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {(industryPacks || Array.from({ length: 15 }).map((_, i) => ({ id: i, name: "Loading...", icon: "🏢", color: "#10b981", description: "" }))).map((pack: any) => (
              <div
                key={pack.id}
                className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-5 text-center hover:shadow-md transition-all hover:border-primary/30 cursor-pointer"
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${pack.color}20`, color: pack.color }}
                >
                  <IndustryIcon icon={pack.icon} className="h-7 w-7" />
                </div>
                <div>
                  <div className="font-semibold text-sm leading-tight">{pack.name}</div>
                  {pack.description && (
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2 hidden sm:block">
                      {pack.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Choose your industry pack <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Simple, transparent pricing</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free for 14 days. No credit card required. Scale as you grow.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {(plans || []).map((plan: any) => (
              <Card
                key={plan.id}
                className={`relative flex flex-col ${plan.isPopular ? "border-primary shadow-lg shadow-primary/10 ring-1 ring-primary" : ""}`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="px-3 py-0.5">Most popular</Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${plan.priceMonthly}</span>
                    <span className="text-muted-foreground">/mo per org</span>
                  </div>
                  {plan.priceYearly && (
                    <p className="text-xs text-muted-foreground">
                      or ${plan.priceYearly}/yr (save {Math.round(100 - (plan.priceYearly / (plan.priceMonthly * 12)) * 100)}%)
                    </p>
                  )}
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <ul className="space-y-3 flex-1 mb-6">
                    {(plan.features || []).map((f: string) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Up to {plan.maxUsers === 9999 ? "unlimited" : plan.maxUsers} users</span>
                    </li>
                  </ul>
                  <Link href="/register">
                    <Button className="w-full" variant={plan.isPopular ? "default" : "outline"}>
                      Get started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center mt-8 text-sm text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-28 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Loved by operations teams</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map(({ name, role, text, avatar }) => (
              <Card key={name} className="bg-card">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      {avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{name}</div>
                      <div className="text-xs text-muted-foreground">{role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="rounded-3xl bg-primary px-8 py-16 sm:py-20">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary-foreground">
              Ready to build your workspace?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-xl mx-auto">
              Join thousands of organizations who've replaced their tool chaos with a single, purpose-built workspace.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="text-base px-8 h-12 gap-2">
                  Start for free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-base px-8 h-12 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-bold text-primary">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LayoutDashboard className="h-3.5 w-3.5" />
              </div>
              Organization OS
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 Organization OS. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
