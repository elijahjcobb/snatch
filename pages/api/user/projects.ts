import { T } from "@elijahjcobb/typr";
import { supabase } from "#db";
import { APIError, APIPlanError } from "lib/api-error";
import {
  APIResponsePlanType,
  APIResponseProject,
  convertToProject,
} from "lib/api/coding";
import { createEndpoint } from "lib/api/create-endpoint";
import { verifyUser, tokenSign } from "lib/api/token";
import { verifyBody } from "lib/api/type-check";

export type APIResponseUserProject = {
  project: APIResponseProject;
  token: string;
  date: string;
  isOwner: boolean;
};

export type APIResponseUserProjects = APIResponseUserProject[];

export default createEndpoint<APIResponseUserProjects>({
  GET: async ({ req, res }) => {
    const user = await verifyUser(req);
    const { data, error } = await supabase
      .from("project_user")
      .select()
      .eq("user_id", user.id);
    if (error || !data) {
      console.error(error);
      throw new APIError(500, "Could not fetch projects.");
    }
    const projects: APIResponseUserProjects = [];

    for (const raw of data) {
      const token = await tokenSign(raw.project_id!, "project");
      projects.push({
        token,
        date: raw.member_created_at!,
        project: {
          name: raw.name!,
          createdAt: raw.project_created_at!,
          id: raw.project_id!,
          plan: raw.plan! as APIResponsePlanType,
        },
        isOwner: raw.is_owner ?? false,
      });
    }

    res.json(projects);
  },
  POST: async ({ req, res }) => {
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

    const user = await verifyUser(req);

    let { data: projects, error: projectsError } = await supabase
      .from("member")
      .select(
        `
          project_id,
          user_id,
          project (
            plan,
            name
          )
      `
      )
      .eq("user_id", user.id);

    if (projectsError || !projects)
      throw new APIError(
        500,
        "Could not fetch member associations.",
        projectsError
      );

    let hobbyAccounts = [];
    for (const project of projects) {
      //@ts-expect-error
      if (project.project.plan === "hobby")
        //@ts-expect-error
        hobbyAccounts.push(project.project.name);
    }

    if (hobbyAccounts.length >= 1) {
      throw new APIError(
        400,
        `You can only have one hobby account. First upgrade "${hobbyAccounts[0]}".`
      );
    }

    let { data, error } = await supabase
      .from("project")
      .insert({ name })
      .select();

    if (error || !data || data.length < 1) {
      console.error(error);
      throw new APIError(500, "Could not create project.");
    }

    const project = data[0];
    error = (
      await supabase.from("member").insert({
        project_id: project.id,
        user_id: user.id,
        is_owner: true,
      })
    ).error;

    if (error) {
      console.error(error);
      throw new APIError(500, "Could not add user to project.");
    }

    const token = await tokenSign(project.id, "project");

    res.json([
      {
        project: convertToProject(project),
        token,
        date: new Date().toISOString(),
      },
    ]);
  },
});
