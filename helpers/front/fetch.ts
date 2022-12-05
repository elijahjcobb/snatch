import { getCookie } from "cookies-next";
import { APIError } from "../api-error";

export async function fetcher<T extends object>({
  path,
  method,
  body,
}: {
  path: string;
  method: "post" | "put" | "delete" | "get";
  body?: object;
}): Promise<T> {
  try {
    const url = `http://localhost:3000/api${path}`;
    const res = await fetch(url, {
      method,
      body: JSON.stringify(body),
      headers: {
        authorization: `Bearer ${getCookie("token")}`,
      },
    });
    const resBody = await res.json();
    if (res.ok) {
      return resBody;
    } else {
      const error = new APIError(res.status, resBody["error"]);
      console.error(error);
      throw error;
    }
  } catch (e) {
    console.error(e);
    if (e instanceof APIError) {
      throw e;
    } else {
      throw new APIError(500, "Unknown error.");
    }
  }
}
