import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import {
  InputField, SelectField, CustomValueFieldVertical,
} from '../../../../../../../components/ReduxForm';
import renderLabel from '../../../../../../../utils/renderLabel';
import { attributeLabels, attributePlaceholders } from './constants';
import { moneyTypeUsage, moneyTypeUsageLabels } from '../../../../../../../constants/bonus-campaigns';

class Bonus extends Component {
  static propTypes = {
    typeValues: PropTypes.array.isRequired,
    nodePath: PropTypes.string.isRequired,
    errors: PropTypes.object,
    disabled: PropTypes.bool,
    remove: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
    limits: true,
    errors: {},
  };

  buildFieldName = name => `${this.props.nodePath}.${name}`;

  render() {
    const {
      typeValues,
      errors,
      disabled,
      remove,
    } = this.props;

    return (
      <div className="add-campaign-container">
        <div className="add-campaign-label">
          {I18n.t(attributeLabels.bonusReward)}
        </div>
        <div className="form-row">
          <div className="form-row__big">
            <CustomValueFieldVertical
              disabled={disabled}
              basename={this.buildFieldName('campaignRatio')}
              label={I18n.t(attributeLabels.grant)}
              typeValues={typeValues}
              errors={errors}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-row__small">
            <Field
              name={this.buildFieldName('wagerWinMultiplier')}
              type="text"
              placeholder="0.00"
              label={I18n.t(attributeLabels.multiplier)}
              component={InputField}
              position="vertical"
              disabled={disabled}
              meta={{
                touched: true,
                error: errors[this.buildFieldName('wagerWinMultiplier')],
              }}
            />
          </div>
          <div className="form-row__medium">
            <Field
              name={this.buildFieldName('moneyTypePriority')}
              type="text"
              label={I18n.t(attributeLabels.moneyPrior)}
              component={SelectField}
              position="vertical"
              disabled={disabled}
              meta={{
                touched: true,
                error: errors[this.buildFieldName('moneyTypePriority')],
              }}
            >
              <option value="">{I18n.t('COMMON.SELECT_OPTION.DEFAULT')}</option>
              {Object.keys(moneyTypeUsage).map(key => (
                <option key={key} value={key}>
                  {renderLabel(key, moneyTypeUsageLabels)}
                </option>
              ))}
            </Field>
          </div>
          <div className="form-row__small form-row_with-placeholder-right">
            <Field
              name={this.buildFieldName('bonusLifetime')}
              type="text"
              placeholder="0"
              label={I18n.t(attributeLabels.lifeTime)}
              component={InputField}
              position="vertical"
              disabled={disabled}
              meta={{
                touched: true,
                error: errors[this.buildFieldName('bonusLifetime')],
              }}
            />
            <span className="right-placeholder">{I18n.t(attributePlaceholders.days)}</span>
          </div>
        </div>
        <div className="form-row">
          <div className="form-row__big">
            <div className="form-group">
              <Field
                name={this.buildFieldName('claimable')}
                type="checkbox"
                component="input"
                disabled={disabled}
              /> Claimable
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

export default Bonus;
