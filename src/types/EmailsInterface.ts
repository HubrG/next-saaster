export interface EmailsInterface {
  type:
    | "inviteUserInOrganization"
    | "verifyEmail"
    | "forgotPassword"
    | "default"
    | "notification";
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
      }
    | {
    notification: {
          content: string;
          title: string;
          actionUrl?: string;
          actionText?: string;
        };
      };
}
