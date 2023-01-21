import { createEndpoint } from "lib/api/create-endpoint";
import { supabase } from "#db";
import { HOST } from "lib/constants";
import { sendFormSubmittedTeam, sendFormSubmittedUser } from "lib/api/email";
import { fetchPlan } from "#lib/plan";

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

    if (
      form.domains.length > 0 &&
      req.headers.host &&
      form.domains.indexOf(req.headers.host) === -1
    ) {
      res.redirect(FORM_SUBMISSION_ERROR_URL);
      return;
    }

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

    const { error: insertError } = await supabase.from("entry").insert({
      form_id: form.id,
      fields: body,
      email,
      first_name: firstName,
      last_name: lastName,
      phone,
      message,
    });
    if (insertError) {
      console.error(insertError);
      res.redirect(FORM_SUBMISSION_ERROR_URL);
      return;
    }

    if (form.destination) {
      if (form.unbranded) {
        res.redirect(form.destination);
      } else {
        res.redirect(
          `${FORM_SUBMISSION_SUCCESS_URL}?next=${encodeURIComponent(
            form.destination
          )}`
        );
      }
    } else {
      res.redirect(FORM_SUBMISSION_SUCCESS_URL);
    }

    if (form.notify_responder && email) sendFormSubmittedUser(email, form);
    if (form.notify_admin) {
      const { data: owners, error: ownersError } = await supabase
        .from("member")
        .select(
          `
          user (
            email
          )
        `
        )
        .eq("project_id", form.project_id);
      if (ownersError || !owners) {
        console.error(ownersError);
        return;
      }
      // @ts-ignore - ignore error
      let emails = owners.map((o) => o.user?.email) as string[];
      sendFormSubmittedTeam(emails, form);
    }
  },
});
