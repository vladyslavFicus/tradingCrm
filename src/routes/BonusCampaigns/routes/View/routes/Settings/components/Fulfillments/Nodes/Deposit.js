import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Field } from 'redux-form';
import { InputField, SelectField } from '../../../../../../../../../components/ReduxForm';
import renderLabel from '../../../../../../../../../utils/renderLabel';
import { lockAmountStrategyLabels } from '../../../../../../../../../constants/bonus-campaigns';

class Deposit extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    nodePath: PropTypes.string.isRequired,
    remove: PropTypes.func.isRequired,
    errors: PropTypes.object,
  };

  static defaultProps = {
    disabled: false,
    errors: {},
  };

  buildFieldName = name => `${this.props.nodePath}.${name}`;

  render() {
    const {
      label,
      remove,
      errors,
      disabled,
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
                meta={{
                  touched: true,
                  error: errors[this.buildFieldName('minAmount')],
                }}
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
                meta={{
                  touched: true,
                  error: errors[this.buildFieldName('maxAmount')],
                }}
              />
            </div>
          </div>

          <div className="form-row__big margin-top-10">
            <label>Withdrawal lock</label>
            <div className="range-group">
              <Field
                name={this.buildFieldName('lockAmountStrategy')}
                label={null}
                type="select"
                component={SelectField}
                position="vertical"
                disabled={disabled}
                meta={{
                  touched: true,
                  error: errors[this.buildFieldName('lockAmountStrategy')],
                }}
              >
                <option value="">{I18n.t('BONUS_CAMPAIGNS.CREATE_MODAL.CHOOSE_LOCK_AMOUNT_STRATEGY')}</option>
                {Object.keys(lockAmountStrategyLabels).map(key => (
                  <option key={key} value={key}>
                    {renderLabel(key, lockAmountStrategyLabels)}
                  </option>
                ))}
              </Field>
              <div className="form-group first-deposit">
                <Field
                  name={this.buildFieldName('firstDeposit')}
                  type="checkbox"
                  component="input"
                  disabled={disabled}
                /> First deposit only
              </div>
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
