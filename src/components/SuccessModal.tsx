import { X, Coffee, Heart } from "lucide-react";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  orgName: string;
  tier: string;
}

export default function SuccessModal({ open, onClose, orgName, tier }: SuccessModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-espresso-800/30 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-cream-50 shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top decorative band */}
        <div className="relative h-28 overflow-hidden bg-gradient-to-br from-terracotta-300 to-terracotta-400">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 30%, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }} />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/20 p-1.5 text-white transition hover:bg-white/30"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-50 shadow-lg">
              <Coffee className="h-7 w-7 text-terracotta-400" />
            </div>
          </div>
        </div>

        <div className="px-8 pb-8 pt-10 text-center">
          <h2 className="font-serif text-2xl font-semibold text-espresso-700">
            Your space is on our radar!
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-espresso-400">
            Thank you, <span className="font-semibold text-espresso-600">{orgName}</span>. Our curator
            will reach out shortly with a tailored partnership plan for your
            <span className="font-semibold text-terracotta-400"> {tier}</span> tier.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-espresso-400/70">
            <Heart className="h-3.5 w-3.5 text-terracotta-300" />
            We'll be in touch within 48 hours
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full rounded-full bg-espresso-700 py-3 text-sm font-semibold text-cream-50 transition hover:bg-espresso-800 active:scale-[0.98]"
          >
            Back to Site
          </button>
        </div>
      </div>
    </div>
  );
}
