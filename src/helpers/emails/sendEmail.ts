"use server";
import { Resend } from "resend";
import { getErrorMessage } from "../../lib/getErrorMessage";
const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailProps = {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  react_template?: string;
  reply_to?: string;
  tag_name?: string | undefined;
  tag_value?: string | undefined;
};
/**
 * This function sends an email using the Resend API.
 */
export const sendEmail = async ({
  from = process.env.RESEND_FROM ?? "onboarding@resend.dev",
  reply_to = process.env.RESEND_REPLY_TO ?? "",
  to,
  subject,
  text,
  react_template,
  tag_name = "",
  tag_value = "",
}: SendEmailProps): Promise<{ success?: string; error?: string }> => {
  if (!to || !subject || (!text && !react_template))
    throw new Error(
      "Missing required fields: to, subject, and either text or react_template must be provided."
    );

  try {
    const send = await resend.emails.send({
      from: from,
      to: [to],
      subject: subject,
      reply_to: reply_to,
      text:
        text ?? react_template
          ? react_template?.replace(/(<([^>]+)>)/gi, "")
          : "",
      html: react_template ?? "",
      tags: [{ name: tag_name, value: tag_value }],
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
