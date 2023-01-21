import { NextApiRequest, NextApiResponse } from "next";
import { APIError } from "lib/api-error";

export type MethodType = "GET" | "PUT" | "POST" | "DELETE";

type Handler<T> = (refs: {
  req: NextApiRequest;
  res: NextApiResponse<T>;
}) => Promise<void>;

export function createEndpoint<T extends object>(
  handlers: Partial<Record<MethodType, Handler<T>>>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      let handler: Handler<T> | undefined = handlers[req.method as MethodType];
      if (!handler) throw new APIError(404, "Endpoint not found.");
      await handler({ req, res });
    } catch (e) {
      console.error(e);
      if (e instanceof APIError) {
        if (e.error) console.error(e.error);
        return res.status(e.code).json({ error: e.message });
      }
      res.status(500).json({ error: "Internal server error." });
    }
  };
}
