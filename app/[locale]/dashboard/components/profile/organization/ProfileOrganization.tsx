"use client";

import { Button } from "@/src/components/ui/button";
import { Loader } from "@/src/components/ui/loader";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { ReturnProps, getUserInfos } from "@/src/helpers/dependencies/user";
import { sliced } from "@/src/helpers/functions/slice";
import { useOrganizationStore } from "@/src/stores/organizationStore";
import { useUserStore } from "@/src/stores/userStore";
import { Hourglass, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  addOrganization,
  removePendingMember,
} from "../../../queries/organization";
import { InviteMember } from "./@ui/InviteMember";

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
  console.log();

  const handleCreateOrganization = async (id: string, email: string) => {
    const createOrganization = await addOrganization({ ownerId: id });
    if (!createOrganization.data) {
      toaster({ type: "error", description: createOrganization.error });
    } else {
      toaster({ type: "success", description: "Organization created" });
      fetchUserStore(email);
      setRefresh(true);
    }
  };

  const handleRemovePending = async (email: string) => {
    const remove = await removePendingMember({
      email,
      organizationId: userInfo.userInfo.organizationId ?? "",
    });
    if (!remove.data) {
      toaster({ type: "error", description: remove.error });
    } else {
      toaster({ type: "success", description: "Pending removed" });
      setRefresh(true);
    }
  };

  return (
    <>
      {userInfo.userInfo.organization ? (
        <>
          <div className="grid grid-cols-2 items-start mt-20">
            <div className="w-full">
              <div>
                <h3 className="text-base text-left flex flex-row  items-center">
                  <Users className="icon" /> Members
                </h3>
                <ul className="ml-8">
                  {organizationStore.members?.map((member) => (
                    <li
                      key={member.id}
                      className="flex flex-row justify-between items-center">
                      <p>{sliced(member.email, 30)}</p>
                      {userInfo.userInfo.organization?.ownerId ===
                        userInfo.userInfo.id  && userInfo.userInfo.email !== member.email &&  (
                        <Button variant={"link"} className="text-xs">
                          Remove
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {organizationStore.organizationInvitations &&
                organizationStore.organizationInvitations?.length > 0 && (
                  <>
                    <h3 className="text-base text-left mt-5 flex flex-row items-center">
                      <Hourglass className="icon" /> Pending
                    </h3>
                    <ul className="ml-8 ">
                      {organizationStore.organizationInvitations?.map(
                        (invitation) => (
                          <li
                            key={invitation.id}
                            className="flex flex-row justify-between items-center !pt-0 !pb-0 !py-0">
                            <p>{sliced(invitation.email, 30)}</p>
                            {userInfo.userInfo.organization?.ownerId ===
                              userInfo.userInfo.id && userInfo.userInfo.email !== invitation.email && (
                              <Button
                                variant={"link"}
                                onClick={(e) =>
                                  handleRemovePending(invitation.email)
                                }
                                className="text-xs">
                                Remove
                              </Button>
                            )}
                          </li>
                        )
                      )}
                    </ul>
                  </>
                )}
            </div>
            <div className="w-full border-l border-dashed flex flex-col px-5">
              <InviteMember user={userInfo.userInfo} />
            </div>
          </div>
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
