import { createEndpoint } from "../../../helpers/api/create-endpoint";
import { verifyUser } from "../../../helpers/api/token";
import { supabase } from "../../../db";
import { APIError } from "../../../helpers/api-error";
import { APIResponseForm, convertToForm } from "../../../helpers/api/coding";

export type APIResponseForms = APIResponseForm[];

export default createEndpoint<APIResponseForms>({
	GET: async ({ req, res }) => {
		const user = await verifyUser(req);
		const { data, error } = await supabase
			.from('form')
			.select()
			.eq('user_id', user.id)
			.order("created_at", { ascending: false });
		if (error || !data) throw new APIError(500, "Could not fetch forms for user.");
		res.json(data.map(raw => convertToForm(raw)));
	},
});
