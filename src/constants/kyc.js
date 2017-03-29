import keyMirror from 'keymirror';

const statuses = keyMirror({
  VERIFIED: null,
  REFUSED: null,
});

const types = keyMirror({
  personal: null,
  address: null,
});
const categories = keyMirror({
  KYC_PERSONAL: null,
  KYC_ADDRESS: null,
});

const statusesLabels = {
  [statuses.VERIFIED]: 'Verified',
  [statuses.REFUSED]: 'Refused',
};

export {
  statuses,
  types,
  categories,
  statusesLabels,
};
