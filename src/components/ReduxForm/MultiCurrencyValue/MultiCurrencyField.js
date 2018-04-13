import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { InputField } from '../../../components/ReduxForm';
import { floatNormalize } from '../../../utils/inputNormalize';

const MultiCurrencyField = ({ label, currency, name, onChange }) => (
  <div key={`${name}-${currency}`}>
    <Field
      name={`${name}.amount`}
      type="number"
      normalize={floatNormalize}
      label={label || currency}
      component={InputField}
      placeholder="0.0"
      position="vertical"
      onChange={onChange}
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
  currency: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

MultiCurrencyField.defaultProps = {
  label: '',
};

export default MultiCurrencyField;
