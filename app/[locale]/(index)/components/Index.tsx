"use client";
import { ContainerScroll } from "@/src/components/ui/@aceternity/container-scroll-animation";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Button } from "@/src/components/ui/button";
import { addUserUsage } from "@/src/helpers/db/userUsage.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { handleError } from "@/src/lib/error-handling/handleError";
import { getLucideComponents } from "@/src/lib/lucideComponents";
import { useUserInfoStore } from "@/src/stores/userInfoStore";
import { CircleOff } from "lucide-react";
import { FeaturesSection } from "./@subcomponents/FeaturesSection";
import { HeroSection } from "./@subcomponents/HeroSection";
import { TestimonialsSection } from "./@subcomponents/TestimonialsSection";

export default function HomePage() {
  const {
    userInfoStore,
    incrementCredit,
    decrementCredit,
    isUserInfoStoreLoading,
    setUserInfoStore,
    fetchUserInfoStore,
    setProperty,
  } = useUserInfoStore();


  const handleIncreaseCredit = async () => {
    incrementCredit(100);
  }


  const handleClick = async () => {
    const click = await addUserUsage({
      // featureAlias: "gpt3",
      consumeCredit: 100,
      // consumeStripeMeteredCredit: 100,
      // quantityForFeature: 2,
      secret: chosenSecret(),
    });
    const { error, message } = handleError(click);
    if (error) {
      toaster({
        description: message,
        type: "error",
        icon: <CircleOff />,
      });
    } else {
      decrementCredit(click.data?.success?.consumeCredit ?? 0);
    }
  };
  // useEffect(() => {
  //   setProperty("info", { ...userInfoStore.info, email: "caco@gg.com" });
  // }, []);
  const iconNames = getLucideComponents();
  return (
    <>
      {/* <HeroParallax products={[]} />
      <BackgroundBeamsDemo /> */}
      <div className="flex flex-col">
        <Button onClick={handleIncreaseCredit}>Reset</Button>
        <div>
          <h1>Liste des composants Lucide</h1>
          <ul></ul>
        </div>
        {userInfoStore?.info?.email}
        <HeroSection />
      </div>
      <FeaturesSection />
      <ContainerScroll users={[]} titleComponent={<h2>Nos Membres</h2>} />
      <div className="full-div">
        <TestimonialsSection />
      </div>
    </>
  );
}
