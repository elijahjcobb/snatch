import { formatDistanceToNow } from "date-fns";

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  let value = formatDistanceToNow(date);
  return `${value} ago`;
}
