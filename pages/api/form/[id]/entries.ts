import { createEndpoint } from "../../../../helpers/api/create-endpoint";
import { verifyProject } from "../../../../helpers/api/token";
import { supabase } from "../../../../db";
import { APIError } from "../../../../helpers/api-error";
import {
  APIResponseFormEntries,
  convertToForm,
  convertToResponse,
} from "../../../../helpers/api/coding";

export default createEndpoint<APIResponseFormEntries>({
  GET: async ({ req, res }) => {
    const formId = req.query.id;
    if (typeof formId !== "string") throw new APIError(400, "Invalid form ID.");
    const project = await verifyProject(req);

    const { data, error } = await supabase
      .from("form")
      .select()
      .eq("id", formId);

    if (!data || data.length < 1 || error)
      throw new APIError(404, "Form does not exist.");
    const form = data[0];
    if (form.project_id !== project.id)
      throw new APIError(404, "Form does not exist.");

    const { data: responses, error: responsesError } = await supabase
      .from("entry")
      .select()
      .eq("form_id", formId);

    if (!responses || responsesError) {
      console.error(responsesError);
      throw new APIError(500, "Could not fetch responses.");
    }

    res.json({
      responses: responses.map((raw) => convertToResponse(raw)),
      form: convertToForm(form),
    });
  },
});
