"use client";

import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { Button } from "@/src/components/ui/button";
import { SkeletonLoader } from "@/src/components/ui/loader";
import { PopoverConfirm } from "@/src/components/ui/popover-confirm";
import { PopoverDelete } from "@/src/components/ui/popover-delete";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import {
  createOrganization,
  deleteOrganization,
  removePendingUser,
  removeUserFromOrganization,
} from "@/src/helpers/db/organization.action";
import { ReturnProps, getUserInfos } from "@/src/helpers/dependencies/user";
import { sliced } from "@/src/helpers/functions/slice";
import { handleError } from "@/src/lib/error-handling/handleError";
import { cn } from "@/src/lib/utils";
import { useOrganizationStore } from "@/src/stores/organizationStore";
import { useUserStore } from "@/src/stores/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { upperCase } from "lodash";
import { Crown, Hourglass, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { InviteMember } from "./@ui/InviteMember";
import { OrganizationName } from "./@ui/OrganizationName";
import { PopoverOrganizationMember } from "./@ui/PopoverMember";

type ProfileOrganizationProps = {};

export const ProfileOrganization = ({}: ProfileOrganizationProps) => {
  const { organizationStore, fetchOrganizationStore } = useOrganizationStore();
  const { userStore, isStoreLoading, fetchUserStore } = useUserStore();
  const [userProfile, setUserProfile] = useState<ReturnProps | null>();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (!isStoreLoading) {
      setUserProfile(getUserInfos({ user: userStore }));
      setRefresh(false);
    }
  }, [userStore, refresh, isStoreLoading]);

  useEffect(() => {
    if (userProfile?.info.organization && !userProfile?.isLoading) {
      fetchOrganizationStore(userProfile?.info.organizationId ?? "");
    }
  }, [userProfile, fetchOrganizationStore]);

  if (!userProfile || userProfile?.isLoading) {
    return <SkeletonLoader type="card" />;
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
      organizationId: userProfile.info.organizationId ?? "",
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
      email: userProfile.info.email ?? "",
      organizationId: userProfile.info.organizationId ?? "",
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
      id: userProfile.info.organizationId ?? "",
    });
    if (handleError(deleteOrg).error) {
      toaster({ type: "error", description: handleError(deleteOrg).message });
    }
    toaster({ type: "success", description: "Organization deleted" });
    window.location.reload();
  };
  return (
    <>
      {userProfile?.info.organization ? (
        <>
          <div className="md:grid flex md:grid-cols-2 flex-col gap-y-10 items-start mt-14">
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
                      className="flex flex-row justify-between gap-3 items-center">
                      <Avatar className="!no-underline w-5 h-5 mt-0.5">
                        {member?.image && (
                          <AvatarImage
                            src={member.image}
                            className="rounded-full"
                            alt={userStore.name ?? "User avatar"}
                          />
                        )}
                        <AvatarFallback
                          className="!no-underline"
                          style={{ textDecoration: "transparent" }}>
                          <span className="!no-underline">
                            {upperCase(
                              member?.name
                                ?.toString()
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            )}
                          </span>
                        </AvatarFallback>
                      </Avatar>
                      <p className="flex flex-row justify-between w-full pr-10 gap-x-2">
                        {sliced(member.email, 30)}
                        {userProfile?.info.organization?.ownerId ===
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
                      {userProfile?.info.organization?.ownerId ===
                        userProfile?.info.id &&
                        userProfile?.info.email !== member.email && (
                          <PopoverOrganizationMember
                            userInfo={userProfile}
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
                            {userProfile?.info.organization?.ownerId ===
                              userProfile?.info.id &&
                              userProfile?.info.email !== invitation.email && (
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
            <div className="w-full max-md:border-none border-l border-dashed flex flex-col px-5">
              <div
                className={cn({
                  "opacity-50 pointer-events-none !cursor-not-allowed":
                    userProfile?.info.organization?.ownerId !==
                    userProfile?.info.id,
                })}>
                <OrganizationName user={userProfile?.info} />
                <InviteMember user={userProfile?.info} />
              </div>
            </div>
          </div>
          {/* If user is ownerId, he cant */}
          <Goodline className="mb-10" />
          {userProfile?.info.organization?.ownerId === userProfile?.info.id ? (
            <PopoverConfirm
              what="to delete this organization ?"
              display="Delete organization..."
              className="text-left float-right dark:text-theming-text-900 text-red-500"
              variant={"link"}
              handleFunction={delOrganization}
            />
          ) : (
            <PopoverConfirm
              what="to quit this organization ?"
              display="Quit organization"
              className="text-left float-right dark:text-theming-text-900 text-red-500"
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
                userProfile?.info.id ?? "",
                userProfile?.info.email ?? ""
              )
            }>
            Create an organization
          </Button>
        </>
      )}
    </>
  );
};
