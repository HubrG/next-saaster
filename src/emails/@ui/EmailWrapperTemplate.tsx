import InviteUserTemplate from "@/src/emails/InviteUserTemplate";
import { EmailsInterface } from "@/src/types/EmailsInterface";
import {
  Body,
  Container,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";
import ForgotPasswordTemplate from "../ForgotPasswordTemplate";
import NotificationTemplate from "../NotificationTemplate";
import VerifyEmailTemplate from "../VerifyEmailTemplate";
import EmailFooterTemplate from "./EmailFooterTemplate";

type Props = {
  preview?: string;
  type?: EmailsInterface["type"];
  vars?: EmailsInterface["vars"];
  text?: string;
  subject?: string;
};
export default function EmailWrapperTemplate({
  preview,
  text,
  type,
  vars,
  subject,
}: Props) {
  return (
    <Html>
      {preview && <Preview>{preview}</Preview>}
      <Tailwind>
        <Body>
          <Container>
            {type === "inviteUserInOrganization" &&
              vars &&
              "inviteUserInOrganization" in vars && (
                <InviteUserTemplate vars={vars.inviteUserInOrganization} />
              )}
            {type === "verifyEmail" && vars && "verifyEmail" in vars && (
              <VerifyEmailTemplate vars={vars.verifyEmail} />
            )}
            {type === "forgotPassword" && vars && "forgotPassword" in vars && (
              <ForgotPasswordTemplate vars={vars.forgotPassword} />
            )}
            {type === "notification" && vars && "notification" in vars && (
              <NotificationTemplate vars={vars.notification} />
            )}
            {!type && text && (
              <>
                {subject && (
                  <>
                    <Heading>{subject}</Heading>
                    <Hr />
                  </>
                )}
                <Text>{text}</Text>
              </>
            )}

          </Container>
          <EmailFooterTemplate />
        </Body>
      </Tailwind>
    </Html>
  );
}
