import { createEndpoint } from "../../../helpers/api/create-endpoint";
import { verifyProject } from "../../../helpers/api/token";
import { supabase } from "../../../db";
import { APIError } from "../../../helpers/api-error";
import { APIResponseForm, convertToForm } from "../../../helpers/api/coding";

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
