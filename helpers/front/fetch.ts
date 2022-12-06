import { getCookie } from "cookies-next";
import { useState, useEffect, useRef } from "react";
import { toast } from "../../components/toast";
import { APIError } from "../api-error";
import type { TokenType } from "../api/token";
import { HOST } from "../constants";

export interface FetcherConfig {
  path: string;
  method: "post" | "put" | "delete" | "get";
  body?: object;
  showToast?: boolean;
  message?: string;
  scope?: TokenType;
}

export function fetcher<T extends object>({
  path,
  method,
  body,
  showToast = true,
  message,
  scope = "project",
}: FetcherConfig): Promise<T> {
  const promise = new Promise<T>((resolve, reject) => {
    (async (): Promise<T> => {
      try {
        const url = `${HOST}/api${path}`;
        const res = await fetch(url, {
          method,
          body: JSON.stringify(body),
          headers: {
            authorization: `Bearer ${getCookie(scope)}`,
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
    })()
      .then(resolve)
      .catch(reject);
  });
  if (showToast) toast({ promise, message });
  return promise;
}

export function useFetch<T extends object>(
  config: FetcherConfig | (() => FetcherConfig)
): [T | undefined, boolean, APIError | undefined] {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<APIError | undefined>(undefined);
  useEffect(() => {
    let realConfig: FetcherConfig;

    if (typeof config === "function") {
      realConfig = config();
    } else realConfig = config;

    fetcher<T>({ ...realConfig, showToast: false })
      .then((res) => {
        setData(res);
        setError(undefined);
      })
      .catch((err) => {
        let message = "Network error.";
        let code = 500;
        if (err instanceof APIError) {
          message = err.message;
          code = err.code;
        }
        setError(new APIError(code, message));
        toast({ message, status: "error" });
      });
  }, []);
  return [data, data === undefined && error === undefined, error];
}
