import { formatDistanceToNow } from "date-fns";

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  let value = formatDistanceToNow(date);
  // value = value.replace("about ", "");
  // value = value.replace("less than ", "");
  // value = value.replace("over ", "");
  return `${value} ago`;
}
