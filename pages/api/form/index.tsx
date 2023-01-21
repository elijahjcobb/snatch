import { T } from "@elijahjcobb/typr";
import { createEndpoint } from "lib/api/create-endpoint";
import { verifyProject } from "lib/api/token";
import { verifyBody } from "lib/api/type-check";
import { supabase } from "#db";
import { APIRawProject, APIResponseForm, convertToForm } from "lib/api/coding";
import { assertArrayFilled } from "lib/assert-filled";
import { fetchPlan } from "#lib/plan";
import { APIPlanError } from "#lib/api-error";
import { verifyPlanForFormActions } from "#lib/api/verify-plan";

export default createEndpoint<APIResponseForm>({
	POST: async ({ req, res }) => {

		const body = verifyBody(
			req,
			T.object({
				name: T.string(),
				notifyAdmin: T.optional(T.boolean()),
				notifyResponder: T.optional(T.boolean()),
				unbranded: T.optional(T.boolean()),
				domains: T.optional(T.array(T.string())),
				keys: T.optional(T.array(T.string())),
				destination: T.optional(T.regex.url()),
			})
		);
		const { name, notifyAdmin, notifyResponder, domains, keys, destination, unbranded } = body;

		const project = await verifyProject(req);

		await verifyPlanForFormActions(project, body);

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
				unbranded
			})
			.select()
		if (error) throw error;
		const form = data[0];

		res.json(convertToForm(form));
	},
});
