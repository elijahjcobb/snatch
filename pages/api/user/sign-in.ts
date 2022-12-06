import { T } from "@elijahjcobb/typr";
import { APIError } from "../../../helpers/api-error";
import { createEndpoint } from "../../../helpers/api/create-endpoint";
import { verifyPassword } from "../../../helpers/api/password";
import { tokenSign } from "../../../helpers/api/token";
import { verifyBody } from "../../../helpers/api/type-check";
import { supabase } from "../../../db";
import { setCookie } from "cookies-next";

export interface APIResponseUserSignIn {
  token: string;
}

const BAD_ACCOUNT_ERROR = new APIError(401, "Invalid username or password.");

export default createEndpoint<APIResponseUserSignIn>({
  POST: async ({ req, res }) => {
    const { email, password: rawPassword } = verifyBody(
      req,
      T.object({
        email: T.regex.email(),
        password: T.string(),
      })
    );

    const { data, error } = await supabase
      .from("user")
      .select()
      .eq("email", email);
    if (error) throw error;

    const user = data[0];
    if (!user) throw BAD_ACCOUNT_ERROR;
    const isCorrect = await verifyPassword(rawPassword, user.password);
    if (!isCorrect) throw BAD_ACCOUNT_ERROR;

    const token = await tokenSign(user.id, "user");

    setCookie("user", token);
    res.json({ token });
  },
});
