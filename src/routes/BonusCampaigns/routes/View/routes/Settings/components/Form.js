import React, { Component } from 'react';
import { Field, reduxForm, getFormValues, getFormSyncErrors, getFormMeta } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import _ from 'lodash';
import {
  InputField, SelectField, DateTimeField, CustomValueFieldVertical, NasSelectField,
} from '../../../../../../../components/ReduxForm';
import PropTypes from '../../../../../../../constants/propTypes';
import {
  campaignTypes,
  targetTypes,
  targetTypesLabels,
  optInSelect,
} from '../../../../../../../constants/bonus-campaigns';
import { customValueFieldTypes } from '../../../../../../../constants/form';
import renderLabel from '../../../../../../../utils/renderLabel';
import getSubFieldErrors from '../../../../../../../utils/getSubFieldErrors';
import { nodeGroupTypes, attributeLabels } from '../constants';
import { nodeTypes as fulfillmentNodeTypes } from './Fulfillments/constants';
import countries from '../../../../../../../utils/countryList';
import Fulfillments from './Fulfillments';
import Rewards from './Rewards';
import validator from './validator';
import './Form.scss';

const CAMPAIGN_NAME_MAX_LENGTH = 100;

const getCustomValueFieldTypes = (fulfillment) => {
  const profileCompleted = _.get(fulfillment, fulfillmentNodeTypes.profileCompleted);

  return profileCompleted
    ? [customValueFieldTypes.ABSOLUTE]
    : [customValueFieldTypes.PERCENTAGE, customValueFieldTypes.ABSOLUTE];
};

class Form extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    valid: PropTypes.bool,
    fulfillmentExist: PropTypes.bool,
    reset: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    errors: PropTypes.object,
    meta: PropTypes.object,
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
    currentValues: PropTypes.shape({
      campaignName: PropTypes.bonusCampaignEntity.campaignName,
      targetType: PropTypes.bonusCampaignEntity.targetType,
      currency: PropTypes.bonusCampaignEntity.currency,
      startDate: PropTypes.bonusCampaignEntity.startDate,
      endDate: PropTypes.bonusCampaignEntity.endDate,
      wagerWinMultiplier: PropTypes.bonusCampaignEntity.wagerWinMultiplier,
      promoCode: PropTypes.bonusCampaignEntity.promoCode,
      bonusLifetime: PropTypes.bonusCampaignEntity.bonusLifetime,
      campaignRatio: PropTypes.bonusCampaignEntity.campaignRatio,
      conversionPrize: PropTypes.bonusCampaignEntity.conversionPrize,
      capping: PropTypes.bonusCampaignEntity.capping,
      optIn: PropTypes.bonusCampaignEntity.optIn,
      campaignType: PropTypes.bonusCampaignEntity.campaignType,
      excludeCountries: PropTypes.bonusCampaignEntity.excludeCountries,
    }),
    disabled: PropTypes.bool,
    toggleModal: PropTypes.func.isRequired,
    revert: PropTypes.func.isRequired,
    removeNode: PropTypes.func.isRequired,
    addNode: PropTypes.func.isRequired,
    nodeGroups: PropTypes.shape({
      fulfillments: PropTypes.array.isRequired,
      rewards: PropTypes.array.isRequired,
    }).isRequired,
  };
  static defaultProps = {
    handleSubmit: null,
    currentValues: {},
    disabled: false,
    meta: {},
    submitting: false,
    pristine: false,
    valid: false,
    fulfillmentExist: false,
    errors: {},
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

    this.props.revert();
    this.props.reset();
  };

  handleRemoveNode = nodeGroup => node => this.props.removeNode(nodeGroup, node);
  handleAddNode = nodeGroup => node => this.props.addNode(nodeGroup, node);

  handleChangeTargetType = (e) => {
    if (e.target.value === targetTypes.ALL) {
      this.props.change('optIn', true);
    }
  };

  render() {
    const {
      handleSubmit,
      onSubmit,
      pristine,
      submitting,
      valid,
      fulfillmentExist,
      currencies,
      currentValues,
      change,
      nodeGroups,
      disabled,
      toggleModal,
      errors,
    } = this.props;

    const allowedCustomValueTypes = getCustomValueFieldTypes(currentValues.fulfillments);

    return (
      <form className="form-horizontal campaign-settings" onSubmit={handleSubmit(onSubmit)}>
        <div className="tab-header">
          <div className="tab-header__heading">
            {I18n.t('BONUS_CAMPAIGNS.SETTINGS.CAMPAIGN_SETTINGS')}
          </div>
          {!(disabled || pristine || submitting || !valid || !_.isEmpty(errors) || !fulfillmentExist) &&
          <div className="tab-header__actions">
            <button
              onClick={this.handleRevert}
              className="btn btn-default-outline text-uppercase margin-right-20"
              type="submit"
            >
              {I18n.t('COMMON.REVERT_CHANGES')}
            </button>
            <button className="btn btn-primary text-uppercase" type="submit" id="bonus-campaign-save-button">
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
                  id="bonus-campaign-name"
                  name="campaignName"
                  label={I18n.t(attributeLabels.campaignName)}
                  type="text"
                  component={InputField}
                  position="vertical"
                  disabled={disabled}
                />
                <div className="form-group__note">
                  {
                    currentValues && currentValues.campaignName
                      ? currentValues.campaignName.length
                      : 0
                  }/{CAMPAIGN_NAME_MAX_LENGTH}
                </div>
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
                    id="bonus-campaign-conversion-prize"
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
                    modalOpen={toggleModal}
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
                    onClick={toggleModal}
                    modalOpen={toggleModal}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group">
                <label>{I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.CAMPAIGN_PERIOD')}</label>
                <div className="range-group">
                  <Field
                    utc
                    name="startDate"
                    placeholder={attributeLabels.startDate}
                    component={DateTimeField}
                    isValidDate={this.startDateValidator('endDate')}
                    position="vertical"
                    disabled={disabled}
                  />
                  <span className="range-group__separator">-</span>
                  <Field
                    utc
                    name="endDate"
                    placeholder={attributeLabels.endDate}
                    component={DateTimeField}
                    isValidDate={this.endDateValidator('startDate')}
                    position="vertical"
                    disabled={disabled}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-row__big">
                  <Field
                    name="promoCode"
                    type="text"
                    label={I18n.t(attributeLabels.promoCode)}
                    component={InputField}
                    position="vertical"
                    disabled={disabled}
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
                onChange={this.handleChangeTargetType}
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
                id="bonus-campaign-target-type"
                name="optIn"
                label={I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.TYPE')}
                type="select"
                component={SelectField}
                position="vertical"
                disabled={disabled || currentValues.targetType === targetTypes.ALL}
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
                name="countries"
                label={
                  <span>
                    {I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.COUNTRIES')}
                    <span className="label-action">
                      <Field
                        disabled={disabled}
                        name="excludeCountries"
                        type="checkbox"
                        component="input"
                      />
                      {I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.EXCLUDE')}
                    </span>
                  </span>
                }
                component={NasSelectField}
                position="vertical"
                disabled={disabled}
                multiple
              >
                {Object
                  .keys(countries)
                  .map(key => <option key={key} value={key}>{countries[key]}</option>)
                }
              </Field>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <div className="tab-header">
              <div className="tab-header__heading">
                {I18n.t('BONUS_CAMPAIGNS.SETTINGS.FULFILLMENTS')}
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="tab-header pl-0">
              <div className="tab-header__heading">
                {I18n.t('BONUS_CAMPAIGNS.SETTINGS.REWARDS')}
              </div>
            </div>
          </div>
        </div>
        <div className="campaign-settings-content">
          <hr />
          <div className="row padding-bottom-30">
            <Fulfillments
              disabled={disabled}
              change={change}
              activeNodes={nodeGroups.fulfillments}
              errors={getSubFieldErrors(errors, nodeGroupTypes.fulfillments)}
              remove={this.handleRemoveNode(nodeGroupTypes.fulfillments)}
              add={this.handleAddNode(nodeGroupTypes.fulfillments)}
            />
            <Rewards
              disabled={disabled}
              change={change}
              activeNodes={nodeGroups.rewards}
              allowedCustomValueTypes={allowedCustomValueTypes}
              errors={getSubFieldErrors(errors, nodeGroupTypes.rewards)}
            />
          </div>
        </div>
      </form>
    );
  }
}

const FORM_NAME = 'updateBonusCampaignSettings';

const SettingsForm = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  validate: values => validator(values, {
    allowedCustomValueTypes: getCustomValueFieldTypes(values),
    countries,
  }),
})(Form);

export default connect((state) => {
  const currentValues = getFormValues(FORM_NAME)(state);

  return {
    currentValues,
    errors: getFormSyncErrors(FORM_NAME)(state),
    meta: getFormMeta(FORM_NAME)(state),
    fulfillmentExist: currentValues && !_.isEmpty(currentValues.fulfillments),
  };
})(SettingsForm);
