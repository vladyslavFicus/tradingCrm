import { Types } from '@crm/common';
import { PaymentSearch__Input as PaymentSearch } from '__generated__/types';

export type FormValues = Omit<PaymentSearch, 'page'> & Types.TimeZone;
