import { setCookie } from "cookies-next";
import { getDate90DaysInFuture } from "./date";
import { truncate } from "./front/truncate";

export type CookieKey = "project" | "user" | "projectId";

export function setCookie30Day(key: CookieKey, value: string): void {
  console.info(`Setting cookie: {"${key}": "${truncate(value ?? "", 20)}"}`);
  setCookie(key, value, { expires: getDate90DaysInFuture() });
}
