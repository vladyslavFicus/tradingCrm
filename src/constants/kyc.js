import keyMirror from 'keymirror';

const filterLabels = {
  from: 'KYC_REQUESTS.FILTER.DATE_FROM',
  to: 'KYC_REQUESTS.FILTER.DATE_TO',
  status: 'KYC_REQUESTS.FILTER.DATE_STATUS',
};
const statuses = keyMirror({
  PENDING: null,
  VERIFIED: null,
  REFUSED: null,
  DOCUMENTS_SENT: null,
});
const userStatuses = keyMirror({
  VERIFIED: null,
  NOT_VERIFIED: null,
  NOT_REQUESTED: null,
});
const userStatusesLabels = {
  [userStatuses.VERIFIED]: 'PLAYER_PROFILE.PROFILE.KYC_STATUS_TITLE.VERIFIED',
  [userStatuses.NOT_VERIFIED]: 'PLAYER_PROFILE.PROFILE.KYC_STATUS_TITLE.NOT_VERIFIED',
  [userStatuses.NOT_REQUESTED]: 'PLAYER_PROFILE.PROFILE.KYC_STATUS_TITLE.NOT_REQUESTED',
};
const statusTypes = keyMirror({
  IDENTITY: null,
  ADDRESS: null,
  FULLY_VERIFIED: null,
});
const requestTypes = keyMirror({
  MANUAL: null,
  AUTO: null,
});
const requestTypesLabels = {
  [requestTypes.MANUAL]: 'KYC_REQUESTS.REQUEST_TYPE.MANUAL',
  [requestTypes.AUTO]: 'KYC_REQUESTS.REQUEST_TYPE.AUTO',
};
const types = keyMirror({
  personal: null,
  address: null,
});
const categories = keyMirror({
  KYC_PERSONAL: null,
  KYC_ADDRESS: null,
});
const statusesLabels = {
  [statuses.PENDING]: 'KYC_REQUESTS.STATUS.PENDING',
  [statuses.VERIFIED]: 'KYC_REQUESTS.STATUS.VERIFIED',
  [statuses.REFUSED]: 'KYC_REQUESTS.STATUS.REFUSED',
  [statuses.DOCUMENTS_SENT]: 'KYC_REQUESTS.STATUS.DOCUMENTS_SENT',
};
const statusesColor = {
  [statuses.VERIFIED]: 'color-success',
  [statuses.REFUSED]: 'color-secondary',
  [statuses.DOCUMENTS_SENT]: 'color-primary',
};
const userStatusesColor = {
  [userStatuses.VERIFIED]: 'color-success',
  [userStatuses.NOT_VERIFIED]: 'color-warning',
  [userStatuses.NOT_REQUESTED]: 'color-secondary',
};
const verifyRequestReasons = {
  COMPLIANCE: 'PLAYER_PROFILE.PROFILE.SEND_KYC_REQUEST.REASONS.COMPLIANCE',
  SECURITY_CHECK: 'PLAYER_PROFILE.PROFILE.SEND_KYC_REQUEST.REASONS.SECURITY_CHECK',
  WITHDRAWAL_ON_HOLD: 'PLAYER_PROFILE.PROFILE.SEND_KYC_REQUEST.REASONS.WITHDRAWAL_ON_HOLD',
  WITHDRAWAL_OVER: 'PLAYER_PROFILE.PROFILE.SEND_KYC_REQUEST.REASONS.WITHDRAWAL_OVER',
  SUSPECTED_FRAUD: 'PLAYER_PROFILE.PROFILE.SEND_KYC_REQUEST.REASONS.SUSPECTED_FRAUD',
  SUSPECTED_ML: 'PLAYER_PROFILE.PROFILE.SEND_KYC_REQUEST.REASONS.SUSPECTED_ML',
  SUSPECTED_IDENTITY_THEFT: 'PLAYER_PROFILE.PROFILE.SEND_KYC_REQUEST.REASONS.SUSPECTED_IDENTITY_THEFT',
};
const refuseRequestReasons = {
  UNCLEAR_OR_DARK_DOC: 'PLAYER_PROFILE.PROFILE.REFUSE_KYC_VERIFICATION.REASONS.UNCLEAR_OR_DARK_DOC',
  NOT_ALL_FOUR_CORNERS: 'PLAYER_PROFILE.PROFILE.REFUSE_KYC_VERIFICATION.REASONS.NOT_ALL_FOUR_CORNERS',
  EXPIRED_DOC: 'PLAYER_PROFILE.PROFILE.REFUSE_KYC_VERIFICATION.REASONS.EXPIRED_DOC',
};

export {
  statuses,
  types,
  categories,
  statusesLabels,
  requestTypes,
  requestTypesLabels,
  statusesColor,
  filterLabels,
  statusTypes,
  verifyRequestReasons,
  refuseRequestReasons,
  userStatuses,
  userStatusesLabels,
  userStatusesColor,
};
