import { T } from "@elijahjcobb/typr";
import { APIError } from "../../../../helpers/api-error";
import { createEndpoint } from "../../../../helpers/api/create-endpoint";
import { sendUserResetEmail } from "../../../../helpers/api/email";
import { otpGenerate } from "../../../../helpers/api/otp";
import { verifyUser } from "../../../../helpers/api/token";
import { verifyBody } from "../../../../helpers/api/type-check";
import { supabase } from "../../../../db";

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
