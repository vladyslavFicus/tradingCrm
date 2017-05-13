import keyMirror from 'keymirror';
import I18n from '../utils/fake-i18n';

const statuses = keyMirror({
  INACTIVE: null,
  IN_PROGRESS: null,
  WAGERING_COMPLETE: null,
  CONSUMED: null,
  CANCELLED: null,
  EXPIRED: null,
});
const types = keyMirror({
  FIRST_DEPOSIT: null,
  PROFILE_COMPLETED: null,
  Manual: null,
});
const assign = keyMirror({
  manual: null,
  campaign: null,
});

const statusesLabels = {
  [statuses.INACTIVE]: I18n.t('CONSTANTS.BONUS.STATUSES.INACTIVE'),
  [statuses.IN_PROGRESS]: I18n.t('CONSTANTS.BONUS.STATUSES.IN_PROGRESS'),
  [statuses.WAGERING_COMPLETE]: I18n.t('CONSTANTS.BONUS.STATUSES.WAGERING_COMPLETE'),
  [statuses.CONSUMED]: I18n.t('CONSTANTS.BONUS.STATUSES.CONSUMED'),
  [statuses.CANCELLED]: I18n.t('CONSTANTS.BONUS.STATUSES.CANCELLED'),
  [statuses.EXPIRED]: I18n.t('CONSTANTS.BONUS.STATUSES.EXPIRED'),
};
const typesLabels = {
  [types.FIRST_DEPOSIT]: I18n.t('CONSTANTS.BONUS.TYPES.FIRSTDEPOSIT'),
  [types.PROFILE_COMPLETED]: I18n.t('CONSTANTS.BONUS.TYPES.PLAYERPROFILECOMPLETED'),
  [types.Manual]: I18n.t('CONSTANTS.BONUS.TYPES.MANUAL'),
};
const assignLabels = {
  [assign.manual]: I18n.t('CONSTANTS.BONUS.ASSIGN.MANUAL'),
  [assign.campaign]: I18n.t('CONSTANTS.BONUS.ASSIGN.CAMPAIGN'),
};

const statusesProps = {
  [statuses.INACTIVE]: {
    className: 'color-default font-weight-600 text-uppercase',
  },
  [statuses.IN_PROGRESS]: {
    className: 'color-success font-weight-600 text-uppercase',
  },
  [statuses.WAGERING_COMPLETE]: {
    className: 'color-warning font-weight-600 text-uppercase',
  },
  [statuses.CONSUMED]: {
    className: 'color-primary font-weight-600 text-uppercase',
  },
  [statuses.CANCELLED]: {
    className: 'color-danger font-weight-600 text-uppercase',
  },
  [statuses.EXPIRED]: {
    className: 'color-primary font-weight-600 text-uppercase',
  },
};
const typesProps = {
  [types.FIRST_DEPOSIT]: {
    className: 'color-primary font-weight-600 text-uppercase',
  },
  [types.Manual]: {
    className: 'color-success font-weight-600 text-uppercase',
  },
};

export {
  statuses,
  statusesLabels,
  statusesProps,
  types,
  typesLabels,
  typesProps,
  assign,
  assignLabels,
};
