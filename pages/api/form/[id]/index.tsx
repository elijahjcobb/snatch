import { T } from "@elijahjcobb/typr";
import { createEndpoint } from "lib/api/create-endpoint";
import { verifyProject } from "lib/api/token";
import { verifyBody } from "lib/api/type-check";
import { supabase } from "#db";
import { APIError } from "lib/api-error";
import { APIResponseForm, convertToForm } from "lib/api/coding";
import { assertArrayFilled } from "lib/assert-filled";
import { verifyPlanForFormActions } from "#lib/api/verify-plan";


export default createEndpoint<APIResponseForm>({
	DELETE: async ({ req, res }) => {
		const formId = req.query.id;
		if (typeof formId !== 'string') throw new APIError(400, "Invalid form ID.");
		const project = await verifyProject(req);

		const { data, error } = await supabase
			.from("form")
			.select()
			.eq('id', formId);

		if (!data || data.length < 1 || error) throw new APIError(404, "Form does not exist.");
		const form = data[0];
		if (form.project_id !== project.id) throw new APIError(404, "Form does not exist.");

		const { error: deleteError } = await supabase
			.rpc("delete_form_with_children", {
				f_id: form.id
			})

		if (deleteError) {
			console.error(deleteError);
			throw new APIError(404, "Could not delete form.");
		}

		res.json(convertToForm(form))

	},
	GET: async ({ req, res }) => {
		const formId = req.query.id;
		if (typeof formId !== 'string') throw new APIError(400, "Invalid form ID.");
		const project = await verifyProject(req);

		const { data, error } = await supabase
			.from("form")
			.select()
			.eq('id', formId);

		if (!data || data.length < 1 || error) throw new APIError(404, "Form does not exist.");
		const form = data[0];
		if (form.project_id !== project.id) throw new APIError(404, "Form does not exist.");

		res.json(convertToForm(form))

	},
	PUT: async ({ req, res }) => {

		const formId = req.query.id;
		if (typeof formId !== 'string') throw new APIError(400, "Invalid form ID.");

		const body = verifyBody(
			req,
			T.object({
				name: T.optional(T.string()),
				notifyAdmin: T.optional(T.boolean()),
				notifyResponder: T.optional(T.boolean()),
				unbranded: T.optional(T.boolean()),
				domains: T.optional(T.array(T.string())),
				keys: T.optional(T.array(T.string())),
				destination: T.optional(T.regex.url()),
			})
		);

		const project = await verifyProject(req);

		await verifyPlanForFormActions(project, body, false);

		const { data, error } = await supabase
			.from("form")
			.select()
			.eq('id', formId);

		if (!data || data.length < 1 || error) throw new APIError(404, "Form does not exist.");
		const form = data[0];
		if (form.project_id !== project.id) throw new APIError(404, "Form does not exist.");

		let name = body.name ?? '';
		if (name.length === 0) name = form.name;

		const newFormData = {
			name,
			notify_admin: body.notifyAdmin ?? false,
			notify_responder: body.notifyResponder ?? false,
			unbranded: body.unbranded ?? false,
			domains: assertArrayFilled(body.domains ?? []),
			keys: assertArrayFilled(body.keys ?? []),
			destination: body.destination ?? null,

		};

		const { error: updateError } = await supabase
			.from("form")
			.update(newFormData)
			.eq('id', formId);

		if (updateError) throw new APIError(404, "Could not update form.");

		res.json(convertToForm({ ...form, ...newFormData }));
	},
});
