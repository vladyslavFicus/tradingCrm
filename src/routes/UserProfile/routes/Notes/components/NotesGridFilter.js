import React, { Component, PropTypes } from 'react';
import { formValueSelector, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import DateTime from 'react-datetime';
import { createValidator } from '../../../../../utils/validator';

const FORM_NAME = 'userNotesFilter';
const notesGridValuesSelector = formValueSelector(FORM_NAME);

const attributeLabels = {
  author: 'Fulltext search',
  startDate: 'Start date',
  endDate: 'End date',
};

const validator = createValidator({
  author: 'string',
  startDate: 'string',
  endDate: 'string',
}, attributeLabels, false);

class NotesGridFilter extends Component {
  static propTypes = {
    reset: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    currentValues: PropTypes.shape({
      author: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
    }),
  };

  handleDateTimeChange = callback => (value) => {
    callback(value ? value.format('YYYY-MM-DD') : '');
  };

  startDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues.endDate
      ? current.isSameOrBefore(moment(currentValues.endDate))
      : true;
  };

  endDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues.startDate
      ? current.isSameOrAfter(moment(currentValues.startDate))
      : true;
  };

  handleReset = () => {
    this.props.reset();
    this.props.onSubmit();
  };

  renderQueryField = ({ input, label, placeholder, type, disabled, meta: { touched, error }, inputClassName }) => {
    return (
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
  };

  renderDateField = ({ input, placeholder, disabled, meta: { touched, error }, isValidDate }) => {
    return (
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
  };

  render() {
    const {
      submitting,
      handleSubmit,
      onSubmit,
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
                <div className="col-md-6">
                  <Field
                    name="author"
                    type="text"
                    label={'Search by'}
                    placeholder={attributeLabels.author}
                    component={this.renderQueryField}
                  />
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

const FilterForm = reduxForm({
  form: FORM_NAME,
  validate: validator,
})(NotesGridFilter);

export default connect(state => ({
  currentValues: {
    author: notesGridValuesSelector(state, 'author') || '',
    startDate: notesGridValuesSelector(state, 'startDate') || '',
    endDate: notesGridValuesSelector(state, 'endDate') || '',
  },
}))(FilterForm);
