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

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [inquiries, setInquiries] = useState<Inquiry[]>(SEED_INQUIRIES);
  const [syncingId, setSyncingId] = useState<number | null>(null);
  const [syncingCount, setSyncingCount] = useState(0);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successData, setSuccessData] = useState({ org: "", tier: "" });
  const [toasts, setToasts] = useState<Toast[]>([]);

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

  const handleSubmitInquiry = (data: {
    contactName: string;
    organization: string;
    locationType: Inquiry["locationType"];
    footfall: number;
    monthlyRevenue: number;
  }) => {
    const tier = classifyTier(data.footfall);
    const newInquiry: Inquiry = {
      ...data,
      id: Date.now(),
      tier,
      syncStatus: "Pending",
      createdAt: new Date().toISOString(),
    };
    setInquiries((prev) => [newInquiry, ...prev]);
    setSuccessData({ org: data.organization, tier });
    setSuccessOpen(true);
    addToast(`Inquiry received from ${data.organization}`);
  };

  const handleSync = useCallback((id: number) => {
    setSyncingId(id);
    const inq = inquiries.find((i) => i.id === id);
    setTimeout(() => {
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, syncStatus: "Synced" as const } : i)),
      );
      setSyncingId(null);
      if (inq) addToast(`${inq.organization} synced to ops`);
    }, 1200);
  }, [inquiries, addToast]);

  const handleSyncAll = useCallback(() => {
    const pending = inquiries.filter((i) => i.syncStatus === "Pending");
    if (pending.length === 0) return;
    setSyncingCount(pending.length);
    addToast(`Syncing ${pending.length} inquiries to ops…`, "info");

    pending.forEach((inq, i) => {
      setTimeout(() => {
        setInquiries((prev) =>
          prev.map((i) => (i.id === inq.id ? { ...i, syncStatus: "Synced" as const } : i)),
        );
        setSyncingCount((c) => {
          const next = c - 1;
          if (next === 0) addToast("All inquiries synced to ops");
          return next;
        });
      }, (i + 1) * 500);
    });
  }, [inquiries, addToast]);

  return (
    <div className="min-h-screen bg-cream-50 text-espresso-700">
      <TopNav
        view={view}
        onViewChange={setView}
        inquiryCount={inquiries.length}
      />

      {view === "landing" && <PartnerLanding onSubmit={handleSubmitInquiry} />}
      {view === "dashboard" && (
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
