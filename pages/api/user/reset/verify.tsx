import { T } from "@elijahjcobb/typr";
import { APIError } from "../../../../helpers/api-error";
import { createEndpoint } from "../../../../helpers/api/create-endpoint";
import { sendUserResetEmailPost } from "../../../../helpers/api/email";
import { otpVerify } from "../../../../helpers/api/otp";
import { verifyBody } from "../../../../helpers/api/type-check";
import { supabase } from "../../../../db";
import { createPassword } from "../../../../helpers/api/password";

export default createEndpoint({
	POST: async ({ req, res }) => {
		const { email, code, password } = await verifyBody(req, T.object({
			email: T.string(),
			code: T.string(),
			password: T.string()
		}));
		if (password.length < 8) throw new APIError(400, "Password must be at least 8 characters.");
		const { data, error } = await supabase.from("user").select().eq('email', email);
		if (error) throw error;
		if (!data || data.length < 1) throw new APIError(404, "A user does not exist with this email.");
		const user = data[0];
		const isValid = otpVerify({ key: user.id, code });
		if (!isValid) throw new APIError(401, "Invalid OTP code.");

		const newPassword = await createPassword(password);
		await supabase.from("user").update({ password: newPassword }).eq("id", user.id);
		sendUserResetEmailPost(email);
		res.json({});
	},
});
