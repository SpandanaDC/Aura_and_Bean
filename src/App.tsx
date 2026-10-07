import { useState, useCallback, useEffect } from "react";
import {
  type Inquiry,
  type View,
  type Toast,
  SEED_INQUIRIES,
  classifyTier,
} from "@/lib/brewsync";
import TopNav from "@/components/TopNav";
import PartnerLanding from "@/components/PartnerLanding";
import SalesDashboard from "@/components/SalesDashboard";
import SuccessModal from "@/components/SuccessModal";
import ToastContainer from "@/components/ToastContainer";

const API_URL = 'http://localhost:5000/api';

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [inquiries, setInquiries] = useState<Inquiry[]>(SEED_INQUIRIES);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncingCount, setSyncingCount] = useState(0);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successData, setSuccessData] = useState({ org: "", tier: "" });
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Organization Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Fetch leads from Express/MongoDB backend on mount
  useEffect(() => {
    fetch(`${API_URL}/leads`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const formatted = data.map((item: any) => ({
            ...item,
            id: item._id,
            organization: item.organizationName,
            footfall: item.dailyFootfall,
            monthlyRevenue: item.expectedRevenue,
            syncStatus: item.syncStatus, // Explicitly map backend sync status
          }));
          setInquiries(formatted);
        }
      })
      .catch(err => console.log("Using local seed inquiries fallback:", err));
  }, []);

  useEffect(() => {
    if (successOpen) {
      const t = setTimeout(() => setSuccessOpen(false), 6000);
      return () => clearTimeout(t);
    }
  }, [successOpen]);

  const addToast = useCallback((message: string, type: Toast["type"] = "success") => {
    setToasts((prev) => [...prev, { id: Date.now() + Math.random(), message, type }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail === "admin@auraandbean.com" && loginPassword === "brew123") {
      setIsAuthenticated(true);
      setLoginError("");
      addToast("Successfully authenticated into Ops Portal");
    } else {
      setLoginError("Invalid organizational credentials. Try admin@auraandbean.com / brew123");
    }
  };

  const handleSubmitInquiry = async (data: {
    contactName: string;
    organization: string;
    locationType: Inquiry["locationType"];
    footfall: number;
    monthlyRevenue: number;
  }) => {
    const tier = classifyTier(data.footfall);
    const payload = {
      contactName: data.contactName,
      organizationName: data.organization,
      locationType: data.locationType,
      dailyFootfall: data.footfall,
      expectedRevenue: data.monthlyRevenue,
      tier,
    };

    try {
      const res = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const savedLead = await res.json();
      
      const newInquiry: Inquiry = {
        ...data,
        id: savedLead._id,
        tier: savedLead.tier,
        syncStatus: savedLead.syncStatus, // Sync status comes straight from backend automation rule
        createdAt: savedLead.createdAt,
      };

      setInquiries((prev) => [newInquiry, ...prev]);
      setSuccessData({ org: data.organization, tier });
      setSuccessOpen(true);
      
      if (savedLead.syncStatus === 'Synced') {
        addToast(`Flagship Auto-Synced: Inquiry received from ${data.organization}`);
      } else {
        addToast(`Inquiry received from ${data.organization}`);
      }
    } catch (err) {
      console.error("Submission failed:", err);
      addToast("Failed to submit inquiry to server", "error");
    }
  };

  const handleSync = useCallback(async (id: string | number) => {
    setSyncingId(id as string);
    try {
      const res = await fetch(`${API_URL}/leads/${id}/sync`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, syncStatus: "Synced" as const } : i)),
        );
        const inq = inquiries.find((i) => i.id === id);
        if (inq) addToast(`${inq.organization} synced to ops`);
      }
    } catch (err) {
      console.error("Sync failed:", err);
      addToast("Sync failed", "error");
    } finally {
      setSyncingId(null);
    }
  }, [inquiries, addToast]);

  const handleSyncAll = useCallback(async () => {
    const pending = inquiries.filter((i) => i.syncStatus === "Pending");
    if (pending.length === 0) return;
    setSyncingCount(pending.length);
    addToast(`Syncing ${pending.length} inquiries to ops…`, "info");

    for (const inq of pending) {
      await handleSync(inq.id);
    }
    setSyncingCount(0);
    addToast("All inquiries synced to ops");
  }, [inquiries, handleSync, addToast]);

  return (
    <div className="min-h-screen bg-cream-50 text-espresso-700">
      <TopNav
        view={view}
        onViewChange={setView}
        inquiryCount={inquiries.length}
      />

      {view === "landing" && <PartnerLanding onSubmit={handleSubmitInquiry} />}
      
      {view === "dashboard" && !isAuthenticated && (
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
          <div className="w-full max-w-md rounded-3xl border border-espresso-100 bg-white p-8 shadow-xl shadow-espresso-900/5">
            <div className="text-center">
              <span className="inline-block rounded-full bg-cream-100 px-3 py-1 text-xs font-semibold tracking-wider text-espresso-600 uppercase">
                Restricted Access
              </span>
              <h2 className="mt-3 font-serif text-2xl font-bold text-espresso-900">
                Aura & Bean Ops Portal
              </h2>
              <p className="mt-1 text-sm text-espresso-500">
                Enter your organizational credentials to access the expansion pipeline.
              </p>
            </div>

            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              <div>
                <label className="block text-xs font-medium text-espresso-600 mb-1">
                  Corporate Email
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@auraandbean.com"
                  className="w-full rounded-xl border border-espresso-200 bg-cream-50/50 px-4 py-3 text-sm text-espresso-900 outline-none transition focus:border-espresso-400 focus:bg-white focus:ring-2 focus:ring-espresso-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-espresso-600 mb-1">
                  Secure Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-espresso-200 bg-cream-50/50 px-4 py-3 text-sm text-espresso-900 outline-none transition focus:border-espresso-400 focus:bg-white focus:ring-2 focus:ring-espresso-100"
                />
              </div>

              {loginError && (
                <p className="text-xs font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-espresso-900 py-3 text-sm font-medium text-cream-50 shadow-md transition hover:bg-espresso-800 active:scale-[0.99]"
              >
                Authenticate & Unlock Dashboard
              </button>
            </form>

            <div className="mt-6 rounded-xl bg-cream-100/60 p-4 text-center text-xs text-espresso-500">
              <span className="font-semibold text-espresso-700">Demo Credentials:</span><br />
              Email: <code className="text-espresso-800">admin@auraandbean.com</code><br />
              Password: <code className="text-espresso-800">brew123</code>
            </div>
          </div>
        </div>
      )}

      {view === "dashboard" && isAuthenticated && (
        <SalesDashboard
          inquiries={inquiries}
          onSync={handleSync}
          onSyncAll={handleSyncAll}
          syncingId={syncingId}
          syncingCount={syncingCount}
        />
      )}

      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        orgName={successData.org}
        tier={successData.tier}
      />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}