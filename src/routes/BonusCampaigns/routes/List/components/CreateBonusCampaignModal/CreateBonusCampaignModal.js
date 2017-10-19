import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm, getFormValues, getFormSyncErrors, getFormMeta } from 'redux-form';
import moment from 'moment';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { createValidator } from '../../../../../../utils/validator';
import {
  CustomValueField,
  InputField,
  SelectField,
  DateTimeField,
} from '../../../../../../components/ReduxForm';
import {
  campaignTypes,
  campaignTypesLabels,
  targetTypesLabels,
  customValueFieldTypesByCampaignType,
  moneyTypeUsageLabels,
  lockAmountStrategyLabels,
} from '../../../../../../constants/bonus-campaigns';
import { customValueFieldTypes } from '../../../../../../constants/form';
import renderLabel from '../../../../../../utils/renderLabel';
import { attributeLabels } from './constants';

const CAMPAIGN_NAME_MAX_LENGTH = 100;

const getCustomValueFieldTypes = (campaignType) => {
  if (!campaignType || !customValueFieldTypesByCampaignType[campaignType]) {
    return [customValueFieldTypes.PERCENTAGE, customValueFieldTypes.ABSOLUTE];
  }

  return customValueFieldTypesByCampaignType[campaignType];
};

class CreateBonusCampaignModal extends Component {
  static propTypes = {
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    valid: PropTypes.bool,
    currentValues: PropTypes.object,
    errors: PropTypes.object,
    meta: PropTypes.object,
    change: PropTypes.func.isRequired,
  };
  static defaultProps = {
    pristine: false,
    submitting: false,
    valid: false,
    errors: {},
    meta: {},
    currentValues: {},
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

  render() {
    const {
      handleSubmit,
      onSubmit,
      pristine,
      submitting,
      currencies,
      valid,
      onClose,
      currentValues,
    } = this.props;
    const allowedCustomValueTypes = getCustomValueFieldTypes(currentValues.campaignType);
    const isDepositCampaign = currentValues
      && [campaignTypes.DEPOSIT, campaignTypes.FIRST_DEPOSIT].indexOf(currentValues.campaignType) > -1;

    return (
      <Modal className="create-bonus-campaign-modal" toggle={onClose} isOpen>
        <ModalHeader toggle={onClose}>
          {I18n.t('BONUS_CAMPAIGNS.CREATE_MODAL.TITLE')}
        </ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Field
              name="campaignName"
              label={I18n.t(attributeLabels.campaignName)}
              type="text"
              component={InputField}
            />
            <Field
              name="priority"
              label={I18n.t(attributeLabels.priority)}
              type="text"
              component={InputField}
            />
            <Field
              name="bonusLifetime"
              label={I18n.t(attributeLabels.bonusLifetime)}
              type="text"
              component={InputField}
            />

            <Field
              name="currency"
              label={I18n.t(attributeLabels.currency)}
              type="select"
              component={SelectField}
            >
              <option value="">{I18n.t('BONUS_CAMPAIGNS.CREATE_MODAL.CHOOSE_CURRENCY')}</option>
              {currencies.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Field>

            <Field
              name="moneyTypePriority"
              label={I18n.t(attributeLabels.moneyTypePriority)}
              type="select"
              component={SelectField}
            >
              {Object.keys(moneyTypeUsageLabels).map(key => (
                <option key={key} value={key}>
                  {renderLabel(key, moneyTypeUsageLabels)}
                </option>
              ))}
            </Field>

            <CustomValueField
              basename={'campaignRatio'}
              label={I18n.t(attributeLabels.campaignRatio)}
              typeValues={allowedCustomValueTypes}
              errors={this.getCustomValueFieldErrors('campaignRatio')}
            />
            <CustomValueField
              basename={'conversionPrize'}
              label={I18n.t(attributeLabels.conversionPrize)}
              typeValues={allowedCustomValueTypes}
              errors={this.getCustomValueFieldErrors('conversionPrize')}
            />
            <CustomValueField
              basename={'capping'}
              label={I18n.t(attributeLabels.capping)}
              typeValues={allowedCustomValueTypes}
              errors={this.getCustomValueFieldErrors('capping')}
            />
            <Field
              name="wagerWinMultiplier"
              label={I18n.t(attributeLabels.wagerWinMultiplier)}
              type="text"
              component={InputField}
            />
            <Field
              name="targetType"
              label={I18n.t(attributeLabels.targetType)}
              type="select"
              component={SelectField}
            >
              <option value="">{I18n.t('BONUS_CAMPAIGNS.CREATE_MODAL.CHOOSE_TARGET_TYPE')}</option>
              {Object.keys(targetTypesLabels).map(key => (
                <option key={key} value={key}>
                  {renderLabel(key, targetTypesLabels)}
                </option>
              ))}
            </Field>
            <Field
              name="campaignType"
              label={I18n.t(attributeLabels.campaignType)}
              type="select"
              component={SelectField}
            >
              {Object.keys(campaignTypesLabels).map(key => (
                <option key={key} value={key}>
                  {renderLabel(key, campaignTypesLabels)}
                </option>
              ))}
            </Field>
            {
              isDepositCampaign &&
              <div className="row">
                <div className="col-md-9 ml-auto">
                  <div className="row">
                    <div className="col-md-4">
                      <Field
                        name="minAmount"
                        placeholder={I18n.t(attributeLabels.minAmount)}
                        type="text"
                        component={InputField}
                        position="vertical"
                      />
                    </div>
                    <div className="col-md-4">
                      <Field
                        name="maxAmount"
                        placeholder={I18n.t(attributeLabels.maxAmount)}
                        type="text"
                        component={InputField}
                        position="vertical"
                      />
                    </div>
                    <div className="col-md-4">
                      <Field
                        name="lockAmountStrategy"
                        label={null}
                        type="select"
                        component={SelectField}
                        position="vertical"
                        showErrorMessage={false}
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
              </div>
            }

            <Field
              utc
              name="startDate"
              label={I18n.t(attributeLabels.startDate)}
              component={DateTimeField}
              isValidDate={this.startDateValidator('endDate')}
            />

            <Field
              utc
              name="endDate"
              label={I18n.t(attributeLabels.endDate)}
              component={DateTimeField}
              isValidDate={this.endDateValidator('startDate')}
            />

            <div className="form-group row">
              <div className="col-md-9 ml-auto">
                <div className="checkbox">
                  <label>
                    <Field
                      name="optIn"
                      type="checkbox"
                      component="input"
                    /> {I18n.t(attributeLabels.optIn)}
                  </label>
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <button
              type="reset"
              className="btn btn-default-outline"
              onClick={onClose}
            >
              {I18n.t('COMMON.BUTTONS.CANCEL')}
            </button>
            <button
              type="submit"
              disabled={pristine || submitting || !valid}
              className="btn btn-primary ml-auto"
            >
              {I18n.t('COMMON.BUTTONS.CREATE_AND_OPEN')}
            </button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

const FORM_NAME = 'bonusCampaignCreateForm';

const validatorAttributeLabels = Object.keys(attributeLabels).reduce((res, name) => ({
  ...res,
  [name]: I18n.t(attributeLabels[name]),
}), {});
export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
  errors: getFormSyncErrors(FORM_NAME)(state),
  meta: getFormMeta(FORM_NAME)(state),
}))(
  reduxForm({
    form: FORM_NAME,
    validate: (values) => {
      const allowedCustomValueTypes = getCustomValueFieldTypes(values.campaignType);
      const rules = {
        campaignName: ['required', 'string', `max:${CAMPAIGN_NAME_MAX_LENGTH}`],
        campaignPriority: 'integer',
        startDate: 'required',
        endDate: 'required|nextDate:startDate',
        currency: 'required',
        bonusLifetime: 'required|integer',
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
        wagerWinMultiplier: 'required|integer|max:999',
        campaignType: ['required', `in:${Object.keys(campaignTypesLabels).join()}`],
        targetType: ['required', 'string', `in:${Object.keys(targetTypesLabels).join()}`],
        minAmount: 'min:0',
        maxAmount: 'min:0',
        lockAmountStrategy: 'required',
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

      return createValidator(rules, validatorAttributeLabels, false)(values);
    },
  })(CreateBonusCampaignModal),
);
