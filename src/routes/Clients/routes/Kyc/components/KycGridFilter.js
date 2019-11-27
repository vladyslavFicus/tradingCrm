import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { reduxForm, Field } from 'redux-form';
import I18n from 'i18n-js';
import { createValidator, translateLabels } from '../../../../../utils/validator';
import { filterLabels } from '../../../../../constants/kyc';
import { multiselectStatuses } from '../constants';
import { DateTimeField, NasSelectField, RangeGroup } from '../../../../../components/ReduxForm';

class KycGridFilter extends Component {
  static propTypes = {
    filterValues: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
      status: PropTypes.string,
    }),
    submitting: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    filterValues: {},
  };

  startDateValidator = toAttribute => (current) => {
    const { filterValues } = this.props;

    return filterValues[toAttribute]
      ? current.isSameOrBefore(moment(filterValues[toAttribute]))
      : true;
  };

  endDateValidator = fromAttribute => (current) => {
    const { filterValues } = this.props;

    return filterValues[fromAttribute]
      ? current.isSameOrAfter(moment(filterValues[fromAttribute]))
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
      handleSubmit,
      onSubmit,
      invalid,
    } = this.props;

    return (
      <form className="filter-row" onSubmit={handleSubmit(onSubmit)}>
        <RangeGroup
          className="filter-row__dates"
          label={I18n.t('KYC_REQUESTS.FILTER.DATE_RANGE')}
        >
          <Field
            utc
            name="from"
            placeholder={I18n.t(filterLabels.from)}
            component={DateTimeField}
            isValidDate={this.startDateValidator('to')}
            pickerClassName="left-side"
          />
          <Field
            utc
            name="to"
            placeholder={I18n.t(filterLabels.to)}
            component={DateTimeField}
            isValidDate={this.endDateValidator('from')}
          />
        </RangeGroup>
        <Field
          name="statuses"
          label={I18n.t(filterLabels.status)}
          component={NasSelectField}
          multiple
          className="filter-row__medium"
        >
          {Object.keys(multiselectStatuses).map(key => (
            <option key={key} value={key}>{I18n.t(multiselectStatuses[key])}</option>
          ))}
        </Field>
        <div className="filter-row__button-block">
          <button
            disabled={submitting || pristine}
            className="btn btn-default"
            onClick={this.handleReset}
            type="button"
          >
            {I18n.t('COMMON.RESET')}
          </button>
          <button
            disabled={submitting || pristine || invalid}
            className="btn btn-primary"
            type="submit"
          >
            {I18n.t('COMMON.APPLY')}
          </button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'kycRequestsGridFilter',
  touchOnChange: true,
  validate: createValidator({
    from: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
    to: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
    status: 'string',
  }, translateLabels(filterLabels), false),
})(KycGridFilter);
