import { createEndpoint } from "../../../helpers/api/create-endpoint";
import { verifyUser } from "../../../helpers/api/token";

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
});
