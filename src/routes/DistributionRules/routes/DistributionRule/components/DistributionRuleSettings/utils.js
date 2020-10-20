/**
* The entry and output objects of the form values may contain the same props,
* but in a different arrange, so very important to bring them in the same order
* to make the right comparison of them
*/
export const normalizeObject = obj => Object.keys(obj).sort().reduce((acc, cur) => ({
  ...acc,
  [cur]: obj[cur]?.sort ? [...obj[cur]].sort() : obj[cur],
}), {});
