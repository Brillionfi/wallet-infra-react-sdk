export const capitalizeString = (str: string): string => {
  const strLow = str.toLowerCase();
  return strLow.charAt(0).toUpperCase() + strLow.slice(1);
};
