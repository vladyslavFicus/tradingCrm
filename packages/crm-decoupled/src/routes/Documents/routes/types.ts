import { DocumentSearch__Input as DocumentSearch } from '__generated__/types';
import { TimeZone } from 'types/timeZoneField';

export type FormValues = Omit<DocumentSearch, 'page'> & TimeZone;
