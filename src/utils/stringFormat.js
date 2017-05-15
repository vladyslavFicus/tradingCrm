const shortifyInMiddle = (sourceString, length, stringSeparator) => {
  if (sourceString.length <= length) {
    return sourceString;
  }

  const separator = stringSeparator || '...';
  const charsToShow = length - separator.length;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);

  return sourceString.substr(0, frontChars) + separator + sourceString.substr(sourceString.length - backChars);
};

export {
  shortifyInMiddle,
};
