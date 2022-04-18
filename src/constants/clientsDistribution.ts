import keyMirror from 'keymirror';
import { DistributionRule__Statuses__Enum as DistributionRuleStatuses } from '__generated__/types';

const statuses = keyMirror({
  ACTIVE: null,
  INACTIVE: null,
});

const clientDistributionStatuses: Record<DistributionRuleStatuses, { label: string, color: string }> = {
  [statuses.ACTIVE]: {
    label: 'CLIENTS_DISTRIBUTION.STATUSES.ACTIVE',
    color: 'color-success',
  },
  [statuses.INACTIVE]: {
    label: 'CLIENTS_DISTRIBUTION.STATUSES.INACTIVE',
    color: 'color-default',
  },
};

const statusesLabels: Record<DistributionRuleStatuses, string> = {
  [statuses.ACTIVE]: 'CLIENTS_DISTRIBUTION.STATUSES.ACTIVE',
  [statuses.INACTIVE]: 'CLIENTS_DISTRIBUTION.STATUSES.INACTIVE',
};

const timeInCurrentStatusInHours: Array<{ label: string, value: number, i18nValue: number }> = [
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.MODAL.TIME_IN_CURRENT_STATUS.N_HOURS',
    value: 3,
    i18nValue: 3,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.MODAL.TIME_IN_CURRENT_STATUS.N_HOURS',
    value: 6,
    i18nValue: 6,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.MODAL.TIME_IN_CURRENT_STATUS.N_HOURS',
    value: 12,
    i18nValue: 12,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.MODAL.TIME_IN_CURRENT_STATUS.N_HOURS',
    value: 18,
    i18nValue: 18,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.MODAL.TIME_IN_CURRENT_STATUS.DAY',
    value: 24,
    i18nValue: 1,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.MODAL.TIME_IN_CURRENT_STATUS.N_DAYS',
    value: 48,
    i18nValue: 2,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.MODAL.TIME_IN_CURRENT_STATUS.N_DAYS',
    value: 72,
    i18nValue: 3,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.MODAL.TIME_IN_CURRENT_STATUS.N_DAYS',
    value: 96,
    i18nValue: 4,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.MODAL.TIME_IN_CURRENT_STATUS.N_DAYS',
    value: 120,
    i18nValue: 5,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.MODAL.TIME_IN_CURRENT_STATUS.N_DAYS',
    value: 168,
    i18nValue: 7,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.MODAL.TIME_IN_CURRENT_STATUS.N_DAYS',
    value: 336,
    i18nValue: 14,
  },
];

export {
  statuses,
  statusesLabels,
  clientDistributionStatuses,
  timeInCurrentStatusInHours,
};
