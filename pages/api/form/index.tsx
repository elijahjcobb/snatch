import { T } from "@elijahjcobb/typr";
import { createEndpoint } from "../../../helpers/api/create-endpoint";
import { verifyUser } from "../../../helpers/api/token";
import { verifyBody } from "../../../helpers/api/type-check";
import { supabase } from "../../../db";
import { APIResponseForm, convertToForm } from "../../../helpers/api/coding";

export default createEndpoint<APIResponseForm>({
	POST: async ({ req, res }) => {

		const user = await verifyUser(req);

		const { name, notifyAdmin, notifyResponder, domains, destination } = verifyBody(
			req,
			T.object({
				name: T.string(),
				notifyAdmin: T.optional(T.boolean()),
				notifyResponder: T.optional(T.boolean()),
				domains: T.optional(T.array(T.string())),
				destination: T.optional(T.regex.url()),
			})
		);

		const { data, error } = await supabase
			.from('form')
			.insert({
				name: name.trim(),
				user_id: user.id,
				notify_admin: notifyAdmin,
				notify_responder: notifyResponder,
				domains,
				destination
			})
			.select()
		if (error) throw error;
		const form = data[0];

		res.json(convertToForm(form));
	},
});
