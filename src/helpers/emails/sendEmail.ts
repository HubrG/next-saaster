"use server";
import { EmailsInterface } from "@/src/types/EmailsInterface";
import React from "react";
import { Resend } from "resend";
import EmailWrapperTemplate from "../../emails/@ui/EmailWrapperTemplate";
import { getErrorMessage } from "../../lib/getErrorMessage";
const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailProps = {
  from?: string;
  type: EmailsInterface["type"];
  to: string;
  vars?: EmailsInterface["vars"];
  subject: string;
  text?: string;
  reply_to?: string;
  tag_name?: "category" | undefined;
  tag_value?: "invite_member_to_organisation" | "confirm_email" | undefined;
  preview?: string;
};
/**
 * This function sends an email using the Resend API.
 * @types
 * @param {string} from - The email address the email is sent from.
 * @param {string} to - The email address the email is sent to.
 * @param {string} subject - The subject of the email.
 * @param {string} text - The text of the email.
 * @param {string} type - The type of email.
 * @param {string} vars - The variables to be used in the email.
 * @param {string} tag_name - The tag name of the email.
 * @param {string} tag_value - The tag value of the email for resend.
 * @param {string} preview - The preview of the email .
 *
 */
export const sendEmail = async ({
  from = process.env.RESEND_FROM ?? "onboarding@resend.dev",
  reply_to = process.env.RESEND_REPLY_TO ?? "",
  to,
  preview,
  subject,
  type,
  vars,
  text,
  tag_name,
  tag_value,
}: SendEmailProps): Promise<{ success?: string; error?: string }> => {
  if (!to || !subject)
    throw new Error(
      "Missing required fields: to, subject, and either text or react_template must be provided."
    );

  try {
    const send = await resend.emails.send({
      from: from,
      to: [to],
      subject: subject,
      reply_to: reply_to,
      text: text,
      react: React.createElement(EmailWrapperTemplate, {
        type: type,
        preview: preview,
        vars: vars,
        text:text,
        subject:subject
      }),
      tags: [{ name: tag_name ?? "", value: tag_value ?? "" }],
    });

    if (!send) {
      throw new Error("An error has occured");
    } else if (send.error) {
      throw new Error(send.error.message);
    }
    return {
      success: send.data?.id,
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};
