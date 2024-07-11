import { Heading, Hr, Section, Text } from "@react-email/components";
import { getTranslations } from "next-intl/server";
import { env } from "../lib/zodEnv";
import ButtonTemplate from "./@ui/ButtonTemplate";

export type ForgotPasswordTemplateProps = {
  vars: {
    verificationToken: string;
  };
};
export default async function ForgotPasswordTemplate({
  vars,
}: ForgotPasswordTemplateProps) {
  const t = await getTranslations();
  const uri = env.NEXT_PUBLIC_URI;
  return (
    <Section>
      <Heading>{t("Emails.ForgotPasswordTemplate.heading")}</Heading>
      <Hr />
      <Text>{t("Emails.ForgotPasswordTemplate.text")}</Text>
      <ButtonTemplate
        uri={`${uri}/forgot-password?token=${vars.verificationToken}`}
        text={t("Emails.ForgotPasswordTemplate.resetPassword")}
      />
    </Section>
  );
}
