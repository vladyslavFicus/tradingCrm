import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import countryList from 'country-list';
import { I18n } from 'react-redux-i18n';
import { InputField, TextAreaField, NasSelectField } from '../../../../../components/ReduxForm';
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
  country: ['required', `in:,${Object.keys(countries).join()}`],
  city: ['string', 'min:3'],
  postCode: ['string', 'min:3'],
  address: ['string'],
}, attributeLabels, false);

class AddressForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
  };
  static defaultProps = {
    handleSubmit: null,
    pristine: false,
    submitting: false,
  };

  render() {
    const {
      pristine,
      submitting,
      handleSubmit,
      onSubmit,
    } = this.props;

    return (
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row margin-bottom-20">
            <div className="col-xl-6">
              <span className="personal-form-heading">{I18n.t('PLAYER_PROFILE.PROFILE.ADDRESS.TITLE')}</span>
            </div>

            <div className="col-xl-6 text-right">
              {
                !(pristine || submitting) &&
                <button className="btn btn-sm btn-primary" type="submit">
                  {I18n.t('COMMON.SAVE_CHANGES')}
                </button>
              }
            </div>
          </div>
          <div className="form-row">
            <div className="form-row__medium">
              <Field
                name="country"
                label={attributeLabels.country}
                type="text"
                position="vertical"
                wrapperClassName="col-lg-4"
                component={NasSelectField}
              >
                {Object
                  .keys(countries)
                  .map(key => <option key={key} value={key}>{countries[key]}</option>)
                }
              </Field>
            </div>
            <div className="form-row__medium">
              <Field
                name="city"
                label={attributeLabels.city}
                type="text"
                component={InputField}
                position="vertical"
                showErrorMessage
              />
            </div>
            <div className="form-row__small">
              <Field
                name="postCode"
                label={attributeLabels.postCode}
                type="text"
                component={InputField}
                position="vertical"
                showErrorMessage
              />
            </div>
          </div>
          <div className="filter-row">
            <div className="filter-row__big">
              <Field
                name="address"
                label={attributeLabels.address}
                type="text"
                component={TextAreaField}
                position="vertical"
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
