import { CallHistory__Status__Enum as CallHistoryStatusEnum } from '__generated__/types';

export type FormValues = {
  operatorUuid?: string,
  callStatus?: CallHistoryStatusEnum,
  callSystems?: Array<string>,
  callDateRange?: {
    from?: string,
    to?: string,
  },
};
