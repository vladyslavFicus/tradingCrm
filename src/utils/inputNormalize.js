const intNormalize = v => (isNaN(parseInt(v)) ? v : parseInt(v));
const floatNormalize = v => !parseFloat(v) || !Number(v) || v.endsWith('.') ? v : parseFloat(v);

export {
  intNormalize,
  floatNormalize,
};
