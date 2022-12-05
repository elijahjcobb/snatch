export function getDate90DaysInFuture(): Date {
  const now = Date.now();
  const future = now + 1000 * 60 * 60 * 24 * 90;
  return new Date(future);
}
