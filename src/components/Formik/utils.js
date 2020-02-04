const isObject = val => typeof val === 'object' && !Array.isArray(val) && val !== null;

const encodeNullValues = (values) => {
  const newValues = { ...values };

  Object.keys(newValues).forEach((key) => {
    const value = newValues[key];
    if (value === null) {
      newValues[key] = '';
    } else if (isObject(value)) {
      newValues[key] = encodeNullValues(value);
    }
  });

  return newValues;
};

const decodeNullValues = (values) => {
  const newValues = { ...values };

  Object.keys(newValues).forEach((key) => {
    const value = newValues[key];

    if (value === '') {
      newValues[key] = null;
    } else if (isObject(value)) {
      newValues[key] = decodeNullValues(value);
    }
  });

  return newValues;
};

export {
  encodeNullValues,
  decodeNullValues,
};