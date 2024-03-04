"use server";
import {
  createOrganization,
  inviteMemberToOrganization,
  removePendingUser,
} from "@/src/helpers/db/organization";
import { handleResponse } from "@/src/lib/handleResponse";
import { iOrganization } from "@/src/types/iOrganization";

type AddOrganizationProps = {
  ownerId: string;
};
export const addOrganization = async ({
  ownerId,
}: AddOrganizationProps): Promise<{
  success?: boolean;
  data?: iOrganization;
  error?: string;
}> => {
  try {
    const create = await createOrganization({
      data: {
        name: "",
        ownerId: ownerId,
      },
    });
    if (!create) throw new Error("No organization found");
    return handleResponse<iOrganization>(create as iOrganization);
  } catch (error) {
    return handleResponse<undefined>(undefined, error);
  }
};

export const inviteMember = async ({
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
    const organization = await inviteMemberToOrganization({
      organizationId,
      email,
    });
    if (organization.error) throw new Error(organization.error);
    return handleResponse<iOrganization>(
      organization.data as iOrganization
    );
  } catch (error) { 
    return handleResponse<undefined>(undefined, error);
  }
};


export const removePendingMember = async({
  organizationId,
  email
}: {
  organizationId: string;
  email: string;
}): Promise<{
  success?: boolean;
  data?: iOrganization;
  error?: string;
}> => {
  try {
    const organization = await removePendingUser({
      organizationId,
      email,
    });
    if (organization.error) throw new Error(organization.error);
    return handleResponse<iOrganization>(
      organization.data as iOrganization
    );
  } catch (error) { 
    return handleResponse<undefined>(undefined, error);
  }
}