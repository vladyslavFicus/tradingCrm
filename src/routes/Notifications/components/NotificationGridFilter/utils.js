/* eslint-disable */
export const subtypesOfChosenTypes = (subtypes, types) => {
  return Object.entries(subtypes).reduce((acc, [key, values]) => {
    if (types.includes(key)) {
      return [...acc, ...values];
    }

    return acc;
  }, []);
};
