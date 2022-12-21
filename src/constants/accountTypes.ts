import { LabelValue } from 'types';

export enum leverageStatuses {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  REJECTED = 'REJECTED',
  FAILED = 'FAILED',
}

type Label = {
  label: string,
};

type AccountTypesLabels = Record<string, Label>;

export const accountTypesLabels: AccountTypesLabels = {
  DEMO: {
    label: 'CONSTANTS.ACCOUNT_TYPE.DEMO',
  },
  LIVE: {
    label: 'CONSTANTS.ACCOUNT_TYPE.LIVE',
  },
};

export const accountTypes: Array<LabelValue> = [
  {
    label: 'CONSTANTS.ACCOUNT_TYPE.DEMO',
    value: 'DEMO',
  },
  {
    label: 'CONSTANTS.ACCOUNT_TYPE.LIVE',
    value: 'LIVE',
  },
];
