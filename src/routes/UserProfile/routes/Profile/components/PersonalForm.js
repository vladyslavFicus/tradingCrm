import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../constants/propTypes';
import { InputField, SelectField, BirthdayField } from '../../../../../components/ReduxForm';
import { createValidator } from '../../../../../utils/validator';
import PermissionContent from '../../../../../components/PermissionContent';
import permissions from '../../../../../config/permissions';

const genders = ['UNDEFINED', 'MALE', 'FEMALE'];
const attributeLabels = {
  firstName: 'First name',
  lastName: 'Last name',
  identifier: 'ID Number',
  birthDate: 'Date of birth',
  gender: 'Gender',
};
const validator = createValidator({
  firstName: 'string',
  lastName: 'string',
  birthDate: 'date',
  identifier: ['string'],
}, attributeLabels, false);

class PersonalForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    disabled: PropTypes.bool,
  };
  static defaultProps = {
    handleSubmit: null,
    pristine: false,
    submitting: false,
    disabled: false,
  };

  render() {
    const {
      handleSubmit,
      onSubmit,
      pristine,
      submitting,
      disabled,
    } = this.props;

    return (
      <form className="padding-bottom-20" onSubmit={handleSubmit(onSubmit)}>
        <div className="row margin-bottom-20">
          <div className="col-xl-6">
            <span className="personal-form-heading">{I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.TITLE')}</span>
          </div>
          <PermissionContent permissions={permissions.USER_PROFILE.UPDATE_PROFILE}>
            <div className="col-xl-6 text-right">
              {
                !pristine && !submitting && !disabled &&
                <button className="btn btn-sm btn-primary" type="submit" id="profile-personal-info-save-btn">
                  {I18n.t('COMMON.SAVE_CHANGES')}
                </button>
              }
            </div>
          </PermissionContent>
        </div>
        <div className="form-row">
          <div className="form-row__medium">
            <Field
              name="firstName"
              label={attributeLabels.firstName}
              type="text"
              component={InputField}
              position="vertical"
              showErrorMessage
              disabled={disabled}
              id="users-profile-first-name"
            />
          </div>
          <div className="form-row__medium">
            <Field
              name="lastName"
              label={attributeLabels.lastName}
              type="text"
              component={InputField}
              position="vertical"
              showErrorMessage
              disabled={disabled}
              id="users-profile-last-name"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-row__medium">
            <Field
              name="identifier"
              label={attributeLabels.identifier}
              type="text"
              component={InputField}
              position="vertical"
              showErrorMessage
              disabled={disabled}
            />
          </div>
          <div className="form-row__small">
            <Field
              name="birthDate"
              label={attributeLabels.birthDate}
              component={BirthdayField}
              disabled={disabled}
            />
          </div>
          <div className="form-row__small">
            <Field
              name="gender"
              label={attributeLabels.gender}
              type="text"
              component={SelectField}
              position="vertical"
              disabled={disabled}
            >
              {genders.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Field>
          </div>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'updateProfilePersonal',
  validate: validator,
  enableReinitialize: true,
})(PersonalForm);
