"use client";
import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { CopySomething } from "@/src/components/ui/@fairysaas/copy-something";
import { PopoverConfirm } from "@/src/components/ui/@fairysaas/popover-confirm";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/src/components/ui/table";
import { updateUserSubscription } from "@/src/helpers/db/userSubscription.action";
import { deleteUser, updateUser } from "@/src/helpers/db/users.action";
import { ReturnUserDependencyProps } from "@/src/helpers/dependencies/user";
import { sendEmail } from "@/src/helpers/emails/sendEmail";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { handleError } from "@/src/lib/error-handling/handleError";
import { cn } from "@/src/lib/utils";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { random } from "lodash";
import { CircleCheck, CircleDashed, Trash } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/dist/client/components/navigation";
import { useEffect, useState } from "react";
import { UserDialogEditInfo } from "./UserDialogEditInfo";
import { UserDialogSendNotification } from "./UserDialogSendNotification";

type UserDialogInfoProps = {
  user: ReturnUserDependencyProps;
  setUpdate: (update: boolean) => void;
};

export const UserDialogInfo = ({ user, setUpdate }: UserDialogInfoProps) => {
  const format = useFormatter();
  const { saasSettings } = useSaasSettingsStore();
  const t = useTranslations("Admin.UserDialogInfo");
  const [isLoading, setIsLoading] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const [newCreditSeted, setNewCreditSeted] = useState(false);
  const [subscriptionCredits, setSubscriptionCredits] = useState(
    user?.activeSubscription?.creditRemaining ?? 0
  );
  const [regularCredits, setRegularCredits] = useState(
    user.info.creditRemaining ?? 0
  );
  const [initialSubscriptionCredits, setInitialSubscriptionCredits] = useState(
    user?.activeSubscription?.creditRemaining ?? 0
  );
  const [initialRegularCredits, setInitialRegularCredits] = useState(
    user.info.creditRemaining ?? 0
  );
  useEffect(() => {
    setSubscriptionCredits(user.activeSubscription?.creditRemaining ?? 0);
    setRegularCredits(user.info.creditRemaining ?? 0);
  }, [user]);
  const onUpdateCredits = async (
    newCredits: number,
    isSubscription: boolean
  ) => {
    setIsLoading(true);
    if (isSubscription) {
      const updateSubscriptionCredits = await updateUserSubscription({
        data: {
          userId: user.info.id,
          subscriptionId: user.activeSubscription.subscription?.id ?? "",
          creditRemaining: newCredits,
        },
        secret: chosenSecret(),
      });
      if (!updateSubscriptionCredits) {
        toaster({
          type: "error",
          description: "An error occurred while updating the credits",
        });
        setIsLoading(false);
        setNewCreditSeted(false);
        return;
      }
      toaster({
        type: "success",
        description: "Credits updated successfully",
      });
    } else {
      const updateRegularCredits = await updateUser({
        data: {
          email: user.info.email ?? "",
          creditRemaining: newCredits,
        },
        secret: chosenSecret(),
      });
      if (!updateRegularCredits) {
        toaster({
          type: "error",
          description: "An error occurred while updating the credits",
        });
        setIsLoading(false);
        return;
      }
      toaster({
        type: "success",
        description: "Credits updated successfully",
      });
    }

    if (isSubscription) {
      setSubscriptionCredits(newCredits);
      setInitialSubscriptionCredits(newCredits);
    } else {
      setRegularCredits(newCredits);
      setInitialRegularCredits(newCredits);
    }

    setIsLoading(false);
  };
  const resetCredits = () => {
    setSubscriptionCredits(initialSubscriptionCredits);
    setRegularCredits(initialRegularCredits);
    setNewCreditSeted(false);
  };

  const handleEmailVerification = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/register/resend-verification-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, locale }),
      });

      if (!response.ok) {
        toaster({
          type: "error",
          description: "An error occurred while sending the verification email",
        });
        throw new Error("Failed to get verification token");
      }

      const { token } = await response.json();

      await sendEmail({
        to: email,
        type: "verifyEmail",
        subject: t("ResendEmail"),
        vars: {
          verifyEmail: {
            verificationToken: token,
          },
        },
        tag_name: "category",
        tag_value: "confirm_email",
      });
    } catch (error) {
      console.error("Error resending verification email:", error);
    } finally {
      toaster({
        type: "success",
        description: "Verification email sent successfully",
      });
      setIsLoading(false);
    }
  };
  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await deleteUser({
        email: user.info.email ?? "",
      });

      if (handleError(response).error) {
        toaster({
          type: "error",
          description: "An error occurred while deleting the user",
        });
        throw new Error("Failed to delete user");
      }
      return;
    } catch (error) {
      toaster({
        type: "error",
        description: "An error occurred while deleting the user",
      });
      return;
    } finally {
      toaster({
        type: "success",
        description: "User deleted successfully",
      });
      window.location.reload();
    }
  };
  return (
    <>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 items-center -mt-5">
        <UserDialogSendNotification user={user} />
        <UserDialogEditInfo userStore={user.info} setUpdate={setUpdate} />
        <PopoverConfirm
          className="h-full"
          variant="destructive"
          icon={<Trash className="icon" />}
          display={`Delete this account...`}
          what="delete this user"
          handleFunction={() => {
            handleDeleteUser(user.info.id);
          }}></PopoverConfirm>
      </div>
      <Goodline className="mb-10" />
      <div className="grid md:grid-cols-2 gap-5 grid-cols-1 user-dialog-info-tab sm:overflow-x-auto">
        <Table className="bg-theming-text-300/20 border-r !rounded-default !py-5">
          <TableBody className=" !py-5">
            <TableRow>
              <TableCell className="font-bold">Email</TableCell>
              <TableCell>
                {user.info.email}{" "}
                {user.info.emailVerified ||
                (user.info.accounts && user.info.accounts.length > 0) ? (
                  <span className="!text-green-500">(verified)</span>
                ) : (
                  <span className="!text-red-500">
                    (no verified -{" "}
                    <span
                      onClick={() =>
                        !isLoading &&
                        handleEmailVerification(user.info.email ?? "")
                      }
                      className={`underline  hover:decoration-dashed cursor-pointer text-blue-500 hover:underline !font-bold ${
                        isLoading ? "opacity-50 pointer-events-none" : ""
                      }`}>
                      {isLoading ? "Sending..." : "click to resend link"}
                    </span>
                    )
                  </span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">Role</TableCell>
              <TableCell>{user.info.role}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">Active subscription</TableCell>
              <TableCell>
                {user.activeSubscription?.subscription ? (
                  <span className="flex-row-center">
                    <CircleCheck className="icon text-green-600" />(
                    {user.activeSubscription.subscription.status})
                  </span>
                ) : (
                  <>
                    <CircleDashed className="icon text-red-500" />
                  </>
                )}
              </TableCell>
            </TableRow>
            {user.activeSubscription?.subscription && (
              <>
                <TableRow>
                  <TableCell className="font-bold">Usage type</TableCell>
                  <TableCell>{user.activeSubscription.usageType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold">Recurrence</TableCell>
                  <TableCell>{user.activeSubscription.recurring}</TableCell>
                </TableRow>
              </>
            )}
            <TableRow>
              <TableCell className="font-bold">
                Total one-time payments
              </TableCell>
              <TableCell>
                {format.number(
                  user.payments.total_amount_ontime_payments ?? 0,
                  {
                    style: "currency",
                    currency: saasSettings.currency ?? "USD",
                  }
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">Total Subscriptions</TableCell>
              <TableCell>
                {format.number(user.payments.total_amount_subscriptions ?? 0, {
                  style: "currency",
                  currency: saasSettings.currency ?? "USD",
                })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">BDD ID</TableCell>
              <TableCell>
                <CopySomething
                  copyText={user.info.id ?? ""}
                  what="User ID"
                  id={"copyId" + random(1, 900)}>
                  {user.info.id ?? "No id"}
                </CopySomething>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">Stripe ID</TableCell>
              <TableCell>
                {user.info.customerId ? (
                  <CopySomething
                    copyText={user.info.customerId ?? ""}
                    what="Customer Stripe ID"
                    id={"copySId" + random(1, 900)}>
                    {user.info.customerId}
                  </CopySomething>
                ) : (
                  "No stripe profile"
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        {/* NOTE : RIGHT SIDE */}
        <div className="flex flex-col gap-5">
          <Table className=" bg-theming-text-300/20  !rounded-default">
            <TableBody className="py-5">
              <TableRow>
                <TableCell className="font-bold">
                  Credit remaining without subscription
                </TableCell>
                <TableCell>
                  <div className="grid grid-cols-4">
                    <Input
                      className="col-span-2 !rounded-r-none"
                      type="number"
                      value={regularCredits}
                      onChange={(e) => {
                        setRegularCredits(parseInt(e.target.value));
                        setNewCreditSeted(true);
                      }}
                    />
                    <Button
                      onClick={() => onUpdateCredits(regularCredits, false)}
                      className="!rounded-l-none"
                      disabled={regularCredits === initialRegularCredits}>
                      <CircleCheck />
                    </Button>
                    <Button
                      onClick={resetCredits}
                      variant={"link"}
                      disabled={regularCredits === initialRegularCredits}>
                      Reset
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className={cn({ hidden: !user.activeSubscription })}>
                <TableCell className="font-bold">
                  Credit remaining with subscription
                </TableCell>
                <TableCell>
                  <div className="grid grid-cols-4">
                    <Input
                      className="col-span-2 !rounded-r-none"
                      type="number"
                      value={subscriptionCredits}
                      onChange={(e) => {
                        setSubscriptionCredits(parseInt(e.target.value));
                        setNewCreditSeted(true);
                      }}
                    />
                    <Button
                      onClick={() => onUpdateCredits(subscriptionCredits, true)}
                      disabled={
                        subscriptionCredits === initialSubscriptionCredits
                      }
                      className="!rounded-l-none">
                      <CircleCheck />
                    </Button>
                    <Button
                      onClick={resetCredits}
                      variant={"link"}
                      className={`px-2 py-1 `}
                      disabled={
                        subscriptionCredits === initialSubscriptionCredits
                      }>
                      Reset
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">
                  Newsletter susbscribed
                </TableCell>
                <TableCell>
                  {user.info.isNewsletterSub ? (
                    <>
                      <CircleCheck className="icon text-green-600" />
                    </>
                  ) : (
                    <>
                      <CircleDashed className="icon text-red-500" />
                    </>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell valign="top" className="font-bold">
                  Organization
                </TableCell>
                <TableCell valign="top">
                  {user.info.organizationId ? (
                    <>
                      <strong>Members</strong>
                      <div className="flex flex-col max-h-40 overflow-y-auto">
                        {user.info.organization?.members?.map((member) => (
                          <div key={member.id} className="flex items-center">
                            <CopySomething
                              copyText={member.email ?? ""}
                              what="Email"
                              id={"copyEmail" + random(1, 900)}>
                              {member.email}
                            </CopySomething>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <CircleDashed className="icon text-red-500" />
                    </>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};
