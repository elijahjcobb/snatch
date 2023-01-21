export const HOST = process.env.NEXT_PUBLIC_HOST;
if (!HOST) throw new Error("NEXT_PUBLIC_HOST not defined.");
