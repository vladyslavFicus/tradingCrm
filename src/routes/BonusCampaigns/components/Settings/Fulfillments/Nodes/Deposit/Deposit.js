import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Field } from 'redux-form';
import { InputField, SelectField } from '../../../../../../../components/ReduxForm';
import renderLabel from '../../../../../../../utils/renderLabel';
import { lockAmountStrategyLabels } from '../../../../../../../constants/bonus-campaigns';
import ordinalizeNumber from '../../../../../../../utils/ordinalizeNumber';
import RestrictedPaymentMethods from './RestrictedPaymentMethods';

class Deposit extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    nodePath: PropTypes.string.isRequired,
    remove: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    fetchPaymentMethods: PropTypes.func.isRequired,
    paymentMethods: PropTypes.array,
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  static defaultProps = {
    disabled: false,
    paymentMethods: [],
  };

  componentDidMount() {
    this.props.fetchPaymentMethods();
  }

  buildFieldName = name => `${this.props.nodePath}.${name}`;

  render() {
    const {
      label,
      remove,
      disabled,
      locale,
      paymentMethods,
      currencies,
    } = this.props;

    return (
      <div className="container-fluid add-campaign-container">
        <div className="row align-items-center">
          <div className="col text-truncate add-campaign-label">
            {label}
          </div>
          {
            !disabled &&
            <div className="col-auto text-right">
              <button
                type="button"
                onClick={remove}
                className="btn-transparent add-campaign-remove"
              >
                &times;
              </button>
            </div>
          }
        </div>
        <div className="row">
          <div className="col-6">
            <Field
              name="currency"
              label={I18n.t('COMMON.CURRENCY')}
              type="select"
              component={SelectField}
              position="vertical"
              disabled={disabled}
            >
              <option value="">{I18n.t('BONUS_CAMPAIGNS.SETTINGS.CHOOSE_CURRENCY')}</option>
              {currencies.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Field>
          </div>
        </div>
        <div className="row">
          <div className="col-6 form-group">
            <label>{I18n.t('BONUS_CAMPAIGNS.FULFILLMENTS.DEPOSIT_AMOUNT_RANGE')}</label>
            <div className="range-group">
              <Field
                name={this.buildFieldName('minAmount')}
                type="text"
                placeholder={I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.MIN_AMOUNT_PLACEHOLDER')}
                component={InputField}
                position="vertical"
                disabled={disabled}
                inputAddon={<i className="nas nas-currencies_icon multi-currency-icon" />}
                inputAddonPosition="right"
              />
              <span className="range-group__separator">-</span>
              <Field
                name={this.buildFieldName('maxAmount')}
                type="text"
                placeholder={I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.MAX_AMOUNT_PLACEHOLDER')}
                component={InputField}
                position="vertical"
                disabled={disabled}
                inputAddon={<i className="nas nas-currencies_icon multi-currency-icon" />}
                inputAddonPosition="right"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-5">
            <Field
              name={this.buildFieldName('depositNumber')}
              type="select"
              component={SelectField}
              position="vertical"
              disabled={disabled}
              label={I18n.t('BONUS_CAMPAIGNS.SETTINGS.FULFILLMENT.DEPOSIT_NUMBER_LABEL')}
            >
              <option value="">Any deposit</option>
              {[...new Array(10)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {`
                    ${ordinalizeNumber(i + 1, locale)}
                    ${I18n.t('BONUS_CAMPAIGNS.SETTINGS.FULFILLMENT.DEPOSIT.NUMBER_OPTION')}
                  `}
                </option>
              ))}
            </Field>
          </div>
          <div className="col-7">
            <Field
              name={this.buildFieldName('lockAmountStrategy')}
              label={I18n.t('CONSTANTS.BONUS_CAMPAIGN.LOCK_AMOUNT_STRATEGY.LABEL')}
              type="select"
              component={SelectField}
              position="vertical"
              disabled={disabled}
            >
              <option value="">{I18n.t('BONUS_CAMPAIGNS.CREATE_MODAL.CHOOSE_LOCK_AMOUNT_STRATEGY')}</option>
              {Object.keys(lockAmountStrategyLabels).map(key => (
                <option key={key} value={key}>
                  {renderLabel(key, lockAmountStrategyLabels)}
                </option>
              ))}
            </Field>
          </div>
        </div>
        <RestrictedPaymentMethods
          name={this.buildFieldName('restrictedPaymentMethods')}
          paymentMethods={paymentMethods}
          disabled={disabled}
        />
      </div>
    );
  }
}

export default Deposit;
