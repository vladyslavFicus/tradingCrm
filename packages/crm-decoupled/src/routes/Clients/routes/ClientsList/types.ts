import { ClientSearch__Input as ClientSearch } from '__generated__/types';
import { Types } from '@crm/common';

export type FormValues = Omit<ClientSearch, 'page'> & Types.TimeZone;
