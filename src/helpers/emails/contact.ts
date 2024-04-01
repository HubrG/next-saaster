"use server";
import { prisma } from "@/src/lib/prisma";
import { ResendContact } from "@prisma/client";
import { Resend } from "resend";
import { getErrorMessage } from "../../lib/error-handling/getErrorMessage";
import { getAudience } from "./audience";
const resend = new Resend(process.env.RESEND_API_KEY);
interface ContactData {
  id: string;
}
type CreateContactProps = {
  email: string;
  last_name?: string;
  first_name: string;
  audienceId: string;
};
/**
 * This function creates a contact in the Resend API and saves the contact in the database.
 *
 * @param email
 * @param last_name (optional)
 * @param first_name
 * @param audienceId
 * @returns { success: datas, data: datas } | { error: string }
 *
 */
export const createContact = async ({
  email,
  last_name = "",
  first_name,
  audienceId,
}: CreateContactProps): Promise<{
  success?: boolean;
  data?: ContactData;
  error?: string;
}> => {
  try {
    const isAudienceExists = await getAudience(audienceId);
    if (isAudienceExists.error) {
      throw new Error("Audience ID does not exist");
    }
    const contact = await resend.contacts.create({
      email: email,
      firstName: last_name,
      lastName: first_name,
      unsubscribed: false,
      audienceId: audienceId,
    });
    if (!contact.data || !contact.data.id)
      throw new Error("Contact creation failed");

    // If contact exists on the audience, resend API will return the contact data. So we need to check if the contact exists in the database by his ID
    const isContactExist = await prisma.resendContact.findUnique({
      where: {
        id: contact.data?.id,
      },
    });
    if (isContactExist)
      throw new Error("This contact already exist in the audience");

    const isContactHasUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const createContact = await prisma.resendContact.create({
      data: {
        id: contact.data.id,
        email: email,
        firstName: first_name,
        lastName: last_name,
        unsubscribed: false,
        audienceId: audienceId,
        userId: isContactHasUser?.id ?? null,
      },
    });
    if (!createContact) throw new Error("Contact creation failed");
    return {
      success: true,
      data: contact.data,
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

/**
 * This function gets all contacts from the Resend API by audience ID.
 */
export const getContactsFromAudienceId = async (
  audienceId: string
): Promise<{
  success?: boolean;
  data?: {};
  error?: string;
}> => {
  try {
    const contacts = await resend.contacts.list({
      audienceId: audienceId,
    });
    if (contacts.error) throw new Error(contacts.error.message);
    if (!contacts.data) throw new Error("No contacts found");
    return {
      success: true,
      data: contacts.data,
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

type UpdateContactProps = {
  contactId: string;
  audienceId: string;
  last_name?: string;
};
/**
 * This function updates a contact in the Resend API and saves the contact in the database.
 * @param contactId
 * @param audienceId
 * @param last_name (optional)
 *
 */
export const updateContact = async ({
  contactId,
  audienceId,
  last_name,
}: UpdateContactProps): Promise<{
  success?: boolean;
  data?: {};
  error?: string;
}> => {
  try {
    const isContactExist = await prisma.resendContact.findUnique({
      where: {
        id: contactId,
      },
    });
    if (!isContactExist) throw new Error("Contact does not exist");

    const contact = await resend.contacts.update({
      id: contactId,
      audienceId: audienceId ?? isContactExist.audienceId ?? "",
      lastName: last_name ?? isContactExist.lastName ?? "",
    });
    if (contact.error) throw new Error(contact.error.message);

    const updateContact = await prisma.resendContact.update({
      where: {
        id: contactId,
      },
      data: {
        audienceId: audienceId,
        lastName: last_name,
      },
    });
    if (!updateContact) throw new Error("Contact update failed");

    return {
      success: true,
      data: contact.data ?? {},
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

/**
 * This function deletes a contact from the Resend API and the database.
 *
 * @param contactId
 * @param audienceId
 * @returns
 */
export const deleteContact = async (
  contactId: string,
  audienceId: string
): Promise<{
  success?: boolean;
  data?: string;
  error?: string;
}> => {
  try {
    const contact = await resend.contacts.remove({
      id: contactId,
      audienceId: audienceId,
    });
    if (contact.error) throw new Error(contact.error.message);

    const deleteContact = await prisma.resendContact.delete({
      where: {
        id: contactId,
      },
    });
    if (!deleteContact) throw new Error("Contact delete failed");
    return { success: true, data: `Contact ${contactId} deleted` };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

/**
 * This function gets a contact from the Resend API by contact ID.
 * @param contactId
 * @param audienceId
 * @returns
 */
export const getContact = async (
  contactId: string,
  audienceId: string
): Promise<{
  success?: boolean;
  data?: {};
  error?: string;
}> => {
  try {
    const contact = await resend.contacts.get({
      id: contactId,
      audienceId: audienceId,
    });
    if (contact.error) throw new Error(contact.error.message);
    if (!contact.data) throw new Error("Contact not found");
    return {
      success: true,
      data: contact.data,
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const getContactByUserEmail = async(
  email: string,
  audienceId: string
): Promise<{
  success?: boolean;
  data?: {};
  error?: string;
}> => {
  try {
    const contact = await prisma.resendContact.findFirst({
      where: {
        email: email,
        audienceId: audienceId,
      },
    });
    if (!contact) throw new Error("Contact not found");
    return {
      success: true,
      data: contact as ResendContact,
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
