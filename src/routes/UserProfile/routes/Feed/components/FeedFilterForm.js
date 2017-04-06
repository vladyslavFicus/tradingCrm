import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import classNames from 'classnames';
import moment from 'moment';
import DateTime from 'react-datetime';
import { createValidator } from '../../../../../utils/validator';
import PropTypes from '../../../../../constants/propTypes';
import { typesLabels } from '../../../../../constants/audit';
import { InputField, SelectField } from '../../../../../components/ReduxForm';

const FORM_NAME = 'userFeedFilter';
const attributeLabels = {
  searchBy: 'Search by',
  actionType: 'Action types',
  creationDateFrom: 'Creation date from',
  creationDateTo: 'Creation date to',
};
const validate = createValidator({
  searchBy: 'string',
  actionType: 'string',
  creationDateFrom: 'string',
  creationDateTo: 'string',
}, attributeLabels, false);

class FeedFilterForm extends Component {
  static propTypes = {
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func,
    currentValues: PropTypes.object,
    availableTypes: PropTypes.arrayOf(PropTypes.string),
  };
  static defaultProps = {
    currentValues: {},
  };

  handleDateTimeChange = callback => (value) => {
    callback(value && moment.isMoment(value) ? value.format('YYYY-MM-DDTHH:mm:00') : '');
  };

  handleReset = () => {
    this.props.reset();
    this.props.onSubmit();
  };

  startDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues.creationDateTo
      ? current.isSameOrBefore(moment(currentValues.creationDateTo))
      : true;
  };

  endDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues.creationDateFrom
      ? current.isSameOrAfter(moment(currentValues.creationDateFrom))
      : true;
  };

  renderDateField = ({ input, placeholder, disabled, meta: { touched, error }, isValidDate }) => (
    <div className={classNames('form-group', { 'has-danger': touched && error })}>
      <DateTime
        dateFormat="MM/DD/YYYY"
        timeFormat="HH:mm"
        onChange={this.handleDateTimeChange(input.onChange)}
        value={input.value ? moment(input.value) : null}
        closeOnSelect
        inputProps={{
          disabled,
          placeholder,
        }}
        isValidDate={isValidDate}
      />
    </div>
  );

  render() {
    const {
      submitting,
      handleSubmit,
      onSubmit,
      availableTypes,
    } = this.props;

    return (
      <div className="well">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-10">
              <div className="col-md-3">
                <Field
                  name="searchBy"
                  type="text"
                  label={attributeLabels.searchBy}
                  labelClassName="form-label"
                  placeholder={'Action ID, Operator ID, IP'}
                  component={InputField}
                  position="vertical"
                />
              </div>
              <div className="col-md-3">
                <Field
                  name="actionType"
                  label={attributeLabels.actionType}
                  labelClassName="form-label"
                  component={SelectField}
                  position="vertical"
                >
                  <option value="">All actions</option>
                  {availableTypes.map(type => (
                    <option key={type} value={type}>
                      {typesLabels[type] || type}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Action date range</label>
                  <div className="row">
                    <div className="col-md-5">
                      <Field
                        name="creationDateFrom"
                        placeholder={attributeLabels.startDate}
                        component={this.renderDateField}
                        isValidDate={this.startDateValidator}
                      />
                    </div>
                    <div className="col-md-5">
                      <Field
                        name="creationDateTo"
                        placeholder={attributeLabels.endDate}
                        component={this.renderDateField}
                        isValidDate={this.endDateValidator}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group margin-top-25">
                <button
                  disabled={submitting}
                  className="btn btn-default btn-sm margin-inline font-weight-700"
                  onClick={this.handleReset}
                  type="reset"
                >
                  Reset
                </button>
                <button
                  disabled={submitting}
                  className="btn btn-primary btn-sm margin-inline font-weight-700"
                  type="submit"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(
  reduxForm({
    form: FORM_NAME,
    validate,
  })(FeedFilterForm)
);
