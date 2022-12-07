import { T } from "@elijahjcobb/typr";
import { APIError } from "../../../helpers/api-error";
import { createEndpoint } from "../../../helpers/api/create-endpoint";
import { verifyPassword } from "../../../helpers/api/password";
import { tokenSign } from "../../../helpers/api/token";
import { verifyBody } from "../../../helpers/api/type-check";
import { supabase } from "../../../db";
import { setCookie } from "cookies-next";
import { da } from "date-fns/locale";

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

    const { data: memberData, error: memberError } = await supabase
      .from("project_user")
      .select()
      .eq("user_id", user.id);

    if (memberError || !memberData) {
      throw new APIError(500, "Could not fetch user projects.");
    }

    if (data.length === 1) {
      const project = data[0];
      const projectToken = await tokenSign(project.id, "project");
      setCookie("project", projectToken);
    }

    res.json({ token });
  },
});
