import keyMirror from 'keymirror';

const warningValues = keyMirror({
  CARDHOLDER_INVALID: null,
});

const warningLabels = {
  [warningValues.CARDHOLDER_INVALID]: 'WARNINGS.CARDHOLDER_INVALID',
};

export {
  warningValues,
  warningLabels,
};
