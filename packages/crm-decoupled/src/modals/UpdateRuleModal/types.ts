import { FormikErrors } from 'formik';
import {
  RuleTimeInterval,
  Rule__Type__Enum as RuleTypeEnum,
  RuleSchedule as RuleScheduleType,
  Rule__OperatorSpread as RuleOperatorSpread,
} from '__generated__/types';
import { Types } from '@crm/common';

export type FormValues = {
  name: string,
  priority: number,
  countries: Array<string>,
  languages: Array<string>,
  affiliateUUIDs: Array<string>,
  operatorSpreads: Array<RuleOperatorSpread>,
  schedules: Array<RuleScheduleType>,
  enableSchedule: boolean,
  sources?: Array<string> | null,
  type?: RuleTypeEnum | null,
};

export type FormikBag = {
  initialValues: FormValues,
  isSubmitting: boolean,
  errors: FormikErrors<FormValues>,
  setFieldValue: Types.SetFieldValue<FormValues>,
};

export type ScheduleError = FormikErrors<{
  days: string,
  timeIntervals: Array<RuleTimeInterval>,
}>;

export type TimeIntervalError = FormikErrors<{
  timeRange: string,
  operatorSpreads: string,
}>;

export type Range = {
  timeFrom: string,
  timeTo: string,
};
