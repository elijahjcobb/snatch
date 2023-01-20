import { HOST } from "#lib/constants";

export function uniqueFormURL(id: string): string {
  return `${HOST}/api/entry/${id}`;
}
