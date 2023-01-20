import { T } from "@elijahjcobb/typr";
import { APIError } from "#lib/api-error";
import { createEndpoint } from "#lib/api/create-endpoint";
import { verifyPassword } from "#lib/api/password";
import { tokenSign } from "#lib/api/token";
import { verifyBody } from "#lib/api/type-check";
import { supabase } from "#db";
import { setCookie30Day } from "#lib/cookie";

export interface APIResponseUserSignIn {
  userToken: string;
  projectToken?: string;
  projectId?: string;
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

    setCookie30Day("user", token);

    const { data: memberData, error: memberError } = await supabase
      .from("project_user")
      .select()
      .eq("user_id", user.id);

    if (memberError || !memberData) {
      throw new APIError(500, "Could not fetch user projects.");
    }

    let projectToken: string | undefined;
    let projectId: string | undefined;

    if (memberData.length > 0) {
      const member = memberData[0];
      projectId = member.project_id!;
      projectToken = await tokenSign(projectId, "project");
    }

    res.json({ userToken: token, projectId, projectToken });
  },
});
