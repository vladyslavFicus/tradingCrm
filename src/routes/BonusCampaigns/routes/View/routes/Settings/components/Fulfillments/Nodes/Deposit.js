import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Field } from 'redux-form';
import { InputField, SelectField } from '../../../../../../../../../components/ReduxForm';
import renderLabel from '../../../../../../../../../utils/renderLabel';
import { lockAmountStrategyLabels } from '../../../../../../../../../constants/bonus-campaigns';
import ordinalizeNumber from '../../../../../../../../../utils/ordinalizeNumber';

class Deposit extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    nodePath: PropTypes.string.isRequired,
    remove: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
  };

  static defaultProps = {
    disabled: false,
  };

  buildFieldName = name => `${this.props.nodePath}.${name}`;

  render() {
    const {
      label,
      remove,
      disabled,
      locale,
    } = this.props;

    return (
      <div className="add-campaign-container">
        <div className="add-campaign-label">
          {label}
        </div>
        <div className="form-row">
          <div className="form-row__big">
            <label>{I18n.t('BONUS_CAMPAIGNS.FULFILLMENTS.DEPOSIT_AMOUNT_RANGE')}</label>
            <div className="range-group">
              <Field
                name={this.buildFieldName('minAmount')}
                type="text"
                placeholder={I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.MIN_AMOUNT_PLACEHOLDER')}
                component={InputField}
                showErrorMessage
                position="vertical"
                disabled={disabled}
                iconRightClassName="nas nas-currencies_icon"
              />
              <span className="range-group__separator">-</span>
              <Field
                name={this.buildFieldName('maxAmount')}
                type="text"
                placeholder={I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.MAX_AMOUNT_PLACEHOLDER')}
                component={InputField}
                position="vertical"
                disabled={disabled}
                iconRightClassName="nas nas-currencies_icon"
              />
            </div>
          </div>
        </div>
        <div className="filter-row">
          <div className="filter-row__small">
            <label>{I18n.t('BONUS_CAMPAIGNS.SETTINGS.FULFILLMENT.DEPOSIT_NUMBER_LABEL')}</label>
            <div className="range-group">
              <Field
                name={this.buildFieldName('depositNumber')}
                label={null}
                type="select"
                component={SelectField}
                position="vertical"
                disabled={disabled}
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
          </div>
          <div className="filter-row__medium">
            <label>Withdrawal lock</label>
            <div className="range-group">
              <Field
                name={this.buildFieldName('lockAmountStrategy')}
                label={null}
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
        </div>
        {
          !disabled &&
          <button
            type="button"
            onClick={remove}
            className="btn-transparent add-campaign-remove"
          >
            &times;
          </button>
        }
      </div>
    );
  }
}

export default Deposit;
