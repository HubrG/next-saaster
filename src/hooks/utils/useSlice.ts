/**
 * Slice text
 * @param text 
 * @param length 
 * @returns 
 */
export const useSlice = (text: string | null | undefined, length: number) => {
  if (text && text?.length > length) {
    return text?.slice(0, length) + "...";
  } else {
    return text;
  }
};
