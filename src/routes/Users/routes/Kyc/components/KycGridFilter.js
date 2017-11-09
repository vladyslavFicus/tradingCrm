import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { reduxForm, Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { createValidator, translateLabels } from '../../../../../utils/validator';
import { filterLabels } from '../../../../../constants/kyc';
import { multiselectStatuses } from '../constants';
import { DateTimeField, NasSelectField } from '../../../../../components/ReduxForm';

class KycGridFilter extends Component {
  static propTypes = {
    filterValues: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
      status: PropTypes.string,
    }).isRequired,
    submitting: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool,
  };
  static defaultProps = {
    invalid: true,
    filterValues: {
      from: '',
      to: '',
      status: '',
    },
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
      <div className="well">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="filter-row">
            <div className="filter-row__big">
              <div className="form-group">
                <label>{I18n.t('KYC_REQUESTS.FILTER.DATE_RANGE')}</label>
                <div className="range-group">
                  <Field
                    utc
                    name="from"
                    placeholder={I18n.t(filterLabels.from)}
                    component={DateTimeField}
                    position="vertical"
                    isValidDate={this.startDateValidator('to')}
                  />

                  <span className="range-group__separator">-</span>
                  <Field
                    utc
                    name="to"
                    placeholder={I18n.t(filterLabels.to)}
                    component={DateTimeField}
                    position="vertical"
                    isValidDate={this.endDateValidator('from')}
                  />
                </div>
              </div>
            </div>
            <div className="filter-row__medium">
              <Field
                name="statuses"
                label={I18n.t(filterLabels.status)}
                component={NasSelectField}
                position="vertical"
                multiple
              >
                {Object
                  .keys(multiselectStatuses)
                  .map(key => <option key={key} value={key}>{I18n.t(multiselectStatuses[key])}</option>)
                }
              </Field>
            </div>
            <div className="filter-row__button-block">
              <div className="button-block-container">
                <button
                  disabled={submitting || pristine}
                  className="btn btn-default"
                  onClick={this.handleReset}
                  type="reset"
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
            </div>
          </div>
        </form>
      </div>
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
