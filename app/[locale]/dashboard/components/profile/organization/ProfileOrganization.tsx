"use client";

import { Button } from "@/src/components/ui/button";
import { Loader } from "@/src/components/ui/loader";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import {
  createOrganization,
  deleteOrganization,
  removePendingUser,
  removeUserFromOrganization,
} from "@/src/helpers/db/organization.action";
import { ReturnProps, getUserInfos } from "@/src/helpers/dependencies/user";
import { sliced } from "@/src/helpers/functions/slice";
import { cn } from "@/src/lib/utils";
import { useOrganizationStore } from "@/src/stores/organizationStore";
import { useUserStore } from "@/src/stores/userStore";
import { Crown, Hourglass, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { InviteMember } from "./@ui/InviteMember";
import { OrganizationName } from "./@ui/OrganizationName";
import { Tooltip } from "react-tooltip";
import { PopoverDelete } from "@/src/components/ui/popover-delete";
import { PopoverOrganizationMember } from "./@ui/PopoverMember";
import { PopoverConfirm } from "@/src/components/ui/popover-confirm";
import { handleError } from "@/src/lib/error-handling/handleError";
import { ActionError } from "@/src/lib/safe-actions";
import { Goodline } from "@/src/components/ui/@aceternity/good-line";

type ProfileOrganizationProps = {};

export const ProfileOrganization = ({}: ProfileOrganizationProps) => {
  const { organizationStore, fetchOrganizationStore } = useOrganizationStore();
  const { userStore, isStoreLoading, fetchUserStore } = useUserStore();
  const [userInfo, setUserInfo] = useState<ReturnProps | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (!isStoreLoading) {
      setUserInfo(getUserInfos({ user: userStore }));
      setRefresh(false);
    }
  }, [userStore, refresh, isLoading, isStoreLoading]);

  useEffect(() => {
    if (userInfo?.userInfo.organization && !userInfo?.isLoading) {
      fetchOrganizationStore(userInfo.userInfo.organizationId ?? "");
    }
  }, [userInfo, fetchOrganizationStore]);

  if (!userInfo || userInfo?.isLoading) {
    return <Loader noHFull />;
  }

  const handleCreateOrganization = async (id: string, email: string) => {
    const create = await createOrganization({ ownerId: id });
    if (create.serverError) {
      toaster({ type: "error", description: create.serverError });
    } else {
      toaster({ type: "success", description: "Organization created" });
      fetchUserStore(email);
      setRefresh(true);
    }
  };

  const handleRemovePending = async (email: string) => {
    const remove = await removePendingUser({
      organizationId: userInfo.userInfo.organizationId ?? "",
      email,
    });
    if (remove.serverError) {
      toaster({ type: "error", description: remove.serverError });
    } else {
      toaster({ type: "success", description: "Pending user removed" });
      setRefresh(true);
    }
  };

  const handleQuitOrganization = async () => {
    const remove = await removeUserFromOrganization({
      email: userInfo.userInfo.email ?? "",
      organizationId: userInfo.userInfo.organizationId ?? "",
    });
    if (remove.serverError) {
      toaster({ type: "error", description: remove.serverError });
    } else {
      toaster({ type: "success", description: "Organization quitted" });
      window.location.reload();
    }
  };

  const delOrganization = async () => {
    const deleteOrg = await deleteOrganization({
      id: userInfo.userInfo.organizationId ?? "",
    });
    if (handleError(deleteOrg).error) {
      toaster({ type: "error", description: handleError(deleteOrg).message });
    }
    toaster({ type: "success", description: "Organization deleted" });
    window.location.reload();
  };
  return (
    <>
      {userInfo.userInfo.organization ? (
        <>
          <div className="grid grid-cols-2 items-start mt-14">
            <div className="w-full">
              <h3 className="text-2xl font-normal text-left mb-5">
                {organizationStore.name}
              </h3>
              <div className="pt-5">
                <h4 className="text-base text-left flex flex-row  items-center">
                  <Users className="icon" /> Members
                </h4>
                <ul className="ml-8">
                  {organizationStore.members?.map((member) => (
                    <li
                      key={member.id}
                      className="flex flex-row justify-between items-center">
                      <p className="flex flex-row justify-between w-full pr-10 gap-x-2">
                        {sliced(member.email, 30)}
                        {userInfo.userInfo.organization?.ownerId ===
                          member.id && (
                          <Crown
                            data-tooltip-id="ownerID"
                            className="icon mt-1 text-yellow-500"
                          />
                        )}
                      </p>
                      <Tooltip
                        className="tooltip z-50"
                        opacity={100}
                        id="ownerID">
                        Owner
                      </Tooltip>
                      {userInfo.userInfo.organization?.ownerId ===
                        userInfo.userInfo.id &&
                        userInfo.userInfo.email !== member.email && (
                          <PopoverOrganizationMember
                            userInfo={userInfo}
                            setRefresh={setRefresh}
                            member={member}
                          />
                        )}
                    </li>
                  ))}
                </ul>
              </div>
              {organizationStore.organizationInvitations &&
                organizationStore.organizationInvitations?.length > 0 && (
                  <>
                    <h4 className="text-base text-left mt-5 flex flex-row items-center">
                      <Hourglass className="icon" /> Pending
                    </h4>
                    <ul className="ml-8 ">
                      {organizationStore.organizationInvitations?.map(
                        (invitation) => (
                          <li
                            key={invitation.id}
                            className="flex flex-row justify-between items-center !pt-0 !pb-0 !py-0">
                            <p>{sliced(invitation.email, 30)}</p>
                            {userInfo.userInfo.organization?.ownerId ===
                              userInfo.userInfo.id &&
                              userInfo.userInfo.email !== invitation.email && (
                                <PopoverDelete
                                  what="this member"
                                  className="mr-5"
                                  handleDelete={() => {
                                    handleRemovePending(invitation.email);
                                  }}
                                />
                              )}
                          </li>
                        )
                      )}
                    </ul>
                  </>
                )}
            </div>
            <div className="w-full border-l border-dashed flex flex-col px-5">
              <div
                className={cn({
                  "opacity-50 pointer-events-none !cursor-not-allowed":
                    userInfo.userInfo.organization?.ownerId !==
                    userInfo.userInfo.id,
                })}>
                <OrganizationName user={userInfo.userInfo} />
                <InviteMember user={userInfo.userInfo} />
              </div>
            </div>
          </div>
          {/* If user is ownerId, he cant */}
          <Goodline className="mb-10" />
          {userInfo.userInfo.organization?.ownerId === userInfo.userInfo.id ? (
            <PopoverConfirm
              what="to delete this organization ?"
              display="Delete organization"
              className="text-left float-right dark:text-red-400 text-red-500"
              variant={"link"}
              handleFunction={delOrganization}
            />
          ) : (
            <PopoverConfirm
              what="to quit this organization ?"
              display="Quit organization"
              className="text-left float-right dark:text-red-400 text-red-500"
              variant={"link"}
              handleFunction={handleQuitOrganization}
            />
          )}
        </>
      ) : (
        <>
          <Button
            className="w-full mt-5"
            onClick={() =>
              handleCreateOrganization(
                userInfo.userInfo.id,
                userInfo.userInfo.email ?? ""
              )
            }>
            Create an organization
          </Button>
        </>
      )}
    </>
  );
};
