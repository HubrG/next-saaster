import { useEffect } from "react";
import { useUserInterfaceNavStore } from "../stores/userInterfaceNavStore";

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  sectionSelector: string; // Sélecteur pour les sections parentes
  subSectionSelector?: string; // Sélecteur pour les sous-sections
}

export const useIntersectionObserver = (
  setActiveSection: (id: string, isSubSection?: boolean) => void,
  options: UseIntersectionObserverOptions
) => {
    const { userInterfaceNav, toggleItemOpen } = useUserInterfaceNavStore();

  useEffect(() => {
   const observerCallback: IntersectionObserverCallback = (entries) => {
     entries.forEach((entry) => {
       if (entry.isIntersecting) {
         const isSubSection = entry.target.matches(
           options.subSectionSelector ?? ""
         );
         // Appel de setActiveSection avec un indicateur supplémentaire
         setActiveSection(entry.target.id, isSubSection);
       }
     });
   };

    const observer = new IntersectionObserver(observerCallback, options);

    // Observer les sections parentes
    const sections = document.querySelectorAll(options.sectionSelector);
    sections.forEach((section) => observer.observe(section));
   

    // Observer les sous-sections, si un sélecteur est fourni
    if (options.subSectionSelector) {
      const subSections = document.querySelectorAll(options.subSectionSelector);
      subSections.forEach((subSection) => observer.observe(subSection));
    }

    return () => {
      // Détacher l'observer de tous les éléments observés
      observer.disconnect();
    };
  }, [setActiveSection, options]);
};
