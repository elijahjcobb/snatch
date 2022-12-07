import { T } from "@elijahjcobb/typr";
import { APIError } from "../../../helpers/api-error";
import { createEndpoint } from "../../../helpers/api/create-endpoint";
import { sendUserSignUpEmail } from "../../../helpers/api/email";
import { otpGenerate } from "../../../helpers/api/otp";
import { createPassword } from "../../../helpers/api/password";
import { tokenSign } from "../../../helpers/api/token";
import { verifyBody } from "../../../helpers/api/type-check";
import { supabase } from "../../../db";
import { setCookie30Day } from "../../../helpers/cookie";
import { APIResponseUserSignIn } from "./sign-in";

export default createEndpoint<APIResponseUserSignIn>({
  POST: async ({ req, res }) => {
    const {
      email,
      password: rawPassword,
      name,
    } = verifyBody(
      req,
      T.object({
        email: T.regex.email(),
        password: T.string(),
        name: T.string(),
      })
    );

    if (rawPassword.length < 8)
      throw new APIError(400, "Password must be at least 8 characters.");
    const password = await createPassword(rawPassword);

    const { data, error } = await supabase
      .from("user")
      .insert({
        email,
        password,
        name,
      })
      .select("id");

    if (error) {
      if (error.code === "23505") {
        throw new APIError(400, "Account already exists.");
      }
      throw error;
    }

    const userId = data[0].id;
    const userToken = await tokenSign(userId, "user");

    const otp = otpGenerate(userId);
    sendUserSignUpEmail(email, otp);
    setCookie30Day("user", userToken);

    res.json({ userToken });
  },
});
