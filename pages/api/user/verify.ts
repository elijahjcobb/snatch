import { T } from "@elijahjcobb/typr";
import { createEndpoint } from "../../../helpers/api/create-endpoint";
import { sendUserPostVerifyEmail } from "../../../helpers/api/email";
import { otpVerify } from "../../../helpers/api/otp";
import { tokenSign, verifyUser } from "../../../helpers/api/token";
import { verifyBody } from "../../../helpers/api/type-check";
import { supabase } from "../../../db";
import { setCookie } from "cookies-next";
import { APIError } from "../../../helpers/api-error";

export interface APIResponseUserVerify {
  valid: boolean;
}

export default createEndpoint<APIResponseUserVerify>({
  POST: async ({ req, res }) => {
    const { code } = verifyBody(req, T.object({ code: T.string() }));
    const user = await verifyUser(req, { allowUnverified: true });

    if (user.verified) {
      res.json({ valid: true });
      console.log("already verified");
      return;
    }

    const isValidOTP = otpVerify({ key: user.id, code });

    if (!isValidOTP) {
      res.json({ valid: false });
      return;
    }

    await supabase.from("user").update({ verified: true }).eq("id", user.id);
    sendUserPostVerifyEmail(user.email);

    const { data: projectData, error: projectError } = await supabase
      .from("project")
      .insert({
        name: "",
      })
      .select();

    if (projectError || !projectData) {
      throw new APIError(500, "Could not create project.");
    }

    const project = projectData[0];

    const { error: memberError } = await supabase.from("member").insert({
      project_id: project.id,
      user_id: user.id,
    });

    if (memberError) {
      throw new APIError(500, "Could not add member to project.");
    }

    const projectToken = await tokenSign(project.id, "project");
    setCookie("project", projectToken);

    res.json({ valid: true });
  },
});
