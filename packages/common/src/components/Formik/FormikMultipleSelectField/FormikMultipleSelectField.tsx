import React from 'react';
import { FieldProps } from 'formik';
import { eq, get } from 'lodash';
import { MultipleSelect, MultipleSelectProps } from '../../Select';

type Props = {
  withFocus?: boolean,
};

const FormikMultipleSelectField = <OptionValue, >(props: Props & MultipleSelectProps<OptionValue> & FieldProps) => {
  const {
    field: {
      name,
      value,
    },
    form: {
      errors,
      initialValues,
      touched,
      setFieldValue,
      setFieldTouched,
    },
    withFocus = false,
    onChange = () => null,
    ...rest
  } = props;

  const handleChange = async (_value: Array<OptionValue>) => {
    setFieldTouched(name, true);
    setFieldValue(name, _value.length ? _value : undefined);

    onChange(_value);
  };

  const isValueExist = Array.isArray(value) && !!value.length;
  const isErrorMessageVisible = get(initialValues, name) === undefined || get(touched, name);

  return (
    <MultipleSelect
      {...rest}
      value={value || []}
      onChange={handleChange}
      error={isErrorMessageVisible && get(errors, name)?.toString()}
      focused={withFocus && isValueExist && eq(get(initialValues, name), value)}
    />
  );
};

export default React.memo(FormikMultipleSelectField);
