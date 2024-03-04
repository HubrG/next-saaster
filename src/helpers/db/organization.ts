"use server";
import { handleResponse } from "@/src/lib/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { iOrganization } from "@/src/types/iOrganization";
import { sendEmail } from "../emails/sendEmail";

type CreateOrganizationProps = {
  data: Omit<
    iOrganization,
    "members" | "owner" | "id" | "createdAt" | "updatedAt"
  >;
};
export const createOrganization = async ({
  data,
}: CreateOrganizationProps): Promise<{
  success?: boolean;
  data?: iOrganization;
  error?: string;
}> => {
  try {
    const organization = await prisma.organization.create({
      data: {
        name: data.name ?? "",
        ownerId: data.ownerId,
      },
      include: include,
    });

    if (!organization) throw new Error("No features found");
    const updateOwner = await prisma.user.update({
      where: { id: data.ownerId },
      data: {
        organizationId: organization.id,
      },
    });
    if (!updateOwner) throw new Error("No features found");
    return handleResponse<iOrganization>(organization);
  } catch (error) {
    return handleResponse<undefined>(undefined, error);
  }
};

export const getOrganization = async ({
  id,
}: {
  id: string;
}): Promise<{
  success?: boolean;
  data?: iOrganization;
  error?: string;
}> => {
  try {

    const organization = await prisma.organization.findUnique({
      where: { id: id },
      include: include,
    });
    if (!organization) throw new Error("No features found");
    return handleResponse<iOrganization>(organization);
  } catch (error) {
    return handleResponse<undefined>(undefined, error);
  }
};

export const inviteMemberToOrganization = async ({
  organizationId,
  email,
}: {
  organizationId: string;
  email: string;
}): Promise<{
  success?: boolean;
  data?: iOrganization;
  error?: string;
}> => {
  try {
    // We check if user is already invited
    const isInvited = await prisma.organizationInvitation.findFirst({
      where: {
        organizationId,
        email,
      },
    });
    if (isInvited) throw new Error("User is already invited");
    // We check if user is already a member of an organization
    const isMember = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (isMember && isMember.organizationId)
      throw new Error("User is already a member of an organization");
    // We create the invitation
    const create = await prisma.organizationInvitation.create({
      data: {
        organizationId,
        email,
      },
    });
    if (!create)
      throw new Error("An error occured while creating the invitation");
    // We return the organization for refresh
    const getOrganization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: include,
    });
    if (!getOrganization) throw new Error("No features found");
    // We send email to the user
    const name = getOrganization.name === "Organization name" ||
          getOrganization.name === ""
            ? getOrganization.owner.name + "'s"
            : getOrganization.name;
      await sendEmail({
        to: "hubrgiorgi@gmail.com",
        type: "inviteUserInOrganization",
        subject: `You have been invited to join the ${
          getOrganization.name === "Organization name" ||
          getOrganization.name === ""
            ? getOrganization.owner.name + "'s"
            : getOrganization.name
        } team`,
        vars: {
          inviteUserInOrganization: {
            organizationId: organizationId,
            email: email,
            name 
          },
        },
        tag_name: "category",
        tag_value: "invite_member_to_organisation",
      });
    return handleResponse<iOrganization>(getOrganization);
  } catch (error) {
    console.error(error);
    return handleResponse<undefined>(undefined, error);
  }
};

export const removePendingUser = async ({
  organizationId,
  email,
}: {
  organizationId: string;
  email: string;
}): Promise<{
  success?: boolean;
  data?: iOrganization;
  error?: string;
}> => {
  try {
    const organization = await prisma.organizationInvitation.deleteMany({
      where: {
        organizationId,
        email,
      },
    });
    if (!organization) throw new Error("No features found");
    const getOrganization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: include,
    });
    if (!getOrganization) throw new Error("No features found");
    return handleResponse<iOrganization>(getOrganization);
  } catch (error) {
    console.error(error);
    return handleResponse<undefined>(undefined, error);
  }
};

const include = {
  owner: true,
  members: true,
  organizationInvitations: true,
};
