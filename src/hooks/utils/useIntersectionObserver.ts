import { useEffect } from "react";

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  sectionSelector: string; 
  subSectionSelector?: string; 
}

export const useIntersectionObserver = (
  setActiveSection: (id: string, isSubSection?: boolean) => void,
  options: UseIntersectionObserverOptions
) => {

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const isSubSection = entry.target.matches(
            options.subSectionSelector ?? ""
          );
          // Call setActiveSection with an additional flag
          setActiveSection(entry.target.id, isSubSection);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, options);

    // Observe subsections, if a selector is provided
    const sections = document.querySelectorAll(options.sectionSelector);
    sections.forEach((section) => observer.observe(section));

    // Observer les sous-sections, si un sélecteur est fourni
    if (options.subSectionSelector) {
      const subSections = document.querySelectorAll(options.subSectionSelector);
      subSections.forEach((subSection) => observer.observe(subSection));
    }

    return () => {
      // Detach the observer from all observed elements
      observer.disconnect();
    };
  }, [setActiveSection, options]);
};
