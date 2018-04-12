export default function (data, defaultValue = {}) {
  try {
    return JSON.parse(data);
  } catch (e) {
    if (window.Raven) {
      window.Raven.captureException(e, {
        extra: {
          data,
        },
      });
    }

    return defaultValue;
  }
}
