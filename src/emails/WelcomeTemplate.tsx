import { Heading, Hr, Section, Text } from "@react-email/components";

export default function WelcomeTemplate() {
  return (
      <Section>
        <Heading>Welcome to Saaster</Heading>
        <Hr />
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti
          totam odio ad possimus sit odit harum ipsam, iusto id praesentium
          fugit suscipit dicta minus culpa pariatur dolore hic eligendi quos!
          <br />
          <br />
          Sit ea maxime optio dolorem commodi ullam omnis animi, et
          necessitatibus ipsum? Cupiditate, eligendi velit nobis id earum at
          unde, rerum recusandae accusamus iusto quos ducimus, ipsam inventore
          laboriosam est.
        </Text>
      </Section>
  );
}
