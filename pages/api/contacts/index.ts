import { supabase } from "#db";
import { fetchPlan } from "#lib/plan";
import { APIError, APIPlanError } from "lib/api-error";
import { createEndpoint } from "lib/api/create-endpoint";
import { verifyProject } from "lib/api/token";

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
    const project = await verifyProject(req);

    const plan = fetchPlan(project);
    if (!plan.contacts) throw new APIPlanError("viewing contacts");

    const { data, error } = await supabase
      .from("contacts")
      .select()
      .eq("project_id", project.id);

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
