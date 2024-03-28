import { Button, Heading, Hr, Section, Text } from "@react-email/components";

export type ForgotPasswordTemplateProps = {
  vars: {
    verificationToken: string;
  };
};
export default function ForgotPasswordTemplate({ vars }: ForgotPasswordTemplateProps) {
  const uri = process.env.NEXT_PUBLIC_URI;
  return (
    <Section>
      <Heading>Reset your password</Heading>
      <Hr />
      <Text>
        You requested to reset your password. To reset your password, click the button below.
      </Text>
      <Button
        className="w-full p-5"
        href={`${uri}/forgot-password?token=${vars.verificationToken}`}>
        Reset password
      </Button>
    </Section>
  );
}
