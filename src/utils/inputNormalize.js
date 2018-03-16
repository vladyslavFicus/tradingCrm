const intNormalize = v => (isNaN(parseInt(v)) ? v : parseInt(v));
const floatNormalize = v => (isNaN(parseFloat(v)) ? v : parseFloat(v));

export {
  intNormalize,
  floatNormalize,
};
