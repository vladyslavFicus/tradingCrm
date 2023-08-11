import { QueryClientCallbacksArgs } from '__generated__/types';
import { Types } from '@crm/common';

export type FormValues = Omit<QueryClientCallbacksArgs, 'page' | 'limit'> & Types.TimeZone;
