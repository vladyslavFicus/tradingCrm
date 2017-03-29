export function shortify(uuid, prefix, size = 1) {
  if (!uuid) {
    return uuid;
  }

  const elements = uuid.split('-');

  if (!prefix) {
    const sourcePrefix = elements[0];

    if (sourcePrefix.toUpperCase() === sourcePrefix) {
      elements[0] = sourcePrefix.slice(0, size + 1);

      return elements.slice(0, 2).join('-');
    }
  }

  const id = elements.slice(0, size).join('-');
  return prefix ? [prefix, id].join('-') : id;
}
