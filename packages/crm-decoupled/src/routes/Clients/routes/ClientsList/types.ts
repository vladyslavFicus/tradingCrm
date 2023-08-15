import { Types } from '@crm/common';
import { ClientSearch__Input as ClientSearch } from '__generated__/types';

export type FormValues = Omit<ClientSearch, 'page'> & Types.TimeZone;
