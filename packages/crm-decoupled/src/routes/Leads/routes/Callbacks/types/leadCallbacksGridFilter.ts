import { QueryLeadCallbacksArgs } from '__generated__/types';
import { TimeZone } from 'types/timeZoneField';

export type FormValues = Omit<QueryLeadCallbacksArgs, 'page' | 'limit'> & TimeZone;
