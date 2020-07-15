import React, { PureComponent } from 'react';
import { Field, Form, Formik } from 'formik';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { FormikInputField, FormikTextAreaField, FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import PropTypes from 'constants/propTypes';
import { createValidator } from 'utils/validator';
import countries from 'utils/countryList';
import UpdateAddressMutation from './graphql/UpdateAddressMutation';

const attributeLabels = {
  country: I18n.t('PLAYER_PROFILE.PROFILE.ADDRESS.LABEL.COUNTRY'),
  city: I18n.t('PLAYER_PROFILE.PROFILE.ADDRESS.LABEL.CITY'),
  postCode: I18n.t('PLAYER_PROFILE.PROFILE.ADDRESS.LABEL.POST_CODE'),
  address: I18n.t('PLAYER_PROFILE.PROFILE.ADDRESS.LABEL.FULL_ADDR'),
  poBox: I18n.t('PLAYER_PROFILE.PROFILE.ADDRESS.LABEL.PO_BOX'),
};

const validator = createValidator(
  {
    city: 'string|min:3',
    postCode: 'string|min:3',
    address: 'string',
  },
  attributeLabels,
  false,
);

class AddressForm extends PureComponent {
  static propTypes = {
    initialValues: PropTypes.object,
    disabled: PropTypes.bool,
    meta: PropTypes.shape({
      countries: PropTypes.arrayOf(PropTypes.object).isRequired,
      countryCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
    updateAddress: PropTypes.func.isRequired,
    playerUUID: PropTypes.string.isRequired,
  };

  static defaultProps = {
    initialValues: {},
    disabled: false,
    meta: {
      countries: [],
      countryCodes: [],
    },
  };

  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
  };

  handleUpdateAddress = async (values, { setSubmitting }) => {
    const { updateAddress, playerUUID } = this.props;
    try {
      await updateAddress({
        variables: {
          playerUUID,
          ...values,
        },
      });

      this.context.addNotification({
        level: 'success',
        title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });
    } catch {
      this.context.addNotification({
        level: 'error',
        title: I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY')}`,
      });
    }

    setSubmitting(false);
  };

  render() {
    const { disabled, initialValues } = this.props;

    return (
      <Formik
        initialValues={initialValues}
        onSubmit={this.handleUpdateAddress}
        validate={validator}
        enableReinitialize
      >
        {({ dirty, isSubmitting }) => (
          <Form>
            <div className="row margin-bottom-20">
              <div className="col personal-form-heading">
                {I18n.t('PLAYER_PROFILE.PROFILE.ADDRESS.TITLE')}
              </div>
              <div className="col-auto">
                <If condition={dirty && !isSubmitting && !disabled}>
                  <Button
                    small
                    primary
                    type="submit"
                  >
                    {I18n.t('COMMON.SAVE_CHANGES')}
                  </Button>
                </If>
              </div>
            </div>
            <div className="row">
              <Field
                name="countryCode"
                label={attributeLabels.country}
                className="col-lg-4"
                component={FormikSelectField}
                disabled={disabled}
              >
                {Object
                  .keys(countries)
                  .map(key => <option key={key} value={key}>{countries[key]}</option>)
                }
              </Field>
              <Field
                name="city"
                label={attributeLabels.city}
                component={FormikInputField}
                disabled={disabled}
                className="col-lg-3"
              />
              <Field
                name="poBox"
                label={attributeLabels.poBox}
                component={FormikInputField}
                disabled={disabled}
                className="col-lg-3"
              />
              <Field
                name="postCode"
                label={attributeLabels.postCode}
                component={FormikInputField}
                disabled={disabled}
                className="col-lg-2"
              />
            </div>
            <Field
              name="address"
              label={attributeLabels.address}
              component={FormikTextAreaField}
              disabled={disabled}
              maxLength={100}
            />
          </Form>
        )}
      </Formik>
    );
  }
}

export default withRequests({
  updateAddress: UpdateAddressMutation,
})(AddressForm);
