"use client";

import { useSaasMRRSPlans } from "@/src/stores/saasMRRSPlans";
import { PlanCard } from "./@ui/PlanCard";

export const Plans = () => {
  const { saasMRRSPlans } = useSaasMRRSPlans();

  return (
    <div className="grid grid-cols-2 gap-5">
      {/* On boucle sur saasMRRSPlans */}
      {saasMRRSPlans
        .slice()
        .sort((a, b) => {
          if (a.active && !b.active) {
            return -1;
          }
          if (!a.active && b.active) {
            return 1;
          }

          // Gestion des valeurs 'null' pour 'createdAt'
          // Convertissez les dates en timestamps
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

          return dateA - dateB;
        })
        .map((plan, index) => (
          <PlanCard key={index + plan.id} modeAdmin={true} plan={plan} />
        ))}
    </div>
  );
};
