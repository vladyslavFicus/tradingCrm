import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { createValidator } from '../../../../../../utils/validator';
import { InputField, SelectField } from '../../../../../../components/ReduxForm';
import { typesLabels, types } from '../../../../../../constants/limits';
import PropTypes from '../../../../../../constants/propTypes';

const FORM_NAME = 'createLimitForm';
const createLimitValuesSelector = formValueSelector(FORM_NAME);

const attributeLabels = {
  type: 'Limit type',
  period: 'Period',
  amount: 'Amount available',
};

const validator = (values, props) => {
  const rules = {
    type: ['required', `in:${Object.values(types).join()}`],
  };

  const limitPeriodValues = props.limitPeriods[values.type];

  if (limitPeriodValues) {
    rules.period = ['required', `in:${limitPeriodValues.join()}`];
  }

  if (values.type && [types.LOSS, types.WAGER, types.DEPOSIT].indexOf(values.type) >= 0) {
    rules.amount = 'required|numeric';
  }

  return createValidator(
    rules,
    attributeLabels,
    false
  )(values);
};

class CreateLimitModal extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    valid: PropTypes.bool,
    currentValues: PropTypes.shape({
      type: PropTypes.string.isRequired,
    }),
    limitPeriods: PropTypes.limitPeriodEntity,
  };

  renderPeriodField = () => {
    const { currentValues: { type }, limitPeriods } = this.props;

    if (!limitPeriods || !type || !limitPeriods[type]) {
      return null;
    }

    const options = limitPeriods[type].map(period =>
      <option key={period} value={period}>{period}</option>
    );

    return (
      <Field
        name="period"
        type="text"
        label={attributeLabels.period}
        component={SelectField}
        position="vertical"
      >
        {options}
      </Field>
    );
  };

  renderAmountField = () => {
    const { currentValues } = this.props;

    if (currentValues.type === types.SESSION_DURATION) {
      return null;
    }

    return (
      <div className="col-md-4">
        <Field
          name="amount"
          label={attributeLabels.amount}
          type="text"
          component={InputField}
          position="vertical"
        />
      </div>
    );
  };

  render() {
    const {
      onClose,
      onSubmit,
      handleSubmit,
      isOpen,
      pristine,
      submitting,
      valid,
    } = this.props;

    return (
      <Modal className="create-limit-modal" toggle={onClose} isOpen={isOpen}>
        <ModalHeader toggle={onClose}>New Limit</ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <div className="row">
              <div className="col-md-4">
                <Field
                  name="type"
                  type="text"
                  label={attributeLabels.type}
                  component={SelectField}
                  position="vertical"
                >
                  {Object.keys(typesLabels).map(status => (
                    <option key={status} value={status}>
                      {typesLabels[status]}
                    </option>
                  ))}
                </Field>
              </div>

              <div className="col-md-4">
                {this.renderPeriodField()}
              </div>

              {this.renderAmountField()}
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="row">
              <div className="col-sm-6 text-muted font-size-12">
                <b>Note</b>: The limit can only be canceled after the cool off period
              </div>
              <div className="col-sm-6 text-right">
                <button
                  type="reset"
                  className="btn btn-default-outline text-uppercase"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  disabled={pristine || submitting || !valid}
                  type="submit"
                  className="btn btn-primary text-uppercase"
                >
                  Set limit
                </button>
              </div>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

const LimitModalForm = reduxForm({
  form: FORM_NAME,
  validate: validator,
})(CreateLimitModal);

export default connect(state => ({
  currentValues: {
    type: createLimitValuesSelector(state, 'type') || '',
  },
}))(LimitModalForm);
