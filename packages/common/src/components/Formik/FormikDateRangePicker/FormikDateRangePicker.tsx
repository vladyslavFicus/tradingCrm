import React from 'react';
import { omit, get, set, PropertyPath } from 'lodash';
import deepMerge from 'deepmerge';
import { FieldProps } from 'formik';
import moment from 'moment';
import { DateRangePicker } from 'components';
import { DefaultFieldProps } from '../types';

type Fields = {
  from: string,
  to: string,
  additional: PropertyPath,
};

type AdditionalOption = {
  label: string,
  value: {
    from: moment.Moment,
    to: moment.Moment,
  },
};

type Props = DefaultFieldProps & {
  fieldsNames: Fields,
  anchorDirection?: 'left' | 'right',
  additionalOptions?: Array<AdditionalOption>,
  withAdditionalValues?: boolean,
  withUtc?: boolean,
};

const FormikDateRangePicker = (props: Props & FieldProps) => {
  const {
    form: {
      values,
      errors,
      initialValues,
      setValues,
    },
    fieldsNames,
    withFocus = false,
    ...restProps
  } = props;

  const getFieldsError = () => {
    const fieldsKeys = Object.values(fieldsNames);

    return fieldsKeys.map(key => get(errors, key)).flat()[0];
  };

  const getPickerFocusState = () => {
    const fieldsKeys = Object.values(fieldsNames);

    const getValuesEqualsToInitial = fieldsKeys.filter((key) => {
      const initialValueByKey = get(initialValues, key);

      return initialValueByKey && initialValueByKey === get(values, key);
    });

    return withFocus && getValuesEqualsToInitial.length > 0;
  };

  // # Removed all unNecessary props
  const dateRangePickerProps = omit(restProps, ['form', 'field', 'children']);

  return (
    <DateRangePicker
      {...dateRangePickerProps}
      error={getFieldsError()}
      additionalValue={fieldsNames.additional ? get(values, fieldsNames.additional) : null}
      dateRange={{
        from: get(values, fieldsNames.from),
        to: get(values, fieldsNames.to),
      }}
      setValues={(_values: Fields) => {
        const newValues = {};

        set(newValues, fieldsNames.from, _values.from);
        set(newValues, fieldsNames.to, _values.to);
        set(newValues, fieldsNames.additional, _values.additional);

        setValues(deepMerge(values, newValues));
      }}
      withFocus={getPickerFocusState()}
    />
  );
};

export default React.memo(FormikDateRangePicker);
