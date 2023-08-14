import { LeadSearch__Input as LeadSearch } from '__generated__/types';
import { Types } from '@crm/common';

export type FormValues = Omit<LeadSearch, 'page'> & Types.TimeZone;
