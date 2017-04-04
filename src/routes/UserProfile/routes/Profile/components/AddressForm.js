import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import countryList from 'country-list';
import { InputField, SelectField, TextAreaField } from '../../../../../components/ReduxForm/UserProfile';
import { createValidator } from '../../../../../utils/validator';

const attributeLabels = {
  country: 'Country',
  city: 'City',
  postCode: 'Post Code',
  address: 'Full Address',
};

const countries = countryList().getData().reduce((result, item) => ({
  ...result,
  [item.code]: item.name,
}), {});

const validator = createValidator({
  country: [`in:,${Object.keys(countries).join()}`],
  city: ['string', 'min:3'],
  postCode: ['string', 'min:3'],
}, attributeLabels, false);

class AddressForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    valid: PropTypes.bool,
  };

  render() {
    const {
      pristine,
      submitting,
      handleSubmit,
      onSubmit,
      valid,
    } = this.props;

    return (
      <div>
        <form className="form-horizontal" role="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-6">
              <h5>Address</h5>
            </div>

            <div className="col-md-6 text-right">
              {
                !(pristine || submitting || !valid) &&
                <button className="btn btn-sm btn-primary" type="submit">
                  Save changes
                </button>
              }
            </div>
          </div>
          <div className="row">
            <div className="player__account__page__kyc-form">
              <Field
                name="country"
                label={attributeLabels.country}
                type="text"
                wrapperClassName="col-lg-4"
                component={SelectField}
              >
                {Object
                  .keys(countries)
                  .map(key => <option key={key} value={key}>{countries[key]}</option>)
                }
              </Field>

              <Field
                name="city"
                label={attributeLabels.city}
                type="text"
                component={InputField}
                wrapperClassName="col-lg-4"
                showErrorMessage
              />

              <Field
                name="postCode"
                label={attributeLabels.postCode}
                type="text"
                component={InputField}
                wrapperClassName="col-lg-4"
                showErrorMessage
              />

              <Field
                name="fullAddress"
                label={attributeLabels.address}
                type="text"
                component={TextAreaField}
                wrapperClassName="col-lg-12"
                showErrorMessage
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default reduxForm({
  form: 'updateProfileAddress',
  validate: validator,
})(AddressForm);
