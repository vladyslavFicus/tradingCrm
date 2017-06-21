export function shortify(uuid, prefix = null, size = 2) {
  if (!uuid) {
    return uuid;
  }

  const elements = uuid.split('-');
  if (elements.length < 2) {
    return uuid;
  }

  const sourcePrefix = prefix || elements[0];
  if (elements.length >= size) {
    const additionalPartsSize = size - 1;
    const startOffset = elements.length - additionalPartsSize;
    const endOffset = startOffset + additionalPartsSize;

    return `${sourcePrefix}-${elements.slice(startOffset, endOffset).join('-')}`;
  }

  return `${sourcePrefix}-${elements.slice(elements.length - 1, elements.length)}`;
}
