export function shortify(uuid, prefix, size = 1) {
  if (!uuid) {
    return uuid;
  }

  const id = uuid.split('-', size).join('-');
  return prefix ? [prefix, id].join('-') : id;
}
