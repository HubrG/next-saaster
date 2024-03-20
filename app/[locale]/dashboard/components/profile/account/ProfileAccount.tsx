"use client";

import { Button } from "@/src/components/ui/button";
import { PopoverConfirm } from "@/src/components/ui/popover-confirm";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";

type ProfileAccountProps = {
}

export const ProfileAccount = ({}: ProfileAccountProps) => {
  return (
    <Button variant={"link"} className="w-full">
      <PopoverConfirm
        handleFunction={() => { 
          console.log('delete account')
          toaster({ type: "success", description: "Account deleted"})
        }}
        display="Delete account"
        what={"to delete your account? This action cannot be undone."}
        />
      </Button>
  )
}
