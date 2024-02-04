import { useCallback } from "react";

const useScrollToSection = () => {
  const handleScroll = useCallback((sectionId: string) => {
    const navbarHeight = document.getElementById("navbar")?.clientHeight || 0;
    const menuNavbarHeight =
      document.getElementById("headerAdminNavbar")?.clientHeight || 0;
    const height = navbarHeight + menuNavbarHeight;
    const section = document.getElementById(sectionId);

    if (section) {
      const sectionTop =
        window.scrollY + section.getBoundingClientRect().top - height;
      window.scrollTo({ top: sectionTop, behavior: "instant" });
    }
  }, []);

  return handleScroll;
};

export default useScrollToSection;
