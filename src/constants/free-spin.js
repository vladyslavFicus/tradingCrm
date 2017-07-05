import keyMirror from 'keymirror';
import I18n from '../utils/fake-i18n';

const statuses = keyMirror({
  CANCELED: null,
  FORFEITED: null,
  ACTIVE: null,
  SCHEDULED: null,
  PENDING: null,
  FAILED: null,
  PLAYED: null,
});
const statusesReasons = keyMirror({
  CANCELED: null,
});
const statusesLabels = {
  [statuses.CANCELED]: I18n.t('CONSTANTS.FREE_SPIN.STATUSES.CANCELED'),
  [statuses.FORFEITED]: I18n.t('CONSTANTS.FREE_SPIN.STATUSES.FORFEITED'),
  [statuses.ACTIVE]: I18n.t('CONSTANTS.FREE_SPIN.STATUSES.ACTIVE'),
  [statuses.SCHEDULED]: I18n.t('CONSTANTS.FREE_SPIN.STATUSES.SCHEDULED'),
  [statuses.PENDING]: I18n.t('CONSTANTS.FREE_SPIN.STATUSES.PENDING'),
  [statuses.FAILED]: I18n.t('CONSTANTS.FREE_SPIN.STATUSES.FAILED'),
  [statuses.PLAYED]: I18n.t('CONSTANTS.FREE_SPIN.STATUSES.PLAYED'),
};
const statusesClassNames = {
  [statuses.CANCELED]: 'color-danger',
  [statuses.FORFEITED]: 'color-black',
  [statuses.ACTIVE]: 'color-success',
  [statuses.SCHEDULED]: 'color-default',
  [statuses.PENDING]: 'color-default',
  [statuses.FAILED]: 'color-danger',
  [statuses.PLAYED]: 'color-danger',
};

export {
  statuses,
  statusesReasons,
  statusesLabels,
  statusesClassNames,
};
