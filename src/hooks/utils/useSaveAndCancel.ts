"use client";
import isEqual from "lodash/isEqual";
import { useCallback, useEffect, useState } from "react";

// Définition de l'interface pour le type de données de formulaire générique
export interface GenericDataObject {
  [key: string]: any;
}

// Paramètres acceptés par le hook
interface UseFormStateParams {
  initialData: GenericDataObject;
  onSave: (data: GenericDataObject) => Promise<void>;
  onReset?: () => void;
  isDirty?: boolean;
  formData?: GenericDataObject;
  updatedData?: GenericDataObject;
}

function useSaveAndCancel({
  initialData,
  onSave,
  onReset,
}: UseFormStateParams) {
  const [formData, setFormData] = useState<GenericDataObject>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Utilisation de isEqual dans useEffect pour déterminer si les données ont été modifiées
  const [isDirty, setIsDirty] = useState<boolean>(false);

  // Effectue une comparaison approfondie à chaque modification de formData ou initialData
  useEffect(() => {
    setIsDirty(!isEqual(formData, initialData));
  }, [formData, initialData]);

  const handleChange = useCallback((updatedData: GenericDataObject) => {
    setFormData(updatedData);
  }, []);

  // Modification ici: handleSave accepte maintenant des données en argument
  const handleSave = useCallback(
    async (data: GenericDataObject) => {
      setIsLoading(true);
      try {
        await onSave(data); // Utilisation de `data` au lieu de `formData`
        setIsDirty(false); // Potentiellement réinitialiser formData ici si nécessaire
      } catch (error) {
        console.error("Save failed", error);
      } finally {
        setIsLoading(false);
      }
    },
    [onSave]
  ); // Retirer `formData` des dépendances

  const handleReset = useCallback(() => {
    setFormData(initialData);
    setIsDirty(false);
    if (onReset) {
      onReset();
    }
  }, [initialData, onReset]);

  return {
    formData,
    isLoading,
    initialData,
    isDirty,
    handleChange,
    handleSave,
    handleReset,
    setFormData,
  };
}

export default useSaveAndCancel;
