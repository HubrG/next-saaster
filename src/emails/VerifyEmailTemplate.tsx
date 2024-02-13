"use client";
import { Button, Heading, Hr, Section, Text } from "@react-email/components";
import EmailWrapperTemplate from "./@ui/EmailWrapperTemplate";

export type verificationEmailTemplateProps = {
  verificationToken: string;
};
export default function VerifyEmailTemplate({
  verificationToken,
}: verificationEmailTemplateProps) {
  const uri = process.env.NEXT_PUBLIC_URI;
  return (
    <EmailWrapperTemplate preview="Verify your email">
      <Section>
        <Heading>Welcome to Saaster</Heading>
        <Hr />
        <Text>To verify your email click on the button bellow :</Text>
        <Button
          className="w-full p-5"
          href={`${uri}/register/verifyemail?token=${verificationToken}`}>
          Verify my email
        </Button>
      </Section>
    </EmailWrapperTemplate>
  );
}
