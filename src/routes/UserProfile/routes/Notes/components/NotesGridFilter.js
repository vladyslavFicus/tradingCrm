import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import DateTime from 'react-datetime';
import { createValidator } from '../../../../../utils/validator';
import { SelectField } from '../../../../../components/ReduxForm';
import { targetTypesLabels } from '../../../../../constants/note';

const FORM_NAME = 'userNotesFilter';
const attributeLabels = {
  searchValue: 'Author, targetUUID',
  targetType: 'Target type',
  startDate: 'Start date',
  endDate: 'End date',
};

const validate = (values, props) => createValidator({
  searchValue: 'string',
  startDate: 'string',
  targetType: ['string', `in:,${props.availableTypes.join()}`],
  endDate: 'string',
}, attributeLabels, false);

class NotesGridFilter extends Component {
  static propTypes = {
    reset: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    currentValues: PropTypes.shape({
      searchValue: PropTypes.string,
      targetType: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
    }),
    availableTypes: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    currentValues: {},
  };

  handleDateTimeChange = callback => (value) => {
    callback(value ? value.format('YYYY-MM-DD') : '');
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
    this.props.onSubmit();
  };

  renderQueryField = ({ input, label, placeholder, type, disabled, meta: { touched, error }, inputClassName }) => (
    <div className={classNames('form-group', { 'has-danger': touched && error })}>
      <label>{label}</label>
      <div className="form-input-icon">
        <i className="icmn-search" />
        <input
          {...input}
          disabled={disabled}
          type={type}
          className={classNames('form-control', inputClassName, { 'has-danger': touched && error })}
          placeholder={placeholder}
          title={placeholder}
        />
      </div>
    </div>
  );

  renderDateField = ({ input, placeholder, disabled, meta: { touched, error }, isValidDate }) => (
    <div className={classNames('form-group', { 'has-danger': touched && error })}>
      <div className="input-group">
        <DateTime
          dateFormat="MM/DD/YYYY"
          timeFormat={false}
          onChange={this.handleDateTimeChange(input.onChange)}
          value={input.value ? moment(input.value) : null}
          closeOnSelect
          inputProps={{
            disabled,
            placeholder,
          }}
          isValidDate={isValidDate}
        />
        <span className="input-group-addon">
          <i className="fa fa-calendar" />
        </span>
      </div>
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row margin-bottom-20">
          <div className="col-md-3">
            <span className="font-size-20">Notes</span>
          </div>
        </div>

        <div className="well">
          <div className="row">
            <div className="col-md-10">
              <div className="row">
                <div className="col-md-3">
                  <Field
                    name="searchValue"
                    type="text"
                    label={'Search by'}
                    placeholder={attributeLabels.searchValue}
                    component={this.renderQueryField}
                  />
                </div>

                <div className="col-md-3">
                  <Field
                    name="targetType"
                    label={attributeLabels.targetType}
                    labelClassName="form-label"
                    component={SelectField}
                    position="vertical"
                  >
                    <option value="">All types</option>
                    {availableTypes.map(type => (
                      <option key={type} value={type}>
                        {targetTypesLabels[type] || type}
                      </option>
                    ))}
                  </Field>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Creation date range</label>
                    <div className="row">
                      <div className="col-md-6">
                        <Field
                          name="from"
                          placeholder={attributeLabels.startDate}
                          component={this.renderDateField}
                          isValidDate={this.startDateValidator}
                        />
                      </div>
                      <div className="col-md-6">
                        <Field
                          name="to"
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
        </div>
      </form>
    );
  }
}

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(
  reduxForm({
    form: FORM_NAME,
    validate,
  })(NotesGridFilter),
);
