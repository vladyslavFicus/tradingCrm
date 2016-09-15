export function parseJson(data) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

export function localDateToString(object) {
  if (typeof object !== 'object') {
    return object;
  }

  const payload = {
    year: object.year,
    month: object.monthValue,
    day: object.dayOfMonth,
    hour: object.hour,
    minute: object.minute,
    second: object.second,
  };

  const data = Object.keys(payload).reduce((result, key) => {
    result[key] = payload[key] > 9 ? payload[key] : `0${payload[key]}`;

    return result;
  }, {});

  return `${data.year}.${data.month}.${data.day} ${data.hour}:${data.minute}:${data.second}`;
}

export function stopEvent(e) {
  e.preventDefault();
  e.stopPropagation();
}

export function getTimestamp() {
  return Date.now() / 1000;
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}
