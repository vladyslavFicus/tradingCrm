/* eslint-disable */
export const prepareSubtypes = subtypes => subtypes.reduce((acc, subtype) => {
  const type = subtype.split('_')[0];
  if (!acc[type]) acc[type] = [];
  acc[type].push(subtype);

  return acc;
}, {});

export const subtypesOfChosenTypes = (subtypes, types) => {
  return Object.entries(subtypes).reduce((acc, [key, values]) => {
    if (types.includes(key)) {
      return [...acc, ...values];
    }

    return acc;
  }, []);
};
