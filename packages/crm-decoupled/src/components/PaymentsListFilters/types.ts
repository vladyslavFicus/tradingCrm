import { PaymentSearch__Input as PaymentSearch } from '__generated__/types';
import { TimeZone } from 'types/timeZoneField';

export type FormValues = Omit<PaymentSearch, 'page'> & TimeZone;
