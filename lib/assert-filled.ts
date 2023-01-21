export function assertArrayFilled<T>(value: string[]): string[] {
  if (!value) return [];
  if (value.length === 0) return [];
  return value.filter((val) => {
    if (val.length === 0) return false;
    return true;
  });
}
