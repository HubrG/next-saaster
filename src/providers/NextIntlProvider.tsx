"use client;";
import { NextIntlClientProvider, useLocale, useMessages } from "next-intl";

import React from "react";

type Props = {
  children: React.ReactNode;
};

export const NextIntlProvider = ({ children }: Props) => {
  const messages = useMessages();
  const locale = useLocale();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
};
