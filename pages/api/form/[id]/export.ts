import { supabase } from "#db";
import { APIError } from "#lib/api-error";
import { createEndpoint } from "#lib/api/create-endpoint";
import { verifyProject } from "#lib/api/token";

export default createEndpoint({
  GET: async ({ req, res }) => {
    const formId = req.query.id;
    if (typeof formId !== "string") throw new APIError(400, "Invalid form ID.");
    const project = await verifyProject(req);
    const { data: form } = await supabase
      .from("form")
      .select()
      .eq("id", formId)
      .single();
    if (!form || form.project_id !== project.id)
      throw new APIError(404, "Form does not exist.");

    const { data: responses } = await supabase
      .from("entry")
      .select()
      .eq("form_id", formId)
      .select();
    if (!responses) throw new APIError(500, "Could not fetch responses.");

    let keys: string[] = ["Date", ...form.keys];

    if (form.keys.length === 0) {
      const keySet = new Set<string>();
      for (const response of responses) {
        const fields = response.fields as Record<string, string> | null;
        if (!fields) continue;
        for (const key in fields) keySet.add(key);
      }
      keys = keys.concat(Array.from(keySet));
    }

    const rows: string[] = [];

    // add header row
    rows.push(keys.join(","));

    // add data rows
    for (const response of responses) {
      const fields = response.fields as Record<string, string> | null;
      if (typeof fields !== "object" || !fields) continue;
      const row: string[] = [];
      for (const key of keys) {
        if (key === "Date") row.push(response.created_at);
        else row.push(fields[key]);
      }
      rows.push(row.join(","));
    }

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${form.name.replace(" ", "-")}.csv"`
    );
    const csv = rows.join("\n");

    res.end(csv);
  },
});
