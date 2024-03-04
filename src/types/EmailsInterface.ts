export interface EmailsInterface {
  type: "inviteUserInOrganization" | "verifyEmail" | "default";
  vars:
    | {
        inviteUserInOrganization: {
          organizationId: string;
          email: string;
          name: string;
        };
      }
    | {
        verifyEmail: {
          verificationToken: string;
        };
      };
}
