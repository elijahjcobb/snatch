import formData from "form-data";
import Mailgun from "mailgun.js";
import type { APIRawForm } from "./coding";

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
      text: content,
    })
    .catch((err) => {
      console.error(err);
      console.error("Email failed to send!");
    });
}

export function sendUserSignUpEmail(email: string, otp: string) {
  sendEmail({
    to: email,
    subject: "Welcome to snatch.fyi!",
    content: `Welcome to snatch!\n\nYour one time code is:\n${otp}\n\nThanks,\nThe snatch team`,
  });
}

export function sendUserPostVerifyEmail(email: string) {
  sendEmail({
    to: email,
    subject: "Thank you for verifying!",
    content: `Hello!\n\nYour email has been verified on snatch.fyi!\n\n- The snatch team`,
  });
}

export function sendUserResetEmail(email: string, otp: string) {
  sendEmail({
    to: email,
    subject: "Snatch Password Reset Code",
    content: `Hello!\n\nYour password reset code is:\n${otp}\n\nThanks,\nThe snatch team`,
  });
}

export function sendUserResetEmailPost(email: string) {
  sendEmail({
    to: email,
    subject: "Snatch Password Reset",
    content: `Hello!\n\nYour password has been reset on snatch.fyi!\n\n- The snatch team`,
  });
}

export function sendFormSubmittedTeam(emails: string[], form: APIRawForm) {
  sendEmail({
    to: emails,
    subject: `Your form '${form.name}' has a new response.`,
    content: `Hello!\n\nYour form has a new response. Check it out on snatch!\n\nhttps://snatch.fyi/dashboard/responses/${form.id}\n\n- The snatch team`,
  });
}

export function sendFormSubmittedUser(email: string, form: APIRawForm) {
  sendEmail({
    to: email,
    subject: "Form Submitted",
    content: `Hello!\n\nYour form entry was submitted!\n\n- The snatch team`,
  });
}
