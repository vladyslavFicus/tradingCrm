import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DateTime from 'react-datetime';
import classNames from 'classnames';
import moment from 'moment';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { Link } from 'react-router';
import { statusesLabels, typesLabels, assignLabels } from '../../../../../constants/bonus';
import { createValidator } from '../../../../../utils/validator';

const FORM_NAME = 'userBonusesFilter';
const bonusGridValuesSelector = formValueSelector(FORM_NAME);
const attributeLabels = {
  keyword: 'Bonus ID, Bonus name, Granted by...',
  assigned: 'Assigned by',
  states: 'Bonus status',
  type: 'Bonus type',
  startDate: 'Start date',
  endDate: 'End date',
};
const validator = createValidator({
  keyword: 'string',
  assigned: 'string',
  states: 'string',
  type: 'string',
  startDate: 'string',
  endDate: 'string',
}, attributeLabels, false);

class BonusGridFilter extends Component {
  static propTypes = {
    playerUUID: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    currentValues: PropTypes.object,
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

  renderSelectField = ({ input, children, label, meta: { touched, error }, emptyOptionLabel }) => {
    return (
      <div className={classNames('form-group', { 'has-danger': touched && error })}>
        <label>{label}</label>
        <select
          {...input}
          className={classNames('form-control form-control-sm', { 'has-danger': touched && error })}
        >
          <option>{emptyOptionLabel}</option>
          {children}
        </select>
      </div>
    );
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
      playerUUID,
    } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row margin-bottom-20">
          <div className="col-sm-2 col-xs-6">
            <span className="font-size-20">Bonus</span>
          </div>
          <div className="col-sm-10 col-xs-6 text-right">
            <Link className="btn btn-sm btn-primary-outline" to={`/bonuses/create/${playerUUID}`}>
              + Manual bonus
            </Link>
          </div>
        </div>

        <div className="well">
          <div className="row">
            <div className="col-md-10">
              <div className="row">
                <div className="col-md-5">
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
                    name="assigned"
                    label={attributeLabels.assigned}
                    emptyOptionLabel="Anyone"
                    component={this.renderSelectField}
                  >
                    {Object.keys(assignLabels).map(assign => (
                      <option key={assign} value={assign}>
                        {assignLabels[assign]}
                      </option>
                    ))}
                  </Field>
                </div>

                <div className="col-md-2">
                  <Field
                    name="type"
                    label={attributeLabels.type}
                    emptyOptionLabel="Any type"
                    component={this.renderSelectField}
                  >
                    {Object.keys(typesLabels).map(type => (
                      <option key={type} value={type}>
                        {typesLabels[type]}
                      </option>
                    ))}
                  </Field>
                </div>

                <div className="col-md-2">
                  <Field
                    name="states"
                    label={attributeLabels.states}
                    emptyOptionLabel="Any status"
                    component={this.renderSelectField}
                  >
                    {Object.keys(statusesLabels).map(status => (
                      <option key={status} value={status}>
                        {statusesLabels[status]}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Availability date range</label>
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
                  disabled={submitting}
                  className="btn btn-default btn-sm margin-inline font-weight-700"
                  onClick={this.handleReset}
                  type="reset"
                >
                  Reset
                </button>
                <button
                  disabled={submitting} className="btn btn-primary btn-sm margin-inline font-weight-700"
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
})(BonusGridFilter);

export default connect((state) => {
  return {
    currentValues: {
      keyword: bonusGridValuesSelector(state, 'keyword'),
      states: bonusGridValuesSelector(state, 'states'),
      type: bonusGridValuesSelector(state, 'type'),
      assigned: bonusGridValuesSelector(state, 'assigned'),
      startDate: bonusGridValuesSelector(state, 'startDate'),
      endDate: bonusGridValuesSelector(state, 'endDate'),
    },
  };
})(FilterForm);
