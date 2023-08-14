import { DocumentSearch__Input as DocumentSearch } from '__generated__/types';
import { Types } from '@crm/common';

export type FormValues = Omit<DocumentSearch, 'page'> & Types.TimeZone;
