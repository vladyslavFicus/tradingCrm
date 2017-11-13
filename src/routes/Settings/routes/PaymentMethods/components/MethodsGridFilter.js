import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import countryList from 'country-list';
import { SelectField } from '../../../../../components/ReduxForm';
import { methodsStatusesLabels, methodStatuses } from '../../../../../constants/payment';
import { createValidator } from '../../../../../utils/validator';

const countries = countryList().getData().reduce((result, item) => ({
  ...result,
  [item.code]: item.name,
}), {});

const attributeLabels = {
  status: 'Status',
  country: 'Country sorting',
};

const validator = createValidator({
  status: ['string', `in:,${Object.keys(methodStatuses).join()}`],
  country: ['string', `in:${Object.keys(countries).join()}`],
}, attributeLabels, false);

class MethodsGridFilter extends Component {
  static propTypes = {
    reset: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
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
                label={attributeLabels.country}
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
                label={attributeLabels.status}
                labelClassName="form-label"
                component={SelectField}
                position="vertical"
              >
                <option value="">All statuses</option>
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
                  Reset
                </button>
                <button
                  disabled={submitting}
                  className="btn btn-primary"
                  type="submit"
                >
                  Apply
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
  validate: validator,
})(MethodsGridFilter);
