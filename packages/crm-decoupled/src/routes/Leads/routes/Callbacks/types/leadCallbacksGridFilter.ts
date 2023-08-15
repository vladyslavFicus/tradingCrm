import { Types } from '@crm/common';
import { QueryLeadCallbacksArgs } from '__generated__/types';

export type FormValues = Omit<QueryLeadCallbacksArgs, 'page' | 'limit'> & Types.TimeZone;
