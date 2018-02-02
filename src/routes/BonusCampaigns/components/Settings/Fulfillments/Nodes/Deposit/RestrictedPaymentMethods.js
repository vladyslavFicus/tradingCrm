import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Field } from 'redux-form';
import { get } from 'lodash';
import { NasSelectField } from '../../../../../../../components/ReduxForm';

class RestrictedPaymentMethods extends Component {
  static propTypes = {
    paymentMethods: PropTypes.array.isRequired,
    disabled: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
  };

  static contextTypes = {
    _reduxForm: PropTypes.object,
  };

  render() {
    const { paymentMethods, disabled, name } = this.props;
    const label = I18n.t('BONUS_CAMPAIGNS.SETTINGS.FULFILLMENT.RESTRICTED_PAYMENT_METHODS');

    const { _reduxForm: { values: formValues } } = this.context;
    const restrictedPaymentMethods = get(formValues, 'fulfillments.deposit.restrictedPaymentMethods', []);

    if (disabled) {
      return (
        <div className="form-group">
          <label>{label}</label>
          <div className="select-disabled-container">
            {
              restrictedPaymentMethods.length
                ? <div> {restrictedPaymentMethods.join(', ')} </div>
                : I18n.t('COMMON.NONE')
            }
          </div>
        </div>
      );
    }

    return (
      <Field
        name={name}
        label={label}
        component={NasSelectField}
        position="vertical"
        multiple
      >
        {
          paymentMethods.map(paymentMethod => (
            <option key={paymentMethod.uuid} value={paymentMethod.methodName.toUpperCase()}>
              {paymentMethod.methodName}
            </option>
          ))
        }
      </Field>
    );
  }
}

export default RestrictedPaymentMethods;
