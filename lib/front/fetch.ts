import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";
import { toast } from "#components/toast";
import { APIError } from "lib/api-error";
import type { TokenType } from "lib/api/token";
import { HOST } from "lib/constants";

export interface FetcherConfig {
  path: string;
  method: "post" | "put" | "delete" | "get";
  body?: object;
  showLoadingToast?: boolean;
  hideToast?: boolean;
  message?: string;
  scope?: TokenType;
  debug?: boolean;
  silent?: boolean;
}

async function handleError(error: APIError): Promise<boolean> {
  if (
    error.code === 401 &&
    error.message === "Authentication user is invalid."
  ) {
    window.open("/sign-in", "_self");
    return true;
  }

  return false;
}

export function fetcher<T extends object>({
  path,
  method,
  body,
  showLoadingToast = true,
  hideToast = false,
  message,
  scope = "project",
  debug = false,
  silent,
}: FetcherConfig): Promise<T> {
  const promise = new Promise<T>((resolve, reject) => {
    (async (): Promise<T> => {
      try {
        const url = `${HOST}/api${path}`;
        if (debug) console.info(`Will make fetch to: '${url}'`);
        const bodyString = JSON.stringify(body);
        if (debug) console.info(`Adding body: '${bodyString}'`);
        if (debug) console.info(`With scope: '${scope}'`);
        const res = await fetch(url, {
          method,
          body: bodyString,
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
        let message = "Network error.";
        let code = 500;
        if (e instanceof APIError) {
          message = e.message;
          code = e.code;
        }
        const error = new APIError(code, message);
        const wasHandled = await handleError(error);
        if (wasHandled) return undefined as unknown as T;
        if (!silent && !hideToast) toast({ message, status: "error" });
        throw error;
      }
    })()
      .then(resolve)
      .catch(reject);
  });
  if (!silent && showLoadingToast) toast({ promise, message });
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

    fetcher<T>({ ...realConfig, showLoadingToast: false })
      .then((res) => {
        setData(res);
        setError(undefined);
      })
      .catch(() => {});
  }, []);
  return [data, data === undefined && error === undefined, error];
}
