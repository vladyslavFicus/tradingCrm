import React from 'react';
import { getIn, FieldProps } from 'formik';
import classNames from 'classnames';
import { FieldLabel, MultiInput } from 'components';
import { createTagOption } from 'constants/multiInput';
import { DefaultFieldProps } from '../types';
import './FormikMultiInputField.scss';

type Props = DefaultFieldProps & FieldProps;

const FormikMultiInputField = (props: Props) => {
  const {
    disabled,
    placeholder,
    label,
    className,
    field: { value, name },
    form: { setFieldValue, errors },
  } = props;

  const onHandleChange = (values: Array<string>) => {
    setFieldValue(name, values);
  };

  const error = getIn(errors, name);

  return (
    <div className={classNames('FormikMultiInputField', className)}>
      <FieldLabel label={label} className="FormikMultiInputField__label" />

      <MultiInput
        disabled={disabled}
        placeholder={placeholder}
        onChange={onHandleChange}
        initialValues={value?.map(createTagOption) || []}
        isError={error}
      />

      <If condition={error}>
        <div className="FormikMultiInputField__error-wrapper">
          <i className="FormikMultiInputField__error-icon icon icon-alert" />
          {error}
        </div>
      </If>
    </div>
  );
};

export default React.memo(FormikMultiInputField);
