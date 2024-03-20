"use server";
import { StripeManager } from "@/app/[locale]/admin/classes/stripeManager";
import {
  HandleResponseProps,
  handleRes,
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { ActionError, action, authAction } from "@/src/lib/safe-actions";
import { iOrganization } from "@/src/types/db/iOrganization";
import { z } from "zod";
import { sendEmail } from "../emails/sendEmail";
import { isOrganizationOwner } from "../functions/isUserRole";
import {
  chosenSecret,
  verifySecretRequest,
} from "../functions/verifySecretRequest";
const stripeManager = new StripeManager();

/**
 * Create an organization
 * - Only users who are not already in an organization can create an organization
 * - The user must be connected
 * - The user will be the owner of the organization
 * @param name - The name of the organization
 * @param ownerId - The id of the user who will be the owner of the organization
 * @returns The organization
 * @throws An error
 * - If the user is already a member of an organization
 * - If the user is not found
 * - If an error occured while creating the organization
 * - If the user is not connected
 */
export const createOrganization = authAction(
  z.object({
    name: z.string().optional(),
    ownerId: z.string().cuid(),
  }),
  async ({ name, ownerId }): Promise<HandleResponseProps<iOrganization>> => {
    try {
      // We check if the user is already a member of an organization
      const user = await prisma.user.findFirst({
        where: {
          id: ownerId,
        },
      });
      if (!user) throw new ActionError("No user found");
      if (user.organizationId)
        throw new ActionError("User is already a member of an organization");
      //
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
      return handleRes<iOrganization>({
        success: organization,
        statusCode: 200,
      });
    } catch (ActionError) {
      return handleRes<iOrganization>({ error: ActionError, statusCode: 500 });
    }
  }
);

/**
 * Get an organization
 * @param id - The id of the organization
 * @param secret - The secret internal key
 * @returns The organization
 * @throws An error
 * - If the organization is not found
 * - If the secret is not valid
 * - If an error occured while getting the organization
 * - If the user is not authorized to get the organization
 *
 */
export const getOrganization = action(
  z.object({
    id: z.string().cuid(),
    secret: z.string(),
  }),
  async ({ id, secret }): Promise<HandleResponseProps<iOrganization>> => {
    if (!verifySecretRequest(secret)) throw new ActionError("Unauthorized");
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

export const updateOrganization = authAction(
  z.object({
    id: z.string().cuid(),
    name: z.string().optional(),
    owner: z.string().optional(),
  }),
  async ({ name, owner, id }): Promise<HandleResponseProps<iOrganization>> => {
    const isOwner = await isOrganizationOwner();
    if (!isOwner)
      throw new ActionError(
        "You are not authorized to update this organization"
      );
    try {
      const organization = await prisma.organization.update({
        where: { id },
        data: {
          name,
          ownerId: owner,
        },
        include: include,
      });
      if (!organization) throw new ActionError("No organization found");
      return handleRes<iOrganization>({
        success: organization,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iOrganization>({ error: ActionError, statusCode: 500 });
    }
  }
);

/**
 * Invite a user to an organization
 * - Only the owner of the organization can invite a user
 * - The user must be connected
 * - The user must be the owner of the organization
 * @param organizationId - The id of the organization
 * @param email - The email of the user to invite
 * @returns The organization
 * @throws An error
 * - If the user is not authorized to invite a user to the organization
 * - If the user is already invited
 * - If the user is already a member of an organization
 * - If an error occured while creating the invitation
 */
export const inviteMemberToOrganization = authAction(
  z.object({
    organizationId: z.string().cuid(),
    email: z.string().email(),
  }),
  async ({
    organizationId,
    email,
  }): Promise<HandleResponseProps<iOrganization>> => {
    // 🔐 Security - Only the owner of the organization can invite a user
    const isOwner = await isOrganizationOwner();
    if (!isOwner)
      throw new ActionError(
        "You are not authorized to invite a user to this organization"
      );
    // 🔓 Unlocked
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
        to: email,
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
      return handleRes<iOrganization>({
        success: getOrganization,
        statusCode: 200,
      });
    } catch (ActionError) {
      return handleRes<iOrganization>({ error: ActionError, statusCode: 500 });
    }
  }
);

/**
 * Remove a pending user from an organization
 * - Only the owner of the organization or the user invited can remove a pending user
 * @param organizationId - The id of the organization
 * @param email - The email of the user to remove
 * @param secret - The secret internal key
 * @returns The organization
 */
export const removePendingUser = action(
  z.object({
    organizationId: z.string().cuid(),
    email: z.string().email(),
    secret: z.string().optional(),
  }),
  async ({
    organizationId,
    email,
    secret,
  }): Promise<HandleResponseProps<iOrganization>> => {
    // 🔐 Security - If internal secret has been sent, we verify if it's the right one (for internal use only)
    if (secret && !verifySecretRequest(secret)) {
      return handleRes<iOrganization>({
        error: new ActionError("Unauthorized"),
        statusCode: 401,
      });
      // If no secret has been sent, we verify if the user is the owner of the organization
    } else if (!secret) {
      const isOwner = await isOrganizationOwner();
      if (!isOwner) throw new ActionError("Not authorized");
    }
    // 🔓 Unlocked
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
        secret: chosenSecret(),
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

/**
 * Accept an invitation to an organization
 * - The user must have received an invitation
 * @param organizationId - The id of the organization
 * @param email - The email of the user to remove
 * @param secret - The secret internal key
 * @returns The organization
 */
export const acceptInvitationToOrganization = action(
  z.object({
    organizationId: z.string().cuid(),
    email: z.string().email(),
    secret: z.string(),
  }),
  async ({
    organizationId,
    email,
    secret,
  }): Promise<HandleResponseProps<iOrganization>> => {
    if (!verifySecretRequest(secret)) throw new ActionError("Unauthorized");
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
      return handleRes<iOrganization>({
        success: get,
        statusCode: 200,
      });
    } catch (ActionError) {
      return handleRes<iOrganization>({ error: ActionError, statusCode: 500 });
    }
  }
);

export const deleteOrganization = authAction(
  z.object({
    id: z.string().cuid(),
  }),
  async ({ id }): Promise<HandleResponseProps<iOrganization>> => {
    const isOwner = await isOrganizationOwner();
    if (!isOwner)
      throw new ActionError("You are not authorized to delete this organization");
    try {
      // We get the organization
      const organization = await prisma.organization.findUnique({
        where: { id },
        include,
      });
      if (!organization) throw new ActionError("No organization found");
      // We check the subscription through userSubscription
      const userSubscription = await prisma.userSubscription.findFirst({
        where: { userId: organization.ownerId },
        orderBy: { createdAt: "desc" },
      });
      // We pass the stripe quantity to 1
      if (userSubscription?.isActive) {
        const upSub = await stripeManager.updateSubscription({
          subscriptionId: userSubscription.subscriptionId,
          data: {
            quantity: 1,
          },
        });
        if (!upSub.success) throw new ActionError("Error while updating subscription");
      }
      // We delete users from userSubscription
      const deleteUsersFromSubscription = await prisma.userSubscription.deleteMany({
        where: {
          userId: { not: organization.ownerId },
          subscriptionId: userSubscription?.subscriptionId,
        },
      });
      if (!deleteUsersFromSubscription)
        throw new ActionError("Error while deleting users from subscription");
      // We delete the organization
      const deleteOrganization = await prisma.organization.delete({
        where: { id },
        include,
      });
      if (!deleteOrganization) throw new ActionError("Error while deleting organization");
      // We get the organization
      return handleRes<iOrganization>({
        success: deleteOrganization,
        statusCode: 200,
      });
    } catch (ActionError) {
      return handleRes<iOrganization>({ error: ActionError, statusCode: 500 });
    }
  }
);

/**
 * Add a user to an organization
 * - The user must be connected
 * - Only the owner of the organization can add a user to the organization
 * @param organizationId - The id of the organization
 * @param email - The email of the user to remove
 * @returns The organization
 * @throws An error
 * - If the user is not authorized to add a user to the organization
 * - If the user is not found
 * - If the user is already a member of an organization
 * - If an error occured while adding the user to the organization
 */
export const removeUserFromOrganization = authAction(
  z.object({
    organizationId: z.string().cuid(),
    email: z.string().email(),
  }),
  async ({
    organizationId,
    email,
  }, {userSession}): Promise<HandleResponseProps<iOrganization>> => {
    const isOwner = await isOrganizationOwner();
    console.log(email, userSession?.user.email);
    // We verify if the email user is member of the organization
    if (!isOwner && userSession?.user.email !== email)
      throw new ActionError(
        "You are not authorized to remove a user from this organization"
      );
    try {
      // We get the user
      const getUser = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      if (!getUser) throw new ActionError("No user found");
      // We check the subscription through userSubscription
      const userSubscription = await prisma.userSubscription.findFirst({
        where: { userId: getUser.id },
        orderBy: { createdAt: "desc" },
      });
      // We delete the user from the organization
      const user = await prisma.user.update({
        where: {
          email,
        },
        data: {
          organizationId: null,
        },
      });
      //
      if (!user) throw new ActionError("User not found");
      // We count the number of members in the organization
      const users = await prisma.user.count({
        where: { organizationId },
      });
      if (!users) throw new ActionError("No user found");
      // We delete the userSubscription
      const organization = await prisma.userSubscription.deleteMany({
        where: {
          userId: user.id,
        },
      });
      if (!organization) throw new ActionError("No user subscription found");
      // We update the quantity in Stripe, only if subscription is active
      if (userSubscription?.isActive) {
        const upSub = await stripeManager.updateSubscription({
          subscriptionId: userSubscription.subscriptionId,
          data: {
            quantity: users,
          },
        });
        if (!upSub.success) {
          // We add user again
          await prisma.user.update({
            where: { id: user.id },
            data: {
              organizationId: organizationId,
            },
          });
          if (!organization)
            throw new ActionError("Error while updating subscription");
          // We add userSubscription again
          await prisma.userSubscription.create({
            data: {
              userId: user.id,
              subscriptionId: userSubscription.subscriptionId,
              isActive: userSubscription.isActive,
            },
          });
          throw new ActionError("Error while updating subscription");
        }
      }
      const newOrganization = await prisma.organization.findUnique({
        where: { id: organizationId },
        include,
      });
      if (!newOrganization) throw new ActionError("No organization found");
      return handleRes<iOrganization>({
        success: newOrganization,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError)
      return handleRes<iOrganization>({ error: ActionError, statusCode: 500 });
    }
  }
);

const include = {
  owner: true,
  members: true,
  organizationInvitations: true,
};
