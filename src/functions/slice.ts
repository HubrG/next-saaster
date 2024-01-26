/**
 * Slice text
 * @param text 
 * @param length 
 * @returns 
 */
export const sliced = (text: string, length: number) => {
  if (text.length > length) {
    return text.slice(0, length) + "...";
  } else {
    return text;
  }
};
