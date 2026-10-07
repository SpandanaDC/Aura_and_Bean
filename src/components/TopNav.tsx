import { Coffee, Sparkles, LayoutDashboard } from "lucide-react";
import type { View } from "@/lib/brewsync";

interface TopNavProps {
  view: View;
  onViewChange: (v: View) => void;
  inquiryCount: number;
}

export default function TopNav({ view, onViewChange, inquiryCount }: TopNavProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-terracotta-300 to-terracotta-400 shadow-md shadow-terracotta-400/20">
            <Coffee className="h-5 w-5 text-white" />
          </div>
          <div className="leading-none">
            <h1 className="font-serif text-xl font-semibold text-espresso-700">
              Aura <span className="text-terracotta-400">&</span> Bean
            </h1>
            <p className="mt-0.5 text-[11px] font-medium tracking-wide text-espresso-400/70">
              COFFEE PARTNERSHIP NETWORK
            </p>
          </div>
        </div>

        {/* View switcher */}
        <div className="flex items-center gap-1.5 rounded-full border border-cream-200 bg-white p-1 shadow-sm">
          <SwitchButton
            active={view === "landing"}
            onClick={() => onViewChange("landing")}
            icon={<Sparkles className="h-4 w-4" />}
            label="For Spaces"
          />
          <SwitchButton
            active={view === "dashboard"}
            onClick={() => onViewChange("dashboard")}
            icon={<LayoutDashboard className="h-4 w-4" />}
            label={`Ops${inquiryCount > 0 ? ` (${inquiryCount})` : ""}`}
          />
        </div>
      </div>
    </header>
  );
}

function SwitchButton({
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
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
        active
          ? "bg-espresso-700 text-cream-50 shadow-sm"
          : "text-espresso-400 hover:text-espresso-600"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
