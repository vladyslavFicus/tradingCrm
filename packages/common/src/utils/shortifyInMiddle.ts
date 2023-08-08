const shortifyInMiddle = (
  sourceString: string,
  length: number,
  stringSeparator: string = '...',
): string => {
  if (sourceString.length <= length) {
    return sourceString;
  }

  const charsToShow = length - stringSeparator.length;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);

  return sourceString.substr(0, frontChars) + stringSeparator + sourceString.substr(sourceString.length - backChars);
};

export default shortifyInMiddle;
