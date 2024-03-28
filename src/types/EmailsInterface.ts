export interface EmailsInterface {
  type: "inviteUserInOrganization" | "verifyEmail" | "forgotPassword" | "default";
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
      }
    | {
        forgotPassword: {
          verificationToken: string;
        };
      };
}
