import keyMirror from 'keymirror';

const targetTypes = keyMirror({
  PROFILE: null,
  PLAYER: null,
  LEAD: null,
  PAYMENT: null,
  CALLBACK: null,
  FILE: null,
  LIMIT: null,
  PAYMENT_ACCOUNT: null,
  KYC_REQUEST_VERIFICATION: null,
  KYC_REFUSE: null,
});

const targetTypesLabels = {
  [targetTypes.PROFILE]: 'Profile',
  [targetTypes.PAYMENT]: 'Payment',
  [targetTypes.FILE]: 'File',
  [targetTypes.LIMIT]: 'Limit',
  [targetTypes.PAYMENT_ACCOUNT]: 'Payment account',
  [targetTypes.KYC_REQUEST_VERIFICATION]: 'KYC Request Verification',
  [targetTypes.KYC_REQUEST_VERIFICATION]: 'KYC Verify',
  [targetTypes.KYC_REQUEST_VERIFICATION]: 'KYC Refuse',
};

const viewType = keyMirror({
  POPOVER: null,
  MODAL: null,
});

export {
  targetTypes,
  targetTypesLabels,
  viewType,
};
