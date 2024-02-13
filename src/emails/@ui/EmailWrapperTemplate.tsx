import {
  Body,
  Container,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import React from "react";
import EmailFooterTemplate from "./EmailFooterTemplate";

type Props = {
  children: React.ReactNode;
  preview: string;
};
export default function EmailWrapperTemplate({ children, preview }: Props) {
  return (
    <Html>
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body>
          <Container>{children}</Container>
          <EmailFooterTemplate />
        </Body>
      </Tailwind>
    </Html>
  );
}
