const intNormalize = v => (Number.isNaN(parseInt(v)) ? v : parseInt(v));
const floatNormalize = v => (Number.isNaN(parseFloat(v)) ? v : parseFloat(v));

export {
  intNormalize,
  floatNormalize,
};
