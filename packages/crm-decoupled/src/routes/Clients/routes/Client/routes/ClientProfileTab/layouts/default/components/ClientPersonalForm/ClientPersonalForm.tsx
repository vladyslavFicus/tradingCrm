import React from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import { Formik, Form, Field } from 'formik';
import { Config, Utils, Constants } from '@crm/common';
import { Button, FormikSingleSelectField, FormikInputField, FormikDatePicker } from 'components';
import { Profile } from '__generated__/types';

import useClientPersonalForm from 'routes/Clients/routes/Client/routes/ClientProfileTab/hooks/useClientPersonalForm';
import {
  attributeLabels,
  timeZoneOffsets,
} from 'routes/Clients/routes/Client/routes/ClientProfileTab/constants/clientPersonalForm';

import './ClientPersonalForm.scss';

type Props = {
  profile: Profile,
};

const ClientPersonalForm = (props: Props) => {
  const { profile } = props;

  const {
    gender,
    passport,
    timeZone,
    lastName,
    firstName,
    birthDate,
    languageCode,
    identificationNumber,
    termsAccepted,
  } = profile;

  const {
    number,
    expirationDate,
    countryOfIssue,
    issueDate,
    countrySpecificIdentifier,
    countrySpecificIdentifierType,
  } = passport || {};

  const {
    allowUpdatePersonalInformation,
    handleSubmit,
  } = useClientPersonalForm(props);

  return (
    <div className="ClientPersonalForm">
      <Formik
        initialValues={{
          gender: gender || '',
          timeZone: timeZone || '',
          lastName: lastName || '',
          firstName: firstName || '',
          birthDate: birthDate || '',
          languageCode: languageCode || '',
          identificationNumber: identificationNumber || '',
          termsAccepted: !!termsAccepted,
          passport: {
            number: number || '',
            expirationDate: expirationDate || '',
            countryOfIssue: countryOfIssue || '',
            issueDate: issueDate || '',
            countrySpecificIdentifier: countrySpecificIdentifier || '',
            countrySpecificIdentifierType: countrySpecificIdentifierType || '',
          },
        }}
        validate={Utils.createValidator({
          firstName: 'required',
          lastName: 'required',
          languageCode: 'required',
          birthDate: [
            'date',
            `minDate:${Constants.User.MIN_BIRTHDATE}`,
            `maxDate:${moment().subtract(Constants.User.AGE_YEARS_CONSTRAINT, 'year')
              .format(Constants.DATE_BASE_FORMAT)}`,
          ],
          'passport.expirationDate': 'date',
          'passport.issueDate': 'date',
        }, Utils.translateLabels(attributeLabels), false,
        {
          'minDate.birthDate': I18n.t(
            'ERRORS.DATE.INVALID_DATE',
            { attributeName: I18n.t(attributeLabels.birthDate) },
          ),
          'maxDate.birthDate': I18n.t(
            'ERRORS.DATE.INVALID_DATE',
            { attributeName: I18n.t(attributeLabels.birthDate) },
          ),
        })}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, dirty }) => (
          <Form>
            <div className="ClientPersonalForm__header">
              <div className="ClientPersonalForm__title">
                {I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.TITLE')}
              </div>

              <If condition={dirty && !isSubmitting && allowUpdatePersonalInformation}>
                <Button
                  small
                  primary
                  type="submit"
                  data-testid="ClientPersonalForm-saveChangesButton"
                >
                  {I18n.t('COMMON.SAVE_CHANGES')}
                </Button>
              </If>
            </div>

            <div className="ClientPersonalForm__fields">
              <div>
                <Field
                  name="firstName"
                  className="ClientPersonalForm__field"
                  data-testid="ClientPersonalForm-firstNameInput"
                  label={I18n.t(attributeLabels.firstName)}
                  placeholder={I18n.t(attributeLabels.firstName)}
                  component={FormikInputField}
                  disabled={isSubmitting || !allowUpdatePersonalInformation}
                />

                <Field
                  name="lastName"
                  className="ClientPersonalForm__field"
                  data-testid="ClientPersonalForm-lastNameInput"
                  label={I18n.t(attributeLabels.lastName)}
                  placeholder={I18n.t(attributeLabels.lastName)}
                  component={FormikInputField}
                  disabled={isSubmitting || !allowUpdatePersonalInformation}
                />

                <Field
                  name="gender"
                  className="ClientPersonalForm__field"
                  data-testid="ClientPersonalForm-genderSelect"
                  label={I18n.t(attributeLabels.gender)}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  component={FormikSingleSelectField}
                  disabled={isSubmitting || !allowUpdatePersonalInformation}
                  options={Object.keys(Constants.User.genders).map(key => ({
                    label: I18n.t(Constants.User.genders[key]),
                    value: key,
                  }))}
                />
              </div>

              <div>
                <Field
                  name="birthDate"
                  className="ClientPersonalForm__field"
                  data-testid="ClientPersonalForm-birthDatePicker"
                  label={I18n.t(attributeLabels.birthDate)}
                  component={FormikDatePicker}
                  minDate={moment(Constants.User.MIN_BIRTHDATE)}
                  maxDate={moment().subtract(Constants.User.AGE_YEARS_CONSTRAINT, 'year')}
                  disabled={isSubmitting || !allowUpdatePersonalInformation}
                  closeOnSelect
                />

                <Field
                  name="languageCode"
                  className="ClientPersonalForm__field"
                  data-testid="ClientPersonalForm-languageCodeSelect"
                  label={I18n.t(attributeLabels.language)}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  component={FormikSingleSelectField}
                  disabled={isSubmitting || !allowUpdatePersonalInformation}
                  options={Config.getAvailableLanguages().map(locale => ({
                    label: I18n.t(`COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`,
                      { defaultValue: locale.toUpperCase() }),
                    value: locale,
                  }))}
                />

                <Field
                  name="timeZone"
                  className="ClientPersonalForm__field"
                  data-testid="ClientPersonalForm-timeZoneSelect"
                  label={I18n.t(attributeLabels.timeZone)}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  component={FormikSingleSelectField}
                  disabled={isSubmitting || !allowUpdatePersonalInformation}
                  options={timeZoneOffsets.map(item => ({
                    label: `UTC ${item}`,
                    value: item,
                  }))}
                />
              </div>

              <div>
                <Field
                  name="identificationNumber"
                  className="ClientPersonalForm__field"
                  data-testid="ClientPersonalForm-identificationNumberInput"
                  label={I18n.t(attributeLabels.identificationNumber)}
                  placeholder={I18n.t(attributeLabels.identificationNumber)}
                  component={FormikInputField}
                  disabled={isSubmitting || !allowUpdatePersonalInformation}
                />

                <Field
                  name="termsAccepted"
                  className="ClientPersonalForm__field"
                  data-testid="ClientPersonalForm-termsAcceptedSelect"
                  label={I18n.t(attributeLabels.termsAccepted)}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  component={FormikSingleSelectField}
                  disabled={isSubmitting || !allowUpdatePersonalInformation}
                  options={Constants.User.TERMS_ACCEPTED_TYPES.map(({ label, value }) => ({
                    label: I18n.t(`PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.TERMS_ACCEPTED_TYPES.${label}`),
                    value,
                  }))}
                />
              </div>

              <div>
                <Field
                  name="passport.number"
                  className="ClientPersonalForm__field"
                  data-testid="ClientPersonalForm-passportNumberInput"
                  label={I18n.t(attributeLabels.passportNumber)}
                  placeholder={I18n.t(attributeLabels.passportNumber)}
                  component={FormikInputField}
                  disabled={isSubmitting || !allowUpdatePersonalInformation}
                />

                <Field
                  name="passport.expirationDate"
                  className="ClientPersonalForm__field"
                  data-testid="ClientPersonalForm-passportExpirationDatePicker"
                  label={I18n.t(attributeLabels.expirationDate)}
                  component={FormikDatePicker}
                  disabled={isSubmitting || !allowUpdatePersonalInformation}
                  closeOnSelect
                />
              </div>

              <div>
                <Field
                  name="passport.countryOfIssue"
                  className="ClientPersonalForm__field"
                  data-testid="ClientPersonalForm-passportCountryOfIssueSelect"
                  label={I18n.t(attributeLabels.countryOfIssue)}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  component={FormikSingleSelectField}
                  disabled={isSubmitting || !allowUpdatePersonalInformation}
                  options={Object.entries(Utils.countryList).map(([key, value]) => ({
                    label: value,
                    value: key,
                  }))}
                />

                <Field
                  name="passport.issueDate"
                  className="ClientPersonalForm__field"
                  data-testid="ClientPersonalForm-passportIssueDatePicker"
                  label={I18n.t(attributeLabels.passportIssueDate)}
                  component={FormikDatePicker}
                  disabled={isSubmitting || !allowUpdatePersonalInformation}
                  closeOnSelect
                />
              </div>

              <div>
                <Field
                  name="passport.countrySpecificIdentifier"
                  className="ClientPersonalForm__field"
                  data-testid="ClientPersonalForm-passportCountrySpecificIdentifierInput"
                  label={I18n.t(attributeLabels.countrySpecificIdentifier)}
                  placeholder={I18n.t(attributeLabels.countrySpecificIdentifier)}
                  component={FormikInputField}
                  disabled={isSubmitting || !allowUpdatePersonalInformation}
                />

                <Field
                  name="passport.countrySpecificIdentifierType"
                  className="ClientPersonalForm__field"
                  data-testid="ClientPersonalForm-passportCountrySpecificIdentifierTypeSelect"
                  label={I18n.t(attributeLabels.countrySpecificIdentifierType)}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  component={FormikSingleSelectField}
                  disabled={isSubmitting || !allowUpdatePersonalInformation}
                  options={Constants.User.COUNTRY_SPECIFIC_IDENTIFIER_TYPES.map(item => ({
                    label: I18n.t(`PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.COUNTRY_SPECIFIC_IDENTIFIER_TYPES.${item}`),
                    value: item,
                  }))}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default React.memo(ClientPersonalForm);
