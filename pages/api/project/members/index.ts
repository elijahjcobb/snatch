import { supabase } from "#db";
import { APIError, APIPlanError } from "lib/api-error";
import { createEndpoint } from "lib/api/create-endpoint";
import { sendMemberInvited } from "lib/api/email";
import { verifyProject } from "lib/api/token";
import { verifyBody } from "lib/api/type-check";
import { T } from "@elijahjcobb/typr";
import { fetchPlan } from "#lib/plan";

export interface APIResponseProjectMembers {
  members: { id: string; name: string }[];
}

export default createEndpoint<APIResponseProjectMembers>({
  GET: async ({ req, res }) => {
    const project = await verifyProject(req);
    const { data, error } = await supabase
      .from("member")
      .select(
        `
			user_id,
			user (
				name
			)
		`
      )
      .eq("project_id", project.id);

    if (error) throw new APIError(500, "Could not fetch members.");
    res.json({
      members: data.map((v) => ({
        // @ts-ignore
        name: v.user?.name ?? v.user_id,
        id: v.user_id,
      })),
    });
  },
  POST: async ({ req, res }) => {
    const { email } = verifyBody(req, T.object({ email: T.regex.email() }));

    const { data, error } = await supabase
      .from("user")
      .select()
      .eq("email", email);
    if (error) throw new APIError(500, "Could not fetch user.");

    const user = data[0];

    if (!user) {
      throw new APIError(
        404,
        "To invite a member to your team, they must already have a snatch account. Please ask them to sign up."
      );
    }

    const project = await verifyProject(req);

    const plan = fetchPlan(project);

    if (plan.memberCount > 0) {
      const { count } = await supabase
        .from("member")
        .select("*", { count: "exact" })
        .eq("project_id", project.id);
      if ((count ?? 0) >= plan.memberCount)
        throw new APIPlanError("inviting members to your team");
    }

    const { error: insertError } = await supabase.from("member").insert({
      user_id: user.id,
      project_id: project.id,
      is_owner: false,
    });

    if (insertError) {
      if (insertError.code === "23505")
        throw new APIError(400, "This user is already a member on your team.");
      throw new APIError(500, "Could not invite user.", insertError);
    }

    sendMemberInvited(email, project.name);

    res.json({
      members: [
        {
          id: user.id,
          name: user.name,
        },
      ],
    });
  },
  DELETE: async ({ req, res }) => {
    const { id } = verifyBody(req, T.object({ id: T.string() }));
    const project = await verifyProject(req);
    const { data, error } = await supabase
      .from("member")
      .select()
      .eq("user_id", id)
      .eq("project_id", project.id);

    const member = data?.[0];
    if (error || !member)
      throw new APIError(500, "Could not fetch members.", error);

    if (member.is_owner)
      throw new APIError(400, "You can not remove an owner from a project.");

    const { error: deleteError } = await supabase
      .from("member")
      .delete()
      .eq("user_id", id)
      .eq("project_id", project.id);

    if (deleteError)
      throw new APIError(500, "Could not delete member.", deleteError);

    res.json({ members: [] });
  },
});
