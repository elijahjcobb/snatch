import { Json } from "../../db/types";

export interface APIResponseForm {
  id: string;
  createdAt: string;
  projectId: string;
  name: string;
  notifyAdmin: boolean;
  notifyResponder: boolean;
  keys: string[];
  domains: string[];
  destination: string | null;
}

export interface APIRawForm {
  id: string;
  created_at: string;
  project_id: string;
  name: string;
  notify_admin: boolean;
  notify_responder: boolean;
  domains: string[];
  keys: string[];
  destination: string | null;
}

export function convertToForm(rawForm: APIRawForm): APIResponseForm {
  return {
    id: rawForm.id,
    createdAt: rawForm.created_at,
    projectId: rawForm.project_id,
    name: rawForm.name,
    notifyAdmin: rawForm.notify_admin,
    notifyResponder: rawForm.notify_responder,
    domains: rawForm.domains,
    destination: rawForm.destination,
    keys: rawForm.keys,
  };
}

type Nullable<T> = T | null;
export interface APIRawEntry {
  id: string;
  created_at: string;
  form_id: string;
  fields: Json;
  email: Nullable<string>;
  phone: Nullable<string>;
  first_name: Nullable<string>;
  last_name: Nullable<string>;
  message: Nullable<string>;
}

export interface APIResponseEntry {
  id: string;
  createdAt: string;
  formId: string;
  fields: Json;
  email: Nullable<string>;
  phone: Nullable<string>;
  firstName: Nullable<string>;
  lastName: Nullable<string>;
  message: Nullable<string>;
}

export type APIResponseFormEntries = {
  responses: APIResponseEntry[];
  form: APIResponseForm;
};

export function convertToResponse(raw: APIRawEntry): APIResponseEntry {
  return {
    id: raw.id,
    createdAt: raw.created_at,
    formId: raw.form_id,
    fields: raw.fields,
    email: raw.email,
    phone: raw.phone,
    firstName: raw.first_name,
    lastName: raw.last_name,
    message: raw.message,
  };
}

export interface APIRawProject {
  name: string;
  created_at: string;
  id: string;
}

export interface APIResponseProject {
  name: string;
  createdAt: string;
  id: string;
}

export function convertToProject(raw: APIRawProject): APIResponseProject {
  return {
    name: raw.name,
    createdAt: raw.created_at,
    id: raw.id,
  };
}
