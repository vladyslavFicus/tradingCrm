import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { uniqBy } from 'lodash';
import moment from 'moment';
import PropTypes from '../../../../../../../constants/propTypes';
import { InputField, SelectField, DateTimeField, NasSelectField } from '../../../../../../../components/ReduxForm';
import { createValidator } from '../../../../../../../utils/validator';
import PermissionContent from '../../../../../../../components/PermissionContent';
import permissions from '../../../../../../../config/permissions';
import languageNames from '../../../../../../../constants/languageNames';

const genders = ['UNDEFINED', 'MALE', 'FEMALE'];
const attributeLabels = {
  firstName: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.FIRST_NAME'),
  lastName: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.LAST_NAME'),
  languageCode: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.LANGUAGE'),
  birthDate: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.DATE_OF_BIRTH'),
  gender: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.GENDER'),
};

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

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row margin-bottom-20">
          <div className="col personal-form-heading">
            {I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.TITLE')}
          </div>
          <PermissionContent permissions={permissions.USER_PROFILE.UPDATE_PROFILE}>
            <div className="col-auto">
              <If condition={!pristine && !submitting && !disabled && valid}>
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
            label={attributeLabels.firstName}
            type="text"
            component={InputField}
            disabled={disabled}
            id="users-profile-first-name"
            className="col-lg-6"
          />
          <Field
            name="lastName"
            label={attributeLabels.lastName}
            type="text"
            component={InputField}
            disabled={disabled}
            id="users-profile-last-name"
            className="col-lg-6"
          />
        </div>
        <div className="row">
          <Field
            name="languageCode"
            label={attributeLabels.languageCode}
            type="text"
            className="col-lg-4"
            component={NasSelectField}
            disabled={disabled}
          >
            {
              uniqBy(languageNames, 'languageCode').map(item => (
                <option key={item.languageCode} value={item.languageCode}>
                  {I18n.t(item.languageName)}
                </option>
              ))
            }
          </Field>
          <Field
            name="birthDate"
            label={attributeLabels.birthDate}
            component={DateTimeField}
            timeFormat={null}
            disabled={disabled}
            isValidDate={this.ageValidator}
            className="col-lg-3"
          />
          <Field
            name="gender"
            label={attributeLabels.gender}
            type="text"
            component={SelectField}
            disabled={disabled}
            className="col-lg-3"
          >
            {genders.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Field>
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
  }, attributeLabels, false),
  enableReinitialize: true,
})(PersonalForm);
