import { Callback__Status__Enum as CallbackStatusEnum } from '__generated__/types';

export type FormValues = {
  searchKeyword?: string,
  statuses?: Array<CallbackStatusEnum>,
  callbackTimeFrom?: string,
  callbackTimeTo?: string,
};
