import formData from "form-data";
import Mailgun from "mailgun.js";
import type { APIRawForm } from "./coding";
import { render } from "@react-email/render";
import EmailSignUp from "#emails/sign-up-code";
import EmailVerified from "#emails/email-verified";
import EmailPasswordReset from "#emails/password-reset";
import EmailPasswordResetComplete from "#emails/password-reset-complete";
import EmailFormSubmittedAdmin from "#emails/form-admin";
import EmailFormSubmittedUser from "#emails/form-user";
import EmailProjectInvitation from "#emails/project-invitation";

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
if (!MAILGUN_API_KEY) throw new Error("No mailgun key in env.");

const mailgun = new Mailgun(formData).client({
  username: "api",
  key: MAILGUN_API_KEY,
});

export function sendEmail({
  to,
  subject,
  content,
}: {
  to: string | string[];
  subject: string;
  content: string;
}): void {
  mailgun.messages
    .create("mail.snatch.fyi", {
      from: "Snatch <noreply@mail.snatch.fyi>",
      to,
      subject,
      html: content,
    })
    .catch((err) => {
      console.error(err);
      console.error("Email failed to send!");
    });
}

export function sendUserSignUpEmail(email: string, name: string, otp: string) {
  sendEmail({
    to: email,
    subject: "Welcome to snatch.fyi!",
    content: render(<EmailSignUp name={name} otp={otp} />),
  });
}

export function sendUserPostVerifyEmail(email: string) {
  sendEmail({
    to: email,
    subject: "Thank you for verifying!",
    content: render(<EmailVerified />),
  });
}

export function sendUserResetEmail(email: string, otp: string) {
  sendEmail({
    to: email,
    subject: "Snatch Password Reset Code",
    content: render(<EmailPasswordReset otp={otp} />),
  });
}

export function sendUserResetEmailPost(email: string) {
  sendEmail({
    to: email,
    subject: "Snatch Password Reset",
    content: render(<EmailPasswordResetComplete />),
  });
}

export function sendFormSubmittedTeam(emails: string[], form: APIRawForm) {
  sendEmail({
    to: emails,
    subject: `Your form '${form.name}' has a new response.`,
    content: render(<EmailFormSubmittedAdmin url={`https://snatch.fyi/dashboard/responses/${form.id}`} name={form.name} />),
  });
}

export function sendFormSubmittedUser(email: string) {
  sendEmail({
    to: email,
    subject: "Form Submitted",
    content: render(<EmailFormSubmittedUser />),
  });
}

export function sendMemberInvited(email: string, projectName: string) {
  sendEmail({
    to: email,
    subject: `Join '${projectName}' on snatch.fyi!`,
    content: render(<EmailProjectInvitation projectName={projectName = ""} />),
  });
}
