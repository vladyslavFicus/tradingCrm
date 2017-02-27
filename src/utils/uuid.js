export function shortify(uuid, prefix) {
  return uuid ? `${prefix}-${uuid.split('-', 2).join('-')}` : uuid;
}
