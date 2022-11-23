export enum CallbackType {
  CLIENT = 'CLIENT',
  LEAD = 'LEAD'
}

export type CallbackTimes = 'callbackTime' | 'creationTime' | 'updateTime';

const callbacksStatuses: Record<string, string> = {
  PENDING: 'CONSTANTS.CALLBACKS.PENDING',
  REJECTED: 'CONSTANTS.CALLBACKS.REJECTED',
  SUCCESS: 'CONSTANTS.CALLBACKS.SUCCESS',
};

const filterLabels = {
  callbackOrOperator: 'CALLBACKS.FILTER.CALLBACK_OR_OPERATOR',
  callbackOrPlayerOrOperator: 'CALLBACKS.FILTER.CALLBACK_OR_PLAYER_OR_OPERATOR',
  searchValue: 'PROFILE.LIST.FILTERS.SEARCH',
  status: 'PROFILE.LIST.FILTERS.STATUS',
  date: 'CALLBACKS.FILTER.DATE_RANGE',
};

const reminderValues = [
  {
    // Time format: ISO 8601
    value: 'PT5M',
    label: '5 minutes',
  },
  {
    value: 'PT10M',
    label: '10 minutes',
  },
  {
    value: 'PT15M',
    label: '15 minutes',
  },
];

export {
  callbacksStatuses,
  filterLabels,
  reminderValues,
};
