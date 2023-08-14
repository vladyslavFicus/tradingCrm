import React from 'react';
import { get, omit } from 'lodash';
import { FieldProps } from 'formik';
import { TimeRange } from '../../TimeRange';

type Field = {
  from: string,
  to: string,
};

type Props = {
  fieldsNames: Field,
  fieldsLabels?: Field,
  className?: string,
};

const FormikTimeRangeField = (props: Props & FieldProps) => {
  const {
    form: {
      values,
      errors,
      setFieldValue,
    },
    fieldsNames,
    fieldsLabels = {},
    ...restProps
  } = props;

  const getFieldsError = () => {
    const fieldsKeys = Object.values(fieldsNames);

    const [error] = fieldsKeys.map(key => get(errors, key)).flat();

    return error as string;
  };

  // # Removed all unnecessary props
  const timeRangeProps = omit(restProps, ['form', 'field', 'children']);

  return (
    <TimeRange
      {...timeRangeProps}
      fieldsValues={{
        from: get(values, fieldsNames.from),
        to: get(values, fieldsNames.to),
      }}
      fieldsLabels={fieldsLabels}
      error={getFieldsError()}
      onChangeFrom={(value) => {
        setFieldValue(fieldsNames.from, value);
      }}
      onChangeTo={(value) => {
        setFieldValue(fieldsNames.to, value);
      }}
    />
  );
};

export default React.memo(FormikTimeRangeField);
