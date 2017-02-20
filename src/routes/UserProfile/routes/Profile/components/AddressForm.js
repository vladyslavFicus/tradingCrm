import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { InputField, SelectField, TextAreaField } from 'components/ReduxForm/UserProfile';
import countryList from 'country-list';
import { createValidator } from 'utils/validator';

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
}, attributeLabels, false);

class AddressForm extends Component {
  render() {
    const { pristine, submitting } = this.props;

    return (
      <div>
        <div className="row">
          <h5 className="pull-left">Address</h5>
          { !(pristine || submitting) &&
          <button className="btn btn-sm btn-primary pull-right" type="submit">
            Save changes
          </button>
          }
        </div>
        <div className="row">
          <form>
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
                  .map((key) => <option key={key} value={key}>{countries[key]}</option>)
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
                name="address"
                label={attributeLabels.address}
                type="text"
                component={TextAreaField}
                wrapperClassName="col-lg-12"
                showErrorMessage
              />

            </div>
            <div className="clearfix visible-xs-block"></div>
          </form>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: 'updateProfileAddress',
  validate: validator,
})(AddressForm);
