import { createEndpoint } from "../../../helpers/api/create-endpoint";
import { supabase } from "../../../db";

const FORM_SUBMISSION_ERROR_URL = "http://localhost:3000/submission/error";
const FORM_SUBMISSION_SUCCESS_URL = "http://localhost:3000/submission/success";

export default createEndpoint({
  GET: async ({ req, res }) => {
    const formId = req.query.id;
    const body = req.body;

    const { data, error } = await supabase
      .from("form")
      .select()
      .eq("id", formId);

    if (error || !data || data.length === 0) {
      res.redirect(FORM_SUBMISSION_ERROR_URL);
      return;
    }

    const form = data[0];
    let email = body.email;
    if (typeof email !== "string") email = null;

    await supabase.from("entry").insert({
      form_id: form.id,
      fields: body,
      email,
    });

    const nextUrl = form.destination ?? FORM_SUBMISSION_SUCCESS_URL;
    res.redirect(nextUrl);
  },
});
