import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import moment from 'moment';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import {
  InputField,
  SelectField,
  DateTimeField,
  RangeGroup,
  MultiInputField,
  PeriodUnitField,
} from '../../../../components/ReduxForm';
import {
  nodeGroups,
  nodeGroupsAlias,
  nodeGroupValidateMessage,
  attributeLabels,
  rewardTemplateTypes,
  rewardTypesLabels,
  fulfillmentTypes,
  fulfillmentTypesLabels,
  optInSelect,
  periods,
  periodsLabels,
} from '../../constants';
import NodeBuilder from '../NodeBuilder';
import { BonusView } from '../Rewards/Bonus';
import { FreeSpinView } from '../Rewards/FreeSpin';
import Tag from '../Rewards/Tag';
import { WageringFulfillment, DepositFulfillment, GamingFulfillment, SimpleFulfillment } from '../Fulfillments';
import { createValidator, translateLabels } from '../../../../utils/validator';
import Permissions from '../../../../utils/permissions';
import permissions from '../../../../config/permissions';
import { withReduxFormValues, withNotifications } from '../../../../components/HighOrder';
import renderLabel from '../../../../utils/renderLabel';
import normalizeBoolean from '../../../../utils/normalizeBoolean';
import normalizePromoCode from '../../../../utils/normalizePromoCode';
import countries from '../../../../utils/countryList';
import { targetTypes, targetTypesLabels } from '../../../../constants/campaigns';
import Countries from '../Countries';
import { aggregationTypes, moneyTypes, spinTypes, gameFilters } from '../Fulfillments/GamingFulfillment/constants';
import '../../../../styles/campaigns.scss';

const CAMPAIGN_NAME_MAX_LENGTH = 100;

const getAllowedTargetTypes = (optIn) => {
  const allowedTargetTypes = Object.keys(targetTypes);

  return optIn ? allowedTargetTypes : allowedTargetTypes.filter(type => type !== targetTypes.REGISTRATION);
};

class Form extends Component {
  static propTypes = {
    reset: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    form: PropTypes.string.isRequired,
    formValues: PropTypes.shape({
      name: PropTypes.string,
    }),
    disabled: PropTypes.bool,
    change: PropTypes.func.isRequired,
  };
  static contextTypes = {
    permissions: PropTypes.array.isRequired,
  };
  static defaultProps = {
    disabled: false,
    handleSubmit: null,
    pristine: false,
    submitting: false,
    formValues: {},
  };

  componentWillReceiveProps({ disabled: nextDisabled }) {
    const { reset, disabled } = this.props;

    if (nextDisabled && !disabled) {
      reset();
    }
  }

  getAllowedNodes = (items, prefix = '') => {
    const { permissions: currentPermissions } = this.context;

    return items.filter(({ type }) => !permissions[`${type}${prefix}`] ||
      new Permissions(permissions[`${type}${prefix}`].CREATE &&
        permissions[`${type}${prefix}`].VIEW).check(currentPermissions))
      .reduce((acc, { type, component, ...rest }) => ({ ...acc, [type]: { component, ...rest } }), {});
  };

  setField = (field, value) => {
    this.props.change(field, value);
  };

  clearFields = (fields) => {
    fields.forEach(field => this.props.change(field, null));
  };

  endDateValidator = fromAttribute => (current) => {
    const { formValues } = this.props;

    return formValues && current.isSameOrAfter(moment().subtract(1, 'd')) && (
      formValues[fromAttribute]
        ? current.isSameOrAfter(moment(formValues[fromAttribute]))
        : true
    );
  };

  handleChangeTargetType = ({ target: { value } }) => {
    if (value === targetTypes.TARGET_LIST) {
      this.clearFields(['countries', 'excludeCountries']);
      this.setField('tags', []);
    }
  };

  handleChangeOptIn = ({ target: { value } }) => {
    if (value === 'false') {
      this.clearFields(['optInPeriod', 'optInPeriodTimeUnit']);
      this.setField('targetType', targetTypes.ALL);
    }
  };

  handleSubmit = (formData) => {
    let valid = true;

    [nodeGroups.REWARDS].forEach((nodeGroup) => {
      if (!formData[nodeGroupsAlias[nodeGroup]].length) {
        this.props.notify({
          level: 'error',
          title: I18n.t(nodeGroupValidateMessage[nodeGroup]),
        });
        valid = false;
      }
    });

    if (!valid) {
      throw new SubmissionError({});
    }

    return this.props.onSubmit(formData);
  };

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      formValues,
      formValues: { optIn },
      form,
      reset,
      disabled,
    } = this.props;

    const allowedTargetTypes = getAllowedTargetTypes(optIn);

    return (
      <form id={form} onSubmit={handleSubmit(this.handleSubmit)} className="campaign-create">
        <div className="row">
          <div className="col-auto campaign-create__title">
            {I18n.t('CAMPAIGNS.SETTINGS.CAMPAIGN_SETTINGS')}
          </div>
          <If condition={!pristine}>
            <div className="col-auto ml-auto">
              <button
                disabled={submitting}
                onClick={reset}
                className="btn btn-default-outline text-uppercase mr-3"
                type="button"
              >
                {I18n.t('COMMON.REVERT_CHANGES')}
              </button>
              <button
                disabled={submitting}
                className="btn btn-primary text-uppercase"
                type="submit"
                id="bonus-campaign-save-button"
              >
                {I18n.t('COMMON.SAVE_CHANGES')}
              </button>
            </div>
          </If>
        </div>
        <hr className="mt-2" />
        <div className="row">
          <Field
            id={`${form}Name`}
            name="name"
            disabled={disabled || submitting}
            label={I18n.t(attributeLabels.campaignName)}
            type="text"
            component={InputField}
            helpText={
              <Choose>
                <When condition={formValues && formValues.name}>
                  {formValues.name.length}/{CAMPAIGN_NAME_MAX_LENGTH}
                </When>
                <Otherwise>
                  0/{CAMPAIGN_NAME_MAX_LENGTH}
                </Otherwise>
              </Choose>
            }
            className="col-md-6"
          />
          <RangeGroup
            className="col-md-4"
            label={I18n.t('CAMPAIGNS.SETTINGS.LABEL.CAMPAIGN_PERIOD')}
          >
            <Field
              utc
              name="startDate"
              component={DateTimeField}
              isValidDate={() => true}
              disabled={disabled}
              id="campaign-start-date"
              pickerClassName="left-side"
            />
            <Field
              utc
              name="endDate"
              component={DateTimeField}
              isValidDate={this.endDateValidator('startDate')}
              disabled={disabled}
              id="campaign-end-date"
            />
          </RangeGroup>
        </div>
        <div className="campaign-create__title">
          {I18n.t('CAMPAIGNS.SETTINGS.TARGET')}
        </div>
        <hr className="mt-2" />
        <div className="row">
          <Field
            name="targetType"
            label={I18n.t(attributeLabels.targetType)}
            type="select"
            disabled={disabled}
            id={`${form}TargetType`}
            component={SelectField}
            onChange={this.handleChangeTargetType}
            className="col-lg-3"
          >
            {allowedTargetTypes.map(targetType => (
              <option key={targetType} value={targetType}>
                {renderLabel(targetType, targetTypesLabels)}
              </option>
            ))}
          </Field>
          <If condition={formValues.targetType === targetTypes.TARGET_LIST}>
            <Field
              name="tags"
              label={I18n.t(attributeLabels.tags)}
              component={MultiInputField}
              async
              disabled={disabled}
              placeholder={I18n.t('PLAYER_PROFILE.TAGS.ADD_TAGS')}
              className="col-6"
            />
          </If>
        </div>
        <div className="row">
          <Field
            name="optIn"
            label={I18n.t(attributeLabels.optIn)}
            type="select"
            id="campaign-opt-in"
            component={SelectField}
            normalize={normalizeBoolean}
            disabled={disabled}
            onChange={this.handleChangeOptIn}
            className="col-lg-3"
          >
            {Object.keys(optInSelect).map(key => (
              <option key={key} value={key}>
                {renderLabel(key, optInSelect)}
              </option>
            ))}
          </Field>
          <If condition={formValues.optIn}>
            <Field
              component={PeriodUnitField}
              name="optInPeriod"
              className="col-lg-3"
              label={I18n.t(attributeLabels.optInPeriod)}
              disabled={disabled}
              id="campaign-opt-in-period"
            >
              {Object.keys(periods).map(period => (
                <option key={period} value={period}>
                  {renderLabel(period, periodsLabels)}
                </option>
              ))}
            </Field>
          </If>
          <Field
            name="fulfillmentPeriod"
            component={PeriodUnitField}
            className="col-lg-3"
            label={I18n.t(attributeLabels.fulfillmentPeriod)}
            disabled={disabled}
            id="campaign-fulfillment-period"
          >
            {Object.keys(periods).map(period => (
              <option key={period} value={period}>
                {renderLabel(period, periodsLabels)}
              </option>
            ))}
          </Field>
        </div>
        <div className="row">
          <Countries
            className="col-3"
            disabled={disabled}
            formValues={formValues}
          />
          <If condition={formValues.targetType === targetTypes.TARGET_LIST}>
            <Field
              name="promoCode"
              type="text"
              label={I18n.t(attributeLabels.promoCode)}
              component={InputField}
              normalize={normalizePromoCode}
              disabled={disabled}
              className="col-3"
            />
          </If>
        </div>
        <div className="row mt-2">
          <div className="col-6 pb-2 campaign-create__title with-right-border">
            {I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.TITLE')}
          </div>
          <div className="col-6 pb-2 campaign-create__title">
            {I18n.t('CAMPAIGNS.SETTINGS.REWARDS.TITLE')}
          </div>
        </div>
        <hr className="my-0" />
        <div className="row">
          <NodeBuilder
            name="fulfillments"
            disabled={disabled}
            className="col-6 pt-3 with-right-border"
            nodeSelectLabel={I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.SELECT_FULFILLMENT')}
            nodeButtonLabel={I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENTS.ADD_FULFILLMENT')}
            components={
              this.getAllowedNodes([
                { type: fulfillmentTypes.WAGERING, component: WageringFulfillment },
                { type: fulfillmentTypes.DEPOSIT, component: DepositFulfillment },
                { type: fulfillmentTypes.GAMING, component: GamingFulfillment },
                { type: fulfillmentTypes.PROFILE_COMPLETED, component: SimpleFulfillment, single: true },
              ], '_FULFILLMENT')
            }
            typeLabels={fulfillmentTypesLabels}
          />
          <NodeBuilder
            name="rewards"
            disabled={disabled}
            className="col-6 pt-3"
            nodeSelectLabel={I18n.t('CAMPAIGNS.SETTINGS.REWARDS.SELECT_REWARD')}
            nodeButtonLabel={I18n.t('CAMPAIGNS.SETTINGS.REWARDS.ADD_REWARD')}
            components={
              this.getAllowedNodes([
                { type: rewardTemplateTypes.BONUS, component: BonusView },
                { type: rewardTemplateTypes.FREE_SPIN, component: FreeSpinView },
                { type: rewardTemplateTypes.TAG, component: Tag },
              ], '_TEMPLATE')
            }
            typeLabels={rewardTypesLabels}
          />
        </div>
      </form>
    );
  }
}

export default compose(
  withNotifications,
  reduxForm({
    enableReinitialize: true,
    touchOnChange: true,
    validate: (values) => {
      const allowedTargetTypes = getAllowedTargetTypes(get(values, 'optIn', false));

      const rules = {
        name: ['required', 'string'],
        targetType: ['required', 'string', `in:${allowedTargetTypes.join()}`],
        tags: ['array'],
        countries: `in:,${Object.keys(countries).join()}`,
        excludeCountries: ['boolean'],
        optInPeriod: ['numeric', 'min:1'],
        fulfillmentPeriod: ['numeric', 'min:1'],
        optInPeriodTimeUnit: [`in:${Object.keys(periods).join()}`],
        fulfillmentPeriodTimeUnit: [`in:${Object.keys(periods).join()}`],
        promoCode: ['string', 'min:4'],
        optIn: ['boolean', 'required'],
        startDate: ['regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/'],
        endDate: ['regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/', 'daysRangeBetween:startDate:230'],
      };

      const fulfillments = get(values, 'fulfillments', []);

      if (fulfillments.length > 0) {
        rules.fulfillments = {};
      }

      if (values.optInPeriod) {
        rules.optInPeriodTimeUnit.push('required');
      }

      if (values.optInPeriodTimeUnit) {
        rules.optInPeriod.push('required');
      }

      if (values.fulfillmentPeriod) {
        rules.fulfillmentPeriodTimeUnit.push('required');
      }

      if (values.fulfillmentPeriodTimeUnit) {
        rules.fulfillmentPeriod.push('required');
      }

      if (
        values.optInPeriod &&
        values.optInPeriodTimeUnit &&
        values.fulfillmentPeriod &&
        values.fulfillmentPeriodTimeUnit
      ) {
        rules.fulfillmentPeriod.push('periodGreaterOrSame:optInPeriod');
      }

      fulfillments.forEach((fulfillment, index) => {
        if (fulfillment.type === fulfillmentTypes.DEPOSIT) {
          rules.fulfillments[index] = {
            'minAmount[0].amount': ['numeric', 'min:1'],
            'maxAmount[0].amount': ['numeric', 'min:1', `greaterOrSame:fulfillments[${index}].minAmount[0].amount`],
          };
        }

        if (fulfillment.type === fulfillmentTypes.WAGERING) {
          rules.fulfillments[index] = {
            'amounts[0].amount': ['required', 'numeric', 'greater:0'],
          };
        }

        if (fulfillment.type === fulfillmentTypes.GAMING) {
          rules.fulfillments[index] = {
            aggregationType: ['required', 'string', `in:${Object.keys(aggregationTypes).join()}`],
            moneyType: ['required', 'string', `in:${Object.keys(moneyTypes).join()}`],
            spinType: ['required', 'string', `in:${Object.keys(spinTypes).join()}`],
            amountCount: ['numeric', 'min:1'],
            gameFilter: ['required', 'string', `in:${Object.keys(gameFilters).join()}`],
            gameList: ['array'],
          };

          if (
            values.fulfillments[index].gameFilter === gameFilters.CUSTOM ||
            values.fulfillments[index].gameFilter === gameFilters.PROVIDER
          ) {
            rules.fulfillments[index].gameList.push('required');
          }

          if (values.fulfillments[index].aggregationType === aggregationTypes.SUM) {
            rules.fulfillments[index] = {
              ...rules.fulfillments[index],
              'amountSum[0].amount': ['required', 'numeric', 'min:1'],
            };
          } else if (values.fulfillments[index].aggregationType === aggregationTypes.COUNT) {
            rules.fulfillments[index].amountCount.push('required');
          }
        }
      });

      const rewards = get(values, 'rewards', []);

      if (rewards.length > 0) {
        rules.rewards = {};
      }

      rewards.forEach((reward, index) => {
        if (reward.type === rewardTemplateTypes.TAG) {
          rules.rewards[index] = {
            tagName: ['required'],
          };
        } else {
          rules.rewards[index] = {
            deviceType: ['required'],
            uuid: ['required'],
          };
        }
      });

      return createValidator(rules, translateLabels(attributeLabels), false)(values);
    },
  }),
  withReduxFormValues
)(Form);
