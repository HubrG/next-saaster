"use client";
import { ContainerScroll } from "@/src/components/ui/@aceternity/container-scroll-animation";
import { toaster } from "@/src/components/ui/@blitzinit/toaster/ToastConfig";
import { AnimatedList } from "@/src/components/ui/@magic-ui/animated-list";
import { Button } from "@/src/components/ui/@shadcn/button";
import { useCredit } from "@/src/hooks/@blitzinit/useCredit";
import { getLucideComponents } from "@/src/lib/lucideComponents";
import { FeaturesSection } from "./@subcomponents/FeaturesSection";
import { HeroSection } from "./@subcomponents/HeroSection";
import { TestimonialsSection } from "./@subcomponents/TestimonialsSection";

export default function HomePage() {
  const iconNames = getLucideComponents();
  const credit = async () => {
    const caca = await useCredit({
      credits: 50,
      decrement: true,
      type: "Credit",
    });
    if (caca === true) {
      toaster({
        description: "Credit consumed",
        type: "success",
      });
    }
  };
  return (
    <>
      {/* <HeroParallax products={[]} />
      <BackgroundBeamsDemo /> */}
      <div className="flex flex-col">
        <Button onClick={() => credit()}>Reset</Button>
        <AnimatedList>coucou</AnimatedList>

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
