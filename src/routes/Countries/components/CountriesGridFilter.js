import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import { SelectField } from '../../../components/ReduxForm';
import { accessTypes, accessTypeLabels } from '../../../constants/countries';
import { createValidator } from '../../../utils/validator';

const attributeLabels = {
  access: 'Access',
};

const validator = createValidator({
  access: ['string', `in:,${Object.keys(accessTypes).join()}`],
}, attributeLabels, false);

class CountriesGridFilter extends Component {
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
                    name="access"
                    label={attributeLabels.access}
                    labelClassName="form-label"
                    component={SelectField}
                    position="vertical"
                  >
                    <option value="">-- Any --</option>
                    {Object
                      .keys(accessTypes)
                      .map(key => <option key={key} value={key}>{accessTypeLabels[key]}</option>)
                    }
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
  form: 'filterCountries',
  validate: validator,
})(CountriesGridFilter);
