import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { InputField } from '../../../../../../../../components/ReduxForm';

const MicrogamingAdditionalFields = ({ disabled, approxeBetValueLabel }) => (
  <div className="col-md-8">
    <div className="row">
      <Field
        name="approxeBetValue"
        type="number"
        label={approxeBetValueLabel}
        labelClassName="form-label"
        position="vertical"
        component={InputField}
        placeholder="0.00"
        showErrorMessage
        disabled={disabled}
      />
    </div>
  </div>
);
MicrogamingAdditionalFields.propTypes = {
  approxeBetValueLabel: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};
MicrogamingAdditionalFields.defaultProps = {
  disabled: false,
};

export default MicrogamingAdditionalFields;
