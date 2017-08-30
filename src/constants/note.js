import keyMirror from 'keymirror';

const targetTypes = keyMirror({
  PROFILE: null,
  BONUS: null,
  FREE_SPIN: null,
  PAYMENT: null,
  FILE: null,
  LIMIT: null,
  PAYMENT_ACCOUNT: null,
  KYC_REQUEST_VERIFICATION: null,
  KYC_VERIFY: null,
  KYC_REFUSE: null,
});
const targetTypesLabels = {
  [targetTypes.PROFILE]: 'Profile',
  [targetTypes.BONUS]: 'Bonus',
  [targetTypes.FREE_SPIN]: 'Free Spin',
  [targetTypes.PAYMENT]: 'Payment',
  [targetTypes.FILE]: 'File',
  [targetTypes.LIMIT]: 'Limit',
  [targetTypes.PAYMENT_ACCOUNT]: 'Payment Account',
  [targetTypes.KYC_REQUEST_VERIFICATION]: 'KYC Request Verification',
  [targetTypes.KYC_REQUEST_VERIFICATION]: 'KYC Verify',
  [targetTypes.KYC_REQUEST_VERIFICATION]: 'KYC Refuse',
};

export {
  targetTypes,
  targetTypesLabels,
};
