import { FormikHelpers } from 'formik';

export type ResetForm<Values> = FormikHelpers<Values>['resetForm'];

export type SetFieldValue<Values> = FormikHelpers<Values>['setFieldValue'];

export type SetValues<Values> = FormikHelpers<Values>['setValues'];

export type DefaultFieldProps = {
  label: string,
  disabled?: boolean,
  className?: string,
  placeholder?: string,
  withFocus?: boolean,
};
