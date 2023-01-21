import { APIError } from "./api-error";
import { APIRawProject, APIResponseProject } from "./api/coding";

export type PlanName = "hobby" | "pro" | "business";

export interface Plan {
  name: PlanName;
  formCount: number;
  responseCount: number;
  customKeyIndexing: boolean;
  exportResponses: boolean;
  memberCount: number;
  customDestination: boolean;
  unbrandedSubmission: boolean;
  contacts: boolean;
  adminNotifications: boolean;
  responderNotifications: boolean;
  domainVerification: boolean;
}

const PLANS: Record<PlanName, Plan> = {
  hobby: {
    name: "hobby",
    responseCount: -1,
    formCount: 1,
    customKeyIndexing: true,
    exportResponses: false,
    memberCount: 1,
    customDestination: false,
    unbrandedSubmission: false,
    contacts: false,
    adminNotifications: false,
    responderNotifications: false,
    domainVerification: false,
  },
  pro: {
    name: "pro",
    responseCount: -1,
    formCount: -1,
    customKeyIndexing: true,
    exportResponses: true,
    memberCount: -1,
    customDestination: true,
    unbrandedSubmission: false,
    contacts: false,
    adminNotifications: false,
    responderNotifications: false,
    domainVerification: false,
  },
  business: {
    name: "business",
    responseCount: -1,
    formCount: -1,
    customKeyIndexing: true,
    exportResponses: true,
    memberCount: -1,
    customDestination: true,
    unbrandedSubmission: true,
    contacts: true,
    adminNotifications: true,
    responderNotifications: true,
    domainVerification: true,
  },
};

export function fetchPlan(
  planOrProject: PlanName | APIResponseProject | APIRawProject
): Plan {
  let planName: PlanName;
  if (typeof planOrProject !== "string")
    planName = planOrProject.plan as PlanName;
  else planName = planOrProject;
  const plan = PLANS[planName];
  if (!plan) throw new APIError(500, "Plan not found.");
  return plan;
}
