const isObject = (val: any) => typeof val === 'object' && !Array.isArray(val) && val !== null;

// # Need to convert empty strings in input fields to null
// # Need to check how to make values undefined on component level
export const decodeNullValues = (values: any) => {
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
