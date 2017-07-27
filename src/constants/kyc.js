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
const verifyRequestReasons = [
  'KYC_REQUEST_REASON_ONE',
  'KYC_REQUEST_REASON_TWO',
  'KYC_REQUEST_REASON_THREE',
  'KYC_REQUEST_REASON_FOUR',
];

export {
  statuses,
  types,
  categories,
  statusesLabels,
  verifyRequestReasons,
};
