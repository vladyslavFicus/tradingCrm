import { Types } from '@crm/common';
import { LeadSearch__Input as LeadSearch } from '__generated__/types';

export type FormValues = Omit<LeadSearch, 'page'> & Types.TimeZone;
