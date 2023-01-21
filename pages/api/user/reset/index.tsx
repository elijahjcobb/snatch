import { T } from "@elijahjcobb/typr";
import { APIError } from "lib/api-error";
import { createEndpoint } from "lib/api/create-endpoint";
import { sendUserResetEmail } from "lib/api/email";
import { otpGenerate } from "lib/api/otp";
import { verifyBody } from "lib/api/type-check";
import { supabase } from "#db";

export interface APIResponseUser {
	id: string;
	name: string;
	email: string;
	createdAt: string;
}

export default createEndpoint({
	POST: async ({ req, res }) => {
		const { email } = await verifyBody(req, T.object({ email: T.string() }));
		const { data, error } = await supabase.from("user").select().eq('email', email);
		if (error) throw error;
		if (!data || data.length < 1) throw new APIError(404, "A user does not exist with this email.");
		const user = data[0];
		const code = otpGenerate(user.id);
		sendUserResetEmail(email, code);
		res.json({});
	},
});
