import { PaymentSearch__Input as PaymentSearch } from '__generated__/types';
import { Types } from '@crm/common';

export type FormValues = Omit<PaymentSearch, 'page'> & Types.TimeZone;
