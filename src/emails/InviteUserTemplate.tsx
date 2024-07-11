import { Heading, Hr, Section, Text } from "@react-email/components";
import { getTranslations } from "next-intl/server";
import { env } from "../lib/zodEnv";
import ButtonTemplate from "./@ui/ButtonTemplate";
export type InviteUserTemplateProps = {
  vars: {
    organizationId: string;
    email: string;
    name: string;
  };
};
export default async function InviteUserTemplate({
  vars,
}: InviteUserTemplateProps) {
  const uri = env.NEXT_PUBLIC_URI;
  const t = await getTranslations();

  return (
    <Section>
      <Heading>
        {t("Emails.InviteUserTemplate.heading", {
          varIntlTeamName: vars.name,
        })}
      </Heading>
      <Hr />
      <Text>{t("Emails.InviteUserTemplate.text")}</Text>
      <ButtonTemplate
        uri={`${uri}/register/teamInvitation?organizationId=${vars.organizationId}&email=${vars.email}`}
        text={t("Emails.InviteUserTemplate.buttonText")}
      />
    </Section>
  );
}
