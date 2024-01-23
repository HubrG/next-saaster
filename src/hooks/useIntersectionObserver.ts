"use client";
import { useEffect } from "react";

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  targetClass: string;
}

const useIntersectionObserver = async (
  setActiveSection: (id: string) => void,
  options: UseIntersectionObserverOptions
) => {
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visibleSections = entries.filter((entry) => entry.isIntersecting);
      if (visibleSections.length) {
        visibleSections.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
        );  
        setActiveSection(visibleSections[0].target.id);
      }
    }, options);

    const sections = document.querySelectorAll(options.targetClass);
    sections.forEach((section) => observer.observe(section as Element));

    return () => {
      sections.forEach((section) => observer.unobserve(section as Element));
    };
  }, [setActiveSection, options,]);
};

export default useIntersectionObserver;
