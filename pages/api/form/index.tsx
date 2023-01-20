import { T } from "@elijahjcobb/typr";
import { createEndpoint } from "#lib/api/create-endpoint";
import { verifyProject } from "#lib/api/token";
import { verifyBody } from "#lib/api/type-check";
import { supabase } from "#db";
import { APIResponseForm, convertToForm } from "#lib/api/coding";
import { assertArrayFilled } from "#lib/assert-filled";

export default createEndpoint<APIResponseForm>({
	POST: async ({ req, res }) => {

		const project = await verifyProject(req);

		const { name, notifyAdmin, notifyResponder, domains, keys, destination } = verifyBody(
			req,
			T.object({
				name: T.string(),
				notifyAdmin: T.optional(T.boolean()),
				notifyResponder: T.optional(T.boolean()),
				domains: T.optional(T.array(T.string())),
				keys: T.optional(T.array(T.string())),
				destination: T.optional(T.regex.url()),
			})
		);

		const { data, error } = await supabase
			.from('form')
			.insert({
				name: name.trim(),
				project_id: project.id,
				notify_admin: notifyAdmin,
				notify_responder: notifyResponder,
				domains: assertArrayFilled(domains ?? []),
				destination,
				keys: assertArrayFilled(keys ?? []),
			})
			.select()
		if (error) throw error;
		const form = data[0];

		res.json(convertToForm(form));
	},
});
