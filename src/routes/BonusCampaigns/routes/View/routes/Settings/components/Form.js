import React, { Component } from 'react';
import { Field, reduxForm, getFormValues, getFormSyncErrors, getFormMeta } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import {
  InputField, SelectField, DateTimeField, CustomValueFieldVertical,
} from '../../../../../../../components/ReduxForm';
import PropTypes from '../../../../../../../constants/propTypes';
import {
  campaignTypes,
  campaignTypesLabels,
  targetTypesLabels,
  customValueFieldTypesByCampaignType,
  moneyTypeUsageLabels,
  optInSelect,
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
    name: ['required', 'string', `max:${CAMPAIGN_NAME_MAX_LENGTH}`],
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
      name: PropTypes.bonusCampaignEntity.name,
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

  getCustomValueFieldErrors = (name) => {
    const { errors, meta } = this.props;

    if (meta && meta[name]) {
      if ((meta[name].value && meta[name].value.touched) || (meta[name].type && meta[name].type.touched)) {
        return errors;
      }
    }

    return {};
  };

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

  render() {
    const {
      handleSubmit,
      onSubmit,
      pristine,
      submitting,
      valid,
      currencies,
      currentValues,
      disabled,
    } = this.props;

    const allowedCustomValueTypes = getCustomValueFieldTypes(currentValues.campaignType);

    return (
      <form className="form-horizontal campaign-settings" onSubmit={handleSubmit(onSubmit)}>
        <div className="tab-header">
          <div className="tab-header__heading">
            {I18n.t('BONUS_CAMPAIGNS.SETTINGS.CAMPAIGN_SETTINGS')}
          </div>
          {!(disabled || pristine || submitting || !valid) &&
          <div className="tab-header__actions">
            <button
              onClick={this.handleRevert}
              className="btn btn-default-outline text-uppercase margin-right-20"
              type="submit"
            >
              {I18n.t('COMMON.REVERT_CHANGES')}
            </button>
            <button className="btn btn-primary text-uppercase" type="submit">
              {I18n.t('COMMON.SAVE_CHANGES')}
            </button>
          </div>
          }
        </div>
        <div className="campaign-settings-content">
          <hr />
          <div className="row">
            <div className="col-lg-7">
              <div>
                <Field
                  name="name"
                  label={I18n.t(attributeLabels.name)}
                  type="text"
                  component={InputField}
                  position="vertical"
                  disabled={disabled}
                />
                <div className="form-group__note">
                  {
                    currentValues && currentValues.name
                      ? currentValues.name.length
                      : 0
                  }/{CAMPAIGN_NAME_MAX_LENGTH}
                </div>
              </div>
              <div className="margin-top-10 margin-bottom-20">
                <Field
                  name="description"
                  label={I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.DESCRIPTION')}
                  type="text"
                  component={InputField}
                  position="vertical"
                  disabled
                />
              </div>
              <div className="form-row">
                <div className="form-row__small">
                  <Field
                    name="currency"
                    label={I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.BASE_CURRENCY')}
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
                <div className="form-row__medium">
                  <CustomValueFieldVertical
                    basename={'conversionPrize'}
                    label={
                      <span>
                        {I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.MIN_PRIZE')}{' '}
                        <span className="label-additional">{I18n.t('COMMON.OPTIONAL')}</span>
                      </span>
                    }
                    typeValues={allowedCustomValueTypes}
                    errors={this.getCustomValueFieldErrors('conversionPrize')}
                    disabled={disabled}
                  />
                </div>
                <div className="form-row__medium">
                  <CustomValueFieldVertical
                    basename={'capping'}
                    label={
                      <span>
                        {I18n.t(attributeLabels.capping)}{' '}
                        <span className="label-additional">{I18n.t('COMMON.OPTIONAL')}</span>
                      </span>
                    }
                    typeValues={allowedCustomValueTypes}
                    errors={this.getCustomValueFieldErrors('capping')}
                    disabled={disabled}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group">
                <label>{I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.CAMPAIGN_PERIOD')}</label>
                <div className="range-group">
                  <Field
                    name="startDate"
                    placeholder={attributeLabels.startDate}
                    component={DateTimeField}
                    isValidDate={this.startDateValidator('endDate')}
                    position="vertical"
                  />
                  <span className="range-group__separator">-</span>
                  <Field
                    name="endDate"
                    placeholder={attributeLabels.endDate}
                    component={DateTimeField}
                    isValidDate={this.endDateValidator('startDate')}
                    position="vertical"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tab-header">
          <div className="tab-header__heading">
            {I18n.t('BONUS_CAMPAIGNS.SETTINGS.TARGET')}
          </div>
        </div>
        <div className="campaign-settings-content">
          <hr />
          <div className="filter-row">
            <div className="filter-row__medium">
              <Field
                name="targetType"
                label={I18n.t(attributeLabels.targetType)}
                type="select"
                disabled={disabled}
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
            <div className="filter-row__small">
              <Field
                name="optIn"
                label={I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.TYPE')}
                type="text"
                component={SelectField}
                position="vertical"
                disabled={disabled}
              >
                {Object.keys(optInSelect).map(key => (
                  <option key={key} value={key}>
                    {renderLabel(key, optInSelect)}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__big">
              <Field
                name="affiliates"
                label={
                  <span>
                    {I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.AFFILIATES')}
                    <span className="label-action">
                      <input type="checkbox" />
                      {I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.EXCLUDE')}
                    </span>
                  </span>
                }
                type="text"
                component={InputField}
                position="vertical"
                disabled={disabled}
                placeholder="78987987, 867868768, 786876876"
              />
            </div>
            <div className="filter-row__big">
              <Field
                name="countries"
                label={
                  <span>
                    {I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.COUNTRIES')}
                    <span className="label-action">
                      <input type="checkbox" />
                      {I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.EXCLUDE')}
                    </span>
                  </span>
                }
                type="text"
                component={InputField}
                position="vertical"
                disabled={disabled}
                placeholder="France, Germany"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <div className="tab-header">
              <div className="tab-header__heading">
                {I18n.t('BONUS_CAMPAIGNS.SETTINGS.FULFILLMENT')}
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="tab-header">
              <div className="tab-header__heading">
                {I18n.t('BONUS_CAMPAIGNS.SETTINGS.REWARD')}
              </div>
            </div>
          </div>
        </div>













        {/*<div>*/}
          {/*<div className="filter-row">*/}
            {/*<div className="filter-row__small">*/}
              {/*<Field*/}
                {/*name="campaignPriority"*/}
                {/*label={I18n.t(attributeLabels.campaignPriority)}*/}
                {/*type="text"*/}
                {/*component={InputField}*/}
                {/*position="vertical"*/}
                {/*disabled={disabled}*/}
              {/*/>*/}
            {/*</div>*/}
            {/*<div className="filter-row__small">*/}
              {/*<Field*/}
                {/*name="moneyTypePriority"*/}
                {/*label={I18n.t(attributeLabels.moneyTypePriority)}*/}
                {/*type="text"*/}
                {/*component={SelectField}*/}
                {/*position="vertical"*/}
                {/*disabled={disabled}*/}
              {/*>*/}
                {/*{Object.keys(moneyTypeUsageLabels).map(key => (*/}
                  {/*<option key={key} value={key}>*/}
                    {/*{renderLabel(key, moneyTypeUsageLabels)}*/}
                  {/*</option>*/}
                {/*))}*/}
              {/*</Field>*/}
            {/*</div>*/}

          {/*</div>*/}
          {/*<hr />*/}
          {/*<div className="filter-row">*/}
            {/*<div className="filter-row__medium">*/}
              {/*<Field*/}
                {/*name="campaignType"*/}
                {/*label={I18n.t(attributeLabels.campaignType)}*/}
                {/*type="select"*/}
                {/*position="vertical"*/}
                {/*component={SelectField}*/}
                {/*disabled={disabled}*/}
              {/*>*/}
                {/*{Object.keys(campaignTypesLabels).map(key => (*/}
                  {/*<option key={key} value={key}>*/}
                    {/*{renderLabel(key, campaignTypesLabels)}*/}
                  {/*</option>*/}
                {/*))}*/}
              {/*</Field>*/}
            {/*</div>*/}
            {/*<div className="filter-row__medium">*/}
              {/*<CustomValueFieldVertical*/}
                {/*basename={'campaignRatio'}*/}
                {/*label={I18n.t(attributeLabels.campaignRatio)}*/}
                {/*typeValues={allowedCustomValueTypes}*/}
                {/*errors={this.getCustomValueFieldErrors('campaignRatio')}*/}
                {/*disabled={disabled}*/}
              {/*/>*/}
              {/*<div className="form-group__note">*/}
                {/*{I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.RATIO_TOOLTIP')}*/}
              {/*</div>*/}
            {/*</div>*/}
            {/*{*/}
              {/*currentValues && currentValues.campaignType !== campaignTypes.PROFILE_COMPLETED &&*/}
              {/*<div className="filter-row__medium">*/}
                {/*<div className="form-group">*/}
                  {/*<label>*/}
                    {/*{I18n.t('BONUS_CAMPAIGNS.SETTINGS.DEPOSIT_AMOUNT')}*/}
                    {/*{' '}*/}
                    {/*<span className="font-size-10 text-muted">*/}
                    {/*{I18n.t('COMMON.OPTIONAL')}*/}
                  {/*</span>*/}
                  {/*</label>*/}
                  {/*<div className="range-group">*/}
                    {/*<Field*/}
                      {/*name="minAmount"*/}
                      {/*label={''}*/}
                      {/*placeholder={I18n.t(attributePlaceholders.minAmount)}*/}
                      {/*type="text"*/}
                      {/*component={InputField}*/}
                      {/*position="vertical"*/}
                      {/*disabled={disabled}*/}
                    {/*/>*/}
                    {/*<span className="range-group__separator">-</span>*/}
                    {/*<Field*/}
                      {/*name="maxAmount"*/}
                      {/*label={''}*/}
                      {/*placeholder={I18n.t(attributePlaceholders.maxAmount)}*/}
                      {/*type="text"*/}
                      {/*component={InputField}*/}
                      {/*position="vertical"*/}
                      {/*disabled={disabled}*/}
                    {/*/>*/}
                  {/*</div>*/}
                {/*</div>*/}
              {/*</div>*/}
            {/*}*/}
          {/*</div>*/}
          {/*<hr />*/}
          {/*<div className="filter-row">*/}
            {/*<div className="filter-row__small">*/}
              {/*<Field*/}
                {/*name="wagerWinMultiplier"*/}
                {/*position="vertical"*/}
                {/*placeholder=" "*/}
                {/*label={I18n.t(attributeLabels.wagerWinMultiplier)}*/}
                {/*type="text"*/}
                {/*component={InputField}*/}
                {/*disabled={disabled}*/}
              {/*/>*/}
            {/*</div>*/}
            {/*<div className="filter-row__small">*/}
              {/*<Field*/}
                {/*name="bonusLifetime"*/}
                {/*position="vertical"*/}
                {/*label={I18n.t(attributeLabels.bonusLifetime)}*/}
                {/*type="text"*/}
                {/*component={InputField}*/}
                {/*inputAddon={<span>days</span>}*/}
                {/*inputAddonPosition="right"*/}
                {/*disabled={disabled}*/}
              {/*/>*/}
            {/*</div>*/}
          {/*</div>*/}
        {/*</div>*/}


      </form>
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


