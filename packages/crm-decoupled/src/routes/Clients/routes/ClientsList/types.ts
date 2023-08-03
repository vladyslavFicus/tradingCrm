import { ClientSearch__Input as ClientSearch } from '__generated__/types';
import { TimeZone } from 'types/timeZoneField';

export type FormValues = Omit<ClientSearch, 'page'> & TimeZone;
