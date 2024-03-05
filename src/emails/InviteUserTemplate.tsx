import { Button, Heading, Hr, Section, Text } from "@react-email/components";

export type InviteUserTemplateProps = {
   vars: {
    organizationId: string;
    email: string;
    name:string;
  };
};
export default function InviteUserTemplate({
  vars,
}: InviteUserTemplateProps) {
  const uri = process.env.NEXT_PUBLIC_URI;
  return (
    <Section>
      <Heading>You have been invited to join the {vars.name} team</Heading>
      <Hr />
      <Text>To accept the invitation, click here :</Text>
      <Button
        className="w-full p-5"
        href={`${uri}/register/teamInvitation?organizationId=${vars.organizationId}&email=${vars.email}`}>
        Verify my email
      </Button>
    </Section>
  );
}
