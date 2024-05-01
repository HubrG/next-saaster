"use client";
import { PopoverConfirm } from "@/src/components/ui/@fairysaas/popover-confirm";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Button } from "@/src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import {
  removeUserFromOrganization,
  updateOrganization,
} from "@/src/helpers/db/organization.action";
import { ReturnUserDependencyProps } from "@/src/helpers/dependencies/user";
import { handleError } from "@/src/lib/error-handling/handleError";
import {
  Crown,
  GripVertical,
  UserRoundX,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";


type PopoverOrganizationMemberProps = {
  userInfo: ReturnUserDependencyProps | null;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  member: {
    email: string | null;
    id: string;
  };
};

export const PopoverOrganizationMember = ({
  userInfo,
  setRefresh,
  member,
}: PopoverOrganizationMemberProps) => {
   const t = useTranslations(
     "Dashboard.Components.Profile.Organization.UI.PopoverOrganizationMember"
   );
  const handleRemoveUser = async (email: string) => {
    const remove = await removeUserFromOrganization({
      email,
      organizationId: userInfo?.info.organizationId ?? "",
    });
    if (remove.serverError) {
      toaster({ type: "error", description: remove.serverError });
    } else {
      toaster({ type: "success", description: t('toasters.user-removed') });
      setRefresh(true);
    }
  };

  const handlePromoteUser = async (email: string) => {
    const promote = await updateOrganization({
      id: userInfo?.info.organizationId ?? "",
      owner: member.id,
    });
    if (handleError(promote).error) {
      return toaster({
        description: handleError(promote).message,
        type: "error",
      });
    }
    toaster({
      type: "success",
      description:
        t("toasters.user-promoted")
    });
    return setTimeout(() => {
      document.location.reload();
    }, 2000);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="mr-10">
          <GripVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <PopoverConfirm
              what={t("popover.promote-member")}
              handleFunction={() => {
                handlePromoteUser(member.email ?? "");
              }}
              icon={<Crown className="icon" />}
              display={t("popover.promote-member-display")}
              variant="default"
            />
          </div>
          <div className="grid gap-2">
            <PopoverConfirm
              what={t("popover.revoke-member")}
              handleFunction={() => {
                handleRemoveUser(member.email ?? "");
              }}
              icon={<UserRoundX className="icon" />}
              display={t("popover.revoke-member-display")}
              variant="default"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
