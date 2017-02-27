import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { statusesLabels, typesLabels, assignLabels } from 'constants/bonus';
import { createValidator } from 'utils/validator';
import classNames from 'classnames';

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
  render() {
    const {
      submitting,
      handleSubmit,
      onSubmit,
      reset,
    } = this.props;

    return <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row margin-bottom-20">
        <div className="col-md-1">
          <span className="font-size-20">Bonus</span>
        </div>
        <div className="col-md-1 col-md-offset-9">
          <button className="btn btn-primary-outline">+ Manual bonus</button>
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
                      />
                    </div>
                    <div className="col-md-5">
                      <Field
                        name="endDate"
                        placeholder={attributeLabels.endDate}
                        component={this.renderDateField}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-2">
            <div className="form-group">
              <br/>
              <button disabled={submitting} className="btn btn-default" onClick={reset}>
                Reset
              </button>
              {' '}
              <button disabled={submitting} className="btn btn-primary" type="submit">
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>;
  }

  renderSelectField = ({ input, children, label, meta: { touched, error }, emptyOptionLabel }) => {
    return <div className={classNames('form-group', { 'has-danger': touched && error })}>
      <label>{label}</label>
      <select
        {...input}
        className={classNames('form-control form-control-sm', { 'has-danger': touched && error })}
      >
        <option>{emptyOptionLabel}</option>
        {children}
      </select>
    </div>;
  };

  renderQueryField = ({ input, label, placeholder, type, disabled, meta: { touched, error }, inputClassName }) => {
    return <div className={classNames('form-group', { 'has-danger': touched && error })}>
      <label>{label}</label>
      <div className="form-input-icon">
        <i className="icmn-search"/>
        <input
          {...input}
          disabled={disabled}
          type={type}
          className={classNames('form-control', inputClassName, { 'has-danger': touched && error })}
          placeholder={placeholder}
          title={placeholder}
        />
      </div>
    </div>;
  };

  renderDateField = ({ input, placeholder, type, disabled, meta: { touched, error }, inputClassName }) => {
    return <div className={classNames('form-group', { 'has-danger': touched && error })}>
      <div className="input-group">
        <input
          {...input}
          disabled={disabled}
          type={type}
          className={classNames('form-control', inputClassName, { 'has-danger': touched && error })}
          placeholder={placeholder}
          title={placeholder}
        />
        <span className="input-group-addon">
          <i className="fa fa-calendar"/>
        </span>
      </div>
    </div>;
  };
}

export default reduxForm({
  form: 'userBonusesFilter',
  validate: validator,
})(BonusGridFilter);
