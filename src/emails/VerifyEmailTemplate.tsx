import { Heading, Hr, Section, Text } from "@react-email/components";
import { getTranslations } from "next-intl/server";
import { env } from "../lib/zodEnv";
import ButtonTemplate from "./@ui/ButtonTemplate";

export type verificationEmailTemplateProps = {
  vars: {
    verificationToken: string;
  };
};
export default async function VerifyEmailTemplate({
  vars,
}: verificationEmailTemplateProps) {
  const uri = env.NEXT_PUBLIC_URI;
  const t = await getTranslations();

  return (
    <Section>
      <Heading>{t("Emails.VerifyEmailTemplate.heading")}</Heading>
      <Hr />
      <Text>{t("Emails.VerifyEmailTemplate.text")}</Text>
      <ButtonTemplate
        uri={`${uri}/register/verifyemail?token=${vars.verificationToken}`}
        text={t("Emails.VerifyEmailTemplate.verifyEmail")}
      />
    </Section>
  );
}
