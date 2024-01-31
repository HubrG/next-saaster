import { unstable_setRequestLocale } from "next-intl/server";

export default async function Pricing({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  return <div>ffff</div>;
}
