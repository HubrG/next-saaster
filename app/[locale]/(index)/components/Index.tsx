"use client";
import { ContainerScroll } from "@/src/components/ui/@aceternity/container-scroll-animation";
import { Button } from "@/src/components/ui/button";
import { getLucideComponents } from "@/src/lib/lucideComponents";
import { useUserInfoStore } from "@/src/stores/userInfoStore";
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
    setProperty,
  } = useUserInfoStore();

  // useEffect(() => {
  //   setProperty("info", { ...userInfoStore.info, email: "caco@gg.com" });
  // }, []);
  const iconNames = getLucideComponents();
  return (
    <>
      {/* <HeroParallax products={[]} />
      <BackgroundBeamsDemo /> */}
      <div>
        <Button onClick={() => incrementCredit(1000)}>Reset</Button>
        <div>
          <h1>Liste des composants Lucide</h1>
          <ul>
          
            
          </ul>
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
