import { T } from "@elijahjcobb/typr";
import { createEndpoint } from "../../../helpers/api/create-endpoint";
import { verifyUser } from "../../../helpers/api/token";
import { verifyBody } from "../../../helpers/api/type-check";
import { supabase } from "../../../db";
import { APIError } from "../../../helpers/api-error";
import { APIResponseForm, convertToForm } from "../../../helpers/api/coding";

export default createEndpoint<APIResponseForm>({
	DELETE: async ({ req, res }) => {
		const formId = req.query.id;
		if (typeof formId !== 'string') throw new APIError(400, "Invalid form ID.");
		const user = await verifyUser(req);

		const { data, error } = await supabase
			.from("form")
			.select()
			.eq('id', formId);

		if (!data || data.length < 1 || error) throw new APIError(404, "Form does not exist.");
		const form = data[0];
		if (form.user_id !== user.id) throw new APIError(404, "Form does not exist.");

		const { error: deleteError } = await supabase
			.from("form")
			.delete()
			.eq("id", formId);

		if (deleteError) throw new APIError(404, "Could not delete form.");

		res.json(convertToForm(form))

	},
	GET: async ({ req, res }) => {
		const formId = req.query.id;
		if (typeof formId !== 'string') throw new APIError(400, "Invalid form ID.");
		const user = await verifyUser(req);

		const { data, error } = await supabase
			.from("form")
			.select()
			.eq('id', formId);

		if (!data || data.length < 1 || error) throw new APIError(404, "Form does not exist.");
		const form = data[0];
		if (form.user_id !== user.id) throw new APIError(404, "Form does not exist.");

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
				domains: T.optional(T.array(T.string())),
				destination: T.optional(T.regex.url()),
			})
		);

		const user = await verifyUser(req);

		const { data, error } = await supabase
			.from("form")
			.select()
			.eq('id', formId);

		if (!data || data.length < 1 || error) throw new APIError(404, "Form does not exist.");
		const form = data[0];
		if (form.user_id !== user.id) throw new APIError(404, "Form does not exist.");

		const newFormData = {
			name: body.name ?? form.name,
			notify_admin: body.notifyAdmin ?? form.notify_admin,
			notify_responder: body.notifyResponder ?? form.notify_responder,
			domains: body.domains ?? form.domains,
			destination: body.destination ?? form.destination,
		}

		const { error: updateError } = await supabase
			.from("form")
			.update(newFormData)
			.eq('id', formId);

		if (updateError) throw new APIError(404, "Could not update form.");

		res.json(convertToForm({ ...form, ...newFormData }));
	},
});
