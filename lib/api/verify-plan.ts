import { supabase } from "#db";
import { APIPlanError } from "#lib/api-error";
import { fetchPlan } from "#lib/plan";
import { APIRawProject } from "./coding";

export async function verifyPlanForFormActions(
  project: APIRawProject,
  body: Partial<{
    name: string;
    notifyAdmin: boolean;
    notifyResponder: boolean;
    domains: string[];
    keys: string[];
    destination: string;
  }>,
  checkForCount = true
): Promise<void> {
  const plan = fetchPlan(project);
  if (plan.formCount > 0 && checkForCount) {
    const { count } = await supabase
      .from("form")
      .select("*", { count: "exact" })
      .eq("project_id", project.id);
    if ((count ?? 0) >= plan.formCount)
      throw new APIPlanError("creating more than one form");
  }
  if (body.keys && !plan.customKeyIndexing)
    throw new APIPlanError("custom key indexing");
  if (body.destination && !plan.customDestination)
    throw new APIPlanError("a custom destination");
  if (body.notifyAdmin && !plan.adminNotifications)
    throw new APIPlanError("admin notifications");
  if (body.notifyResponder && !plan.responderNotifications)
    throw new APIPlanError("responder notifications");
  if (body.domains && !plan.domainVerification)
    throw new APIPlanError("domain verification");
}
