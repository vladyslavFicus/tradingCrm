import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getFormValues, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import { initiators, initiatorsLabels } from '../../../../../../../../constants/transaction';
import { createValidator } from '../../../../../../../../utils/validator';
import { types, statuses, methods, typesLabels, statusesLabels, methodsLabels } from '../../../../../../../../constants/payment';
import { InputField, SelectField } from '../../../../../../../../components/ReduxForm';

const FORM_NAME = 'freeSpinsFilter';
const validator = createValidator({
  keyword: 'string',
  initiatorType: ['string', `in:${Object.keys(initiators).join()}`],
  type: ['string', `in:${Object.keys(types).join()}`],
  statuses: ['string', `in:${Object.keys(statuses).join()}`],
  paymentMethod: ['string', `in:${Object.keys(methods).join()}`],
  startDate: 'string',
  endDate: 'string',
  amountLowerBound: 'numeric',
  amountUpperBound: 'numeric',
}, attributeLabels, false);

class FreeSpinsFilterForm extends Component {
  static propTypes = {
    reset: PropTypes.func,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    disabled: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    currentValues: PropTypes.shape({
      keyword: PropTypes.string,
      initiatorType: PropTypes.string,
      type: PropTypes.string,
      statuses: PropTypes.string,
      paymentMethod: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
    }),
  };

  handleDateTimeChange = callback => (value) => {
    callback(value && moment(value).isValid() ? value.format('YYYY-MM-DD') : '');
  };

  startDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues.endDate
      ? current.isSameOrBefore(moment(currentValues.endDate))
      : true;
  };

  endDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues.startDate
      ? current.isSameOrAfter(moment(currentValues.startDate))
      : true;
  };

  handleReset = () => {
    this.props.reset();
    this.props.onReset();
  };

  render() {
    const {
      submitting,
      pristine,
      disabled,
      handleSubmit,
      onSubmit,
    } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="well">
          <div className="row">
            <div className="col-md-10">
              <div className="row">
                <div className="col-md-4">
                  <Field
                    name="keyword"
                    type="text"
                    label={'Search by'}
                    placeholder={attributeLabels.keyword}
                    component={this.renderQueryField}
                  />
                </div>
                <div className="col-md-2">
                  <Field
                    name="initiatorType"
                    label={attributeLabels.initiatorType}
                    labelClassName="form-label"
                    position="vertical"
                    component={SelectField}
                  >
                    <option value="">Anyone</option>
                    {Object.keys(initiatorsLabels).map(assign => (
                      <option key={assign} value={assign}>
                        {initiatorsLabels[assign]}
                      </option>
                    ))}
                  </Field>
                </div>
                <div className="col-md-2">
                  <Field
                    name="type"
                    label={attributeLabels.type}
                    labelClassName="form-label"
                    position="vertical"
                    component={SelectField}
                  >
                    <option value="">Any type</option>
                    {Object.keys(typesLabels).map(type => (
                      <option key={type} value={type}>
                        {typesLabels[type]}
                      </option>
                    ))}
                  </Field>
                </div>
                <div className="col-md-2">
                  <Field
                    name="statuses"
                    label={attributeLabels.statuses}
                    labelClassName="form-label"
                    position="vertical"
                    component={SelectField}
                  >
                    <option value="">Any status</option>
                    {Object.keys(statusesLabels).map(status => (
                      <option key={status} value={status}>
                        {statusesLabels[status]}
                      </option>
                    ))}
                  </Field>
                </div>
                <div className="col-md-2">
                  <Field
                    name="paymentMethod"
                    label={attributeLabels.paymentMethod}
                    labelClassName="form-label"
                    position="vertical"
                    component={SelectField}
                  >
                    <option value="">Any method</option>
                    {Object.keys(methodsLabels).map(method => (
                      <option key={method} value={method}>
                        {methodsLabels[method]}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <div className="row">
                      <div className="col-md-5">
                        <Field
                          name="amountLowerBound"
                          type="text"
                          label={attributeLabels.amountLowerBound}
                          labelClassName="form-label"
                          position="vertical"
                          placeholder="0.00"
                          component={InputField}
                        />
                      </div>
                      <div className="col-md-5">
                        <Field
                          name="amountUpperBound"
                          type="text"
                          label={attributeLabels.amountUpperBound}
                          labelClassName="form-label"
                          position="vertical"
                          placeholder="0.00"
                          component={InputField}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Creation date range</label>

                    <div className="row">
                      <div className="col-md-5">
                        <Field
                          name="startDate"
                          placeholder={attributeLabels.startDate}
                          component={this.renderDateField}
                          isValidDate={this.startDateValidator}
                        />
                      </div>
                      <div className="col-md-5">
                        <Field
                          name="endDate"
                          placeholder={attributeLabels.endDate}
                          component={this.renderDateField}
                          isValidDate={this.endDateValidator}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-2">
              <div className="form-group margin-top-25">
                <button
                  disabled={submitting || (disabled && pristine)}
                  className="btn btn-default btn-sm margin-inline font-weight-700"
                  onClick={this.handleReset}
                  type="reset"
                >
                  Reset
                </button>
                <button
                  disabled={submitting || (disabled && pristine)}
                  className="btn btn-primary btn-sm margin-inline font-weight-700"
                  type="submit"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

const FilterForm = reduxForm({
  form: FORM_NAME,
  validate: validator,
})(FreeSpinsFilterForm);

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(FilterForm);
