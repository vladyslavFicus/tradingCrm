import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm, getFormValues } from 'redux-form';
import moment from 'moment';
import { connect } from 'react-redux';
import { createValidator } from '../../../../../../utils/validator';
import {
  CustomValueField, InputField, SelectField, DateTimeField,
} from '../../../../../../components/ReduxForm';
import { eventTypesLabels } from '../../../../constants';
import { customValueFieldTypesLabels } from '../../../../../../constants/form';
import renderLabel from '../../../../../../utils/renderLabel';
import './CreateBonusCampaignModal.scss';

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
  conversionPrize: 'Conversion prize',
  'conversionPrize.value': 'Conversion prize value',
  'conversionPrize.type': 'Conversion prize value type',
  wagerWinMultiplier: 'Multiplier',
  eventsTypes: 'Events types',
  optIn: 'Opt-In',
};
const validator = createValidator({
  campaignName: 'required',
  startDate: 'required',
  endDate: 'required|nextDate:startDate',
  currency: 'required',
  bonusLifetime: 'required|integer',
  'campaignRatio.value': 'required|numeric|customTypeValue.value',
  'campaignRatio.type': ['required', `in:${Object.keys(customValueFieldTypesLabels).join()}`],
  capping: {
    value: 'required|numeric|customTypeValue.value',
    type: ['required', `in:${Object.keys(customValueFieldTypesLabels).join()}`],
  },
  conversionPrize: {
    value: 'required|numeric|customTypeValue.value',
    type: ['required', `in:${Object.keys(customValueFieldTypesLabels).join()}`],
  },
  wagerWinMultiplier: 'required|integer|max:999',
  eventsTypes: ['required', 'array', `in:${Object.keys(eventTypesLabels).join()}`],
}, attributeLabels, false);

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
  };

  handleSubmit = (data) => {
    this.props.onSubmit(data);
  };

  handleDateTimeChange = callback => (value) => {
    callback(value ? value.format('YYYY-MM-DDTHH:mm:00') : '');
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
    } = this.props;

    return (
      <Modal className="create-bonus-campaign-modal" toggle={onClose} isOpen={isOpen}>
        <ModalHeader toggle={onClose}>New bonus campaign</ModalHeader>

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
              typeValues={customValueFieldTypesLabels}
              errors={errors}
            />
            <CustomValueField
              basename={'capping'}
              label={attributeLabels.capping}
              typeValues={customValueFieldTypesLabels}
              errors={errors}
            />
            <CustomValueField
              basename={'conversionPrize'}
              label={attributeLabels.conversionPrize}
              typeValues={customValueFieldTypesLabels}
              errors={errors}
            />
            <Field
              name="wagerWinMultiplier"
              label={attributeLabels.wagerWinMultiplier}
              type="text"
              component={InputField}
            />
            <Field
              name="eventsType"
              label={attributeLabels.eventsTypes}
              type="select-multiple"
              multiple
              component={SelectField}
            >
              {Object.keys(eventTypesLabels).map(key => (
                <option key={key} value={key}>
                  { renderLabel(key, eventTypesLabels) }
                </option>
              ))}
            </Field>

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
          </ModalBody>.

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
