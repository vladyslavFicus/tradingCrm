import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import PropTypes from '../../../../../../../constants/propTypes';
import { InputField, SelectField, DateTimeField } from '../../../../../../../components/ReduxForm';
import { createValidator } from '../../../../../../../utils/validator';
import PermissionContent from '../../../../../../../components/PermissionContent';
import permissions from '../../../../../../../config/permissions';

const genders = ['UNDEFINED', 'MALE', 'FEMALE'];
const attributeLabels = {
  firstName: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.FIRST_NAME'),
  lastName: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.LAST_NAME'),
  identifier: I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.LABEL.IDENTIFIER'),
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
            className="col-lg-4"
          />
          <Field
            name="lastName"
            label={attributeLabels.lastName}
            type="text"
            component={InputField}
            disabled={disabled}
            id="users-profile-last-name"
            className="col-lg-4"
          />
        </div>
        <div className="row">
          <Field
            name="identifier"
            label={attributeLabels.identifier}
            type="text"
            component={InputField}
            disabled={disabled}
            className="col-lg"
          />
          <Field
            name="birthDate"
            label={attributeLabels.birthDate}
            component={DateTimeField}
            timeFormat={null}
            disabled={disabled}
            isValidDate={this.ageValidator}
            className="col-lg"
          />
          <Field
            name="gender"
            label={attributeLabels.gender}
            type="text"
            component={SelectField}
            disabled={disabled}
            className="col-lg"
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
