import { useState, useMemo } from "react";
import {
  Inbox,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Search,
  ArrowUpDown,
  ChevronDown,
  RefreshCw,
  Building2,
  GraduationCap,
  Filter,
  X,
} from "lucide-react";
import {
  type Inquiry,
  type SortKey,
  type SortDir,
  TIER_ORDER,
  TIER_LABELS,
  getTierStyle,
  formatCompactRevenue,
  formatRelativeTime,
  getInitials,
  getAvatarGradient,
} from "@/lib/brewsync";

interface SalesDashboardProps {
  inquiries: Inquiry[];
  onSync: (id: string | number) => void;
  onSyncAll: () => void;
  syncingId: string | number | null;
  syncingCount: number;
}

export default function SalesDashboard({
  inquiries,
  onSync,
  onSyncAll,
  syncingId,
  syncingCount,
}: SalesDashboardProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("tier");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [tierFilter, setTierFilter] = useState("all");
  const [syncFilter, setSyncFilter] = useState("all");

  const flagshipCount = inquiries.filter((i) => i.tier === "Flagship Space").length;
  const syncedCount = inquiries.filter((i) => i.syncStatus === "Synced").length;
  const pendingCount = inquiries.filter((i) => i.syncStatus === "Pending").length;
  const totalRevenue = inquiries.reduce((s, i) => s + i.monthlyRevenue, 0);
  const syncRate = inquiries.length > 0 ? Math.round((syncedCount / inquiries.length) * 100) : 0;

  const filtered = useMemo(() => {
    let result = [...inquiries];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) => i.contactName.toLowerCase().includes(q) || i.organization.toLowerCase().includes(q),
      );
    }
    if (tierFilter !== "all") result = result.filter((i) => i.tier === tierFilter);
    if (syncFilter !== "all") result = result.filter((i) => i.syncStatus === syncFilter);

    result.sort((a, b) => {
      let cmp: number;
      if (sortKey === "tier") cmp = TIER_ORDER[a.tier] - TIER_ORDER[b.tier];
      else if (sortKey === "footfall") cmp = a.footfall - b.footfall;
      else if (sortKey === "syncStatus") cmp = a.syncStatus.localeCompare(b.syncStatus);
      else cmp = a[sortKey].localeCompare(b[sortKey]);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [inquiries, search, sortKey, sortDir, tierFilter, syncFilter]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const sortIcon = (key: SortKey) =>
    sortKey !== key ? <ArrowUpDown className="h-3 w-3 opacity-30" /> : <ChevronDown className={`h-3.5 w-3.5 transition-transform ${sortDir === "asc" ? "" : "rotate-180"}`} />;

  const hasFilters = tierFilter !== "all" || syncFilter !== "all" || search.trim() !== "";

  return (
    <div className="animate-fade-in px-5 py-8 sm:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-terracotta-400">
            Aura & Operations
          </p>
          <h2 className="mt-1.5 font-serif text-3xl font-semibold text-espresso-700">
            Expansion Sales Dashboard
          </h2>
          <p className="mt-1 text-sm text-espresso-400">
            Live partnership inquiries, auto-classified and ready for ops sync.
          </p>
        </div>
        <button
          onClick={onSyncAll}
          disabled={pendingCount === 0 || syncingCount > 0}
          className="flex items-center gap-2 rounded-full border border-cream-200 bg-white px-5 py-2.5 text-sm font-semibold text-espresso-600 shadow-sm transition hover:border-terracotta-200 hover:text-terracotta-400 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${syncingCount > 0 ? "animate-spin" : ""}`} />
          Sync All ({pendingCount})
        </button>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid gap-5 sm:grid-cols-3">
        <StatCard
          icon={<Inbox className="h-5 w-5" />}
          label="Total Inquiries"
          value={inquiries.length.toString()}
          sub="all time"
          gradient="from-sage-300 to-sage-400"
        />
        <StatCard
          icon={<Sparkles className="h-5 w-5" />}
          label="Tier-1 Flagship Spaces"
          value={flagshipCount.toString()}
          sub="≥ 1,000 footfall"
          gradient="from-terracotta-300 to-terracotta-400"
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Synced to Ops"
          value={`${syncRate}%`}
          sub={`${syncedCount} of ${inquiries.length} synced`}
          gradient="from-espresso-400 to-espresso-600"
        />
      </div>

      {/* Revenue + sync progress strip */}
      <div className="mb-8 grid gap-5 lg:grid-cols-3">
        <div className="flex items-center gap-4 rounded-3xl border border-cream-200 bg-white p-5 shadow-sm lg:col-span-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-50 text-sage-500">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-espresso-400">Total Pipeline Revenue</p>
            <p className="font-serif text-2xl font-semibold text-espresso-700">{formatCompactRevenue(totalRevenue)}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-cream-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-espresso-600">Ops Sync Progress</span>
            <span className="text-sm font-bold text-espresso-700">{syncRate}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-cream-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sage-300 to-sage-400 transition-all duration-1000"
              style={{ width: `${syncRate}%` }}
            />
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-sage-500">
              <span className="h-2 w-2 rounded-full bg-sage-400" /> Synced ({syncedCount})
            </span>
            <span className="flex items-center gap-1.5 text-terracotta-400">
              <span className="h-2 w-2 rounded-full bg-terracotta-400" /> Pending ({pendingCount})
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso-400/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or organization…"
            className="w-full rounded-full border border-cream-200 bg-white py-2.5 pl-10 pr-4 text-sm text-espresso-700 outline-none transition focus:border-terracotta-300 focus:ring-2 focus:ring-terracotta-200/40 placeholder:text-espresso-400/40"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-espresso-400/40" />
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="rounded-full border border-cream-200 bg-white px-4 py-2.5 text-sm text-espresso-600 outline-none transition focus:border-terracotta-300"
          >
            <option value="all">All Tiers</option>
            {TIER_LABELS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            value={syncFilter}
            onChange={(e) => setSyncFilter(e.target.value)}
            className="rounded-full border border-cream-200 bg-white px-4 py-2.5 text-sm text-espresso-600 outline-none transition focus:border-terracotta-300"
          >
            <option value="all">All Statuses</option>
            <option value="Synced">Synced</option>
            <option value="Pending">Pending</option>
          </select>
          {hasFilters && (
            <button
              onClick={() => { setSearch(""); setTierFilter("all"); setSyncFilter("all"); }}
              className="flex items-center gap-1 rounded-full px-3 py-2.5 text-sm font-medium text-espresso-400 transition hover:bg-cream-100"
            >
              <X className="h-4 w-4" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table (Sync Column Removed) */}
      <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left">
            <thead className="border-b border-cream-200 bg-cream-50/50 text-xs uppercase tracking-wide text-espresso-400/70">
              <tr>
                {([
                  { key: "contactName" as SortKey, label: "Contact" },
                  { key: "organization" as SortKey, label: "Organization" },
                  { key: "locationType" as SortKey, label: "Location" },
                  { key: "footfall" as SortKey, label: "Footfall" },
                  { key: "tier" as SortKey, label: "Tier" },
                ]).map((col) => (
                  <th key={col.key} className="px-6 py-4">
                    <button
                      onClick={() => handleSort(col.key)}
                      className="flex items-center gap-1.5 transition hover:text-espresso-600"
                    >
                      {col.label}
                      {sortIcon(col.key)}
                    </button>
                  </th>
                ))}
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {filtered.map((inq) => {
                const ts = getTierStyle(inq.tier);
                const isSyncing = syncingId === inq.id;
                return (
                  <tr key={inq.id} className="group transition hover:bg-cream-50/40">
                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white ${getAvatarGradient(inq.contactName)}`}
                        >
                          {getInitials(inq.contactName)}
                        </div>
                        <div>
                          <p className="font-medium text-espresso-700">{inq.contactName}</p>
                          <p className="text-xs text-espresso-400/60">{formatRelativeTime(inq.createdAt)}</p>
                        </div>
                      </div>
                    </td>
                    {/* Organization */}
                    <td className="px-6 py-4 text-sm text-espresso-600">{inq.organization}</td>
                    {/* Location */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-espresso-400">
                        {inq.locationType === "Corporate Tech Park"
                          ? <Building2 className="h-3.5 w-3.5" />
                          : <GraduationCap className="h-3.5 w-3.5" />}
                        {inq.locationType === "Corporate Tech Park" ? "Corporate" : "Campus"}
                      </span>
                    </td>
                    {/* Footfall */}
                    <td className="px-6 py-4 text-sm font-semibold text-espresso-600">
                      {inq.footfall.toLocaleString()}
                    </td>
                    {/* Tier badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${ts.badge}`}>
                        <span className="text-sm">{ts.icon}</span>
                        {inq.tier}
                      </span>
                    </td>
                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      {inq.syncStatus === "Pending" ? (
                        <button
                          onClick={() => onSync(inq.id)}
                          disabled={isSyncing}
                          className="inline-flex items-center gap-1.5 rounded-full border border-cream-200 bg-white px-3.5 py-2 text-xs font-semibold text-espresso-600 transition hover:border-terracotta-200 hover:text-terracotta-500 disabled:opacity-50"
                        >
                          <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                          {isSyncing ? "Syncing…" : "Sync to Ops"}
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sage-50 px-3 py-1.5 text-xs font-semibold text-sage-600">
                          ✓ Synced
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <p className="text-sm text-espresso-400/60">
                      {hasFilters ? "No inquiries match your filters." : "No inquiries yet."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tier legend */}
      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-3xl border border-cream-200 bg-white p-4">
        <span className="text-sm font-medium text-espresso-600">Auto-Classification:</span>
        {TIER_LABELS.map((t) => {
          const ts = getTierStyle(t);
          const range = t === "Flagship Space" ? "≥ 1,000 footfall" : t === "Campus Partner" ? "300–999 footfall" : "< 300 footfall";
          return (
            <span key={t} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${ts.badge}`}>
              <span>{ts.icon}</span>
              {range} → {t}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  gradient,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  gradient: string;
}) {
  return (
    <div className="rounded-3xl border border-cream-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:shadow-espresso-700/5">
      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md ${gradient}`}>
        {icon}
      </div>
      <p className="font-serif text-3xl font-semibold text-espresso-700">{value}</p>
      <p className="mt-1 text-sm font-medium text-espresso-600">{label}</p>
      <p className="text-xs text-espresso-400/60">{sub}</p>
    </div>
  );
}