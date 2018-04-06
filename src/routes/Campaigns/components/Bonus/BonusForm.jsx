import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import {
  InputField, SelectField, CustomValueFieldVertical,
} from '../../../../../components/ReduxForm';
import renderLabel from '../../../../../utils/renderLabel';
import { attributeLabels, attributePlaceholders, wageringRequirementTypes } from './constants';
import {
  moneyTypeUsage,
  moneyTypeUsageLabels,
  lockAmountStrategy,
  lockAmountStrategyLabels,
} from '../../../../../constants/bonus-campaigns';

class BonusForm extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  render() {
    const {
      onSubmit,
      handleSubmit,
      currencies,
    } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="container-fluid add-campaign-container">
          <div className="row align-items-center">
            <div className="col text-truncate add-campaign-label">
              {I18n.t(attributeLabels.bonusReward)}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <Field
                name="currency"
                label={I18n.t('COMMON.CURRENCY')}
                type="select"
                component={SelectField}
                position="vertical"
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
            <div className="col-md-8">
              <Field
                name="name"
                type="text"
                placeholder=""
                label={I18n.t(attributeLabels.name)}
                component={InputField}
                position="vertical"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <CustomValueFieldVertical
                basename={'prize'}
                label={
                  <span>
                    {I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.MIN_PRIZE')}{' '}
                    <span className="label-additional">{I18n.t('COMMON.OPTIONAL')}</span>
                  </span>
                }
              />
            </div>
            <div className="col-md-6">
              <CustomValueFieldVertical
                basename={'capping'}
                label={
                  <span>
                    {I18n.t(attributeLabels.capping)}{' '}
                    <span className="label-additional">{I18n.t('COMMON.OPTIONAL')}</span>
                  </span>
                }
              />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-7">
              <CustomValueFieldVertical
                basename="grantRatio"
                label={I18n.t(attributeLabels.grant)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-7">
              <CustomValueFieldVertical
                basename="wageringRequirement"
                label={I18n.t(attributeLabels.wageringRequirement)}
              >
                {
                  Object.keys(wageringRequirementTypes).map(key =>
                    <option key={key} value={key}>{key}</option>
                  )
                }
              </CustomValueFieldVertical>
            </div>
          </div>

          <div className="row">
            <div className="col-7">
              <Field
                name="lockAmountStrategy"
                label={I18n.t(attributeLabels.lockAmountStrategy)}
                type="select"
                component={SelectField}
                position="vertical"
              >
                <option value="">{I18n.t('COMMON.SELECT_OPTION.DEFAULT')}</option>
                {Object.keys(lockAmountStrategy).map(key => (
                  <option key={key} value={key}>
                    {renderLabel(key, lockAmountStrategyLabels)}
                  </option>
                ))}
              </Field>
            </div>
          </div>

          <div className="row">
            <div className="col-4">
              <Field
                name="wagerWinMultiplier"
                type="text"
                placeholder="0.00"
                label={I18n.t(attributeLabels.multiplier)}
                component={InputField}
                position="vertical"
              />
            </div>
            <div className="col-5">
              <Field
                name="moneyTypePriority"
                type="text"
                label={I18n.t(attributeLabels.moneyPrior)}
                component={SelectField}
                position="vertical"
              >
                <option value="">{I18n.t('COMMON.SELECT_OPTION.DEFAULT')}</option>
                {Object.keys(moneyTypeUsage).map(key => (
                  <option key={key} value={key}>
                    {renderLabel(key, moneyTypeUsageLabels)}
                  </option>
                ))}
              </Field>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <Field
                name="maxBet"
                type="text"
                placeholder="0"
                label={I18n.t(attributeLabels.maxBet)}
                component={InputField}
                position="vertical"
                iconRightClassName="nas nas-currencies_icon"
              />
            </div>
            <div className="col-4 form-row_with-placeholder-right">
              <Field
                name="bonusLifeTime"
                type="text"
                placeholder="0"
                label={I18n.t(attributeLabels.lifeTime)}
                component={InputField}
                position="vertical"
              />
              <span className="right-placeholder">{I18n.t(attributePlaceholders.days)}</span>
            </div>
          </div>
          <div className="form-group">
            <Field
              name="claimable"
              type="checkbox"
              component="input"
            /> {I18n.t('COMMON.CLAIMABLE')}
          </div>

          <button className="btn btn-primary" type="submit">
            Apply
          </button>

        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'addRewardsBonus',
})(BonusForm);
