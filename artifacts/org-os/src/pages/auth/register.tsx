import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useListIndustryPacks, useListSubscriptions, useCreateOrganization, useCreateUser } from "@workspace/api-client-react";
import type { IndustryPack, SubscriptionPlan } from "@workspace/api-client-react";
import { IndustryIcon } from "@/components/industry-icon";
import { useAuth } from "@/lib/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, LayoutDashboard, ArrowLeft, ArrowRight, ChevronRight, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

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

export default function Register() {
  const [_, setLocation] = useLocation();
  const { login } = useAuth();
  const { data: industryPacks } = useListIndustryPacks();
  const { data: plans } = useListSubscriptions();
  const createOrg = useCreateOrganization();
  const createUser = useCreateUser();
  const queryClient = useQueryClient();

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
      const org = await createOrg.mutateAsync({
        data: {
          name: form.orgName,
          type: form.orgType,
          country: form.orgCountry,
          city: form.orgCity,
          size: form.orgSize,
          industryPackId: form.industryPackId,
          website: form.orgWebsite || undefined,
        },
      });
      const user = await createUser.mutateAsync({
        data: {
          fullName: form.adminName,
          email: form.adminEmail,
          role: "admin",
          organizationId: org.id,
          password: form.adminPassword,
        },
      });
      login({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        status: user.status,
        avatarUrl: user.avatarUrl ?? null,
        phone: user.phone ?? null,
        createdAt: user.createdAt,
      });
      queryClient.invalidateQueries();
      setLocation("/app");
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-primary">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            Organization OS
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="sm">Already have an account? Sign in</Button>
          </Link>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-10 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-shrink-0">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                s.id === step ? "bg-primary text-primary-foreground" :
                s.id < step ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
              }`}>
                {s.id < step ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span className="text-xs w-3.5 text-center">{s.id}</span>}
                <span className="hidden sm:inline">{s.title}</span>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground mx-1 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        <Card>
          <CardContent className="p-6 sm:p-8">
            {/* Step 1: Choose industry */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-1">Choose your industry</h2>
                <p className="text-muted-foreground mb-6 text-sm">Select the industry pack that best matches your organization.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(industryPacks || []).map((pack: IndustryPack) => (
                    <button
                      key={pack.id}
                      type="button"
                      onClick={() => update("industryPackId", pack.id)}
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center transition-all hover:border-primary/50 ${
                        form.industryPackId === pack.id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-card"
                      }`}
                    >
                      {form.industryPackId === pack.id && (
                        <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-primary" />
                      )}
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${pack.color}20`, color: pack.color }}
                      >
                        <IndustryIcon icon={pack.icon} className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-medium leading-tight">{pack.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Organization info */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-1">Your organization</h2>
                <p className="text-muted-foreground mb-6 text-sm">Tell us about your organization.</p>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Organization name *</Label>
                    <Input placeholder="Acme Corp" value={form.orgName} onChange={e => update("orgName", e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Type</Label>
                      <select
                        value={form.orgType}
                        onChange={e => update("orgType", e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        {ORG_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Country</Label>
                      <Input placeholder="United States" value={form.orgCountry} onChange={e => update("orgCountry", e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>City *</Label>
                      <Input placeholder="San Francisco" value={form.orgCity} onChange={e => update("orgCity", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Website</Label>
                      <Input placeholder="https://acme.com" value={form.orgWebsite} onChange={e => update("orgWebsite", e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Admin account */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-1">Create your admin account</h2>
                <p className="text-muted-foreground mb-6 text-sm">You'll use these credentials to sign in to your workspace.</p>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Full name *</Label>
                    <Input placeholder="Jane Smith" value={form.adminName} onChange={e => update("adminName", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Work email *</Label>
                    <Input type="email" placeholder="jane@acme.com" value={form.adminEmail} onChange={e => update("adminEmail", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Password *</Label>
                    <Input type="password" placeholder="At least 6 characters" value={form.adminPassword} onChange={e => update("adminPassword", e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Team size */}
            {step === 4 && (
              <div>
                <h2 className="text-2xl font-bold mb-1">Team size</h2>
                <p className="text-muted-foreground mb-6 text-sm">How big is your team? This helps us configure your workspace.</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {ORG_SIZES.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => update("orgSize", size)}
                      className={`p-4 rounded-xl border-2 text-sm font-medium transition-all ${
                        form.orgSize === size
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-xl bg-muted/50 border">
                  <div className="text-sm font-medium text-muted-foreground mb-3">Your workspace will include:</div>
                  {selectedPack && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedPack.features.slice(0, 4).map((f: string) => (
                        <div key={f} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Choose plan */}
            {step === 5 && (
              <div>
                <h2 className="text-2xl font-bold mb-1">Choose a plan</h2>
                <p className="text-muted-foreground mb-6 text-sm">Start with a 14-day free trial on any plan. No credit card required.</p>
                <div className="space-y-4">
                  {(plans || []).map((plan: SubscriptionPlan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => { update("planId", plan.id); update("planName", plan.name); }}
                      className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                        form.planId === plan.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        form.planId === plan.id ? "border-primary bg-primary" : "border-muted-foreground"
                      }`}>
                        {form.planId === plan.id && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{plan.name}</span>
                          {plan.isPopular && <Badge className="text-xs py-0">Popular</Badge>}
                          <span className="ml-auto font-bold">${plan.priceMonthly}<span className="text-xs font-normal text-muted-foreground">/mo</span></span>
                        </div>
                        <div className="text-sm text-muted-foreground">{plan.description}</div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                          {plan.features.slice(0, 3).map((f: string) => (
                            <span key={f} className="text-xs text-muted-foreground flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-primary" />{f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Confirm */}
            {step === 6 && (
              <div>
                <h2 className="text-2xl font-bold mb-1">Review & confirm</h2>
                <p className="text-muted-foreground mb-6 text-sm">Almost there! Review your setup before creating your workspace.</p>
                <div className="space-y-3">
                  {[
                    { label: "Industry", value: selectedPack ? `${selectedPack.icon} ${selectedPack.name}` : "—" },
                    { label: "Organization", value: form.orgName },
                    { label: "Location", value: `${form.orgCity}, ${form.orgCountry}` },
                    { label: "Type & Size", value: `${form.orgType} · ${form.orgSize} employees` },
                    { label: "Admin email", value: form.adminEmail },
                    { label: "Plan", value: selectedPlan ? `${selectedPlan.name} — $${selectedPlan.priceMonthly}/mo` : "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span className="text-sm text-muted-foreground">{label}</span>
                      <span className="text-sm font-medium">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm text-muted-foreground">
                  Your 14-day free trial starts today. You can change your plan at any time.
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)}>
                  <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                </Button>
              ) : (
                <Link href="/"><Button type="button" variant="ghost"><ArrowLeft className="h-4 w-4 mr-1.5" /> Back to home</Button></Link>
              )}
              {step < 6 ? (
                <Button type="button" disabled={!canNext()} onClick={() => setStep(s => s + 1)}>
                  Continue <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Creating workspace...</> : <>Create workspace <ArrowRight className="h-4 w-4 ml-1.5" /></>}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
