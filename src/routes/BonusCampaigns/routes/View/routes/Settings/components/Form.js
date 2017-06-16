import React, { Component } from 'react';
import { Field, reduxForm, getFormValues, getFormSyncErrors, getFormMeta } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import {
  InputField, SelectField, DateTimeField, CustomValueFieldVertical,
} from '../../../../../../../components/ReduxForm';
import ReactSwitch from '../../../../../../../components/ReactSwitch';
import PropTypes from '../../../../../../../constants/propTypes';
import {
  campaignTypes,
  campaignTypesLabels,
  targetTypesLabels,
  customValueFieldTypesByCampaignType,
} from '../../../../../../../constants/bonus-campaigns';
import { customValueFieldTypes } from '../../../../../../../constants/form';
import { createValidator } from '../../../../../../../utils/validator';
import renderLabel from '../../../../../../../utils/renderLabel';
import { attributeLabels, attributePlaceholders } from '../constants';

const CAMPAIGN_NAME_MAX_LENGTH = 100;
const FORM_NAME = 'updateBonusCampaignSettings';

const getCustomValueFieldTypes = (campaignType) => {
  if (!campaignType || !customValueFieldTypesByCampaignType[campaignType]) {
    return [customValueFieldTypes.PERCENTAGE, customValueFieldTypes.ABSOLUTE];
  }

  return customValueFieldTypesByCampaignType[campaignType];
};

const validator = (values) => {
  const allowedCustomValueTypes = getCustomValueFieldTypes(values.campaignType);
  const rules = {
    campaignName: ['required', 'string', `max:${CAMPAIGN_NAME_MAX_LENGTH}`],
    campaignPriority: 'integer',
    optIn: 'boolean',
    targetType: ['required', 'string', `in:${Object.keys(targetTypesLabels).join()}`],
    currency: 'required',
    startDate: 'required',
    endDate: 'required|nextDate:startDate',
    wagerWinMultiplier: 'required|integer|max:999',
    bonusLifetime: 'required|integer',
    campaignType: ['required', 'string', `in:${Object.keys(campaignTypesLabels).join()}`],
    campaignRatio: {
      value: 'required|numeric|customTypeValue.value',
      type: ['required', `in:${allowedCustomValueTypes.join()}`],
    },
    capping: {
      value: ['numeric', 'customTypeValue.value'],
      type: [`in:${allowedCustomValueTypes.join()}`],
    },
    conversionPrize: {
      value: ['numeric', 'customTypeValue.value'],
      type: [`in:${allowedCustomValueTypes.join()}`],
    },
    minAmount: 'min:0',
    maxAmount: 'min:0',
  };

  if (values.minAmount) {
    const minAmount = parseFloat(values.minAmount).toFixed(2);

    if (!isNaN(minAmount)) {
      rules.maxAmount = 'greaterOrSame:minAmount';
    }
  }

  if (values.maxAmount) {
    const maxAmount = parseFloat(values.maxAmount).toFixed(2);

    if (!isNaN(maxAmount)) {
      rules.minAmount = 'lessOrSame:maxAmount';
    }
  }

  if (values.conversionPrize && values.conversionPrize.value) {
    const value = parseFloat(values.conversionPrize.value).toFixed(2);

    if (!isNaN(value)) {
      rules.capping.value.push('greaterThan:conversionPrize.value');
    }
  }

  if (values.capping && values.capping.value) {
    const value = parseFloat(values.capping.value).toFixed(2);

    if (!isNaN(value)) {
      rules.conversionPrize.value.push('lessThan:capping.value');
    }
  }

  return createValidator(
    rules,
    Object.keys(attributeLabels).reduce((res, name) => ({ ...res, [name]: I18n.t(attributeLabels[name]) }), {}),
    false
  )(values);
};

class Form extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    valid: PropTypes.bool,
    reset: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    errors: PropTypes.object,
    meta: PropTypes.object,
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
    currentValues: PropTypes.shape({
      campaignName: PropTypes.bonusCampaignEntity.campaignName,
      campaignPriority: PropTypes.bonusCampaignEntity.campaignPriority,
      targetType: PropTypes.bonusCampaignEntity.targetType,
      currency: PropTypes.bonusCampaignEntity.currency,
      startDate: PropTypes.bonusCampaignEntity.startDate,
      endDate: PropTypes.bonusCampaignEntity.endDate,
      wagerWinMultiplier: PropTypes.bonusCampaignEntity.wagerWinMultiplier,
      bonusLifetime: PropTypes.bonusCampaignEntity.bonusLifetime,
      campaignRatio: PropTypes.bonusCampaignEntity.campaignRatio,
      conversionPrize: PropTypes.bonusCampaignEntity.conversionPrize,
      capping: PropTypes.bonusCampaignEntity.capping,
      optIn: PropTypes.bonusCampaignEntity.optIn,
      campaignType: PropTypes.bonusCampaignEntity.campaignType,
    }),
    disabled: PropTypes.bool,
  };
  static defaultProps = {
    currentValues: {},
    disabled: false,
  };

  componentWillReceiveProps(nextProps) {
    const { currentValues, change } = this.props;
    const { currentValues: { campaignType: nextCampaignType } } = nextProps;
    if (currentValues && currentValues.campaignType &&
      currentValues.campaignType !== nextCampaignType &&
      nextCampaignType === campaignTypes.PROFILE_COMPLETED
    ) {
      ['campaignRatio', 'capping', 'conversionPrize'].forEach((field) => {
        change(`${field}.type`, customValueFieldTypes.ABSOLUTE);
      });
    }
  }

  startDateValidator = toAttribute => (current) => {
    const { currentValues } = this.props;

    return currentValues && current.isSameOrAfter(moment().subtract(1, 'd')) && (
      currentValues[toAttribute]
        ? current.isSameOrBefore(moment(currentValues[toAttribute]))
        : true
    );
  };

  endDateValidator = fromAttribute => (current) => {
    const { currentValues } = this.props;

    return currentValues && current.isSameOrAfter(moment().subtract(1, 'd')) && (
      currentValues[fromAttribute]
        ? current.isSameOrAfter(moment(currentValues[fromAttribute]))
        : true
    );
  };

  handleRevert = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.props.reset();
  };

  getCustomValueFieldErrors = (name) => {
    const { errors, meta } = this.props;

    if (meta && meta[name]) {
      if ((meta[name].value && meta[name].value.touched) || (meta[name].type && meta[name].type.touched)) {
        return errors;
      }
    }

    return {};
  };

  renderSwitchField = ({ input, wrapperClassName }) => {
    const onClick = () => input.onChange(!input.value);

    return (
      <span className={wrapperClassName}>
        <ReactSwitch
          on={input.value}
          className="vertical-align-middle"
          onClick={onClick}
        />
      </span>
    );
  };

  render() {
    const {
      handleSubmit,
      onSubmit,
      pristine,
      submitting,
      valid,
      errors,
      currencies,
      currentValues,
      disabled,
    } = this.props;

    const allowedCustomValueTypes = getCustomValueFieldTypes(currentValues.campaignType);

    return (
      <div>
        <form className="form-horizontal" role="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <h5 className="pull-left">
              {I18n.t('BONUS_CAMPAIGNS.SETTINGS.CAMPAIGN_SETTINGS')}
            </h5>
            { !(disabled || pristine || submitting || !valid) &&
            <div className="pull-right">
              <button
                onClick={this.handleRevert}
                className="btn btn-sm margin-right-20"
                type="submit"
              >
                {I18n.t('COMMON.REVERT_CHANGES')}
              </button>
              <button className="btn btn-sm btn-primary" type="submit">
                {I18n.t('COMMON.SAVE_CHANGES')}
              </button>
            </div>
            }
          </div>
          <div className="row">
            <div className="col-md-6">
              <Field
                name="campaignName"
                label={I18n.t(attributeLabels.campaignName)}
                type="text"
                component={InputField}
                position="vertical"
                disabled={disabled}
              />
              <div className="color-default font-size-10">
                {
                  currentValues && currentValues.campaignName
                    ? currentValues.campaignName.length
                    : 0
                }/{CAMPAIGN_NAME_MAX_LENGTH}
              </div>
            </div>
            <div className="col-md-2">
              <Field
                name="campaignPriority"
                label={I18n.t(attributeLabels.campaignPriority)}
                type="text"
                component={InputField}
                position="vertical"
                disabled={disabled}
              />
            </div>
          </div>
          <hr />
          <div className="row">
            <h5 className="pull-left">
              {I18n.t('BONUS_CAMPAIGNS.SETTINGS.TARGET')}
            </h5>
          </div>
          <div className="row">
            <div className="col-md-3">
              <Field
                name="targetType"
                label={I18n.t(attributeLabels.targetType)}
                type="select"
                disabled
                position="vertical"
                component={SelectField}
              >
                <option value="">{I18n.t('BONUS_CAMPAIGNS.SETTINGS.CHOOSE_TARGET_TYPE')}</option>
                {Object.keys(targetTypesLabels).map(key => (
                  <option key={key} value={key}>
                    {renderLabel(key, targetTypesLabels)}
                  </option>
                ))}
              </Field>
            </div>

            <div className="col-md-1">
              <div className="form-group">
                <label className="form-control-label">
                  {I18n.t(attributeLabels.optIn)}
                </label>
                <Field
                  name="optIn"
                  className="form-control"
                  wrapperClassName="display-block font-size-12 margin-top-10"
                  component={this.renderSwitchField}
                  disabled={disabled}
                />
              </div>
            </div>

            <div className="col-md-2">
              <Field
                name="currency"
                label={I18n.t(attributeLabels.currency)}
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

            <div className="col-md-3">
              <Field
                name="startDate"
                label={I18n.t(attributeLabels.startDate)}
                position="vertical"
                component={DateTimeField}
                isValidDate={this.startDateValidator('endDate')}
                disabled={disabled}
              />
            </div>

            <div className="col-md-3">
              <Field
                name="endDate"
                label={I18n.t(attributeLabels.endDate)}
                position="vertical"
                component={DateTimeField}
                isValidDate={this.endDateValidator('startDate')}
                disabled={disabled}
              />
            </div>
          </div>

          <hr />
          <div className="row">
            <h5 className="pull-left">
              {I18n.t('BONUS_CAMPAIGNS.SETTINGS.FULFILLMENT')}
            </h5>
          </div>
          <div className="row">
            <div className="col-md-3">
              <Field
                name="campaignType"
                label={I18n.t(attributeLabels.campaignType)}
                type="select"
                position="vertical"
                component={SelectField}
                disabled={disabled}
              >
                {Object.keys(campaignTypesLabels).map(key => (
                  <option key={key} value={key}>
                    {renderLabel(key, campaignTypesLabels)}
                  </option>
                ))}
              </Field>
            </div>
            <div className="col-md-3">
              <CustomValueFieldVertical
                basename={'campaignRatio'}
                label={I18n.t(attributeLabels.campaignRatio)}
                typeValues={allowedCustomValueTypes}
                errors={this.getCustomValueFieldErrors('campaignRatio')}
                disabled={disabled}
              />
              <div className="color-default font-size-10">
                {I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.RATIO_TOOLTIP')}
              </div>
            </div>
            {
              currentValues && currentValues.campaignType !== campaignTypes.PROFILE_COMPLETED &&
              <div className="form-group col-md-6">
                <label className="form-control-label">
                  {I18n.t('BONUS_CAMPAIGNS.SETTINGS.DEPOSIT_AMOUNT')}
                  {' '}
                  <span className="font-size-10 text-muted">
                    {I18n.t('COMMON.OPTIONAL')}
                  </span>
                </label>

                <div>
                  <div className="width-200 display-inline-block margin-inline">
                    <Field
                      name="minAmount"
                      label={''}
                      placeholder={I18n.t(attributePlaceholders.minAmount)}
                      type="text"
                      component={InputField}
                      position="vertical"
                      disabled={disabled}
                    />
                  </div>

                  <div className="width-200 display-inline-block margin-inline">
                    <Field
                      name="maxAmount"
                      label={''}
                      placeholder={I18n.t(attributePlaceholders.maxAmount)}
                      type="text"
                      component={InputField}
                      position="vertical"
                      disabled={disabled}
                    />
                  </div>
                </div>
              </div>
            }
          </div>

          <hr />
          <div className="row">
            <h5 className="pull-left">
              {I18n.t('BONUS_CAMPAIGNS.SETTINGS.REWARD')}
            </h5>
          </div>
          <div className="row">
            <div className="col-md-1">
              <Field
                name="wagerWinMultiplier"
                position="vertical"
                placeholder=" "
                label={I18n.t(attributeLabels.wagerWinMultiplier)}
                type="text"
                component={InputField}
                disabled={disabled}
              />
            </div>

            <div className="col-md-2">
              <Field
                name="bonusLifetime"
                position="vertical"
                label={I18n.t(attributeLabels.bonusLifetime)}
                type="text"
                component={InputField}
                inputAddon={<span>days</span>}
                inputAddonPosition="right"
                disabled={disabled}
              />
            </div>

            <div className="col-md-3">
              <CustomValueFieldVertical
                basename={'capping'}
                label={
                  <div>
                    {I18n.t(attributeLabels.capping)}{' '}
                    <span className="font-size-10 text-muted">{I18n.t('COMMON.OPTIONAL')}</span>
                  </div>
                }
                typeValues={allowedCustomValueTypes}
                errors={this.getCustomValueFieldErrors('capping')}
                disabled={disabled}
              />
            </div>

            <div className="col-md-3">
              <CustomValueFieldVertical
                basename={'conversionPrize'}
                label={
                  <div>
                    {I18n.t(attributeLabels.conversionPrize)}{' '}
                    <span className="font-size-10 text-muted">{I18n.t('COMMON.OPTIONAL')}</span>
                  </div>
                }
                typeValues={allowedCustomValueTypes}
                errors={this.getCustomValueFieldErrors('conversionPrize')}
                disabled={disabled}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const SettingsForm = reduxForm({
  form: FORM_NAME,
  validate: validator,
})(Form);

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
  errors: getFormSyncErrors(FORM_NAME)(state),
  meta: getFormMeta(FORM_NAME)(state),
}))(SettingsForm);

