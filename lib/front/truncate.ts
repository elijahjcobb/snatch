export function truncate(value: string, length: number): string {
  if (value.length > length) return value.slice(0, length - 3) + "...";
  else return value;
}
