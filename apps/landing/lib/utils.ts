export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + "M";
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + "K";
  }
  return value.toString();
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "active":
    case "connected":
    case "published":
    case "won":
    case "enriched":
      return "success";
    case "paused":
    case "pending":
    case "draft":
    case "scheduled":
    case "new":
      return "warning";
    case "retired":
    case "disconnected":
    case "invalid":
    case "expired":
    case "lost":
      return "danger";
    default:
      return "neutral";
  }
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const stageOrder = [
  "discovery",
  "proposal",
  "negotiation",
  "verbal",
  "contract",
  "won",
  "lost",
];

export const stageProbabilities: Record<string, number> = {
  discovery: 10,
  proposal: 25,
  negotiation: 50,
  verbal: 75,
  contract: 90,
  won: 100,
  lost: 0,
};
