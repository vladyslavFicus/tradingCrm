import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import {
  InputField, SelectField, CustomValueFieldVertical,
} from '../../../../../../../../../../components/ReduxForm';
import renderLabel from '../../../../../../../../../../utils/renderLabel';
import { attributeLabels, attributePlaceholders } from './constants';
import { multipliersTypes, moneyTypeUsageLabels } from '../../../../../../../../../../constants/bonus-campaigns';

class Bonus extends Component {
  static propTypes = {
    typeValues: PropTypes.array.isRequired,
    errors: PropTypes.object,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
    limits: true,
    errors: {},
  };

  render() {
    const {
      typeValues,
      errors,
      disabled,
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
              basename={'rewards.bonus.campaignRatio'}
              label={I18n.t(attributeLabels.grant)}
              typeValues={typeValues}
              errors={errors}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-row__small">
            <Field
              name="rewards.bonus.wagerWinMultiplier"
              type="text"
              placeholder="0.00"
              label={I18n.t(attributeLabels.multiplier)}
              component={InputField}
              position="vertical"
              disabled={disabled}
              meta={{
                touched: true,
                error: errors['rewards.bonus.wagerWinMultiplier'],
              }}
            />
          </div>
          <div className="form-row__medium">
            <Field
              name="rewards.bonus.moneyTypePriority"
              type="text"
              label={I18n.t(attributeLabels.moneyPrior)}
              component={SelectField}
              position="vertical"
              disabled={disabled}
              meta={{
                touched: true,
                error: errors['rewards.bonus.moneyTypePriority'],
              }}
            >
              {Object.keys(moneyTypeUsageLabels).map(key => (
                <option key={key} value={key}>
                  {renderLabel(key, moneyTypeUsageLabels)}
                </option>
              ))}
            </Field>
          </div>

          <div className="form-row__small form-row_with-placeholder-right">
            <Field
              name="rewards.bonus.bonusLifetime"
              type="text"
              placeholder="0"
              label={I18n.t(attributeLabels.lifeTime)}
              component={InputField}
              position="vertical"
              disabled={disabled}
              meta={{
                touched: true,
                error: errors['rewards.bonus.bonusLifetime'],
              }}
            />
            <span className="right-placeholder">{I18n.t(attributePlaceholders.days)}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Bonus;
