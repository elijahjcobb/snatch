import { T } from "@elijahjcobb/typr";
import { createEndpoint } from "#lib/api/create-endpoint";
import { sendUserPostVerifyEmail } from "#lib/api/email";
import { otpVerify } from "#lib/api/otp";
import { tokenSign, verifyUser } from "#lib/api/token";
import { verifyBody } from "#lib/api/type-check";
import { supabase } from "#db";
import { APIError } from "#lib/api-error";
import { setCookie30Day } from "#lib/cookie";

export interface APIResponseUserVerify {
  projectToken?: string;
  projectId?: string;
}

export default createEndpoint<APIResponseUserVerify>({
  POST: async ({ req, res }) => {
    const { code } = verifyBody(req, T.object({ code: T.string() }));
    const user = await verifyUser(req, { allowUnverified: true });

    if (user.verified) {
      res.json({});
      return;
    }

    const isValidOTP = otpVerify({ key: user.id, code });

    if (!isValidOTP) {
      res.json({});
      return;
    }

    await supabase.from("user").update({ verified: true }).eq("id", user.id);
    sendUserPostVerifyEmail(user.email);

    const { data: projectData, error: projectError } = await supabase
      .from("project")
      .insert({
        name: `${user.name.split(" ")[0]}'s Project`,
      })
      .select();

    if (projectError || !projectData) {
      throw new APIError(500, "Could not create project.");
    }

    const project = projectData[0];

    const { error: memberError } = await supabase.from("member").insert({
      project_id: project.id,
      user_id: user.id,
      is_owner: true,
    });

    if (memberError) {
      throw new APIError(500, "Could not add member to project.");
    }

    const projectToken = await tokenSign(project.id, "project");
    setCookie30Day("project", projectToken);

    res.json({ projectToken, projectId: project.id });
  },
});
