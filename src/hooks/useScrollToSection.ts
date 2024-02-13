import { useCallback } from "react";
type ScrollBehavior = "auto" | "smooth" | "instant";

const useScrollToSection = () => {
  const handleScroll = useCallback(
    (sectionId: string, behavior: ScrollBehavior = "instant") => {
      const navbarHeight = document.getElementById("navbar")?.clientHeight || 0;
      const menuNavbarHeight =
        document.getElementById("headerAdminNavbar")?.clientHeight || 0;
      const height = navbarHeight + menuNavbarHeight;
      const section = document.getElementById(sectionId);

      if (section) {
        const sectionTop =
          window.scrollY + section.getBoundingClientRect().top - height;
        window.scrollTo({ top: sectionTop, behavior: behavior });
      }
    },
    []
  );

  return handleScroll;
};

export default useScrollToSection;
