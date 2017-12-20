import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm, getFormValues, getFormSyncErrors, getFormMeta } from 'redux-form';
import moment from 'moment';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import {
  CustomValueField,
  InputField,
  SelectField,
  DateTimeField,
} from '../../../../../../components/ReduxForm';
import {
  campaignTypes,
  campaignTypesLabels,
  targetTypes,
  targetTypesLabels,
  customValueFieldTypesByCampaignType,
  moneyTypeUsageLabels,
  lockAmountStrategyLabels,
} from '../../../../../../constants/bonus-campaigns';
import { customValueFieldTypes } from '../../../../../../constants/form';
import renderLabel from '../../../../../../utils/renderLabel';
import { attributeLabels } from './constants';
import validator from './validator';

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
    types: PropTypes.arrayOf(PropTypes.string).isRequired,
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

  handleChangeTargetType = (e) => {
    if (e.target.value === targetTypes.ALL) {
      this.handleEnableOptIn();
    }
  };

  handleChangeCampaignType = (e) => {
    if (e.target.value === campaignTypes.WITHOUT_FULFILMENT) {
      this.handleEnableOptIn();
    }
  };

  handleEnableOptIn = () => this.props.change('optIn', true);

  render() {
    const {
      handleSubmit,
      onSubmit,
      types,
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
              id="create-campaign-name"
            />
            <Field
              name="bonusLifetime"
              label={I18n.t(attributeLabels.bonusLifetime)}
              type="text"
              component={InputField}
              id="create-campaign-bonus-life-time"
            />
            <Field
              name="currency"
              label={I18n.t(attributeLabels.currency)}
              type="select"
              component={SelectField}
              id="create-campaign-currency"
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
              valueId="create-campaign-ratio-value"
            />
            <CustomValueField
              basename={'conversionPrize'}
              label={I18n.t(attributeLabels.conversionPrize)}
              typeValues={allowedCustomValueTypes}
              errors={this.getCustomValueFieldErrors('conversionPrize')}
              valueId="create-campaign-conversion-prize-value"
            />
            <CustomValueField
              basename={'capping'}
              label={I18n.t(attributeLabels.capping)}
              typeValues={allowedCustomValueTypes}
              errors={this.getCustomValueFieldErrors('capping')}
              valueId="create-campaign-capping-value"
            />
            <Field
              name="wagerWinMultiplier"
              label={I18n.t(attributeLabels.wagerWinMultiplier)}
              type="text"
              component={InputField}
              id="create-campaign-wager-win-multiplier"
            />
            <Field
              name="targetType"
              label={I18n.t(attributeLabels.targetType)}
              type="select"
              component={SelectField}
              id="create-campaign-target-type"
              onChange={this.handleChangeTargetType}
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
              onChange={this.handleChangeCampaignType}
            >
              {types.map(item => (
                <option key={item} value={item}>
                  {renderLabel(item, campaignTypesLabels)}
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
                        id="create-campaign-min-lock-amount"
                      />
                    </div>
                    <div className="col-md-4">
                      <Field
                        name="maxAmount"
                        placeholder={I18n.t(attributeLabels.maxAmount)}
                        type="text"
                        component={InputField}
                        position="vertical"
                        id="create-campaign-max-lock-amount"
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
                        id="create-campaign-lock-strategy"
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
            {
              currentValues && currentValues.targetType === targetTypes.TARGET_LIST &&
              <Field
                name="promoCode"
                label={I18n.t(attributeLabels.promoCode)}
                type="text"
                component={InputField}
                id="create-campaign-promo-code"
              />
            }
            <Field
              utc
              name="startDate"
              label={I18n.t(attributeLabels.startDate)}
              component={DateTimeField}
              isValidDate={this.startDateValidator('endDate')}
              id="create-campaign-start-date"
            />
            <Field
              utc
              name="endDate"
              label={I18n.t(attributeLabels.endDate)}
              component={DateTimeField}
              isValidDate={this.endDateValidator('startDate')}
              id="create-campaign-end-date"
            />
            <div className="form-group row">
              <div className="col-md-9 ml-auto">
                <div className="checkbox">
                  <label>
                    <Field
                      name="optIn"
                      type="checkbox"
                      component="input"
                      id="create-campaign-optin"
                      disabled={
                        currentValues.targetType === targetTypes.ALL ||
                        currentValues.campaignType === campaignTypes.WITHOUT_FULFILMENT
                      }
                    /> {I18n.t(attributeLabels.optIn)}
                  </label>
                </div>
              </div>
            </div>
            <div className="form-group row">
              <div className="col-md-9 ml-auto">
                <div className="checkbox">
                  <label>
                    <Field
                      name="claimable"
                      type="checkbox"
                      component="input"
                      id="create-campaign-claimable"
                    /> {I18n.t(attributeLabels.claimable)}
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
              id="create-campaign-submit-button"
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

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
  errors: getFormSyncErrors(FORM_NAME)(state),
  meta: getFormMeta(FORM_NAME)(state),
}))(
  reduxForm({
    form: FORM_NAME,
    validate: (values, props) => validator(values, {
      allowedCustomValueTypes: getCustomValueFieldTypes(values),
      campaignType: props.types,
    }),
  })(CreateBonusCampaignModal),
);
