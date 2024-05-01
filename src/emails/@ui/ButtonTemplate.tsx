import { Button, Tailwind } from "@react-email/components";

type ButtonTemplateProps = {
  uri: string;
  text: string;
};

export default function ButtonTemplate({
  uri,
  text,
}: ButtonTemplateProps) {
  return (
    <Tailwind>
      <Button
        className="w-full p-2 bg-blue-800 text-white text-base font-bold text-center rounded"
        href={uri}>
        {text}
      </Button>
    </Tailwind>
  );
}
