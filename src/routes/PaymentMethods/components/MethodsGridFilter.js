import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import countryList from 'country-list';
import { SelectField } from '../../../components/ReduxForm';
import { methodsStatusesLabels, methodStatuses } from '../../../constants/payment';
import { createValidator } from '../../../utils/validator';

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="well">
          <div className="row">
            <div className="col-md-10">
              <div className="row">
                <div className="col-md-4">
                  <Field
                    name="countryCode"
                    label={attributeLabels.country}
                    labelClassName="form-label"
                    component={SelectField}
                    position="vertical"
                  >
                    <option value="">- General -</option>
                    {Object
                      .keys(countries)
                      .map(key => <option key={key} value={key}>{countries[key]}</option>)
                    }
                  </Field>
                </div>
                <div className="col-md-4">
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

export default reduxForm({
  form: 'filterPaymentMethods',
  validate: validator,
})(MethodsGridFilter);
