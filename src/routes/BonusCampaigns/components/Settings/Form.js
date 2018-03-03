import React, { Component } from 'react';
import { Field, reduxForm, getFormValues, getFormMeta } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import { get, isEmpty } from 'lodash';
import { InputField, SelectField, DateTimeField } from '../../../../components/ReduxForm';
import PropTypes from '../../../../constants/propTypes';
import {
  targetTypes,
  targetTypesLabels,
  optInSelect,
} from '../../../../constants/bonus-campaigns';
import { customValueFieldTypes } from '../../../../constants/form';
import renderLabel from '../../../../utils/renderLabel';
import { nodeGroupTypes, attributeLabels, optInPeriods, optInPeriodsLabels } from './constants';
import { nodeTypes as fulfillmentNodeTypes } from './Fulfillments/constants';
import countries from '../../../../utils/countryList';
import Fulfillments from './Fulfillments';
import Rewards from './Rewards';
import validator from './validator';
import './Form.scss';
import normalizePromoCode from '../../../../utils/normalizePromoCode';
import LinkedCampaign from './LinkedCampaign';
import Countries from './Countries';

const CAMPAIGN_NAME_MAX_LENGTH = 100;

const getCustomValueFieldTypes = (fulfillment) => {
  const isAbsolute = get(fulfillment, fulfillmentNodeTypes.profileCompleted)
    || get(fulfillment, fulfillmentNodeTypes.noFulfillments);

  return isAbsolute
    ? [customValueFieldTypes.ABSOLUTE]
    : [customValueFieldTypes.PERCENTAGE, customValueFieldTypes.ABSOLUTE];
};

class Form extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
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
      bonusLifeTime: PropTypes.bonusCampaignEntity.bonusLifeTime,
      campaignRatio: PropTypes.bonusCampaignEntity.campaignRatio,
      conversionPrize: PropTypes.bonusCampaignEntity.conversionPrize,
      capping: PropTypes.bonusCampaignEntity.capping,
      optIn: PropTypes.bonusCampaignEntity.optIn,
      fulfilmentType: PropTypes.bonusCampaignEntity.fulfilmentType,
      excludeCountries: PropTypes.bonusCampaignEntity.excludeCountries,
    }),
    disabled: PropTypes.bool,
    revert: PropTypes.func.isRequired,
    removeNode: PropTypes.func.isRequired,
    addNode: PropTypes.func.isRequired,
    nodeGroups: PropTypes.shape({
      fulfillments: PropTypes.array.isRequired,
      rewards: PropTypes.array.isRequired,
    }).isRequired,
    games: PropTypes.arrayOf(PropTypes.gameEntity),
    providers: PropTypes.array,
    freeSpinTemplates: PropTypes.array,
    baseCurrency: PropTypes.string.isRequired,
    fetchGames: PropTypes.func.isRequired,
    fetchFreeSpinTemplate: PropTypes.func.isRequired,
    fetchFreeSpinTemplates: PropTypes.func.isRequired,
    handleClickChooseCampaign: PropTypes.func.isRequired,
    linkedCampaign: PropTypes.shape({
      campaignName: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      uuid: PropTypes.string.isRequired,
      authorUUID: PropTypes.string.isRequired,
    }),
    locale: PropTypes.string.isRequired,
    paymentMethods: PropTypes.array,
    fetchPaymentMethods: PropTypes.func.isRequired,
    form: PropTypes.string.isRequired,
    fetchBonusTemplates: PropTypes.func.isRequired,
    fetchBonusTemplate: PropTypes.func.isRequired,
    bonusTemplates: PropTypes.arrayOf(PropTypes.bonusTemplateListEntity),
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
    games: [],
    providers: [],
    freeSpinTemplates: [],
    linkedCampaign: null,
    paymentMethods: [],
  };

  componentWillUnmount() {
    this.props.revert();
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

  handleRevert = () => {
    this.props.revert();
    this.props.reset();
  };

  handleRemoveNode = nodeGroup => node => this.props.removeNode(nodeGroup, node);

  handleAddNode = nodeGroup => (node) => {
    const { change, addNode } = this.props;

    if (nodeGroup === nodeGroupTypes.fulfillments) {
      const isNoFulfilment = node === fulfillmentNodeTypes.noFulfillments;
      const isProfileCompleted = node === fulfillmentNodeTypes.profileCompleted;

      if (isNoFulfilment) {
        change('optIn', true);
      }

      if (isNoFulfilment || isProfileCompleted) {
        ['capping', 'conversionPrize'].forEach((field) => {
          change(`${field}.type`, customValueFieldTypes.ABSOLUTE);
        });
      }
    }
    addNode(nodeGroup, node);
  };

  handleChangeTargetType = (e) => {
    const targetType = e.target.value;

    if (targetType !== targetTypes.LINKED_CAMPAIGN) {
      this.props.change('linkedCampaignUUID', null);
    }

    if (targetType === targetTypes.ALL) {
      this.props.change('optIn', true);
      this.props.change('promoCode', null);
    }
  };

  handleChangeOptIn = (e) => {
    const { change } = this.props;
    const value = e.target.value;

    if (value === 'false' || value === false) {
      change('optInPeriod', null);
      change('optInPeriodTimeUnit', null);
    }

    change('optIn', value);
  };

  handleRemoveLinkedCampaign = () => this.props.change('linkedCampaignUUID', null);

  render() {
    const {
      handleSubmit,
      onSubmit,
      pristine,
      submitting,
      currencies,
      currentValues,
      change,
      nodeGroups,
      disabled,
      games,
      providers,
      freeSpinTemplates,
      bonusTemplates,
      baseCurrency,
      fetchFreeSpinTemplate,
      fetchBonusTemplates,
      fetchBonusTemplate,
      fetchFreeSpinTemplates,
      fetchGames,
      handleClickChooseCampaign,
      linkedCampaign,
      locale,
      fetchPaymentMethods,
      form,
      paymentMethods,
    } = this.props;

    const allowedCustomValueTypes = getCustomValueFieldTypes(currentValues.fulfillments);
    const isOptInDisabled = disabled || currentValues.targetType === targetTypes.ALL
      || get(currentValues.fulfillments, fulfillmentNodeTypes.noFulfillments);

    return (
      <form id={form} className="campaign-settings" onSubmit={handleSubmit(onSubmit)}>
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-6 text-truncate campaign-settings__title">
              {I18n.t('BONUS_CAMPAIGNS.SETTINGS.CAMPAIGN_SETTINGS')}
            </div>
            {
              !(pristine || submitting) &&
              <div className="col-md-6 text-md-right">
                <button
                  onClick={this.handleRevert}
                  className="btn btn-default-outline text-uppercase margin-right-20"
                  type="button"
                >
                  {I18n.t('COMMON.REVERT_CHANGES')}
                </button>
                <button className="btn btn-primary text-uppercase" type="submit" id="bonus-campaign-save-button">
                  {I18n.t('COMMON.SAVE_CHANGES')}
                </button>
              </div>
            }
          </div>
          <hr />
          <div className="row">
            <div className="col-md-7">
              <Field
                id={`${form}СampaignName`}
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
            <div className="col-md-4">
              <div className="form-group">
                <label>{I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.CAMPAIGN_PERIOD')}</label>
                <div className="range-group">
                  <Field
                    utc
                    name="startDate"
                    id={`${form}StartDate`}
                    component={DateTimeField}
                    isValidDate={this.startDateValidator('endDate')}
                    position="vertical"
                    disabled={disabled}
                  />
                  <span className="range-group__separator">-</span>
                  <Field
                    utc
                    name="endDate"
                    id={`${form}EndDate`}
                    component={DateTimeField}
                    isValidDate={this.endDateValidator('startDate')}
                    position="vertical"
                    disabled={disabled}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid my-3">
          <div className="text-truncate campaign-settings__title">
            {I18n.t('BONUS_CAMPAIGNS.SETTINGS.TARGET')}
          </div>
          <hr />
          <div className="row">
            <div className="col-3">
              <Field
                name="targetType"
                label={I18n.t(attributeLabels.targetType)}
                type="select"
                disabled={disabled}
                id={`${form}TargetType`}
                position="vertical"
                component={SelectField}
                onChange={this.handleChangeTargetType}
              >
                <option value="">{I18n.t('BONUS_CAMPAIGNS.SETTINGS.CHOOSE_TARGET_TYPE')}</option>
                {Object.keys(targetTypes).map(key => (
                  <option key={key} value={key}>
                    {renderLabel(key, targetTypesLabels)}
                  </option>
                ))}
              </Field>
            </div>
            {
              currentValues.targetType === targetTypes.LINKED_CAMPAIGN &&
              <div className="col-auto pl-0 align-self-center">
                <button
                  onClick={handleClickChooseCampaign}
                  className="btn btn-default-outline text-uppercase w-100"
                  type="button"
                >
                  {I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.CHOOSE_CAMPAIGN')}
                </button>
              </div>
            }
            <div className="col-3">
              <Field
                name="optIn"
                label={I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.OPT_IN')}
                type="select"
                id={`${form}TargetTypeOptIn`}
                component={SelectField}
                position="vertical"
                disabled={isOptInDisabled}
                onChange={this.handleChangeOptIn}
              >
                {Object.keys(optInSelect).map(key => (
                  <option key={key} value={key}>
                    {renderLabel(key, optInSelect)}
                  </option>
                ))}
              </Field>
            </div>
            {
              (currentValues.optIn === 'true' || currentValues.optIn === true) &&
              <div className="col-3">
                <div className="form-group">
                  <label>{I18n.t(attributeLabels.optInPeriod)}</label>
                  <div className="form-row">
                    <div className="col-4">
                      <Field
                        name="optInPeriod"
                        id={`${form}OptInPeriod`}
                        type="number"
                        placeholder=""
                        disabled={disabled}
                        component={InputField}
                        position="vertical"
                      />
                    </div>
                    <div className="col">
                      <Field
                        name="optInPeriodTimeUnit"
                        id={`${form}OptInPeriodTimeUnit`}
                        type="select"
                        component={SelectField}
                        position="vertical"
                        disabled={disabled}
                      >
                        <option value="">{I18n.t('BONUS_CAMPAIGNS.SETTINGS.SELECT_OPT_IN_PERIOD')}</option>
                        {
                          Object.keys(optInPeriods).map(period => (
                            <option key={period} value={period}>
                              {renderLabel(period, optInPeriodsLabels)}
                            </option>
                          ))
                        }
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            }
            {
              currentValues && currentValues.targetType === targetTypes.TARGET_LIST &&
              <div className="col-2">
                <Field
                  name="promoCode"
                  type="text"
                  label={I18n.t(attributeLabels.promoCode)}
                  component={InputField}
                  normalize={normalizePromoCode}
                  position="vertical"
                  disabled={disabled}
                />
              </div>
            }
            <Countries disabled={disabled} />
          </div>
          <div className="row">
            <div className="col-md-6">
              <Field
                name="linkedCampaignUUID"
                hidden="hidden"
                type="text"
                component="input"
              />
              <LinkedCampaign
                linkedCampaign={linkedCampaign}
                targetType={currentValues.targetType}
                linkedCampaignUUID={currentValues.linkedCampaignUUID}
                remove={this.handleRemoveLinkedCampaign}
              />
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-6 text-truncate campaign-settings__title">
              {I18n.t('BONUS_CAMPAIGNS.SETTINGS.FULFILLMENTS')}
            </div>
            <div className="col-6 text-truncate campaign-settings__title">
              {I18n.t('BONUS_CAMPAIGNS.SETTINGS.REWARDS')}
            </div>
          </div>
          <hr />
          <div className="row">
            <Fulfillments
              locale={locale}
              disabled={disabled}
              change={change}
              activeNodes={nodeGroups.fulfillments}
              remove={this.handleRemoveNode(nodeGroupTypes.fulfillments)}
              add={this.handleAddNode(nodeGroupTypes.fulfillments)}
              fetchPaymentMethods={fetchPaymentMethods}
              paymentMethods={paymentMethods}
              currencies={currencies}
            />
            <Rewards
              disabled={disabled}
              currencies={currencies}
              change={change}
              activeNodes={nodeGroups.rewards}
              allowedCustomValueTypes={allowedCustomValueTypes}
              remove={this.handleRemoveNode(nodeGroupTypes.rewards)}
              add={this.handleAddNode(nodeGroupTypes.rewards)}
              games={games}
              providers={providers}
              freeSpinTemplates={freeSpinTemplates}
              bonusTemplates={bonusTemplates}
              baseCurrency={baseCurrency}
              fetchFreeSpinTemplate={fetchFreeSpinTemplate}
              fetchBonusTemplates={fetchBonusTemplates}
              fetchBonusTemplate={fetchBonusTemplate}
              fetchGames={fetchGames}
              fetchFreeSpinTemplates={fetchFreeSpinTemplates}
            />
          </div>
        </div>
      </form>
    );
  }
}

const SettingsForm = reduxForm({
  enableReinitialize: true,
  validate: values => validator(values, {
    allowedCustomValueTypes: getCustomValueFieldTypes(values),
    countries,
  }),
})(Form);

export default connect((state, { form }) => {
  const currentValues = getFormValues(form)(state);

  return {
    currentValues,
    meta: getFormMeta(form)(state),
    fulfillmentExist: currentValues && !isEmpty(currentValues.fulfillments),
  };
})(SettingsForm);
