import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Field } from 'redux-form';
import { get } from 'lodash';
import { NasSelectField } from '../../../../../components/ReduxForm/index';

const ExcludedPaymentMethods = ({ paymentMethods, disabled, name }, { _reduxForm: { values: formValues } }) => {
  const label = I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.DEPOSIT.RESTRICTED_PAYMENT_METHODS');
  const excludedPaymentMethods = get(formValues, 'excludedPaymentMethods', []);

  return (
    <Choose>
      <When condition={disabled}>
        <div className="form-group">
          <label>{label}</label>
          <div className="select-disabled-container">
            <Choose>
              <When condition={excludedPaymentMethods.length}>
                {excludedPaymentMethods.join(', ')}
              </When>
              <Otherwise>
                {I18n.t('COMMON.NONE')}
              </Otherwise>
            </Choose>
          </div>
        </div>
      </When>
      <Otherwise>
        <Field
          name={name}
          label={label}
          component={NasSelectField}
          multiple
          id="campaign-deposit-ful-excluded"
        >
          {paymentMethods.map(paymentMethod => (
            <option key={paymentMethod.uuid} value={paymentMethod.methodName.toUpperCase()}>
              {paymentMethod.methodName}
            </option>
          ))}
        </Field>
      </Otherwise>
    </Choose>
  );
};

ExcludedPaymentMethods.propTypes = {
  paymentMethods: PropTypes.arrayOf(PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    methodName: PropTypes.string.isRequired,
  })).isRequired,
  disabled: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
};
ExcludedPaymentMethods.contextTypes = {
  _reduxForm: PropTypes.object,
};

export default ExcludedPaymentMethods;
