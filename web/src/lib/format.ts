export function formatDate(dateStr?: string): string {
  if (!dateStr)
    return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime()))
    return dateStr;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function formatViews(count?: string): string {
  if (!count)
    return "0";
  const n = Number(count);
  if (Number.isNaN(n))
    return count;
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)
    return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function timeAgo(dateStr?: string): string {
  if (!dateStr)
    return "";
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then))
    return dateStr;
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 60)
    return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24)
    return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30)
    return `${days}d ago`;
  return formatDate(dateStr);
}
