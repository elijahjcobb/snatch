import { T } from "@elijahjcobb/typr";
import { createEndpoint } from "../../../helpers/api/create-endpoint";
import { sendUserPostVerifyEmail } from "../../../helpers/api/email";
import { otpVerify } from "../../../helpers/api/otp";
import { verifyUser } from "../../../helpers/api/token";
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
