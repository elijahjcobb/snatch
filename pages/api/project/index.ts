import { T } from "@elijahjcobb/typr";
import { supabase } from "../../../db";
import { APIError } from "../../../helpers/api-error";
import {
  APIResponseProject,
  convertToProject,
} from "../../../helpers/api/coding";
import { createEndpoint } from "../../../helpers/api/create-endpoint";
import { verifyProject } from "../../../helpers/api/token";
import { verifyBody } from "../../../helpers/api/type-check";

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
