import React, { PureComponent } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { parseErrors, withRequests } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import permissions from 'config/permissions';
import { withPermission } from 'providers/PermissionsProvider';
import countryList from 'utils/countryList';
import { createValidator, translateLabels } from 'utils/validator';
import PropTypes from 'constants/propTypes';
import { FormikInputField, FormikSelectField, FormikTextAreaField } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button } from 'components/UI';
import UpdateClientAddressMutation from './graphql/UpdateClientAddressMutation';
import './ClientAddressForm.scss';

const attributeLabels = {
  country: 'PLAYER_PROFILE.PROFILE.ADDRESS.LABEL.COUNTRY',
  city: 'PLAYER_PROFILE.PROFILE.ADDRESS.LABEL.CITY',
  postCode: 'PLAYER_PROFILE.PROFILE.ADDRESS.LABEL.POST_CODE',
  address: 'PLAYER_PROFILE.PROFILE.ADDRESS.LABEL.FULL_ADDR',
  poBox: 'PLAYER_PROFILE.PROFILE.ADDRESS.LABEL.PO_BOX',
};

class ClientAddressForm extends PureComponent {
  static propTypes = {
    clientData: PropTypes.profile.isRequired,
    permission: PropTypes.permission.isRequired,
    updateClientAddress: PropTypes.func.isRequired,
  };

  handleSubmit = async (values) => {
    const {
      updateClientAddress,
      clientData,
    } = this.props;

    try {
      await updateClientAddress({
        variables: {
          playerUUID: clientData.uuid,
          ...decodeNullValues(values),
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('PLAYER_PROFILE.PROFILE.ADDRESS.TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });
    } catch (e) {
      const { error } = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('PLAYER_PROFILE.PROFILE.ADDRESS.TITLE'),
        message: error.message || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  }

  render() {
    const {
      clientData,
      permission: { allows },
    } = this.props;

    const {
      countryCode,
      city,
      poBox,
      postCode,
      address,
    } = clientData?.address || {};

    const isAvailableToUpdate = allows(permissions.USER_PROFILE.UPDATE_ADDRESS);

    return (
      <div className="ClientAddressForm">
        <Formik
          initialValues={{
            countryCode: countryCode || '',
            city: city || '',
            poBox: poBox || '',
            postCode: postCode || '',
            address: address || '',
          }}
          validate={createValidator({
            city: 'min:3',
            postCode: 'min:3',
          }, translateLabels(attributeLabels), false)}
          onSubmit={this.handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, dirty }) => (
            <Form>
              <div className="ClientAddressForm__header">
                <div className="ClientAddressForm__title">
                  {I18n.t('PLAYER_PROFILE.PROFILE.ADDRESS.TITLE')}
                </div>

                <If condition={dirty && !isSubmitting && isAvailableToUpdate}>
                  <div className="ClientAddressForm__actions">
                    <Button
                      small
                      primary
                      type="submit"
                    >
                      {I18n.t('COMMON.SAVE_CHANGES')}
                    </Button>
                  </div>
                </If>
              </div>

              <div className="ClientAddressForm__fields">
                <Field
                  name="countryCode"
                  className="ClientAddressForm__field"
                  label={I18n.t(attributeLabels.country)}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  component={FormikSelectField}
                  disabled={isSubmitting || !isAvailableToUpdate}
                >
                  {Object.entries(countryList).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Field>

                <Field
                  name="city"
                  className="ClientAddressForm__field"
                  label={I18n.t(attributeLabels.city)}
                  placeholder={I18n.t(attributeLabels.city)}
                  component={FormikInputField}
                  disabled={isSubmitting || !isAvailableToUpdate}
                />

                <Field
                  name="poBox"
                  className="ClientAddressForm__field"
                  label={I18n.t(attributeLabels.poBox)}
                  placeholder={I18n.t(attributeLabels.poBox)}
                  component={FormikInputField}
                  disabled={isSubmitting || !isAvailableToUpdate}
                />

                <Field
                  name="postCode"
                  className="ClientAddressForm__field"
                  label={I18n.t(attributeLabels.postCode)}
                  placeholder={I18n.t(attributeLabels.postCode)}
                  component={FormikInputField}
                  disabled={isSubmitting || !isAvailableToUpdate}
                />

                <Field
                  name="address"
                  className="ClientAddressForm__field ClientAddressForm__text-area"
                  label={I18n.t(attributeLabels.address)}
                  placeholder={I18n.t(attributeLabels.address)}
                  component={FormikTextAreaField}
                  disabled={isSubmitting || !isAvailableToUpdate}
                  maxLength={100}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default compose(
  withPermission,
  withRequests({
    updateClientAddress: UpdateClientAddressMutation,
  }),
)(ClientAddressForm);
