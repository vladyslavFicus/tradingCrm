import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import RemoteDateRangePickerWrapper from 'components/Forms/RemoteDateRangePickerWrapper';
import { SelectField } from 'components/ReduxForm';
import { createValidator } from 'utils/validator';
import { Types } from '../contants';
import classNames from 'classnames';
import moment from 'moment';

const attributeLabels = {
  type: 'Type',
  period: 'Period',
};
const validator = createValidator({
  type: 'required|string',
  startDate: 'required|string',
  endDate: 'required|string',
}, attributeLabels, false);

class Form extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleDatesChange = this.handleDatesChange.bind(this);
    this.handleResetForm = this.handleResetForm.bind(this);

    this.state = {
      startDate: props.initialValues && props.initialValues.startDate !== undefined ?
        moment(props.initialValues.startDate) : null,
      endDate: props.initialValues && props.initialValues.endDate !== undefined ?
        moment(props.initialValues.endDate) : null,
    };
  }

  handleDatesChange({ startDate, endDate }) {
    const { change, fields } = this.props;

    this.setState({ startDate, endDate }, () => {
      if (startDate) {
        const formattedDate = startDate.format('YYYY-MM-DD');
        if (fields.startDate !== formattedDate) {
          change('startDate', formattedDate);
        }
      }

      if (endDate) {
        const formattedDate = endDate.format('YYYY-MM-DD');
        if (fields.endDate !== formattedDate) {
          change('endDate', formattedDate);
        }
      }
    });
  }

  handleResetForm() {
    this.handleDatesChange({ startDate: null, endDate: null });

    this.props.reset();
  }

  render() {
    const { startDate, endDate } = this.state;
    const { handleSubmit, valid, pristine, submitting, onSubmit, disabled, errors } = this.props;

    return <form onSubmit={handleSubmit(onSubmit)}>
      <Field
        name="type"
        label={attributeLabels.type}
        type="text"
        disabled={disabled}
        component={SelectField}
      >
        <option>-- Select --</option>
        {Object.keys(Types).map((key) => <option key={key} value={key}>
          {Types[key]}
        </option>)}
      </Field>

      <div className={classes.period(errors)}>
        <div className="col-md-3">
          <label className="form-control-label">{attributeLabels.period}</label>
        </div>
        <div className="col-md-9">
          <RemoteDateRangePickerWrapper
            isOutsideRange={(day) => moment() <= day}
            onDatesChange={this.handleDatesChange}
            startDate={startDate}
            endDate={endDate}
            disabled={disabled}
          />

          <Field type="hidden" component="input" name="startDate"/>
          <Field type="hidden" component="input" name="endDate"/>

          {!!errors.startDate && <div className="form-control-feedback">
            {errors.startDate}
          </div>}
          {!!errors.endDate && <div className="form-control-feedback">
            {errors.endDate}
          </div>}
        </div>
      </div>

      <div className="form-actions">
        <div className="form-group row">
          <div className="col-md-9 col-md-offset-3">
            <button
              type="submit"
              disabled={!valid || submitting}
              className="btn width-150 btn-primary">
              Download
            </button>
          </div>
        </div>
      </div>
    </form>;
  }
}

const classes = {
  period: (errors) => classNames('form-group row', {
    'has-danger': errors.startDate || errors.endDate,
  }),
};

export default reduxForm({
  form: 'revenueReport',
  validate: validator,
})(Form);
