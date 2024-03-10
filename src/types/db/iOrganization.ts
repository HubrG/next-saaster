import { Organization, OrganizationInvitation, User } from "@prisma/client";

export interface iOrganization extends Organization {
  owner: User;
  members: User[];
  organizationInvitations?: OrganizationInvitation[] | null;
}
