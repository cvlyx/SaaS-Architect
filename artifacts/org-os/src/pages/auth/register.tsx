import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useListIndustryPacks, useListSubscriptions } from "@workspace/api-client-react";
import type { IndustryPack, SubscriptionPlan } from "@workspace/api-client-react";
import { IndustryIcon } from "@/components/industry-icon";
import { useAuth } from "@/lib/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle2, LayoutDashboard, ArrowLeft, ArrowRight, ChevronRight, Loader2, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme-provider";
import { motion } from "framer-motion";

const FALLBACK_PACKS: IndustryPack[] = [
  { id: 1, name: "Healthcare", slug: "healthcare", description: "HIPAA-compliant tools for medical practices", features: ["Patient records", "Appointment scheduling", "Billing"], roles: ["doctor", "nurse", "admin", "receptionist"], icon: "HeartPulse", color: "#ef4444" },
  { id: 2, name: "Construction", slug: "construction", description: "Project management for contractors and builders", features: ["Blueprint markup", "Site inspections", "Material tracking"], roles: ["project_manager", "supervisor", "worker", "engineer"], icon: "HardHat", color: "#f59e0b" },
  { id: 3, name: "Retail", slug: "retail", description: "POS and inventory management for stores", features: ["POS system", "Inventory tracking", "Supplier management"], roles: ["manager", "cashier", "stock_clerk"], icon: "ShoppingCart", color: "#22c55e" },
  { id: 4, name: "Education", slug: "education", description: "LMS and student management for institutions", features: ["Course management", "Gradebook", "Student portal"], roles: ["teacher", "student", "admin", "parent"], icon: "GraduationCap", color: "#3b82f6" },
  { id: 5, name: "Technology", slug: "technology", description: "Agile tools for software teams", features: ["Sprint planning", "Code review", "Issue tracking"], roles: ["developer", "team_lead", "product_owner", "scrum_master"], icon: "Monitor", color: "#8b5cf6" },
  { id: 6, name: "Finance", slug: "finance", description: "Compliance and reporting for financial services", features: ["Audit trails", "Financial reporting", "Risk assessment"], roles: ["analyst", "compliance_officer", "manager", "advisor"], icon: "Landmark", color: "#06b6d4" },
];

const FALLBACK_PLANS: SubscriptionPlan[] = [
  { id: 1, name: "Starter", description: "For small teams getting started", priceMonthly: 29, priceYearly: 290, maxUsers: 10, features: ["Up to 10 users", "Basic analytics", "Email support"], isPopular: false },
  { id: 2, name: "Growth", description: "For growing organizations", priceMonthly: 99, priceYearly: 990, maxUsers: 50, features: ["Up to 50 users", "Advanced analytics", "Priority support", "Custom roles"], isPopular: true },
  { id: 3, name: "Enterprise", description: "For large-scale deployments", priceMonthly: 299, priceYearly: 2990, maxUsers: 999999, features: ["Unlimited users", "Full analytics suite", "24/7 phone support", "Custom integrations", "SLA guarantee"], isPopular: false },
];

const STEPS = [
  { id: 1, title: "Industry" },
  { id: 2, title: "Organization" },
  { id: 3, title: "Account" },
  { id: 4, title: "Team" },
  { id: 5, title: "Plan" },
  { id: 6, title: "Confirm" },
];

const ORG_SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"];
const ORG_TYPES = ["Private", "Public", "Non-profit", "Government", "Startup"];

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function Register() {
  const [_, setLocation] = useLocation();
  const { login } = useAuth();
  const { setTheme, theme } = useTheme();
  const { data: apiPacks } = useListIndustryPacks();
  const { data: apiPlans } = useListSubscriptions();
  const industryPacks = apiPacks && apiPacks.length > 0 ? apiPacks : FALLBACK_PACKS;
  const plans = apiPlans && apiPlans.length > 0 ? apiPlans : FALLBACK_PLANS;
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    industryPackId: 0,
    industryPackName: "",
    orgName: "",
    orgType: "Private",
    orgCountry: "United States",
    orgCity: "",
    orgWebsite: "",
    orgSize: "11-50",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    planId: 0,
    planName: "",
  });

  const selectedPack = industryPacks?.find((p: IndustryPack) => p.id === form.industryPackId);
  const selectedPlan = plans?.find((p: SubscriptionPlan) => p.id === form.planId);

  const update = (key: string, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  const canNext = () => {
    if (step === 1) return form.industryPackId > 0;
    if (step === 2) return form.orgName.trim().length > 0 && form.orgCity.trim().length > 0;
    if (step === 3) return form.adminName.trim().length > 0 && form.adminEmail.includes("@") && form.adminPassword.length >= 6;
    if (step === 4) return true;
    if (step === 5) return form.planId > 0;
    return false;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.adminEmail,
          password: form.adminPassword,
          fullName: form.adminName,
          role: "admin",
          organization: {
            name: form.orgName,
            type: form.orgType,
            country: form.orgCountry,
            city: form.orgCity,
            size: form.orgSize,
            industryPackId: form.industryPackId,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Registration failed" }));
        toast.error(err.error || "Registration failed");
        return;
      }

      const data = await res.json();
      login(data.token, data.user);
      toast.success("Workspace created! Welcome aboard.");
      setLocation("/app");
    } catch {
      toast.error("Network error. Is the server running?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=2000&auto=format&fit=crop"
          alt="Background"
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/70 to-background/85" />
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 z-10 glass-input"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-primary glass-card px-4 py-2 rounded-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            Organization OS
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="sm" className="glass-input">Already have an account? Sign in</Button>
          </Link>
        </div>

        <div className="flex items-center gap-0 mb-10 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-shrink-0">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                s.id === step ? "bg-primary text-primary-foreground shadow-lg" :
                s.id < step ? "bg-primary/20 text-primary glass-input" : "bg-muted/50 text-muted-foreground glass-input"
              }`}>
                {s.id < step ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span className="text-xs w-3.5 text-center">{s.id}</span>}
                <span className="hidden sm:inline">{s.title}</span>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground mx-2 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="glass-card border-0 shadow-2xl">
            <CardContent className="p-6 sm:p-10">
              {step === 1 && (
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-1">Choose your industry</h2>
                  <p className="text-muted-foreground mb-6 text-base">Select the industry pack that best matches your organization.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(industryPacks || []).map((pack: IndustryPack) => (
                      <button
                        key={pack.id}
                        type="button"
                        onClick={() => update("industryPackId", pack.id)}
                        className={`relative flex flex-col items-center gap-2 p-6 rounded-2xl border-2 text-center transition-all hover:border-primary/50 ${
                          form.industryPackId === pack.id
                            ? "border-primary bg-primary/10 shadow-lg"
                            : "border-border glass-card"
                        }`}
                      >
                        {form.industryPackId === pack.id && (
                          <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-primary" />
                        )}
                        <div
                          className="flex h-14 w-14 items-center justify-center rounded-2xl"
                          style={{ backgroundColor: `${pack.color}20`, color: pack.color }}
                        >
                          <IndustryIcon icon={pack.icon} className="h-7 w-7" />
                        </div>
                        <span className="text-base font-medium leading-tight">{pack.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-1">Your organization</h2>
                  <p className="text-muted-foreground mb-6 text-base">Tell us about your organization.</p>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Organization name *</Label>
                      <Input
                        placeholder="Acme Corp"
                        value={form.orgName}
                        onChange={e => update("orgName", e.target.value)}
                        className="glass-input h-12 text-base"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="text-base font-medium">Type</Label>
                        <select
                          value={form.orgType}
                          onChange={e => update("orgType", e.target.value)}
                          className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring glass-input"
                        >
                          {ORG_TYPES.map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-base font-medium">Country</Label>
                        <Input
                          placeholder="United States"
                          value={form.orgCountry}
                          onChange={e => update("orgCountry", e.target.value)}
                          className="glass-input h-12 text-base"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="text-base font-medium">City *</Label>
                        <Input
                          placeholder="San Francisco"
                          value={form.orgCity}
                          onChange={e => update("orgCity", e.target.value)}
                          className="glass-input h-12 text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-base font-medium">Website</Label>
                        <Input
                          placeholder="https://acme.com"
                          value={form.orgWebsite}
                          onChange={e => update("orgWebsite", e.target.value)}
                          className="glass-input h-12 text-base"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-1">Create your admin account</h2>
                  <p className="text-muted-foreground mb-6 text-base">You'll use these credentials to sign in to your workspace.</p>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Full name *</Label>
                      <Input
                        placeholder="Jane Smith"
                        value={form.adminName}
                        onChange={e => update("adminName", e.target.value)}
                        className="glass-input h-12 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Work email *</Label>
                      <Input
                        type="email"
                        placeholder="jane@acme.com"
                        value={form.adminEmail}
                        onChange={e => update("adminEmail", e.target.value)}
                        className="glass-input h-12 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Password *</Label>
                      <Input
                        type="password"
                        placeholder="At least 6 characters"
                        value={form.adminPassword}
                        onChange={e => update("adminPassword", e.target.value)}
                        className="glass-input h-12 text-base"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-1">Team size</h2>
                  <p className="text-muted-foreground mb-6 text-base">How big is your team? This helps us configure your workspace.</p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                    {ORG_SIZES.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => update("orgSize", size)}
                        className={`p-6 rounded-2xl border-2 text-lg font-medium transition-all ${
                          form.orgSize === size
                            ? "border-primary bg-primary/10 text-primary shadow-lg"
                            : "border-border glass-card hover:border-primary/50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <div className="mt-8 p-6 rounded-2xl glass-card">
                    <div className="text-base font-medium text-muted-foreground mb-4">Your workspace will include:</div>
                    {selectedPack && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedPack.features.slice(0, 4).map((f: string) => (
                          <div key={f} className="flex items-center gap-3 text-base">
                            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            {f}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-1">Choose a plan</h2>
                  <p className="text-muted-foreground mb-6 text-base">Start with a 14-day free trial on any plan. No credit card required.</p>
                  <div className="space-y-5">
                    {(plans || []).map((plan: SubscriptionPlan) => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => { update("planId", plan.id); update("planName", plan.name); }}
                        className={`w-full flex items-start gap-6 p-6 rounded-2xl border-2 text-left transition-all ${
                          form.planId === plan.id
                            ? "border-primary bg-primary/10 shadow-lg"
                            : "border-border glass-card hover:border-primary/50"
                        }`}
                      >
                        <div className={`mt-0.5 w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                          form.planId === plan.id ? "border-primary bg-primary" : "border-muted-foreground"
                        }`}>
                          {form.planId === plan.id && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-xl">{plan.name}</span>
                            {plan.isPopular && <Badge className="text-sm py-0.5">Popular</Badge>}
                            <span className="ml-auto font-bold text-2xl">${plan.priceMonthly}<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
                          </div>
                          <div className="text-base text-muted-foreground">{plan.description}</div>
                          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
                            {plan.features.slice(0, 3).map((f: string) => (
                              <span key={f} className="text-sm text-muted-foreground flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-primary" />{f}
                              </span>
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 6 && (
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-1">Review & confirm</h2>
                  <p className="text-muted-foreground mb-6 text-base">Almost there! Review your setup before creating your workspace.</p>
                  <div className="space-y-4">
                    {[
                      { label: "Industry", value: selectedPack ? `${selectedPack.icon} ${selectedPack.name}` : "—" },
                      { label: "Organization", value: form.orgName },
                      { label: "Location", value: `${form.orgCity}, ${form.orgCountry}` },
                      { label: "Type & Size", value: `${form.orgType} · ${form.orgSize} employees` },
                      { label: "Admin email", value: form.adminEmail },
                      { label: "Plan", value: selectedPlan ? `${selectedPlan.name} — $${selectedPlan.priceMonthly}/mo` : "—" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between py-3 border-b last:border-0">
                        <span className="text-base text-muted-foreground">{label}</span>
                        <span className="text-base font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 p-6 rounded-2xl bg-primary/10 border border-primary/30 text-base text-muted-foreground">
                    Your 14-day free trial starts today. You can change your plan at any time.
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mt-10 pt-6 border-t">
                {step > 1 ? (
                  <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)} className="glass-input h-12 text-base">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                  </Button>
                ) : (
                  <Link href="/"><Button type="button" variant="ghost" className="h-12 text-base"><ArrowLeft className="h-4 w-4 mr-2" /> Back to home</Button></Link>
                )}
                {step < 6 ? (
                  <Button type="button" disabled={!canNext()} onClick={() => setStep(s => s + 1)} className="h-12 text-base">
                    Continue <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="button" onClick={handleSubmit} disabled={submitting} className="h-12 text-base">
                    {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating workspace...</> : <>Create workspace <ArrowRight className="h-4 w-4 ml-2" /></>}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
