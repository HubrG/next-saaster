import { BackgroundBeamsDemo } from "@/src/components/ui/@aceternity/background-beams";
import { ContainerScroll } from "@/src/components/ui/@aceternity/container-scroll-animation";
import { HeroParallax } from "@/src/components/ui/@aceternity/hero-parallax";
import { FeaturesSection } from "./@subcomponents/FeaturesSection";
import { HeroSection } from "./@subcomponents/HeroSection";
import { TestimonialsSection } from "./@subcomponents/TestimonialsSection";

export default async function HomePage() {
  return (
    <>
      <HeroParallax products={[]} />
      <BackgroundBeamsDemo />
      <HeroSection />
      <FeaturesSection />
      <ContainerScroll users={[]} titleComponent={<h2>Nos Membres</h2>} />
      <TestimonialsSection />
    </>
  );
}
