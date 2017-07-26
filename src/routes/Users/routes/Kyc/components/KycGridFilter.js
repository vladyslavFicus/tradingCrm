import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { reduxForm, Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { createValidator } from '../../../../../utils/validator';
import fakeI18n from '../../../../../utils/fake-i18n';
import { filterLabels, statuses as kycStatuses, statusTypes as kysStatusTypes } from '../../../../../constants/kyc';
import { DateTimeField, NasSelectField } from '../../../../../components/ReduxForm';

const statusTypesKeys = {
  [kysStatusTypes.ADDRESS]: 'addressStatus',
  [kysStatusTypes.IDENTITY]: 'identityStatus',
};
const multiselectStatuses = {
  [kysStatusTypes.FULLY_VERIFIED]: fakeI18n.t('KYC_REQUESTS.FILTER.STATUS.FULLY_VERIFIED'),
  [`${statusTypesKeys[kysStatusTypes.IDENTITY]}.${kycStatuses.VERIFIED}`]:
    fakeI18n.t('KYC_REQUESTS.FILTER.STATUS.IDENTITY_VERIFIED'),
  [`${statusTypesKeys[kysStatusTypes.IDENTITY]}.${kycStatuses.PENDING}`]:
    fakeI18n.t('KYC_REQUESTS.FILTER.STATUS.IDENTITY_PENDING'),
  [`${statusTypesKeys[kysStatusTypes.IDENTITY]}.${kycStatuses.DOCUMENTS_SENT}`]:
    fakeI18n.t('KYC_REQUESTS.FILTER.STATUS.IDENTITY_DOCUMENT_SENT'),
  [`${statusTypesKeys[kysStatusTypes.ADDRESS]}.${kycStatuses.VERIFIED}`]:
    fakeI18n.t('KYC_REQUESTS.FILTER.STATUS.ADDRESS_VERIFIED'),
  [`${statusTypesKeys[kysStatusTypes.ADDRESS]}.${kycStatuses.PENDING}`]:
    fakeI18n.t('KYC_REQUESTS.FILTER.STATUS.ADDRESS_PENDING'),
  [`${statusTypesKeys[kysStatusTypes.ADDRESS]}.${kycStatuses.DOCUMENTS_SENT}`]:
    fakeI18n.t('KYC_REQUESTS.FILTER.STATUS.ADDRESS_DOCUMENT_SENT'),
};
const validator = createValidator({
  from: 'string',
  to: 'string',
  status: 'string',
}, filterLabels, false);

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
  };
  static defaultProps = {
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
                    name="from"
                    placeholder={I18n.t(filterLabels.from)}
                    component={DateTimeField}
                    position="vertical"
                    isValidDate={this.endDateValidator('to')}
                    className={null}
                  />

                  <span className="range-group__separator">-</span>
                  <Field
                    name="to"
                    placeholder={I18n.t(filterLabels.to)}
                    component={DateTimeField}
                    position="vertical"
                    isValidDate={this.endDateValidator('from')}
                    className={null}
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
                  disabled={submitting || pristine}
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
  validate: validator,
})(KycGridFilter);
