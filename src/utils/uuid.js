export function shortify(uuid, manualPrefix = null, size = 2) {
  if (!uuid) {
    return uuid;
  }

  const elements = uuid.split('-');
  if (elements.length < 2 || uuid.length < 12) {
    return manualPrefix ? `${manualPrefix}-${uuid}` : uuid;
  }

  const isUppercasePrefixExist = elements[0] === (elements[0].toUpperCase());

  const additionalPartsSize = size - 1;
  const startOffset = isUppercasePrefixExist ? 1 : 0;
  const endOffset = startOffset + additionalPartsSize;

  const prefix = !manualPrefix && isUppercasePrefixExist ? elements[0].substr(0, 2) : manualPrefix;
  const mainPart = elements.slice(startOffset, endOffset).join('-');

  return [prefix, mainPart].filter(v => v).join('-');
}
