import { QueryClientCallbacksArgs } from '__generated__/types';
import { TimeZone } from 'types/timeZoneField';

export type FormValues = Omit<QueryClientCallbacksArgs, 'page' | 'limit'> & TimeZone;
