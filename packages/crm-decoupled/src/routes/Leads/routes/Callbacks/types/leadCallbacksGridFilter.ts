import { QueryLeadCallbacksArgs } from '__generated__/types';
import { Types } from '@crm/common';

export type FormValues = Omit<QueryLeadCallbacksArgs, 'page' | 'limit'> & Types.TimeZone;
