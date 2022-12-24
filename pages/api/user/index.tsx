import { T } from "@elijahjcobb/typr";
import { createEndpoint } from "../../../helpers/api/create-endpoint";
import { verifyUser } from "../../../helpers/api/token";
import { verifyBody } from "../../../helpers/api/type-check";
import { supabase } from "../../../db";
import { APIError } from "../../../helpers/api-error";

export interface APIResponseUser {
	id: string;
	name: string;
	email: string;
	createdAt: string;
}

export default createEndpoint({
	GET: async ({ req, res }) => {
		const user = await verifyUser(req);
		res.json({
			id: user.id,
			name: user.name,
			email: user.email,
			createdAt: user.created_at
		});
	},
	PUT: async ({ req, res }) => {
		const { name: rawName } = verifyBody(req, T.object({
			name: T.string()
		}))

		const name = rawName.trim();
		if (name.length === 0) throw new APIError(400, "Name cannot be empty.");

		const user = await verifyUser(req);

		const { data, error } = await supabase
			.from('user')
			.update({
				name
			})
			.eq('id', user.id)
			.select()

		if (!data || data.length === 0 || error) {
			console.error(error);
			throw new APIError(500, "Could not update user.");
		}

		const updatedUser = data[0];

		res.json({
			id: updatedUser.id,
			name: updatedUser.name,
			email: updatedUser.email,
			createdAt: updatedUser.created_at
		});
	},
});
