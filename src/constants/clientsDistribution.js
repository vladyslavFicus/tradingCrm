import keyMirror from 'keymirror';

const statuses = keyMirror({
  ACTIVE: null,
  INACTIVE: null,
});

const clientDistributionStatuses = {
  [statuses.ACTIVE]: {
    label: 'CLIENTS_DISTRIBUTION.STATUSES.ACTIVE',
    color: 'color-success',
  },
  [statuses.INACTIVE]: {
    label: 'CLIENTS_DISTRIBUTION.STATUSES.INACTIVE',
    color: 'color-default',
  },
};

const statusesLabels = {
  [statuses.ACTIVE]: 'CLIENTS_DISTRIBUTION.STATUSES.ACTIVE',
  [statuses.INACTIVE]: 'CLIENTS_DISTRIBUTION.STATUSES.INACTIVE',
};

const executionPeriodInHours = [
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.EXECUTION_TIME.N_HOURS',
    value: 3,
    i18nValue: 3,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.EXECUTION_TIME.N_HOURS',
    value: 6,
    i18nValue: 6,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.EXECUTION_TIME.N_HOURS',
    value: 12,
    i18nValue: 12,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.EXECUTION_TIME.N_HOURS',
    value: 18,
    i18nValue: 18,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.EXECUTION_TIME.N_DAY',
    value: 24,
    i18nValue: 1,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.EXECUTION_TIME.N_DAY',
    value: 48,
    i18nValue: 2,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.EXECUTION_TIME.N_DAY',
    value: 72,
    i18nValue: 3,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.EXECUTION_TIME.N_DAY',
    value: 96,
    i18nValue: 4,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.EXECUTION_TIME.N_DAY',
    value: 120,
    i18nValue: 5,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.EXECUTION_TIME.LAST_WEEK',
    value: 168,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.EXECUTION_TIME.LAST_N_WEEKS',
    value: 336,
    i18nValue: 2,
  },
];

export {
  statuses,
  statusesLabels,
  clientDistributionStatuses,
  executionPeriodInHours,
};
