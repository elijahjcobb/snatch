import { createEndpoint } from "../../../helpers/api/create-endpoint";
import { supabase } from "../../../db";
import { HOST } from "../../../helpers/constants";

const FORM_SUBMISSION_ERROR_URL = `${HOST}/submission/error`;
const FORM_SUBMISSION_SUCCESS_URL = `${HOST}/submission/success`;

export default createEndpoint({
  GET: async ({ req, res }) => {
    const url = req.url;

    if (!url) {
      console.error("Request url was undefined.");
      res.redirect(FORM_SUBMISSION_ERROR_URL);
      return;
    }

    const paramsIndex = url.indexOf("?");

    if (paramsIndex === -1) {
      console.error("No params in url.");
      res.redirect(FORM_SUBMISSION_ERROR_URL);
      return;
    }

    const paramsString = url.slice(paramsIndex + 1);
    const params = new URLSearchParams(paramsString);
    const body = Object.fromEntries(params.entries()) as Record<
      string,
      string | null
    >;

    const formId = req.query.id;
    const { data, error } = await supabase
      .from("form")
      .select()
      .eq("id", formId);

    if (error || !data || data.length === 0) {
      res.redirect(FORM_SUBMISSION_ERROR_URL);
      return;
    }

    const form = data[0];

    function getItemFromForm(value: string): string | null {
      let newValue = body[value];
      if (typeof newValue !== "string") newValue = null;
      if (newValue) newValue = newValue.trim();
      if (newValue?.length === 0) newValue = null;
      return newValue;
    }

    const email = getItemFromForm("email");
    const message = getItemFromForm("message");
    const phone = getItemFromForm("phone");
    let firstName = getItemFromForm("firstName");
    let lastName = getItemFromForm("lastName");

    if (!firstName || !lastName) {
      const name = getItemFromForm("name");
      if (name) {
        const parts = name.split(" ");
        if (!firstName) firstName = parts[0];
        if (!lastName) lastName = parts[0];
      }
    }

    const x = {
      form_id: form.id,
      fields: body,
      email,
      first_name: firstName,
      last_name: lastName,
      phone,
      message,
    };

    console.log(x);

    const { error: insertError } = await supabase.from("entry").insert(x);
    if (insertError) {
      console.error(insertError);
      res.redirect(FORM_SUBMISSION_ERROR_URL);
      return;
    }

    const nextUrl = form.destination ?? FORM_SUBMISSION_SUCCESS_URL;
    res.redirect(nextUrl);
  },
});
