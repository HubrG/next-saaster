import { Heading, Hr, Section, Text } from "@react-email/components";
import { getTranslations } from "next-intl/server";
import { env } from "../lib/zodEnv";
import ButtonTemplate from "./@ui/ButtonTemplate";

export type NotificationTemplateProps = {
    vars: {
      content: string;
    title: string;
    actionUrl?: string;
    actionText?: string;
  };
};

export default async function NotificationTemplate({
  vars,
}: NotificationTemplateProps) {
  const t = await getTranslations();
  const uri = env.NEXT_PUBLIC_URI;
  return (
    <Section>
      <Heading>{t("Emails.NotificationTemplate.heading")}</Heading>
      <Hr />
          <Text>{vars.title}</Text>
          <Text>{vars.content}</Text>
      {vars.actionUrl && vars.actionText && (
        <ButtonTemplate
          uri={`${vars.actionUrl}`}
          text={vars.actionText}
        />
      )}
    </Section>
  );
}
