export function shortify(uuid, manualPrefix = '', size = 2, manualPostfix = '', length = 0) {
  if (!uuid) {
    return uuid;
  }

  const elements = uuid.toString().split('-');
  if (elements.length < 2 || uuid.length < 12) {
    if (manualPrefix) {
      return `${manualPrefix}-${uuid}`;
    } if (manualPostfix && !(uuid.length < length)) {
      return `${uuid}${manualPostfix}`;
    }

    return uuid;
  }

  const isUppercasePrefixExist = elements[0] === (elements[0].toUpperCase());

  const additionalPartsSize = size - 1;
  const startOffset = isUppercasePrefixExist ? 1 : 0;
  const endOffset = startOffset + additionalPartsSize;

  const prefix = !manualPrefix && isUppercasePrefixExist ? elements[0].substr(0, 2) : manualPrefix;
  const mainPart = elements.slice(startOffset, endOffset).join('-');

  return [prefix, mainPart].filter(v => v).join('-');
}
