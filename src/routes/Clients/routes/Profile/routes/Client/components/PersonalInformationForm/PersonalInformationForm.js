import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import moment from 'moment';
import { Formik, Form, Field } from 'formik';
import PermissionContent from 'components/PermissionContent';
import {
  FormikSelectField,
  FormikDatePicker,
  FormikInputField,
} from 'components/Formik';
import Button from 'components/UI/Button';
import { getAvailableLanguages } from 'config';
import permissions from 'config/permissions';
import { createValidator } from 'utils/validator';
import countryList from 'utils/countryList';
import PropTypes from 'constants/propTypes';
import languageNames from 'constants/languageNames';
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

  static contextTypes = {
    tradingOperatorAccessDisabled: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    disabled: false,
  };

  ageValidator = (current) => {
    const requireAge = moment().subtract(AGE_YEARS_CONSTRAINT, 'year');

    return current.isBefore(requireAge);
  };

  render() {
    const {
      initialValues,
      onSubmit,
      disabled,
    } = this.props;

    const { tradingOperatorAccessDisabled } = this.context;

    return (
      <Formik
        initialValues={initialValues}
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
                disabled={disabled || tradingOperatorAccessDisabled}
                className="col-lg-6"
              />
              <Field
                name="lastName"
                label={attributeLabels.lastName}
                component={FormikInputField}
                disabled={disabled || tradingOperatorAccessDisabled}
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
                {
                  getAvailableLanguages().map(languageCode => (
                    <option key={languageCode} value={languageCode}>
                      {I18n.t(
                        get(languageNames.find(item => item.languageCode === languageCode),
                          'languageName', languageCode),
                      )}
                    </option>
                  ))
                }
              </Field>
              <FormikDatePicker
                name="birthDate"
                label={attributeLabels.birthDate}
                placeholder={attributeLabels.birthDate}
                disabled={disabled}
                timeFormat={null}
                isValidDate={this.ageValidator}
                className="col-lg-3"
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
                    {timeZone}
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
              <FormikDatePicker
                name="passport.expirationDate"
                label={attributeLabels.expirationDate}
                placeholder={attributeLabels.expirationDate}
                disabled={disabled}
                timeFormat={null}
                isValidDate={() => true}
                className="col-lg-3"
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
              <FormikDatePicker
                name="passport.issueDate"
                label={attributeLabels.passportIssueDate}
                placeholder={attributeLabels.passportIssueDate}
                disabled={disabled}
                timeFormat={null}
                isValidDate={() => true}
                className="col-lg-3"
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
