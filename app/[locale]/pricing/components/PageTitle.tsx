"use client";
import { SkeletonLoader } from "@/src/components/ui/@fairysaas/loader";
import {
  ReturnUserDependencyProps,
  getUserInfos,
} from "@/src/helpers/dependencies/user";
import { useSessionQuery } from "@/src/queries/useSessionQuery";
import { useUserStore } from "@/src/stores/userStore";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export const PageTitle = () => {
  const t = useTranslations("Pricing");
  const { userStore, fetchUserStore } = useUserStore();
  const { data: session } = useSessionQuery();
  const [userInfo, setUserInfo] = useState<
    ReturnUserDependencyProps | undefined
  >(undefined);

  useEffect(() => {
    setUserInfo(
      getUserInfos({ user: userStore, email: session?.user.email ?? "" })
    );
  }, [userStore, session?.user?.email]);
if (!userInfo) return (
  <div className="w-full">
    <SkeletonLoader type="simple-line" className=" w-full !mx-auto" />
    <div className="grid grid-cols-3  items-center gap-10">
      <SkeletonLoader type="card" className="!h-60" />
      <SkeletonLoader type="card" className="!h-60" />
      <SkeletonLoader type="card" className="!h-60" />
    </div>
  </div>
);
  if (!userInfo) return <h1 className="!bg-gradient2 mb-14">{t("title")}</h1>;
  else if (userInfo.activeSubscription)
    return <h1 className="!bg-gradient2 mb-14">{t("update")}</h1>;
  else return <h1 className="!bg-gradient2 mb-14">{t("title")}</h1>;
};
