import React from 'react';
import { FieldProps } from 'formik';
import { eq, get } from 'lodash';
import { SingleSelect, SingleSelectProps } from '../../Select';

type Props = {
  withFocus?: boolean,
};

const FormikSingleSelectField = <OptionValue, >(props: Props & SingleSelectProps<OptionValue> & FieldProps) => {
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

  const handleChange = async (_value: OptionValue) => {
    setFieldTouched(name, true);
    setFieldValue(name, _value);

    onChange(_value);
  };

  const isErrorMessageVisible = !get(initialValues, name) || get(touched, name);

  return (
    <SingleSelect
      {...rest}
      value={value}
      onChange={handleChange}
      error={isErrorMessageVisible && get(errors, name)?.toString()}
      focused={withFocus && !!value && eq(get(initialValues, name), value)}
    />
  );
};

export default React.memo(FormikSingleSelectField);
