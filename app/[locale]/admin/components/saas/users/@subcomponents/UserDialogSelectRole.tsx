"use client";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { updateUser } from "@/src/helpers/db/users.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { handleError } from "@/src/lib/error-handling/handleError";
import { useUserStore } from "@/src/stores/userStore";
import { iUsers } from "@/src/types/db/iUsers";
import { UserRole } from "@prisma/client";
import { useState } from "react";
type UserDialogSelectRoleProps = {
  user: iUsers;
};

export const UserDialogChangeRole = ({ user }: UserDialogSelectRoleProps) => {
    const { usersStore, setUsersStoreByEmail, userStore } = useUserStore();
  const [role, setRole] = useState(user.role);
  const handleRoleChange = async (e: UserRole) => {
    const upRole = await updateUser({
      data: { email: user.email ?? "", role: e },
      secret: chosenSecret(),
    });
    if (handleError(upRole).error) {
      toaster({ type: "error", description: handleError(upRole).message });
      return;
    }
    setUsersStoreByEmail(user.email ?? "", { ...user, role: e });
    toaster({ type: "success", description: "Role updated" });
  };
  const roles = ["ADMIN", "SUPER_ADMIN", "USER", "EDITOR"];
  return (
    <Select
      defaultValue={user.role}
      onValueChange={(e) => {
        handleRoleChange(e as UserRole);
        setRole(e as UserRole);
      }}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select a role</SelectLabel>
          {roles.map((role) => (
            <SelectItem
              key={role}
              value={role}
              disabled={role !== "SUPER_ADMIN" && userStore.role === "SUPER_ADMIN" && userStore.id === user.id}>
              {role}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
