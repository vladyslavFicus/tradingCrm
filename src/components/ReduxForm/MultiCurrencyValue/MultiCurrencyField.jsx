import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { InputField } from '../../../components/ReduxForm';
import { floatNormalize } from '../../../utils/inputNormalize';

const MultiCurrencyField = ({ label, name, id, className, ...rest }) => (
  <div>
    <Field
      name={`${name}.amount`}
      label={label}
      type="number"
      normalize={floatNormalize}
      component={InputField}
      placeholder="0.0"
      position="vertical"
      className={className}
      id={id}
      {...rest}
    />
    <Field
      name={`${name}.currency`}
      hidden
      component="input"
    />
  </div>
);

MultiCurrencyField.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onIconClick: PropTypes.func,
  iconRightClassName: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
};

MultiCurrencyField.defaultProps = {
  label: '',
  onIconClick: null,
  onChange: null,
  iconRightClassName: '',
  id: null,
  className: null,
};

export default MultiCurrencyField;
