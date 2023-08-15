import { Types } from '@crm/common';
import { QueryClientCallbacksArgs } from '__generated__/types';

export type FormValues = Omit<QueryClientCallbacksArgs, 'page' | 'limit'> & Types.TimeZone;
