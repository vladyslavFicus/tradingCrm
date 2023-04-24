import React from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import { Formik, Form, Field } from 'formik';
import { parseErrors } from 'apollo';
import { getAvailableLanguages } from 'config';
import { Profile } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import countryList from 'utils/countryList';
import { createValidator, translateLabels } from 'utils/validator';
import { COUNTRY_SPECIFIC_IDENTIFIER_TYPES, AGE_YEARS_CONSTRAINT, genders, MIN_BIRTHDATE } from 'constants/user';
import { DATE_BASE_FORMAT } from 'components/DatePickers/constants';
import { FormikInputField, FormikSelectField, FormikDatePicker } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button } from 'components/Buttons';
import { attributeLabels, timeZoneOffsets } from './constants';
import { useUpdateClientPersonalMutation } from './graphql/__generated__/UpdateClientPersonalMutation';
import './ClientPersonalForm.scss';

type FormValues = {
  firstName: string,
  lastName: string,
  gender: string,
  birthDate: string,
  languageCode: string,
  timeZone: string,
  identificationNumber: string,
  passport: {
    number: string,
    expirationDate: string,
    countryOfIssue: string,
    issueDate: string,
    countrySpecificIdentifier: string,
    countrySpecificIdentifierType: string,
  },
};

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
  } = profile;

  const {
    number,
    expirationDate,
    countryOfIssue,
    issueDate,
    countrySpecificIdentifier,
    countrySpecificIdentifierType,
  } = passport || {};

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowUpdatePersonalInformation = permission.allows(permissions.USER_PROFILE.UPDATE_PERSONAL_INFORMATION);

  // ===== Requests ===== //
  const [updateClientPersonalMutation] = useUpdateClientPersonalMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues) => {
    try {
      await updateClientPersonalMutation({
        variables: {
          playerUUID: profile.uuid,
          ...decodeNullValues(values),
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.TITLE'),
        message: `${I18n.t('COMMON.ACTIONS.UPDATED')} ${I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.TITLE'),
        message: error.message || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

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
          passport: {
            number: number || '',
            expirationDate: expirationDate || '',
            countryOfIssue: countryOfIssue || '',
            issueDate: issueDate || '',
            countrySpecificIdentifier: countrySpecificIdentifier || '',
            countrySpecificIdentifierType: countrySpecificIdentifierType || '',
          },
        }}
        validate={createValidator({
          firstName: 'required',
          lastName: 'required',
          languageCode: 'required',
          birthDate: [
            'date',
            `minDate:${MIN_BIRTHDATE}`,
            `maxDate:${moment().subtract(AGE_YEARS_CONSTRAINT, 'year').format(DATE_BASE_FORMAT)}`,
          ],
          'passport.expirationDate': 'date',
          'passport.issueDate': 'date',
        }, translateLabels(attributeLabels), false,
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
                  label={I18n.t(attributeLabels.firstName)}
                  placeholder={I18n.t(attributeLabels.firstName)}
                  component={FormikInputField}
                  disabled={isSubmitting || !allowUpdatePersonalInformation}
                />

                <Field
                  name="lastName"
                  className="ClientPersonalForm__field"
                  label={I18n.t(attributeLabels.lastName)}
                  placeholder={I18n.t(attributeLabels.lastName)}
                  component={FormikInputField}
                  disabled={isSubmitting || !allowUpdatePersonalInformation}
                />

                <Field
                  name="gender"
                  className="ClientPersonalForm__field"
                  label={I18n.t(attributeLabels.gender)}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  component={FormikSelectField}
                  disabled={isSubmitting || !allowUpdatePersonalInformation}
                >
                  {Object.keys(genders).map(key => (
                    <option key={key} value={key}>
                      {I18n.t(genders[key])}
                    </option>
                  ))}
                </Field>
              </div>

              <div>
                <Field
                  name="birthDate"
                  className="ClientPersonalForm__field"
                  label={I18n.t(attributeLabels.birthDate)}
                  component={FormikDatePicker}
                  minDate={moment(MIN_BIRTHDATE)}
                  maxDate={moment().subtract(AGE_YEARS_CONSTRAINT, 'year')}
                  disabled={isSubmitting || !allowUpdatePersonalInformation}
                  closeOnSelect
                />

                <Field
                  name="languageCode"
                  className="ClientPersonalForm__field"
                  label={I18n.t(attributeLabels.language)}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  component={FormikSelectField}
                  disabled={isSubmitting || !allowUpdatePersonalInformation}
                >
                  {getAvailableLanguages().map(locale => (
                    <option key={locale} value={locale}>
                      {I18n.t(`COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`, { defaultValue: locale.toUpperCase() })}
                    </option>
                  ))}
                </Field>

                <Field
                  name="timeZone"
                  className="ClientPersonalForm__field"
                  label={I18n.t(attributeLabels.timeZone)}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  component={FormikSelectField}
                  disabled={isSubmitting || !allowUpdatePersonalInformation}
                >
                  {timeZoneOffsets.map(item => (
                    <option key={item} value={item}>
                      {`UTC ${item}`}
                    </option>
                  ))}
                </Field>
              </div>

              <Field
                name="identificationNumber"
                className="ClientPersonalForm__field"
                label={I18n.t(attributeLabels.identificationNumber)}
                placeholder={I18n.t(attributeLabels.identificationNumber)}
                component={FormikInputField}
                disabled={isSubmitting || !allowUpdatePersonalInformation}
              />

              <div>
                <Field
                  name="passport.number"
                  className="ClientPersonalForm__field"
                  label={I18n.t(attributeLabels.passportNumber)}
                  placeholder={I18n.t(attributeLabels.passportNumber)}
                  component={FormikInputField}
                  disabled={isSubmitting || !allowUpdatePersonalInformation}
                />

                <Field
                  name="passport.expirationDate"
                  className="ClientPersonalForm__field"
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
                  label={I18n.t(attributeLabels.countryOfIssue)}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  component={FormikSelectField}
                  disabled={isSubmitting || !allowUpdatePersonalInformation}
                >
                  {Object.entries(countryList).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Field>

                <Field
                  name="passport.issueDate"
                  className="ClientPersonalForm__field"
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
                  label={I18n.t(attributeLabels.countrySpecificIdentifier)}
                  placeholder={I18n.t(attributeLabels.countrySpecificIdentifier)}
                  component={FormikInputField}
                  disabled={isSubmitting || !allowUpdatePersonalInformation}
                />

                <Field
                  name="passport.countrySpecificIdentifierType"
                  className="ClientPersonalForm__field"
                  label={I18n.t(attributeLabels.countrySpecificIdentifierType)}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  component={FormikSelectField}
                  disabled={isSubmitting || !allowUpdatePersonalInformation}
                >
                  {COUNTRY_SPECIFIC_IDENTIFIER_TYPES.map(item => (
                    <option key={item} value={item}>
                      {I18n.t(`PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.COUNTRY_SPECIFIC_IDENTIFIER_TYPES.${item}`)}
                    </option>
                  ))}
                </Field>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default React.memo(ClientPersonalForm);