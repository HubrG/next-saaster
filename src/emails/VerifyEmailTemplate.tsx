import { Button, Heading, Hr, Section, Text } from "@react-email/components";

export type verificationEmailTemplateProps = {
  vars: {
    verificationToken: string;
  };
};
export default function VerifyEmailTemplate({ vars }: verificationEmailTemplateProps) {
  const uri = process.env.NEXT_PUBLIC_URI;
  return (
      <Section>
        <Heading>Welcome to Saaster</Heading>
        <Hr />
        <Text>To verify your email click on the button bellow :</Text>
        <Button
          className="w-full p-5"
          href={`${uri}/register/verifyemail?token=${vars.verificationToken}`}>
          Verify my email
        </Button>
      </Section>
  );
}
