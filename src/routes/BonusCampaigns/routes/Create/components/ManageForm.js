import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import classNames from 'classnames';
import DateRangePickerWrapper from 'components/Forms/DateRangePickerWrapper';
import { renderField } from 'utils/redux-form';
import { stopEvent } from 'utils/helpers';
import createValidator from 'utils/validator';

const selector = formValueSelector('campaignCreation');

const validator = createValidator([
  { fields: ['campaignName', 'startDate', 'endDate'], validator: 'required' },
]);

class ManageForm extends Component {
  constructor(props) {
    super(props);

    this.handleDatesChange = this.handleDatesChange.bind(this);
  }

  handleDatesChange({ startDate, endDate }) {
    const { dispatch, change, fields } = this.props;

    if (startDate) {
      const formattedDate = startDate.format('YYYY/MM/DD');
      if (fields.startDate !== formattedDate) {
        dispatch(change('startDate', formattedDate));
      }
    }

    if (endDate) {
      const formattedDate = endDate.format('YYYY/MM/DD');
      if (fields.endDate !== formattedDate) {
        dispatch(change('endDate', formattedDate));
      }
    }
  }

  render() {
    const { handleSubmit, pristine, reset, submitting, onSubmit } = this.props;

    return <form onSubmit={handleSubmit(onSubmit)}>
      <Field
        name="campaignName"
        label="Name"
        type="text"
        component={renderField}
      />
      <Field
        name="bonusLifetime"
        label="Bonus life time"
        type="text"
        component={renderField}
      />
      <Field
        name="campaignRatio"
        label="Ratio"
        type="text"
        component={renderField}
      />
      <Field
        name="bonusAmount"
        label="Bonus amount"
        type="text"
        component={renderField}
      />
      <Field
        name="wagerWinMultiplier"
        label="Multiplier"
        type="text"
        component={renderField}
      />
      <Field
        name="triggerType"
        label="Trigger type"
        type="select"
        values={{ FIRST_DEPOSIT: 'First deposit' }}
        component={renderField}
      />
      <Field
        name="priorityMoneyTypeUsage"
        label="Money usage"
        type="select"
        values={{ REAL: 'Real money', BONUS: 'Bonus money' }}
        component={renderField}
      />

      <div className={classNames('form-group row')}>
        <div className="col-md-3">
          <label className="form-control-label">Period</label>
        </div>
        <div className="col-md-9">
          <DateRangePickerWrapper
            onDatesChange={this.handleDatesChange}
          />
        </div>
      </div>
      <Field type="hidden" component="input" name="startDate"/>
      <Field type="hidden" component="input" name="endDate"/>

      <div className="form-actions">
        <div className="form-group row">
          <div className="col-md-9 col-md-offset-3">
            <button type="submit" disabled={pristine || submitting} className="btn width-150 btn-primary">
              Submit
            </button>

            <button type="button" disabled={pristine || submitting} onClick={reset} className="btn btn-default">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>;
  }
}

let ManageReduxForm = reduxForm({
  form: 'campaignCreation',
  validate: validator,
})(ManageForm);

ManageReduxForm = connect((state) => ({
  fields: selector(state, 'startDate', 'endDate'),
}), {})(ManageReduxForm);

export default ManageReduxForm;
