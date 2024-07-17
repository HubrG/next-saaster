import { Hr, Text } from "@react-email/components";

export default function EmailFooterTemplate() {
  return (
    <>
      <Hr />
      <Text className="text-xs opacity-50">
        {process.env.NEXT_PUBLIC_APP_NAME} - all right reserved
      </Text>
    </>
  );
}
