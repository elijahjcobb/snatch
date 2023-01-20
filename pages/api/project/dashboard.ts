import { supabase } from "#db";
import { APIError } from "#lib/api-error";
import { createEndpoint } from "#lib/api/create-endpoint";
import { verifyProject } from "#lib/api/token";

export interface APIResponseDashboard {
  entries: number;
  contacts: number;
}

export default createEndpoint<APIResponseDashboard>({
  GET: async ({ req, res }) => {
    const project = await verifyProject(req);

    const { data, error } = await supabase
      .from("dashboard")
      .select()
      .eq("p_id", project.id);
    if (error || !data) {
      console.error(error);
      throw new APIError(500, "Could not fetch dashboard.");
    }
    const dashboard = data[0];
    res.json({
      contacts: dashboard?.contact_count ?? 0,
      entries: dashboard?.ent_count ?? 0,
    });
  },
});
