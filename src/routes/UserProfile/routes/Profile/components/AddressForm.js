import React, { PureComponent } from 'react';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import uniqBy from 'lodash/uniqBy';
import { InputField, TextAreaField, NasSelectField } from '../../../../../components/ReduxForm';
import PropTypes from '../../../../../constants/propTypes';
import { createValidator } from '../../../../../utils/validator';

const attributeLabels = {
  country: 'Country',
  city: 'City',
  postCode: 'Post Code',
  address: 'Full Address',
};

class AddressForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    disabled: PropTypes.bool,
    meta: PropTypes.shape({
      countries: PropTypes.arrayOf(PropTypes.object).isRequired,
      countryCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
  };
  static defaultProps = {
    handleSubmit: null,
    pristine: false,
    submitting: false,
    disabled: false,
    meta: {
      countries: [],
      countryCodes: [],
    },
  };

  render() {
    const {
      pristine,
      submitting,
      handleSubmit,
      onSubmit,
      disabled,
      meta: {
        countries,
      },
    } = this.props;

    return (
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row margin-bottom-20">
            <div className="col-xl-6 personal-form-heading">
              {I18n.t('PLAYER_PROFILE.PROFILE.ADDRESS.TITLE')}
            </div>

            <div className="col-xl-6 text-right">
              {
                !pristine && !submitting && !disabled &&
                <button className="btn btn-sm btn-primary" type="submit" id="profile-address-info-save-btn">
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
                disabled={disabled}
              >
                {
                  uniqBy(countries, 'countryCode').map(item =>
                    (
                      <option key={`${item.countryCode}-${item.phoneCode}`} value={item.countryCode}>
                        {item.countryName}
                      </option>
                    )
                  )
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
                disabled={disabled}
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
                disabled={disabled}
              />
            </div>
          </div>
          <div className="filter-row">
            <div className="filter-row__big">
              <Field
                name="address"
                label={attributeLabels.address}
                component={TextAreaField}
                position="vertical"
                showErrorMessage
                disabled={disabled}
                id="profile-address-textarea"
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
  enableReinitialize: true,
  validate: (values, props) => {
    const { meta: { countryCodes } } = props;

    const rules = {
      country: ['required', `in:,${countryCodes.join()}`],
      city: ['string', 'min:3'],
      postCode: ['string', 'min:3'],
      address: ['string'],
    };

    return createValidator(
      rules,
      attributeLabels,
      false,
    )(values);
  },
})(AddressForm);
