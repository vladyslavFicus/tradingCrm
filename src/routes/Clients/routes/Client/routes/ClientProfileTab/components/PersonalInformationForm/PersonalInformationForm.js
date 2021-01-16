import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import { Formik, Form, Field } from 'formik';
import PermissionContent from 'components/PermissionContent';
import {
  FormikSelectField,
  FormikDatePicker,
  FormikInputField,
} from 'components/Formik';
import { encodeNullValues } from 'components/Formik/utils';
import Button from 'components/UI/Button';
import { getAvailableLanguages } from 'config';
import permissions from 'config/permissions';
import { createValidator } from 'utils/validator';
import countryList from 'utils/countryList';
import PropTypes from 'constants/propTypes';
import {
  COUNTRY_SPECIFIC_IDENTIFIER_TYPES,
  attributeLabels,
  timeZoneOffsets,
  genders,
} from './constants';

const validator = createValidator({
  firstName: ['required', 'string'],
  lastName: ['required', 'string'],
  languageCode: ['required', 'string'],
  birthDate: 'regex:/^\\d{4}-\\d{2}-\\d{2}$/',
  identifier: 'string',
  passportNumber: 'string',
  expirationDate: 'regex:/^\\d{4}-\\d{2}-\\d{2}$/',
  countryOfIssue: 'string',
  passportIssueDate: 'regex:/^\\d{4}-\\d{2}-\\d{2}$/',
}, attributeLabels, false);

const AGE_YEARS_CONSTRAINT = 18;

class PersonalInformationForm extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    initialValues: PropTypes.shape({
      passport: PropTypes.shape({
        number: PropTypes.string,
        issueDate: PropTypes.string,
        expirationDate: PropTypes.string,
        countryOfIssue: PropTypes.string,
        countrySpecificIdentifier: PropTypes.string,
        countrySpecificIdentifierType: PropTypes.string,
      }),
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      birthDate: PropTypes.string,
      gender: PropTypes.string,
      languageCode: PropTypes.string.isRequired,
      identificationNumber: PropTypes.string,
      timeZone: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    disabled: false,
  };

  render() {
    const {
      initialValues,
      onSubmit,
      disabled,
    } = this.props;

    return (
      <Formik
        enableReinitialize
        initialValues={encodeNullValues(initialValues)}
        validate={validator}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, dirty }) => (
          <Form>
            <div className="row margin-bottom-20">
              <div className="col personal-form-heading">
                {I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.TITLE')}
              </div>
              <PermissionContent permissions={permissions.USER_PROFILE.UPDATE_PERSONAL_INFORMATION}>
                <div className="col-auto">
                  <If condition={dirty && !disabled && !isSubmitting}>
                    <Button
                      type="submit"
                      primary
                      small
                    >
                      {I18n.t('COMMON.SAVE_CHANGES')}
                    </Button>
                  </If>
                </div>
              </PermissionContent>
            </div>
            <div className="row">
              <Field
                name="firstName"
                label={attributeLabels.firstName}
                component={FormikInputField}
                disabled={disabled}
                className="col-lg-6"
              />
              <Field
                name="lastName"
                label={attributeLabels.lastName}
                component={FormikInputField}
                disabled={disabled}
                className="col-lg-6"
              />
            </div>
            <div className="row">
              <Field
                name="languageCode"
                label={attributeLabels.language}
                className="col-lg-4"
                component={FormikSelectField}
                disabled={disabled}
              >
                {getAvailableLanguages().map(locale => (
                  <option key={locale} value={locale}>
                    {I18n.t(`COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`, { defaultValue: locale.toUpperCase() })}
                  </option>
                ))}
              </Field>
              <Field
                name="birthDate"
                className="col-lg-3"
                label={attributeLabels.birthDate}
                placeholder={attributeLabels.birthDate}
                component={FormikDatePicker}
                maxDate={moment().subtract(AGE_YEARS_CONSTRAINT, 'year')}
                disabled={disabled}
                withTime={false}
                closeOnSelect
              />
              <Field
                name="gender"
                label={attributeLabels.gender}
                component={FormikSelectField}
                disabled={disabled}
                className="col-lg-2"
              >
                {Object.entries(genders).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Field>
              <Field
                name="timeZone"
                label={attributeLabels.timeZone}
                placeholder={attributeLabels.timeZone}
                component={FormikSelectField}
                disabled={disabled}
                className="col-lg-2"
              >
                {timeZoneOffsets.map(timeZone => (
                  <option key={timeZone} value={timeZone}>
                    {`UTC ${timeZone}`}
                  </option>
                ))}
              </Field>
              <Field
                name="identificationNumber"
                label={attributeLabels.identificationNumber}
                placeholder={attributeLabels.identificationNumber}
                component={FormikInputField}
                disabled={disabled}
                className="col-lg-3"
              />
            </div>
            <div className="row">
              <Field
                name="passport.number"
                label={attributeLabels.passportNumber}
                placeholder={attributeLabels.passportNumber}
                component={FormikInputField}
                disabled={disabled}
                className="col-lg-6"
              />
              <Field
                name="passport.expirationDate"
                className="col-lg-3"
                label={attributeLabels.expirationDate}
                placeholder={attributeLabels.expirationDate}
                component={FormikDatePicker}
                disabled={disabled}
                closeOnSelect
              />
            </div>
            <div className="row">
              <Field
                name="passport.countryOfIssue"
                label={attributeLabels.countryOfIssue}
                component={FormikSelectField}
                disabled={disabled}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                className="col-lg-4"
              >
                {Object.entries(countryList).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Field>
              <Field
                name="passport.issueDate"
                className="col-lg-3"
                label={attributeLabels.passportIssueDate}
                placeholder={attributeLabels.passportIssueDate}
                component={FormikDatePicker}
                disabled={disabled}
                closeOnSelect
              />
            </div>
            <div className="row">
              <Field
                name="passport.countrySpecificIdentifier"
                label={attributeLabels.countrySpecificIdentifier}
                placeholder={attributeLabels.countrySpecificIdentifier}
                component={FormikInputField}
                disabled={disabled}
                className="col-lg-3"
              />
              <Field
                name="passport.countrySpecificIdentifierType"
                label={attributeLabels.countrySpecificIdentifierType}
                placeholder={attributeLabels.countrySpecificIdentifierType}
                component={FormikSelectField}
                disabled={disabled}
                className="col-lg-4"
              >
                {COUNTRY_SPECIFIC_IDENTIFIER_TYPES.map(item => (
                  <option key={item} value={item}>
                    {I18n.t(`PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.COUNTRY_SPECIFIC_IDENTIFIER_TYPES.${item}`)}
                  </option>
                ))}
              </Field>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

export default PersonalInformationForm;
