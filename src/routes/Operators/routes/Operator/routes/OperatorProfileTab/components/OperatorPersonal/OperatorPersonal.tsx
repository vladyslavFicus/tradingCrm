import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { camelCase, startCase } from 'lodash';
import { Operator } from '__generated__/types';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { notify, LevelType } from 'providers/NotificationProvider';
import { createValidator, translateLabels } from 'utils/validator';
import countries from 'utils/countryList';
import { FormikSelectField, FormikInputField } from 'components/Formik';
import { Button } from 'components/Buttons';
import { useClickToCallConfigQuery } from './graphql/__generated__/ClickToCallConfigQuery';
import { useUpdateOperatorMutation } from './graphql/__generated__/UpdateOperatorMutation';
import './OperatorPersonal.scss';

const attributeLabels = {
  firstName: 'OPERATORS.PROFILE.PERSONAL_FORM.LABELS.FIRST_NAME',
  lastName: 'OPERATORS.PROFILE.PERSONAL_FORM.LABELS.LAST_NAME',
  phoneNumber: 'OPERATORS.PROFILE.PERSONAL_FORM.LABELS.PHONE',
  country: 'OPERATORS.PROFILE.PERSONAL_FORM.LABELS.COUNTRY',
  email: 'COMMON.EMAIL',
};

const validate = createValidator({
  firstName: ['required', 'string'],
  lastName: ['required', 'string'],
  email: ['required', 'email'],
  country: [`in:,${Object.keys(countries).join()}`],
  phoneNumber: 'string',
}, translateLabels(attributeLabels), false);

type FormaValues = {
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  country: string,
  clickToCall: Record<string, string>,
};

type Props = {
  operator: Operator,
};

const OperatorPersonal = (props: Props) => {
  const {
    operator: {
      uuid,
      phoneNumber,
      firstName,
      lastName,
      country,
      email,
      clickToCall,
    },
  } = props;

  const permission = usePermission();

  const deniesUpdate = permission.denies(permissions.OPERATORS.UPDATE_PROFILE);

  // ===== Requests ===== //
  const clickToCallConfigQuery = useClickToCallConfigQuery();

  const clickToCallConfig = clickToCallConfigQuery.data?.clickToCall?.configs || [];

  const [updateOperatorMutation] = useUpdateOperatorMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormaValues) => {
    try {
      await updateOperatorMutation({ variables: { uuid, ...values } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('OPERATORS.NOTIFICATIONS.UPDATE_OPERATOR_SUCCESS.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.UPDATE_OPERATOR_SUCCESS.MESSAGE'),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('OPERATORS.NOTIFICATIONS.UPDATE_OPERATOR_ERROR.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.UPDATE_OPERATOR_ERROR.MESSAGE'),
      });
    }
  };

  return (
    <Formik
      initialValues={{
        phoneNumber: phoneNumber || '',
        firstName: firstName || '',
        lastName: lastName || '',
        country: country || '',
        email: email || '',
        clickToCall,
      }}
      validate={validate}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, dirty }) => (
        <Form className="OperatorPersonal">
          <div className="OperatorPersonal__header">
            <div className="OperatorPersonal__title">
              {I18n.t('OPERATOR_PROFILE.PERSONAL_INFORMATION.TITLE')}
            </div>

            <div className="OperatorPersonal__actions">
              <If condition={dirty && !isSubmitting && !deniesUpdate}>
                <Button
                  small
                  primary
                  type="submit"
                  className="OperatorPersonal__action"
                >
                  {I18n.t('COMMON.SAVE_CHANGES')}
                </Button>
              </If>
            </div>
          </div>

          <div className="OperatorPersonal__fields">
            <Field
              name="firstName"
              className="OperatorPersonal__field"
              label={I18n.t(attributeLabels.firstName)}
              placeholder={I18n.t(attributeLabels.firstName)}
              component={FormikInputField}
              disabled={isSubmitting || deniesUpdate}
            />

            <Field
              name="lastName"
              className="OperatorPersonal__field"
              label={I18n.t(attributeLabels.lastName)}
              placeholder={I18n.t(attributeLabels.lastName)}
              component={FormikInputField}
              disabled={isSubmitting || deniesUpdate}
            />

            <Field
              name="email"
              className="OperatorPersonal__field"
              label={I18n.t(attributeLabels.email)}
              placeholder={I18n.t(attributeLabels.email)}
              component={FormikInputField}
              disabled
            />
          </div>

          <hr />

          <div className="OperatorPersonal__title">
            {I18n.t('OPERATOR_PROFILE.DETAILS.LABEL.CONTACTS')}
          </div>

          <div className="OperatorPersonal__fields">
            <Field
              name="phoneNumber"
              className="OperatorPersonal__field"
              label={I18n.t(attributeLabels.phoneNumber)}
              placeholder={I18n.t(attributeLabels.phoneNumber)}
              component={FormikInputField}
              disabled={isSubmitting || deniesUpdate}
            />

            <Field
              name="country"
              className="OperatorPersonal__field"
              label={I18n.t(attributeLabels.country)}
              placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
              component={FormikSelectField}
              disabled={isSubmitting || deniesUpdate}
              withAnyOption
              searchable
            >
              {Object.keys(countries).map(countryCode => (
                <option key={countryCode} value={countryCode}>
                  {countries[countryCode]}
                </option>
              ))}
            </Field>
          </div>

          <If condition={!!clickToCallConfig.length}>
            <hr />

            <div className="OperatorPersonal__title">
              {I18n.t('OPERATOR_PROFILE.DETAILS.LABEL.VOIP')}
            </div>

            <div className="OperatorPersonal__fields">
              {/* Dynamic construct fields for clickToCall operator config */}
              {clickToCallConfig.map(({ callSystem }) => (
                <Field
                  key={callSystem}
                  name={`clickToCall.${camelCase(callSystem)}Phone`}
                  className="OperatorPersonal__field"
                  label={`${startCase(callSystem.toLowerCase())} SIP`}
                  placeholder={`${startCase(callSystem.toLowerCase())} SIP`}
                  component={FormikInputField}
                  disabled={isSubmitting || deniesUpdate}
                />
              ))}
            </div>
          </If>
        </Form>
      )}
    </Formik>
  );
};

export default React.memo(OperatorPersonal);
