import { useState } from "react";
import {
  ArrowRight,
  Building2,
  GraduationCap,
  Users,
  IndianRupee,
  Sparkles,
  Leaf,
  Coffee,
  Clock,
  TrendingUp,
  Check,
} from "lucide-react";
import {
  type LocationType,
  type Tier,
  classifyTier,
  getTierStyle,
  MONTHLY_TIERS,
  COFFEE_IMAGES,
} from "@/lib/brewsync";

interface PartnerLandingProps {
  onSubmit: (data: {
    contactName: string;
    organization: string;
    locationType: LocationType;
    footfall: number;
    monthlyRevenue: number;
  }) => void;
}

export default function PartnerLanding({ onSubmit }: PartnerLandingProps) {
  const [form, setForm] = useState({
    contactName: "",
    organization: "",
    locationType: "" as LocationType | "",
    footfall: "",
    monthlyRevenue: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const previewTier: Tier | null =
    form.footfall && Number(form.footfall) > 0 ? classifyTier(Number(form.footfall)) : null;
  const previewStyle = previewTier ? getTierStyle(previewTier) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!form.contactName.trim()) err.contactName = "Please enter your name";
    if (!form.organization.trim()) err.organization = "Please enter your organization";
    if (!form.locationType) err.locationType = "Select a location type";
    if (!form.footfall || Number(form.footfall) <= 0) err.footfall = "Enter estimated footfall";
    if (!form.monthlyRevenue) err.monthlyRevenue = "Select a tier";
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }
    onSubmit({
      contactName: form.contactName.trim(),
      organization: form.organization.trim(),
      locationType: form.locationType as LocationType,
      footfall: Number(form.footfall),
      monthlyRevenue: Number(form.monthlyRevenue),
    });
    setForm({ contactName: "", organization: "", locationType: "", footfall: "", monthlyRevenue: "" });
    setErrors({});
  };

  const fieldClass = (field: string) =>
    `w-full rounded-2xl border bg-white px-4 py-3 text-sm text-espresso-700 outline-none transition focus:ring-2 focus:ring-terracotta-200/60 placeholder:text-espresso-400/40 ${
      errors[field]
        ? "border-terracotta-300"
        : "border-cream-200 focus:border-terracotta-300"
    }`;

  return (
    <div className="animate-fade-in">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-cream-50">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-terracotta-100/40 blur-3xl" />
        <div className="absolute -left-20 top-40 h-72 w-72 rounded-full bg-sage-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 sm:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: copy */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-cream-200 bg-white px-4 py-2 text-xs font-medium text-espresso-400 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-terracotta-400" />
                Now onboarding partners for 2026
              </div>

              <h1 className="mt-6 font-serif text-4xl font-semibold leading-tight text-espresso-700 sm:text-5xl lg:text-6xl">
                Elevate your space with{" "}
                <span className="italic text-terracotta-400">artisan coffee</span> craft.
              </h1>

              <p className="mt-5 max-w-md text-base leading-relaxed text-espresso-400">
                Aura & Bean partners with corporate offices and college canteens to design,
                install, and operate beautiful coffee stations — your space, our craft.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#inquiry"
                  className="group flex items-center gap-2 rounded-full bg-espresso-700 px-6 py-3 text-sm font-semibold text-cream-50 shadow-lg shadow-espresso-700/15 transition hover:bg-espresso-800 active:scale-[0.98]"
                >
                  Apply for Partnership
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href="#offering"
                  className="flex items-center gap-2 rounded-full border border-cream-200 bg-white px-6 py-3 text-sm font-semibold text-espresso-600 transition hover:border-terracotta-200 hover:text-terracotta-400"
                >
                  How It Works
                </a>
              </div>

              <div className="mt-10 flex items-center gap-6">
                <div>
                  <p className="font-serif text-3xl font-semibold text-espresso-700">120+</p>
                  <p className="text-xs text-espresso-400">Active stations</p>
                </div>
                <div className="h-10 w-px bg-cream-200" />
                <div>
                  <p className="font-serif text-3xl font-semibold text-espresso-700">48hr</p>
                  <p className="text-xs text-espresso-400">Curator response</p>
                </div>
                <div className="h-10 w-px bg-cream-200" />
                <div>
                  <p className="font-serif text-3xl font-semibold text-espresso-700">14</p>
                  <p className="text-xs text-espresso-400">Cities</p>
                </div>
              </div>
            </div>

            {/* Right: floating imagery */}
            <div className="relative hidden h-[460px] lg:block">
              <div className="absolute right-8 top-0 h-72 w-60 overflow-hidden rounded-3xl shadow-2xl animate-float">
                <img
                  src={COFFEE_IMAGES.heroLatte}
                  alt="Latte art cappuccino"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute left-0 top-32 h-64 w-52 overflow-hidden rounded-3xl shadow-2xl animate-float-slow">
                <img
                  src={COFFEE_IMAGES.pourOver}
                  alt="Pour over coffee"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute bottom-4 right-20 h-40 w-56 overflow-hidden rounded-2xl shadow-xl animate-float">
                <img
                  src={COFFEE_IMAGES.cappuccino}
                  alt="Cappuccino"
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute bottom-12 left-4 rounded-2xl border border-cream-200 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm animate-float-slow">
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-sage-400" />
                  <span className="text-xs font-semibold text-espresso-600">100% ethically sourced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== OFFERING ===== */}
      <section id="offering" className="bg-cream-100 py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-terracotta-400">
              The Aura & Bean Model
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-espresso-700 sm:text-4xl">
              We bring the cafe to your corridor.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-espresso-400">
              From sleek self-serve kiosks to full flagship espresso bars, we tailor
              every station to your space, footfall, and community.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <OfferingCard
              image={COFFEE_IMAGES.officeCafe}
              icon={<Building2 className="h-5 w-5" />}
              title="Corporate Tech Parks"
              description="Transform break rooms into third-wave coffee destinations. Boost morale, retain talent, and impress visiting clients."
              points={["Full barista staffing", "Branded station design", "Monthly revenue sharing"]}
            />
            <OfferingCard
              image={COFFEE_IMAGES.businessCoffee}
              icon={<GraduationCap className="h-5 w-5" />}
              title="College Campuses"
              description="Become the go-to spot between lectures. From quick kiosks to campus cafes, we match your student pulse."
              points={["Quick-serve optimized", "Student pricing tiers", "Event pop-up support"]}
            />
            <OfferingCard
              image={COFFEE_IMAGES.chemex}
              icon={<Coffee className="h-5 w-5" />}
              title="Self-Serve Micro-Kiosks"
              description="Compact, elegant, automated. Perfect for smaller footprints that still want premium coffee on tap."
              points={["Zero staffing needed", "IoT-enabled monitoring", "Restocked weekly"]}
            />
          </div>

          {/* Feature strip */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium text-espresso-400">
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-sage-400" /> Zero setup cost</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-sage-400" /> End-to-end operations</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-sage-400" /> Custom menu curation</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-sage-400" /> Sustainable sourcing</span>
          </div>
        </div>
      </section>

      {/* ===== INQUIRY FORM ===== */}
      <section id="inquiry" className="bg-cream-50 py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-terracotta-400">
              Partner Inquiry
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-espresso-700 sm:text-4xl">
              Let's brew something together.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-espresso-400">
              Tell us about your space. We'll curate a coffee program tailored to your community.
            </p>
          </div>

          {/* Form card */}
          <div className="mt-10 rounded-3xl border border-cream-200 bg-white p-6 shadow-xl shadow-espresso-700/5 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-espresso-600">
                    Full Name
                  </label>
                  <input
                    value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                    placeholder="e.g. Jordan Lee"
                    className={fieldClass("contactName")}
                  />
                  {errors.contactName && <p className="mt-1.5 text-xs text-terracotta-400">{errors.contactName}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-espresso-600">
                    Organization / Institution
                  </label>
                  <input
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    placeholder="e.g. Acme Tech Park"
                    className={fieldClass("organization")}
                  />
                  {errors.organization && <p className="mt-1.5 text-xs text-terracotta-400">{errors.organization}</p>}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-espresso-600">
                  Location Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <LocationCard
                    active={form.locationType === "Corporate Tech Park"}
                    onClick={() => setForm({ ...form, locationType: "Corporate Tech Park" })}
                    icon={<Building2 className="h-5 w-5" />}
                    label="Corporate Tech Park"
                  />
                  <LocationCard
                    active={form.locationType === "College Campus"}
                    onClick={() => setForm({ ...form, locationType: "College Campus" })}
                    icon={<GraduationCap className="h-5 w-5" />}
                    label="College Campus"
                  />
                </div>
                {errors.locationType && <p className="mt-1.5 text-xs text-terracotta-400">{errors.locationType}</p>}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-espresso-600">
                    <Users className="mr-1 inline h-3.5 w-3.5" />
                    Estimated Daily Footfall
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.footfall}
                    onChange={(e) => setForm({ ...form, footfall: e.target.value })}
                    placeholder="e.g. 500"
                    className={fieldClass("footfall")}
                  />
                  {errors.footfall && <p className="mt-1.5 text-xs text-terracotta-400">{errors.footfall}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-espresso-600">
                    <IndianRupee className="mr-1 inline h-3.5 w-3.5" />
                    Expected Monthly Tier
                  </label>
                  <select
                    value={form.monthlyRevenue}
                    onChange={(e) => setForm({ ...form, monthlyRevenue: e.target.value })}
                    className={fieldClass("monthlyRevenue")}
                  >
                    <option value="">Select tier…</option>
                    {MONTHLY_TIERS.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  {errors.monthlyRevenue && <p className="mt-1.5 text-xs text-terracotta-400">{errors.monthlyRevenue}</p>}
                </div>
              </div>

              {/* Tier preview */}
              {previewTier && previewStyle && (
                <div className="flex items-center gap-3 rounded-2xl bg-cream-100 px-5 py-4">
                  <span className="text-lg">{previewStyle.icon}</span>
                  <div>
                    <p className="text-xs text-espresso-400">Your space qualifies as:</p>
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${previewStyle.badge}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${previewStyle.dot}`} />
                      {previewTier}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-espresso-700 py-3.5 text-sm font-semibold text-cream-50 shadow-lg shadow-espresso-700/15 transition hover:bg-espresso-800 active:scale-[0.98]"
              >
                <Coffee className="h-4 w-4" />
                Submit Partnership Inquiry
              </button>
            </form>
          </div>

          {/* Tier explanation */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <TierHint icon="✨" label="1,000+ footfall → Flagship Space" color="bg-terracotta-50 text-terracotta-600" />
            <TierHint icon="🌿" label="300–999 → Campus Partner" color="bg-sage-50 text-sage-600" />
            <TierHint icon="☕" label="< 300 → Micro-Kiosk" color="bg-cream-100 text-espresso-400" />
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-cream-200 bg-cream-100 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8">
          <div className="flex items-center gap-2">
            <Coffee className="h-4 w-4 text-terracotta-400" />
            <span className="font-serif text-sm font-semibold text-espresso-600">Aura & Bean</span>
          </div>
          <p className="text-xs text-espresso-400/60">© 2026 Aura & Bean Coffee Partnership Network</p>
        </div>
      </footer>
    </div>
  );
}

function OfferingCard({
  image,
  icon,
  title,
  description,
  points,
}: {
  image: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  points: string[];
}) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-espresso-700/5">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso-800/40 to-transparent" />
        <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 backdrop-blur-sm">
          <span className="text-terracotta-400">{icon}</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-serif text-lg font-semibold text-espresso-700">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-espresso-400">{description}</p>
        <ul className="mt-4 space-y-2">
          {points.map((p) => (
            <li key={p} className="flex items-center gap-2 text-xs text-espresso-400">
              <Check className="h-3.5 w-3.5 text-sage-400" />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function LocationCard({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all ${
        active
          ? "border-terracotta-300 bg-terracotta-50 ring-2 ring-terracotta-200/50"
          : "border-cream-200 bg-white hover:border-cream-300"
      }`}
    >
      <span className={active ? "text-terracotta-400" : "text-espresso-400/60"}>{icon}</span>
      <span className={`text-sm font-medium ${active ? "text-terracotta-600" : "text-espresso-600"}`}>
        {label}
      </span>
      {active && <Check className="ml-auto h-4 w-4 text-terracotta-400" />}
    </button>
  );
}

function TierHint({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${color}`}>
      <span>{icon}</span>
      {label}
    </span>
  );
}
