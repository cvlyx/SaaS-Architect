import { createClient } from "../../../node_modules/@libsql/client/index.mjs";

const c = createClient({ url: process.env.DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });

const packs = [
  ["Non-Profit","non-profit","Donor and volunteer management","[\"Donor tracking\",\"Volunteer scheduling\",\"Campaign management\"]","[\"director\",\"coordinator\",\"volunteer\"]","Heart","#ec4899"],
  ["Legal","legal","Case and document management","[\"Case tracking\",\"Document workflow\",\"Client portal\"]","[\"partner\",\"associate\",\"paralegal\",\"admin\"]","Scale","#6366f1"],
  ["Manufacturing","manufacturing","Production and supply chain","[\"Production runs\",\"Supplier tracking\",\"Quality control\"]","[\"plant_manager\",\"supervisor\",\"operator\",\"inspector\"]","Factory","#a16207"],
  ["Real Estate","real-estate","Property and client management","[\"Property listings\",\"Client CRM\",\"Lease tracking\"]","[\"agent\",\"broker\",\"manager\"]","Building","#14b8a6"],
  ["Hospitality","hospitality","Hotel and restaurant management","[\"Room booking\",\"Guest profiles\",\"Service management\"]","[\"manager\",\"front_desk\",\"housekeeping\",\"chef\"]","Hotel","#f97316"],
  ["Transportation","transportation","Logistics and fleet management","[\"Fleet tracking\",\"Route planning\",\"Driver management\"]","[\"dispatcher\",\"driver\",\"manager\"]","Truck","#64748b"],
  ["Media","media","Content and editorial workflow","[\"Content calendar\",\"Editorial workflow\",\"Asset library\"]","[\"editor\",\"writer\",\"designer\",\"publisher\"]","Newspaper","#dc2626"],
  ["Consulting","consulting","Client engagement and project delivery","[\"Client CRM\",\"Engagement tracking\",\"Resource planning\"]","[\"partner\",\"consultant\",\"analyst\"]","Briefcase","#2563eb"],
  ["Government","government","Public sector workflow and permit management","[\"Permit processing\",\"License renewals\",\"Service requests\"]","[\"clerk\",\"officer\",\"admin\",\"inspector\"]","Government","#4f46e5"],
];

for (const p of packs) {
  const r = await c.execute("INSERT OR IGNORE INTO industry_packs (name, slug, description, features, roles, icon, color) VALUES (?, ?, ?, ?, ?, ?, ?)", p);
  console.log(p[0] + ": " + (r.rowsAffected > 0 ? "inserted" : "exists"));
}
console.log("Done");
process.exit(0);
