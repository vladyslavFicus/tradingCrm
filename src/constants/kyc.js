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
export {
  statuses,
  types,
  categories,
  statusesLabels,
  requestTypes,
  requestTypesLabels,
  statusesColor,
  filterLabels,
};
