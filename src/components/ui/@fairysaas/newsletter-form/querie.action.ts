"use server";
import { getAudienceByName } from "@/src/helpers/emails/audience";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const addNewsletterEmail = async (email: string) => {
  // Get "Newsletter" audience
  const getAudience = await getAudienceByName("Newsletter");
  if (getAudience.error || !getAudience.data?.id) {
    return { success: false, message: "Audience does not exist" };
  }
  const contact = await resend.contacts.create({
    email: email,
    firstName: email.split("@")[0],
    unsubscribed: false,
    audienceId: getAudience.data?.id,
  });
  if (!contact.data || !contact.data.id) {
    return { success: false, message: "Contact creation failed" };
  } else {
    return { success: true, message: "Subscribed successfully" };
  }
};
