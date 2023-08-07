import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Button } from 'components';
import { Profile } from '__generated__/types';
import countryList from 'utils/countryList';
import { createValidator, translateLabels } from 'utils/validator';
import { FormikInputField, FormikSelectField, FormikTextAreaField } from 'components/Formik';
import { attributeLabels } from 'routes/Clients/routes/Client/routes/ClientProfileTab/constants/clientAddressForm';
import { FormValues } from 'routes/Clients/routes/Client/routes/ClientProfileTab/types/clientAddressForm';
import useClientAddressForm from 'routes/Clients/routes/Client/routes/ClientProfileTab/hooks/useClientAddressForm';
import './ClientAddressForm.scss';

type Props = {
  profile: Profile,
};

const ClientAddressForm = (props: Props) => {
  const { profile } = props;
  const { countryCode, city, poBox, postCode, address } = profile.address || {};

  const {
    clientAddress,
    handleSubmit,
    allowUpdateAddress,
  } = useClientAddressForm(props);

  return (
    <div className="ClientAddressForm">
      <Formik
        initialValues={{
          countryCode: clientAddress.countryCode || countryCode,
          city: clientAddress.city || city,
          poBox: clientAddress.poBox || poBox,
          postCode: clientAddress.postCode || postCode,
          address: clientAddress.address || address,
        } as FormValues}
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
                  data-testid="ClientAddressForm-saveChangesButton"
                >
                  {I18n.t('COMMON.SAVE_CHANGES')}
                </Button>
              </If>
            </div>

            <div className="ClientAddressForm__fields">
              <Field
                name="countryCode"
                className="ClientAddressForm__field"
                data-testid="ClientAddressForm-countryCodeSelect"
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
                data-testid="ClientAddressForm-cityInput"
                label={I18n.t(attributeLabels.city)}
                placeholder={I18n.t(attributeLabels.city)}
                component={FormikInputField}
                disabled={isSubmitting || !allowUpdateAddress}
              />

              <Field
                name="poBox"
                className="ClientAddressForm__field"
                data-testid="ClientAddressForm-poBoxInput"
                label={I18n.t(attributeLabels.poBox)}
                placeholder={I18n.t(attributeLabels.poBox)}
                component={FormikInputField}
                disabled={isSubmitting || !allowUpdateAddress}
              />

              <Field
                name="postCode"
                className="ClientAddressForm__field"
                data-testid="ClientAddressForm-postCodeInput"
                label={I18n.t(attributeLabels.postCode)}
                placeholder={I18n.t(attributeLabels.postCode)}
                component={FormikInputField}
                disabled={isSubmitting || !allowUpdateAddress}
              />

              <Field
                name="address"
                className="ClientAddressForm__field ClientAddressForm__text-area"
                data-testid="ClientAddressForm-addressTextArea"
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
