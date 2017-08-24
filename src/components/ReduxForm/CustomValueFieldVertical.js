import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import classNames from 'classnames';
import renderLabel from '../../utils/renderLabel';
import InputField from './InputField';
import { customValueFieldTypesLabels } from '../../constants/form';

const CustomValueField = (props) => {
  const {
    basename,
    label,
    disabled,
    typeValues,
    errors,
    iconRightClassName,
  } = props;

  return (
    <div className="double-group">
      <label>
        {label}
      </label>
      <Field
        name={`${basename}.value`}
        type="text"
        label={''}
        placeholder={typeof label === 'string' ? label : null}
        component={InputField}
        position="vertical"
        disabled={disabled}
        iconRightClassName={iconRightClassName}
      />
      <Field
        name={`${basename}.type`}
        className="form-control"
        component="select"
        disabled={disabled}
      >
        {typeValues.map(key =>
          <option key={key} value={key}>{renderLabel(key, customValueFieldTypesLabels)}</option>
        )}
      </Field>
      {!!errors[`${basename}.value`] && <div className="form-control-feedback">
        {errors[`${basename}.value`]}
      </div>}
      {!!errors[`${basename}.type`] && <div className="form-control-feedback">
        {errors[`${basename}.type`]}
      </div>}
    </div>
  );
};

CustomValueField.defaultProps = {
  errors: {},
  iconRightClassName: '',
  disabled: false,
};
CustomValueField.propTypes = {
  basename: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  typeValues: PropTypes.array.isRequired,
  errors: PropTypes.object,
  disabled: PropTypes.bool,
  iconRightClassName: PropTypes.string,
};

export default CustomValueField;
