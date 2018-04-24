import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { I18n } from 'react-redux-i18n';
import { Field } from 'redux-form';
import { MultiCurrencyValue, SelectField } from '../../../../components/ReduxForm';
import PropTypes from '../../../../constants/propTypes';
import ordinalizeNumber from '../../../../utils/ordinalizeNumber';
import ExcludedPaymentMethods from './ExcludedPaymentMethods';

class DepositFulfillmentView extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    paymentMethods: PropTypes.shape({
      paymentMethods: PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.shape({
          uuid: PropTypes.string,
          methodName: PropTypes.string,
        })),
      }),
    }),
    locale: PropTypes.string.isRequired,
  };

  static defaultProps = {
    paymentMethods: {},
  };

  render() {
    const {
      name,
      disabled,
      paymentMethods: paymentMethodsData,
      locale,
    } = this.props;
    const paymentMethods = get(paymentMethodsData, 'paymentMethods.data', []);

    return (
      <div>
        <div className="row">
          <div className="col-6 form-group">
            <label>{I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.DEPOSIT.DEPOSIT_AMOUNT_RANGE')}</label>
            <div className="range-group">
              <MultiCurrencyValue
                disabled={disabled}
                baseName={`${name}.minAmount`}
                showErrorMessage={false}
                id="qa-new-campaign-deposit-ful-min-amount"
              />
              <span className="range-group__separator">-</span>
              <MultiCurrencyValue
                disabled={disabled}
                baseName={`${name}.maxAmount`}
                showErrorMessage={false}
                id="qa-new-campaign-deposit-ful-max-amount"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-5">
            <Field
              name={`${name}.numDeposit`}
              type="select"
              component={SelectField}
              position="vertical"
              disabled={disabled}
              label={I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.DEPOSIT.DEPOSIT_NUMBER_LABEL')}
              showErrorMessage={false}
              id="qa-new-campaign-deposit-ful-number"
            >
              <option value="">{I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.DEPOSIT.SELECT_DEPOSIT_NUMBER')}</option>
              {[...new Array(10)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {`
                    ${ordinalizeNumber(i + 1, locale)}
                    ${I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.DEPOSIT.NUMBER_OPTION')}
                  `}
                </option>
              ))}
            </Field>
          </div>
        </div>
        <ExcludedPaymentMethods
          name={`${name}.excludedPaymentMethods`}
          paymentMethods={paymentMethods}
          disabled={disabled}
        />
      </div>
    );
  }
}

export default DepositFulfillmentView;
