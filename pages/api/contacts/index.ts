import { supabase } from "../../../db";
import { APIError } from "../../../helpers/api-error";
import { createEndpoint } from "../../../helpers/api/create-endpoint";
import { verifyUser } from "../../../helpers/api/token";

export interface APIResponseContact {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  createdAt: string;
  id: string;
}

export type APIResponseContacts = APIResponseContact[];

export default createEndpoint<APIResponseContacts>({
  GET: async ({ req, res }) => {
    const user = await verifyUser(req);

    const { data, error } = await supabase
      .from("contacts")
      .select()
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      throw new APIError(500, "Could not fetch contacts.");
    }

    res.json(
      data.map((raw) => ({
        firstName: raw.first_name ?? null,
        lastName: raw.last_name ?? null,
        email: raw.email ?? null,
        phone: raw.phone ?? null,
        createdAt: raw.created_at as string,
        id: raw.entry_id as string,
      }))
    );
  },
});
