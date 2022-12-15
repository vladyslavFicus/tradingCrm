import { FormikHelpers } from 'formik';

export type ResetForm<Values> = FormikHelpers<Values>['resetForm'];

export type SetFieldValue<Values> = FormikHelpers<Values>['setFieldValue'];

export type SetValues<Values> = FormikHelpers<Values>['setValues'];
