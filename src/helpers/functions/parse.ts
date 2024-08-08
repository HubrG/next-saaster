/**
 * Converts the value of a field to an integer if the field name is included in a specified array.
 * @param {string[]} inputs - An array of field names to convert to integers.
 * @param {string} input - The current field name.
 * @param {string} value - The field value to convert.
 * @returns {number} - The converted value or the initial value if the field name is not included.
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
 * Converts the value of a field to a floating-point number if the field name is included in a specified array.
 * @param {string[]} inputs - An array of field names to convert to floating-point numbers.
 * @param {string} input - The current field name.
 * @param {string} value - The field value to convert.
 * @returns {number} - The converted value or the initial value if the field name is not included.
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
