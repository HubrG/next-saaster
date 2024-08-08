"use server"
import { env } from "@/src/lib/zodEnv";
import { EmailsInterface } from "@/src/types/EmailsInterface";
import React from "react";
import { Resend } from "resend";
import EmailWrapperTemplate from "../../emails/@ui/EmailWrapperTemplate";
import { getErrorMessage } from "../../lib/error-handling/getErrorMessage";

const resend = new Resend(env.RESEND_API_KEY);

type SendEmailProps = {
  from?: string;
  type: EmailsInterface["type"];
  to: string;
  vars?: EmailsInterface["vars"];
  subject: string;
  text?: string;
  reply_to?: string;
  tag_name?: "category" | undefined;
  tag_value?:
    | "invite_member_to_organisation"
    | "confirm_email"
    | "forgot_password"
    | "notification"
    | undefined;
  preview?: string;
};

/**
 * This function sends an email using the Resend API.
 * @param {SendEmailProps} props - The properties for sending the email.
 * @param {string} props.from - The email address the email is sent from. Defaults to .env RESEND_FROM.
 * @param {string} props.to - The email address the email is sent to. Required.
 * @param {string} [props.subject] - The subject of the email. Optional.
 * @param {string} props.text - The text of the email.
 * @param {string} props.type - The type of email to send.
 * @param {string} [props.reply_to] - The email address to reply to. Defaults to the from address.
 * @param {string} [props.tag_name] - The name of the tag.
 * @param {string} [props.tag_value] - The value of the tag.
 * @param {string} [props.preview] - The preview of the email (optional).
 * @param {object} [props.vars] - The variables to pass to the email template.
 * @returns {object} - The success or error message.
 */
export const useSendEmail = ({
  from,
  to,
  preview,
  subject,
  type,
  vars,
  text,
  reply_to,
  tag_name,
  tag_value,
}: SendEmailProps): Promise<{ success?: string; error?: string }> => {
  const sendEmail = async ({
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
  }: SendEmailProps) => {
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
          text: text,
          subject: subject,
        }),
        tags: [{ name: tag_name ?? "", value: tag_value ?? "" }],
      });
      if (!send) {
        throw new Error("An error has occured");
      } else if (send.error) {
        throw new Error(send.error.message);
      }
      return { success: send.data?.id };
    } catch (error) {
      console.error(error);
      return { error: getErrorMessage(error) };
    }
  };

  return sendEmail({
    from,
    to,
    preview,
    subject,
    type,
    vars,
    text,
    reply_to,
    tag_name,
    tag_value,
  });
};
