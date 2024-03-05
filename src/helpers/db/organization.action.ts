"use server";
import {
  HandleResponseProps,
  handleRes,
  handleResponse,
} from "@/src/lib/error-handling/handleResponse";
import { authOptions } from "@/src/lib/next-auth/auth";
import { prisma } from "@/src/lib/prisma";
import { ActionError, action, authAction } from "@/src/lib/safe-actions";
import { iOrganization } from "@/src/types/iOrganization";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { sendEmail } from "../emails/sendEmail";
import {
  isConnected,
  isMe,
  isOrganizationOwner,
  isSuperAdmin,
} from "../functions/isUserRole";

export const createOrganization = authAction(
  z.object({
    name: z.string().optional(),
    ownerId: z.string().cuid(),
  }),
  async ({
    name,
    ownerId,
  }): Promise<{
    success?: boolean;
    data?: iOrganization;
    error?: string;
  }> => {
    try {
      const organization = await prisma.organization.create({
        data: {
          name: name ?? "",
          ownerId: ownerId,
        },
        include: include,
      });

      if (!organization)
        throw new ActionError(
          "An error occured while creating the organization"
        );
      const updateOwner = await prisma.user.update({
        where: { id: ownerId },
        data: {
          organizationId: organization.id,
        },
      });
      if (!updateOwner) throw new ActionError("No user found");
      return handleResponse<iOrganization>(organization);
    } catch (ActionError) {
      return handleResponse<undefined>(undefined, ActionError);
    }
  }
);

export const getOrganization = action(
  z.object({
    id: z.string().cuid(),
  }),
  async ({ id }): Promise<HandleResponseProps<iOrganization>> => {
    try {
      const organization = await prisma.organization.findUnique({
        where: { id },
        include: include,
      });
      if (!organization) {
        throw new ActionError("No organization found");
      }
      return handleRes<iOrganization>({
        success: organization,
        statusCode: 200,
      });
    } catch (ActionError) {
      return handleRes<iOrganization>({ error: ActionError, statusCode: 500 });
    }
  }
);

export const inviteMemberToOrganization = action(
  z.object({
    organizationId: z.string().cuid(),
    email: z.string().email(),
  }),
  async ({
    organizationId,
    email,
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
      if (isInvited) throw new ActionError("User is already invited");
      // We check if user is already a member of an organization
      const isMember = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      if (isMember && isMember.organizationId)
        throw new ActionError("User is already a member of an organization");
      // We create the invitation
      const create = await prisma.organizationInvitation.create({
        data: {
          organizationId,
          email,
        },
      });
      if (!create)
        throw new ActionError("An error occured while creating the invitation");
      // We return the organization for refresh
      const getOrganization = await prisma.organization.findUnique({
        where: { id: organizationId },
        include: include,
      });
      if (!getOrganization) throw new ActionError("No features found");
      // We send email to the user
      const name =
        getOrganization.name === "Organization name" ||
        getOrganization.name === ""
          ? getOrganization.owner.name + "'s"
          : getOrganization.name;
      const sendmail = await sendEmail({
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
            name,
          },
        },
        tag_name: "category",
        tag_value: "invite_member_to_organisation",
      });
      if (sendmail.error) {
        throw new ActionError(sendmail.error);
      }
      return handleResponse<iOrganization>(getOrganization);
    } catch (ActionError) {
      return handleResponse<undefined>(undefined, ActionError);
    }
  }
);

export const removePendingUser = action(
  z.object({
    organizationId: z.string().cuid(),
    email: z.string().email(),
    stripeSignature: z.string().optional(),
  }),
  async ({
    organizationId,
    email,
    stripeSignature,
  }): Promise<HandleResponseProps<iOrganization>> => {
    const isAuthorized = await authorize({
      email,
      stripeSignature,
    });
    const isOwner = await isOrganizationOwner(organizationId);
    const session = getServerSession(authOptions);
    if (!isAuthorized && !isOwner && !session)
      throw new ActionError("Not authorized");
    try {
      const organization = await prisma.organizationInvitation.deleteMany({
        where: {
          organizationId,
          email,
        },
      });
      if (!organization) throw new ActionError("Delete failed");
      const retrieveOrganization = await getOrganization({
        id: organizationId,
      });
      if (!retrieveOrganization) throw new ActionError("No organization found");
      return handleRes<iOrganization>({
        success: retrieveOrganization.data?.success,
        statusCode: 200,
      });
    } catch (ActionError) {
      return handleRes<iOrganization>({ error: ActionError, statusCode: 500 });
    }
  }
);

export const acceptInvitationToOrganization = action(
  z.object({
    organizationId: z.string().cuid(),
    email: z.string().email(),
  }),
  async ({
    organizationId,
    email,
  }): Promise<{
    success?: boolean;
    data?: iOrganization;
    error?: string;
    serverError?: string;
  }> => {
    try {
      const organization = await prisma.organizationInvitation.findFirst({
        where: {
          organizationId: organizationId,
          email: email,
        },
      });
      if (!organization) throw new ActionError("No user found");
      const update = await prisma.organizationInvitation.update({
        where: { id: organization.id },
        data: {
          isAccepted: true,
        },
      });
      if (!update) throw new ActionError("No invitation found");
      const get = await prisma.organization.findUnique({
        where: { id: organizationId },
        include: include,
      });
      if (!get) throw new ActionError("No organization found");
      return handleResponse<iOrganization>(get);
    } catch (ActionError) {
      return handleResponse<undefined>(undefined, ActionError);
    }
  }
);

export const removeUserFromOrganization = action(
  z.object({
    organizationId: z.string().cuid(),
    email: z.string().email(),
  }),
  async ({
    organizationId,
    email,
  }: {
    organizationId: string;
    email: string;
  }): Promise<{
    success?: boolean;
    data?: iOrganization | undefined;
    error?: string;
  }> => {
    try {
      const user = await prisma.user.update({
        where: {
          email,
        },
        data: {
          organizationId: null,
        },
        include: {
          subscriptions: {
            include: {
              subscription: true,
            },
          },
        },
      });
      if (!user) throw new ActionError("User not found");
      const organization = await prisma.userSubscription.updateMany({
        where: {
          userId: user.id,
        },
        data: {
          isActive: false,
        },
      });
      if (!organization) throw new ActionError("No user subscription found");
      const newOrganization = await prisma.organization.findUnique({
        where: { id: organizationId },
        include: include,
      });
      if (!newOrganization) throw new ActionError("No organization found");
      return handleResponse<iOrganization>(newOrganization);
    } catch (ActionError) {
      return handleResponse<undefined>(undefined, ActionError);
    }
  }
);

const include = {
  owner: true,
  members: true,
  organizationInvitations: true,
};

// SECTION AUTHORIZE
type AuthorizeProps = {
  email?: string;
  stripeSignature?: string | undefined;
  internalSignature?: string | undefined;
};
async function authorize({
  email,
  internalSignature,
  stripeSignature,
}: AuthorizeProps): Promise<boolean> {
  const isSuperAdminFlag = await isSuperAdmin();

  const isAuth = await isConnected();

  let isUserFlag = true;
  if (email) {
    isUserFlag = await isMe(email);
  }

  let isInternalValid = false;
  if (internalSignature) {
    isInternalValid = verifyInternalRequest(internalSignature);
  }

  let isStripeValid = false;
  if (stripeSignature) {
    isStripeValid = verifyStripeRequest(stripeSignature);
  }

  return (
    isSuperAdminFlag || isUserFlag || isStripeValid || isInternalValid || isAuth
  );
}

function verifyStripeRequest(stripeSignature: string) {
  return stripeSignature === process.env.STRIPE_WEBHOOK_SECRET;
}
function verifyInternalRequest(internalSignature: string) {
  return internalSignature === process.env.NEXTAUTH_SECRET;
}
