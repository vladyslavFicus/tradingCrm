const intNormalize = v => (Number.isNaN(parseInt(v, 10)) ? v : parseInt(v, 10));
const floatNormalize = v => (Number.isNaN(parseFloat(v)) ? v : parseFloat(v));

export {
  intNormalize,
  floatNormalize,
};
