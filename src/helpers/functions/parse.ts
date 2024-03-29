/**
 * Convertit la valeur d'un champ en un entier si le nom du champ est inclus dans un tableau spécifié.
 * @param {string[]} inputs - Un tableau de noms de champs à convertir en entiers.
 * @param {string} input - Le nom du champ actuel.
 * @param {string} value - La valeur du champ à convertir.
 * @returns {number} - La valeur convertie ou la valeur initiale si le nom du champ n'est pas inclus.
 */
export const parseIntInput = (
  inputs: string[],
  input: string,
  value: string
) => {
  if (inputs.includes(input)) {
    const parsedValue = parseInt(value, 10);
    if (parsedValue < 0) {
      return 0;
    }
    return isNaN(parsedValue) ? 0 : parsedValue;
  }
  return value;
};

/**
 * Convertit la valeur d'un champ en un nombre à virgule flottante si le nom du champ est inclus dans un tableau spécifié.
 * @param {string[]} inputs - Un tableau de noms de champs à convertir en nombres à virgule flottante.
 * @param {string} input - Le nom du champ actuel.
 * @param {string} value - La valeur du champ à convertir.
 * @returns {number} - La valeur convertie ou la valeur initiale si le nom du champ n'est pas inclus.
 */
export const parseFloatInput = (
  inputs: string[],
  input: string,
  value: string
) => {
  if (inputs.includes(input)) {
    const parsedValue = parseFloat(value);
    if (parsedValue < 0) {
      return 0;
    }
    return isNaN(parsedValue) ? 0 : parsedValue;
  }
  return value;
};
