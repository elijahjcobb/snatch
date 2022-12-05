import { T } from "@elijahjcobb/typr";
import { APIError } from "../../../helpers/api-error";
import { createEndpoint } from "../../../helpers/api/create-endpoint";
import {
  sendUserPostVerifyEmail,
  sendUserSignUpEmail,
} from "../../../helpers/api/email";
import { otpGenerate, otpVerify } from "../../../helpers/api/otp";
import { createPassword } from "../../../helpers/api/password";
import { tokenSign, verifyUser } from "../../../helpers/api/token";
import { verifyBody } from "../../../helpers/api/type-check";
import { supabase } from "../../../db";

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
    res.json({ valid: true });
  },
});
