import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { camelCase, startCase } from 'lodash';
import { Utils } from '@crm/common';
import { Button, FormikSingleSelectField, FormikInputField } from 'components';
import { Operator } from '__generated__/types';
import useOperatorPersonal from 'routes/Operators/routes/hooks/useOperatorPersonal';
import './OperatorPersonal.scss';

const attributeLabels = {
  firstName: 'OPERATORS.PROFILE.PERSONAL_FORM.LABELS.FIRST_NAME',
  lastName: 'OPERATORS.PROFILE.PERSONAL_FORM.LABELS.LAST_NAME',
  phoneNumber: 'OPERATORS.PROFILE.PERSONAL_FORM.LABELS.PHONE',
  country: 'OPERATORS.PROFILE.PERSONAL_FORM.LABELS.COUNTRY',
  email: 'COMMON.EMAIL',
};

const validate = Utils.createValidator({
  firstName: ['required', 'string'],
  lastName: ['required', 'string'],
  email: ['required', 'email'],
  country: [`in:,${Object.keys(Utils.countryList).join()}`],
  phoneNumber: 'string',
}, Utils.translateLabels(attributeLabels), false);

type Props = {
  operator: Operator,
};

const OperatorPersonal = (props: Props) => {
  const {
    operator: {
      phoneNumber,
      firstName,
      lastName,
      country,
      email,
      clickToCall,
    },
  } = props;

  const {
    deniesUpdate,
    clickToCallConfig,
    handleSubmit,
  } = useOperatorPersonal(props);

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
                  data-testid="OperatorPersonal-saveChangesButton"
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
              data-testid="OperatorPersonal-firstNameInput"
              label={I18n.t(attributeLabels.firstName)}
              placeholder={I18n.t(attributeLabels.firstName)}
              component={FormikInputField}
              disabled={isSubmitting || deniesUpdate}
            />

            <Field
              name="lastName"
              className="OperatorPersonal__field"
              data-testid="OperatorPersonal-lastNameInput"
              label={I18n.t(attributeLabels.lastName)}
              placeholder={I18n.t(attributeLabels.lastName)}
              component={FormikInputField}
              disabled={isSubmitting || deniesUpdate}
            />

            <Field
              name="email"
              className="OperatorPersonal__field"
              data-testid="OperatorPersonal-emailInput"
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
              data-testid="OperatorPersonal-phoneNumberInput"
              label={I18n.t(attributeLabels.phoneNumber)}
              placeholder={I18n.t(attributeLabels.phoneNumber)}
              component={FormikInputField}
              disabled={isSubmitting || deniesUpdate}
            />

            <Field
              withAnyOption
              searchable
              name="country"
              className="OperatorPersonal__field"
              data-testid="OperatorPersonal-countrySelect"
              label={I18n.t(attributeLabels.country)}
              placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
              component={FormikSingleSelectField}
              disabled={isSubmitting || deniesUpdate}
              options={Object.keys(Utils.countryList).map(countryCode => ({
                label: Utils.countryList[countryCode],
                value: countryCode,
              }))}
            />
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
                  data-testid="OperatorPersonal-clickToCallPhoneInput"
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
