import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import moment from 'moment';
import PropTypes from 'constants/propTypes';
import { InputField, SelectField, DateTimeField, NasSelectField } from 'components/ReduxForm';
import { createValidator } from 'utils/validator';
import PermissionContent from 'components/PermissionContent';
import { getAvailableLanguages } from 'config';
import permissions from 'config/permissions';
import languageNames from 'constants/languageNames';
import countryList from 'utils/countryList';

const genders = () => ({
  UNDEFINED: I18n.t('COMMON.GENDERS.UNDEFINED'),
  MALE: I18n.t('COMMON.GENDERS.MALE'),
  FEMALE: I18n.t('COMMON.GENDERS.FEMALE'),
});

const attributeLabels = () => ({
  firstName: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.FIRST_NAME'),
  lastName: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.LAST_NAME'),
  languageCode: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.LANGUAGE'),
  birthDate: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.DATE_OF_BIRTH'),
  gender: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.GENDER'),
  passportNumber: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.PASSPORT_NUMBER'),
  expirationDate: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.PASSPORT_EXPARATION_DATE'),
  countryOfIssue: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.PASSPORT_ISSUE_COUNTRY'),
  passportIssueDate: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.PASSPORT_ISSUE_DATE'),
});

const AGE_YEARS_CONSTRAINT = 18;

class PersonalForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    disabled: PropTypes.bool,
    valid: PropTypes.bool,
  };

  static contextTypes = {
    tradingOperatorAccessDisabled: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    handleSubmit: null,
    pristine: false,
    submitting: false,
    disabled: false,
    valid: false,
  };

  ageValidator = (current) => {
    const requireAge = moment().subtract(AGE_YEARS_CONSTRAINT, 'year');

    return current.isBefore(requireAge);
  };

  render() {
    const {
      handleSubmit,
      onSubmit,
      pristine,
      submitting,
      disabled,
      valid,
    } = this.props;

    const { tradingOperatorAccessDisabled } = this.context;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row margin-bottom-20">
          <div className="col personal-form-heading">
            {I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.TITLE')}
          </div>
          <PermissionContent permissions={permissions.USER_PROFILE.UPDATE_PROFILE}>
            <div className="col-auto">
              <If condition={!pristine && !submitting && valid && !disabled}>
                <button className="btn btn-sm btn-primary" type="submit" id="profile-personal-info-save-btn">
                  {I18n.t('COMMON.SAVE_CHANGES')}
                </button>
              </If>
            </div>
          </PermissionContent>
        </div>
        <div className="row">
          <Field
            name="firstName"
            label={attributeLabels().firstName}
            type="text"
            component={InputField}
            disabled={disabled || tradingOperatorAccessDisabled}
            id="users-profile-first-name"
            className="col-lg-6"
          />
          <Field
            name="lastName"
            label={attributeLabels().lastName}
            type="text"
            component={InputField}
            disabled={disabled || tradingOperatorAccessDisabled}
            id="users-profile-last-name"
            className="col-lg-6"
          />
        </div>
        <div className="row">
          <Field
            name="languageCode"
            label={attributeLabels().languageCode}
            type="text"
            className="col-lg-4"
            component={NasSelectField}
            disabled={disabled}
          >
            {
              getAvailableLanguages().map(languageCode => (
                <option key={languageCode} value={languageCode}>
                  {I18n.t(get(languageNames.find(item => item.languageCode === languageCode), 'languageName'))}
                </option>
              ))
            }
          </Field>
          <Field
            name="birthDate"
            label={attributeLabels().birthDate}
            component={DateTimeField}
            timeFormat={null}
            disabled={disabled}
            isValidDate={this.ageValidator}
            className="col-lg-3"
          />
          <Field
            name="gender"
            label={attributeLabels().gender}
            type="text"
            component={SelectField}
            disabled={disabled}
            className="col-lg-3"
          >
            {Object.entries(genders()).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </Field>
        </div>
        <div className="row">
          <Field
            name="passportNumber"
            label={attributeLabels().passportNumber}
            type="text"
            component={InputField}
            disabled={disabled}
            className="col-lg-6"
          />
          <Field
            name="expirationDate"
            label={attributeLabels().expirationDate}
            component={DateTimeField}
            timeFormat={null}
            isValidDate={() => true}
            disabled={disabled}
            className="col-lg-3"
          />
        </div>
        <div className="row">
          <Field
            name="countryOfIssue"
            label={I18n.t(attributeLabels().countryOfIssue)}
            component={NasSelectField}
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
            name="passportIssueDate"
            label={attributeLabels().passportIssueDate}
            component={DateTimeField}
            timeFormat={null}
            isValidDate={() => true}
            disabled={disabled}
            className="col-lg-3"
          />
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'updateProfilePersonal',
  touchOnChange: true,
  validate: createValidator({
    firstName: 'string',
    lastName: 'string',
    birthDate: 'regex:/^\\d{4}-\\d{2}-\\d{2}$/',
    identifier: 'string',
    passportNumber: 'string',
    expirationDate: 'regex:/^\\d{4}-\\d{2}-\\d{2}$/',
    countryOfIssue: 'string',
    passportIssueDate: 'regex:/^\\d{4}-\\d{2}-\\d{2}$/',
  }, attributeLabels(), false),
  enableReinitialize: true,
})(PersonalForm);
