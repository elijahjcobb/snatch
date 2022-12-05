export interface APIResponseForm {
  id: string;
  createdAt: string;
  userId: string;
  name: string;
  notifyAdmin: boolean;
  notifyResponder: boolean;
  domains: string[];
  destination: string | null;
}

export interface APIRawForm {
  id: string;
  created_at: string;
  user_id: string;
  name: string;
  notify_admin: boolean;
  notify_responder: boolean;
  domains: string[];
  destination: string | null;
}

export function convertToForm(rawForm: APIRawForm): APIResponseForm {
  return {
    id: rawForm.id,
    createdAt: rawForm.created_at,
    userId: rawForm.user_id,
    name: rawForm.name,
    notifyAdmin: rawForm.notify_admin,
    notifyResponder: rawForm.notify_responder,
    domains: rawForm.domains,
    destination: rawForm.destination,
  };
}
