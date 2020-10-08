import keyMirror from 'keymirror';
import I18n from 'i18n-js';

const statuses = keyMirror({
  ACTIVE: null,
  INACTIVE: null,
});

const clientDistributionStatuses = {
  [statuses.ACTIVE]: {
    label: I18n.t('CLIENTS_DISTRIBUTION.STATUSES.ACTIVE'),
    color: 'color-success',
  },
  [statuses.INACTIVE]: {
    label: I18n.t('CLIENTS_DISTRIBUTION.STATUSES.INACTIVE'),
    color: 'color-default',
  },
};

const statusesLabels = {
  [statuses.ACTIVE]: I18n.t('CLIENTS_DISTRIBUTION.STATUSES.ACTIVE'),
  [statuses.INACTIVE]: I18n.t('CLIENTS_DISTRIBUTION.STATUSES.INACTIVE'),
};

export {
  statuses,
  statusesLabels,
  clientDistributionStatuses,
};
