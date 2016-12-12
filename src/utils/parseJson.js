export default function (data) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}
