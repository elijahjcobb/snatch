import { createEndpoint } from "lib/api/create-endpoint";
import { verifyProject } from "lib/api/token";
import { supabase } from "#db";
import { APIError } from "lib/api-error";
import { APIResponseForm, convertToForm } from "lib/api/coding";

export type APIResponseForms = APIResponseForm[];

export default createEndpoint<APIResponseForms>({
	GET: async ({ req, res }) => {
		const project = await verifyProject(req);
		const { data, error } = await supabase
			.from('form')
			.select()
			.eq('project_id', project.id)
			.order("created_at", { ascending: false });
		if (error || !data) throw new APIError(500, "Could not fetch forms for project.");
		res.json(data.map(raw => convertToForm(raw)));
	},
});
