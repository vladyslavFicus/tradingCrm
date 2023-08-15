import { Types } from '@crm/common';
import { DocumentSearch__Input as DocumentSearch } from '__generated__/types';

export type FormValues = Omit<DocumentSearch, 'page'> & Types.TimeZone;
