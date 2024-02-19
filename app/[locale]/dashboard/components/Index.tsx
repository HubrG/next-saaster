"use client";

import { Button } from "@/src/components/ui/button";

export const Index = () => {
  const handleSendEmail = async () => {
    // const test = await updateContact({
    //   email: "hubrgiorgi@gmail.com",
    //   first_name: "Giorgi",
    //   audienceId: "69aaabca-ec79-4e44-ac99-192c562bff13",
    // });
    // if (test.error) {
    //   toaster({ type: "error", description: test.error });
    // } else {
    //   toaster({ type: "success", description: test.success });
    // }
  };
  return (
    <div>
      <Button onClick={handleSendEmail}>Click email</Button>
    </div>
  );
};
