import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { InputField } from '../../../components/ReduxForm';
import { floatNormalize } from '../../../utils/inputNormalize';

const MultiCurrencyField = ({ label, name, onChange, iconRightClassName, onIconClick }) => (
  <div>
    <Field
      name={`${name}.amount`}
      label={label}
      type="text"
      normalize={floatNormalize}
      component={InputField}
      placeholder="0.0"
      position="vertical"
      onChange={onChange}
      className={iconRightClassName ? 'form-group' : ''}
      iconRightClassName={iconRightClassName}
      onIconClick={onIconClick}
    />
    <Field
      name={`${name}.currency`}
      hidden
      component="input"
    />
  </div>
);

MultiCurrencyField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onIconClick: PropTypes.func,
  iconRightClassName: PropTypes.string,
};

MultiCurrencyField.defaultProps = {
  label: '',
  onIconClick: null,
  onChange: null,
  iconRightClassName: '',
};

export default MultiCurrencyField;
