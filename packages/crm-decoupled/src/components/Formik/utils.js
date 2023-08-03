const isObject = val => typeof val === 'object' && !Array.isArray(val) && val !== null;

// # Will be removed after refactoring ClientProfile page
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

// # Need to convert empty strings in input fields to null
// # Need to check how to make values undefined on component level
const decodeNullValues = (values) => {
  const newValues = { ...values };

  Object.keys(newValues).forEach((key) => {
    const value = newValues[key];

    if (value === '') {
      newValues[key] = undefined;
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
