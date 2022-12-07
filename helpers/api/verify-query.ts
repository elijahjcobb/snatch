import type { NextApiRequest } from "next";
import { APIError } from "../api-error";

export function verifyQuery(req: NextApiRequest, key = "id"): string {
  const value = req.query[key];
  if (typeof value !== "string") {
    throw new APIError(400, `URL does not contain dynamic item: ${key}.`);
  }
  return value;
}
