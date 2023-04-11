import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { parseErrors } from 'apollo';
import { Profile } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import countryList from 'utils/countryList';
import { createValidator, translateLabels } from 'utils/validator';
import { FormikInputField, FormikSelectField, FormikTextAreaField } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button } from 'components/Buttons';
import { useUpdateClientAddressMutation } from './graphql/__generated__/UpdateClientAddressMutation';
import './ClientAddressForm.scss';

const attributeLabels = {
  country: 'PLAYER_PROFILE.PROFILE.ADDRESS.LABEL.COUNTRY',
  city: 'PLAYER_PROFILE.PROFILE.ADDRESS.LABEL.CITY',
  postCode: 'PLAYER_PROFILE.PROFILE.ADDRESS.LABEL.POST_CODE',
  address: 'PLAYER_PROFILE.PROFILE.ADDRESS.LABEL.FULL_ADDR',
  poBox: 'PLAYER_PROFILE.PROFILE.ADDRESS.LABEL.PO_BOX',
};

type FormValues = {
  countryCode: string,
  city: string,
  poBox: string,
  postCode: string,
  address: string,
};

type Props = {
  profile: Profile,
};

const ClientAddressForm = (props: Props) => {
  const { profile } = props;
  const { countryCode, city, poBox, postCode, address } = profile.address || {};

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowUpdateAddress = permission.allows(permissions.USER_PROFILE.UPDATE_ADDRESS);

  // ===== Requests ===== //
  const [updateClientAddressMutation] = useUpdateClientAddressMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues) => {
    try {
      await updateClientAddressMutation({
        variables: {
          playerUUID: profile.uuid,
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
  };

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
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, dirty }) => (
          <Form>
            <div className="ClientAddressForm__header">
              <div className="ClientAddressForm__title">
                {I18n.t('PLAYER_PROFILE.PROFILE.ADDRESS.TITLE')}
              </div>

              <If condition={dirty && !isSubmitting && allowUpdateAddress}>
                <Button
                  small
                  primary
                  type="submit"
                >
                  {I18n.t('COMMON.SAVE_CHANGES')}
                </Button>
              </If>
            </div>

            <div className="ClientAddressForm__fields">
              <Field
                name="countryCode"
                className="ClientAddressForm__field"
                label={I18n.t(attributeLabels.country)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                component={FormikSelectField}
                disabled={isSubmitting || !allowUpdateAddress}
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
                disabled={isSubmitting || !allowUpdateAddress}
              />

              <Field
                name="poBox"
                className="ClientAddressForm__field"
                label={I18n.t(attributeLabels.poBox)}
                placeholder={I18n.t(attributeLabels.poBox)}
                component={FormikInputField}
                disabled={isSubmitting || !allowUpdateAddress}
              />

              <Field
                name="postCode"
                className="ClientAddressForm__field"
                label={I18n.t(attributeLabels.postCode)}
                placeholder={I18n.t(attributeLabels.postCode)}
                component={FormikInputField}
                disabled={isSubmitting || !allowUpdateAddress}
              />

              <Field
                name="address"
                className="ClientAddressForm__field ClientAddressForm__text-area"
                label={I18n.t(attributeLabels.address)}
                placeholder={I18n.t(attributeLabels.address)}
                component={FormikTextAreaField}
                disabled={isSubmitting || !allowUpdateAddress}
                maxLength={100}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default React.memo(ClientAddressForm);
