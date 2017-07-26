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
  DateTimeField
} from '../../../../../../components/ReduxForm';
import {
  campaignTypes,
  campaignTypesLabels,
  targetTypesLabels,
  customValueFieldTypesByCampaignType,
  moneyTypeUsageLabels
} from '../../../../../../constants/bonus-campaigns';
import { customValueFieldTypes } from '../../../../../../constants/form';
import renderLabel from '../../../../../../utils/renderLabel';

const CAMPAIGN_NAME_MAX_LENGTH = 100;
const FORM_NAME = 'bonusCampaignCreateForm';

const attributeLabels = {
  name: 'Name',
  priority: 'Priority',
  startDate: 'Start date',
  endDate: 'End date',
  currency: 'Currency',
  moneyTypePriority: 'Money type priority',
  bonusLifetime: 'Lifetime',
  campaignRatio: 'Ratio',
  'campaignRatio.value': 'Ratio',
  'campaignRatio.type': 'Ratio value type',
  capping: 'Capping',
  'capping.value': 'Capping',
  'capping.type': 'Capping value type',
  conversionPrize: 'Prize',
  'conversionPrize.value': 'Conversion prize',
  'conversionPrize.type': 'Conversion prize value type',
  wagerWinMultiplier: 'Multiplier',
  campaignType: 'Campaign type',
  minAmount: 'Min amount',
  maxAmount: 'Max amount',
  targetType: 'Target type',
  optIn: 'Opt-In',
};

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

  return createValidator(rules, attributeLabels, false)(values);
};

class CreateBonusCampaignModal extends Component {
  static propTypes = {
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    valid: PropTypes.bool,
    currentValues: PropTypes.object,
    errors: PropTypes.object,
    meta: PropTypes.object,
    change: PropTypes.func.isRequired,
  };
  static defaultProps = {
    currentValues: {},
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

  getCustomValueFieldErrors = (name) => {
    const { errors, meta } = this.props;

    if (meta && meta[name]) {
      if ((meta[name].value && meta[name].value.touched) || (meta[name].type && meta[name].type.touched)) {
        return errors;
      }
    }

    return {};
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

  render() {
    const {
      handleSubmit,
      onSubmit,
      pristine,
      submitting,
      currencies,
      valid,
      onClose,
      isOpen,
      currentValues,
    } = this.props;
    const allowedCustomValueTypes = getCustomValueFieldTypes(currentValues.campaignType);

    return (
      <Modal className="create-bonus-campaign-modal" toggle={onClose} isOpen={isOpen}>
        <ModalHeader toggle={onClose}>
          {I18n.t('BONUS_CAMPAIGNS.CREATE_MODAL.TITLE')}
        </ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Field
              name="name"
              label={attributeLabels.name}
              type="text"
              component={InputField}
            />
            <Field
              name="priority"
              label={attributeLabels.priority}
              type="text"
              component={InputField}
            />
            <Field
              name="bonusLifetime"
              label={attributeLabels.bonusLifetime}
              type="text"
              component={InputField}
            />

            <Field
              name="currency"
              label={attributeLabels.currency}
              type="select"
              component={SelectField}
            >
              <option value="">--- Choose currency ---</option>
              {currencies.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Field>

            <Field
              name="moneyTypePriority"
              label={attributeLabels.moneyTypePriority}
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
              label={attributeLabels.campaignRatio}
              typeValues={allowedCustomValueTypes}
              errors={this.getCustomValueFieldErrors('campaignRatio')}
            />
            <CustomValueField
              basename={'conversionPrize'}
              label={attributeLabels.conversionPrize}
              typeValues={allowedCustomValueTypes}
              errors={this.getCustomValueFieldErrors('conversionPrize')}
            />
            <CustomValueField
              basename={'capping'}
              label={attributeLabels.capping}
              typeValues={allowedCustomValueTypes}
              errors={this.getCustomValueFieldErrors('capping')}
            />
            <Field
              name="wagerWinMultiplier"
              label={attributeLabels.wagerWinMultiplier}
              type="text"
              component={InputField}
            />
            <Field
              name="targetType"
              label={attributeLabels.targetType}
              type="select"
              component={SelectField}
            >
              <option value="">--- Choose target type ---</option>
              {Object.keys(targetTypesLabels).map(key => (
                <option key={key} value={key}>
                  {renderLabel(key, targetTypesLabels)}
                </option>
              ))}
            </Field>
            <Field
              name="campaignType"
              label={attributeLabels.campaignType}
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
              currentValues && currentValues.campaignType !== campaignTypes.PROFILE_COMPLETED &&
              <div className="row">
                <div className="col-md-offset-3 col-md-4">
                  <Field
                    name="minAmount"
                    placeholder={attributeLabels.minAmount}
                    type="text"
                    component={InputField}
                  />
                </div>
                <div className="col-md-4">
                  <Field
                    name="maxAmount"
                    placeholder={attributeLabels.maxAmount}
                    type="text"
                    component={InputField}
                  />
                </div>
              </div>
            }

            <Field
              name="startDate"
              label="Start date"
              component={DateTimeField}
              isValidDate={this.startDateValidator('endDate')}
            />

            <Field
              name="endDate"
              label="End date"
              component={DateTimeField}
              isValidDate={this.endDateValidator('startDate')}
            />

            <div className="form-group row">
              <div className="col-md-9 col-md-offset-3">
                <div className="checkbox">
                  <label>
                    <Field
                      name="optIn"
                      type="checkbox"
                      component="input"
                    /> {attributeLabels.optIn}
                  </label>
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <button
              type="reset"
              className="btn btn-default-outline pull-left"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pristine || submitting || !valid}
              className="btn btn-primary"
            >
              Create & open
            </button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
  errors: getFormSyncErrors(FORM_NAME)(state),
  meta: getFormMeta(FORM_NAME)(state),
}))(
  reduxForm({
    form: FORM_NAME,
    validate: validator,
  })(CreateBonusCampaignModal),
);
