import { T } from "@elijahjcobb/typr";
import { supabase } from "#db";
import { APIError } from "lib/api-error";
import { APIResponseProject, convertToProject } from "lib/api/coding";
import { createEndpoint } from "lib/api/create-endpoint";
import { verifyProject } from "lib/api/token";
import { verifyBody } from "lib/api/type-check";

export default createEndpoint<APIResponseProject>({
  GET: async ({ req, res }) => {
    const project = await verifyProject(req);
    res.json(convertToProject(project));
  },
  PUT: async ({ req, res }) => {
    const project = await verifyProject(req);
    let { name } = verifyBody(
      req,
      T.object({
        name: T.string(),
      })
    );

    name = name.trim();
    if (name.length === 0) {
      throw new APIError(400, "Name cannot be empty.");
    }

    const { data, error } = await supabase
      .from("project")
      .update({ name })
      .eq("id", project.id)
      .select();

    if (error || !data || data.length < 1) {
      console.error(error);
      throw new APIError(500, "Could not set name.");
    }

    res.json(convertToProject(data[0]));
  },
  DELETE: async ({ req, res }) => {
    const project = await verifyProject(req);
    const { error } = await supabase.rpc("delete_project_with_children", {
      p_id: project.id,
    });
    if (error) {
      console.error(error);
      throw new APIError(500, "Could not delete project.");
    }
    res.json(convertToProject(project));
  },
});
