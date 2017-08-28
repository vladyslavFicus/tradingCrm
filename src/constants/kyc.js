import keyMirror from 'keymirror';
import I18n from '../utils/fake-i18n';

const filterLabels = {
  from: I18n.t('KYC_REQUESTS.FILTER.DATE_FROM'),
  to: I18n.t('KYC_REQUESTS.FILTER.DATE_TO'),
  status: I18n.t('KYC_REQUESTS.FILTER.DATE_STATUS'),
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
  [userStatuses.VERIFIED]: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS_TITLE.VERIFIED'),
  [userStatuses.NOT_VERIFIED]: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS_TITLE.NOT_VERIFIED'),
  [userStatuses.NOT_REQUESTED]: I18n.t('PLAYER_PROFILE.PROFILE.KYC_STATUS_TITLE.NOT_REQUESTED'),
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
  [requestTypes.MANUAL]: I18n.t('KYC_REQUESTS.REQUEST_TYPE.MANUAL'),
  [requestTypes.AUTO]: I18n.t('KYC_REQUESTS.REQUEST_TYPE.AUTO'),
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
  [statuses.PENDING]: I18n.t('KYC_REQUESTS.STATUS.PENDING'),
  [statuses.VERIFIED]: I18n.t('KYC_REQUESTS.STATUS.VERIFIED'),
  [statuses.REFUSED]: I18n.t('KYC_REQUESTS.STATUS.REFUSED'),
  [statuses.DOCUMENTS_SENT]: I18n.t('KYC_REQUESTS.STATUS.DOCUMENTS_SENT'),
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
  COMPLIANCE: I18n.t('PLAYER_PROFILE.PROFILE.SEND_KYC_REQUEST.REASONS.COMPLIANCE'),
  SECURITY_CHECK: I18n.t('PLAYER_PROFILE.PROFILE.SEND_KYC_REQUEST.REASONS.SECURITY_CHECK'),
  WITHDRAWAL_ON_HOLD: I18n.t('PLAYER_PROFILE.PROFILE.SEND_KYC_REQUEST.REASONS.WITHDRAWAL_ON_HOLD'),
};
const refuseRequestReasons = {
  UNCLEAR_OR_DARK_DOC: I18n.t('PLAYER_PROFILE.PROFILE.REFUSE_KYC_VERIFICATION.REASONS.UNCLEAR_OR_DARK_DOC'),
  NOT_ALL_FOUR_CORNERS: I18n.t('PLAYER_PROFILE.PROFILE.REFUSE_KYC_VERIFICATION.REASONS.NOT_ALL_FOUR_CORNERS'),
  EXPIRED_DOC: I18n.t('PLAYER_PROFILE.PROFILE.REFUSE_KYC_VERIFICATION.REASONS.EXPIRED_DOC'),
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
