import { LeadSearch__Input as LeadSearch } from '__generated__/types';
import { TimeZone } from 'types/timeZoneField';

export type FormValues = Omit<LeadSearch, 'page'> & TimeZone;
