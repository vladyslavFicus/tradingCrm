import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { SelectField } from '../../../../../components/ReduxForm';
import { methodsStatusesLabels, methodStatuses } from '../../../../../constants/payment';
import { createValidator, translateLabels } from '../../../../../utils/validator';
import { attributeLabels } from './constants';
import countries from '../../../../../utils/countryList';

class MethodsGridFilter extends Component {
  static propTypes = {
    reset: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
  };
  static defaultProps = {
    handleSubmit: null,
    submitting: false,
  };

  handleReset = () => {
    this.props.reset();
    this.props.onSubmit();
  };

  render() {
    const { submitting, handleSubmit, onSubmit } = this.props;

    return (
      <div className="well">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="filter-row">
            <div className="filter-row__small">
              <Field
                name="countryCode"
                label={I18n.t(attributeLabels.country)}
                labelClassName="form-label"
                component={SelectField}
                position="vertical"
              >
                <option value="">- General -</option>
                {Object.keys(countries).map(key =>
                  <option key={key} value={key}>{countries[key]}</option>
                )}
              </Field>
            </div>
            <div className="filter-row__small">
              <Field
                name="status"
                label={I18n.t(attributeLabels.status)}
                labelClassName="form-label"
                component={SelectField}
                position="vertical"
              >
                <option value="">{I18n.t('PAYMENT_METHODS.FILTER_FORM.LABELS.ALL_STATUSES')}</option>
                {Object.keys(methodsStatusesLabels).map(status => (
                  <option key={status} value={status}>
                    {methodsStatusesLabels[status]}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__button-block">
              <div className="button-block-container">
                <button
                  disabled={submitting}
                  className="btn btn-default"
                  onClick={this.handleReset}
                  type="reset"
                >
                  {I18n.t('COMMON.RESET')}
                </button>
                <button
                  disabled={submitting}
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
  form: 'filterPaymentMethods',
  validate: createValidator({
    status: ['string', `in:,${Object.keys(methodStatuses).join()}`],
    country: ['string', `in:${Object.keys(countries).join()}`],
  }, translateLabels(attributeLabels), false),
})(MethodsGridFilter);
