export type LocationType = "Corporate Tech Park" | "College Campus";
export type Tier = "Flagship Space" | "Campus Partner" | "Micro-Kiosk";
export type SyncStatus = "Synced" | "Pending";
export type View = "landing" | "dashboard";
export type SortKey = "contactName" | "organization" | "locationType" | "footfall" | "tier" | "syncStatus";
export type SortDir = "asc" | "desc";

export interface Inquiry {
  id: number;
  contactName: string;
  organization: string;
  locationType: LocationType;
  footfall: number;
  monthlyRevenue: number;
  tier: Tier;
  syncStatus: SyncStatus;
  createdAt: string;
}

export interface Toast {
  id: number;
  message: string;
  type: "success" | "info";
}

export const TIER_ORDER: Record<Tier, number> = {
  "Flagship Space": 0,
  "Campus Partner": 1,
  "Micro-Kiosk": 2,
};

export const TIER_LABELS: Tier[] = ["Flagship Space", "Campus Partner", "Micro-Kiosk"];

export function classifyTier(footfall: number): Tier {
  if (footfall >= 1000) return "Flagship Space";
  if (footfall >= 300) return "Campus Partner";
  return "Micro-Kiosk";
}

export function getTierStyle(tier: Tier): {
  badge: string;
  dot: string;
  bar: string;
  text: string;
  icon: string;
} {
  switch (tier) {
    case "Flagship Space":
      return {
        badge: "bg-terracotta-50 text-terracotta-600 border-terracotta-100",
        dot: "bg-terracotta-400",
        bar: "bg-terracotta-400",
        text: "text-terracotta-500",
        icon: "✨",
      };
    case "Campus Partner":
      return {
        badge: "bg-sage-50 text-sage-600 border-sage-100",
        dot: "bg-sage-400",
        bar: "bg-sage-400",
        text: "text-sage-500",
        icon: "🌿",
      };
    default:
      return {
        badge: "bg-cream-100 text-espresso-400 border-cream-200",
        dot: "bg-espresso-400",
        bar: "bg-espresso-400",
        text: "text-espresso-400",
        icon: "☕",
      };
  }
}

export function formatRevenue(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactRevenue(amount: number): string {
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(1)}Cr`;
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(1)}L`;
  if (amount >= 1_000) return `₹${(amount / 1_000).toFixed(0)}K`;
  return `₹${amount}`;
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${diffDay}d ago`;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const AVATAR_GRADIENTS = [
  "from-terracotta-300 to-terracotta-400",
  "from-sage-300 to-sage-400",
  "from-amber-400 to-orange-400",
  "from-cream-300 to-terracotta-200",
  "from-sage-200 to-sage-400",
  "from-terracotta-200 to-terracotta-400",
  "from-amber-300 to-terracotta-300",
  "from-sage-300 to-sage-500",
];

export function getAvatarGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

export const MONTHLY_TIERS = [
  { label: "Starter — ₹50K+", value: 50000 },
  { label: "Growth — ₹1.5L+", value: 150000 },
  { label: "Flagship — ₹5L+", value: 500000 },
  { label: "Enterprise — ₹10L+", value: 1000000 },
];

export const SEED_INQUIRIES: Inquiry[] = [
  {
    id: 1,
    contactName: "Aarav Sharma",
    organization: "TechNova Towers",
    locationType: "Corporate Tech Park",
    footfall: 1500,
    monthlyRevenue: 500000,
    tier: "Flagship Space",
    syncStatus: "Synced",
    createdAt: "2026-09-28T09:30:00Z",
  },
  {
    id: 2,
    contactName: "Priya Nair",
    organization: "GreenGrid Campus",
    locationType: "College Campus",
    footfall: 650,
    monthlyRevenue: 150000,
    tier: "Campus Partner",
    syncStatus: "Pending",
    createdAt: "2026-09-30T14:20:00Z",
  },
  {
    id: 3,
    contactName: "Rohan Mehta",
    organization: "PixelWorks Studio",
    locationType: "Corporate Tech Park",
    footfall: 180,
    monthlyRevenue: 50000,
    tier: "Micro-Kiosk",
    syncStatus: "Pending",
    createdAt: "2026-10-02T10:00:00Z",
  },
  {
    id: 4,
    contactName: "Sneha Kapoor",
    organization: "DataForge Hub",
    locationType: "Corporate Tech Park",
    footfall: 2200,
    monthlyRevenue: 1000000,
    tier: "Flagship Space",
    syncStatus: "Synced",
    createdAt: "2026-09-15T07:00:00Z",
  },
  {
    id: 5,
    contactName: "Vikram Reddy",
    organization: "CloudPeak Towers",
    locationType: "Corporate Tech Park",
    footfall: 420,
    monthlyRevenue: 150000,
    tier: "Campus Partner",
    syncStatus: "Synced",
    createdAt: "2026-09-25T12:15:00Z",
  },
  {
    id: 6,
    contactName: "Ananya Iyer",
    organization: "BioSense Institute",
    locationType: "College Campus",
    footfall: 95,
    monthlyRevenue: 50000,
    tier: "Micro-Kiosk",
    syncStatus: "Pending",
    createdAt: "2026-10-04T16:00:00Z",
  },
];

export const COFFEE_IMAGES = {
  heroLatte: "https://images.pexels.com/photos/2096840/pexels-photo-2096840.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  pourOver: "https://images.pexels.com/photos/19723762/pexels-photo-19723762.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  chemex: "https://images.pexels.com/photos/8809322/pexels-photo-8809322.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  officeCafe: "https://images.pexels.com/photos/210658/pexels-photo-210658.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  businessCoffee: "https://images.pexels.com/photos/36766700/pexels-photo-36766700.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  cappuccino: "https://images.pexels.com/photos/38729411/pexels-photo-38729411.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  baristaPour: "https://images.pexels.com/photos/2858192/pexels-photo-2858192.png?auto=compress&cs=tinysrgb&h=650&w=940",
};
