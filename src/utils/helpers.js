export function parseJson(data) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

export function stopEvent(e) {
  e.preventDefault();
  e.stopPropagation();
}

export function getTimestamp() {
  return Date.now() / 1000;
}
