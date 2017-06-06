import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm, getFormValues } from 'redux-form';
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
} from '../../../../constants';
import { customValueFieldTypes } from '../../../../../../constants/form';
import renderLabel from '../../../../../../utils/renderLabel';
import './CreateBonusCampaignModal.scss';

const CAMPAIGN_NAME_MAX_LENGTH = 100;
const FORM_NAME = 'bonusCampaignCreateForm';

const attributeLabels = {
  campaignName: 'Name',
  startDate: 'Start date',
  endDate: 'End date',
  currency: 'Currency',
  bonusLifetime: 'Bonus life time',
  campaignRatio: 'Ratio',
  'campaignRatio.value': 'Ratio value',
  'campaignRatio.type': 'Ratio value type',
  capping: 'Capping',
  'capping.value': 'Capping value',
  'capping.type': 'Capping value type',
  conversionPrize: 'Prize',
  'conversionPrize.value': 'Conversion prize value',
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
    campaignName: ['required', 'string', `max:${CAMPAIGN_NAME_MAX_LENGTH}`],
    startDate: 'required',
    endDate: 'required|nextDate:startDate',
    currency: 'required',
    bonusLifetime: 'required|integer',
    'campaignRatio.value': 'required|numeric|customTypeValue.value',
    'campaignRatio.type': ['required', `in:${allowedCustomValueTypes.join()}`],
    capping: {
      value: 'required|numeric|customTypeValue.value',
      type: ['required', `in:${allowedCustomValueTypes.join()}`],
    },
    conversionPrize: {
      value: 'required|numeric|customTypeValue.value',
      type: ['required', `in:${allowedCustomValueTypes.join()}`],
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
      rules.maxAmount = `min:${minAmount}`;
    }
  }

  if (values.minAmount) {
    const maxAmount = parseFloat(values.maxAmount).toFixed(2);

    if (!isNaN(maxAmount)) {
      rules.minAmount = `max:${maxAmount}`;
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
    change: PropTypes.func.isRequired,
  };

  static defaultProps = {
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

  handleSubmit = (data) => {
    this.props.onSubmit(data);
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
      errors,
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
              name="campaignName"
              label={attributeLabels.campaignName}
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
              <option value="">--- Chose currency ---</option>
              {currencies.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Field>

            <CustomValueField
              basename={'campaignRatio'}
              label={attributeLabels.campaignRatio}
              typeValues={allowedCustomValueTypes}
              errors={errors}
            />
            <CustomValueField
              basename={'capping'}
              label={attributeLabels.capping}
              typeValues={allowedCustomValueTypes}
              errors={errors}
            />
            <CustomValueField
              basename={'conversionPrize'}
              label={attributeLabels.conversionPrize}
              typeValues={allowedCustomValueTypes}
              errors={errors}
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
              currentValues && currentValues.campaignType !== campaignTypes.FIRST_DEPOSIT &&
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
            <div className="row">
              <div className="col-md-12 text-right">
                <button
                  type="reset"
                  className="btn btn-default-outline text-uppercase"
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={pristine || submitting || !valid}
                  className="btn btn-primary text-uppercase"
                >
                  Create & open
                </button>
              </div>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(
  reduxForm({
    form: FORM_NAME,
    validate: validator,
  })(CreateBonusCampaignModal)
);
