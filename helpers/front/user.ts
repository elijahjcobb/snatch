import { hasCookie } from "cookies-next";

export function isSignedIn(): boolean {
  return hasCookie("token");
}
