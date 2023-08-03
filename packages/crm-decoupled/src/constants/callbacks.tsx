import { LabelValue } from 'types';

export type CallbackTimes = 'callbackTime' | 'creationTime' | 'updateTime';

export enum CallbackType {
  CLIENT = 'CLIENT',
  LEAD = 'LEAD'
}

export const filterLabels: Record<string, string> = {
  callbackOrOperator: 'CALLBACKS.FILTER.CALLBACK_OR_OPERATOR',
  callbackOrPlayerOrOperator: 'CALLBACKS.FILTER.CALLBACK_OR_PLAYER_OR_OPERATOR',
  searchValue: 'PROFILE.LIST.FILTERS.SEARCH',
  status: 'PROFILE.LIST.FILTERS.STATUS',
  date: 'CALLBACKS.FILTER.DATE_RANGE',
};

export const reminderValues: Array<LabelValue> = [
  {
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
