import React, { Component } from 'react';
import { get, set } from 'lodash';
import { I18n } from 'react-redux-i18n';
import { Field } from 'redux-form';
import { MultiCurrencyValue, SelectField } from '../../../../components/ReduxForm';
import PropTypes from '../../../../constants/propTypes';
import ordinalizeNumber from '../../../../utils/ordinalizeNumber';
import ExcludedPaymentMethods from './ExcludedPaymentMethods';
import Placeholder, { DefaultLoadingPlaceholder } from '../../../../components/Placeholder';
import deepRemoveKeyByRegex from '../../../../utils/deepKeyPrefixRemove';

class DepositFulfillmentView extends Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    uuid: PropTypes.string,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    optionCurrencies: PropTypes.shape({
      options: PropTypes.shape({
        signUp: PropTypes.shape({
          currency: PropTypes.shape({
            list: PropTypes.arrayOf(PropTypes.string),
            base: PropTypes.PropTypes.string,
          }),
        }),
      }),
    }).isRequired,
    depositFulfillment: PropTypes.shape({
      depositFulfillment: PropTypes.shape({
        data: PropTypes.shape({
          uuid: PropTypes.string,
          numDeposit: PropTypes.number,
          fulfillmentAmounts: PropTypes.arrayOf(PropTypes.shape({
            min: PropTypes.number.isRequired,
            max: PropTypes.number.isRequired,
            currency: PropTypes.string.isRequired,
          })),
          excludedPaymentMethods: PropTypes.arrayOf(PropTypes.string),
        }),
      }),
    }),
    paymentMethods: PropTypes.shape({
      paymentMethods: PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.shape({
          uuid: PropTypes.string,
          methodName: PropTypes.string,
        })),
      }),
    }),
    locale: PropTypes.string.isRequired,
    formValues: PropTypes.object.isRequired,
  };
  static contextTypes = {
    _reduxForm: PropTypes.shape({
      initialize: PropTypes.func.isRequired,
    }).isRequired,
  };
  static defaultProps = {
    uuid: null,
    depositFulfillment: {},
    paymentMethods: {},
  };

  componentWillReceiveProps({ depositFulfillment: nextDepositFulfillment }) {
    const { uuid, name, type, depositFulfillment, formValues } = this.props;

    const loading = get(depositFulfillment, 'loading', true);
    const nextLoading = get(nextDepositFulfillment, 'loading', true);

    if (uuid && loading && !nextLoading) {
      const data = get(nextDepositFulfillment, 'depositFulfillment.data', null);

      if (data) {
        const { _reduxForm: { initialize } } = this.context;
        const value = { ...deepRemoveKeyByRegex(data, /^__/), type };

        initialize(set({ ...formValues }, name, value));
      }
    }
  }

  render() {
    const {
      uuid,
      name,
      disabled,
      depositFulfillment,
      optionCurrencies,
      paymentMethods: paymentMethodsData,
      locale,
    } = this.props;
    const loading = get(depositFulfillment, 'loading', true);

    const currencies = get(optionCurrencies, 'options.signUp.post.currency.list', []);
    const baseCurrency = get(optionCurrencies, 'options.signUp.post.currency.base', '');
    const paymentMethods = get(paymentMethodsData, 'paymentMethods.data', []);

    return (
      <Placeholder
        ready={!uuid || !loading}
        className={null}
        customPlaceholder={<DefaultLoadingPlaceholder />}
      >
        <div>
          <div className="row">
            <div className="col-6 form-group">
              <label>{I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.DEPOSIT.DEPOSIT_AMOUNT_RANGE')}</label>
              <div className="range-group">
                <MultiCurrencyValue
                  baseName={`${name}.minAmount`}
                  baseCurrency={baseCurrency}
                  currencies={currencies}
                />
                <span className="range-group__separator">-</span>
                <MultiCurrencyValue
                  baseName={`${name}.maxAmount`}
                  baseCurrency={baseCurrency}
                  currencies={currencies}
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
      </Placeholder>
    );
  }
}

export default DepositFulfillmentView;
