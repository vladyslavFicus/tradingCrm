import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../constants/propTypes';
import { InputField, SelectField, BirthdayField } from '../../../../../components/ReduxForm/UserProfile';
import { createValidator } from '../../../../../utils/validator';

const genders = ['UNDEFINED', 'MALE', 'FEMALE'];
const titles = ['Mr.', 'Ms.', 'Mrs.'];
const attributeLabels = {
  title: 'Title',
  firstName: 'First name',
  lastName: 'Last name',
  identifier: 'ID Number',
  birthDate: 'Date of birth',
  gender: 'Gender',
};
const validator = createValidator({
  title: ['string'],
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
    valid: PropTypes.bool,
  };

  render() {
    const {
      handleSubmit,
      onSubmit,
      pristine,
      submitting,
      valid,
    } = this.props;

    return (
      <div className="padding-bottom-20">
        <form className="form-horizontal" role="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-6">
              <h5>{I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.TITLE')}</h5>
            </div>

            <div className="col-md-6 text-right">
              {
                !(pristine || submitting || !valid) &&
                <button className="btn btn-sm btn-primary" type="submit">
                  {I18n.t('COMMON.SAVE_CHANGES')}
                </button>
              }
            </div>
          </div>

          <div className="row">
            <Field
              name="title"
              label={attributeLabels.title}
              wrapperClassName="col-lg-2"
              component={SelectField}
            >
              <option value="">None</option>
              {titles.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Field>
            <Field
              name="firstName"
              label={attributeLabels.firstName}
              type="text"
              component={InputField}
              wrapperClassName="col-lg-4"
              showErrorMessage
            />
            <Field
              name="lastName"
              label={attributeLabels.lastName}
              type="text"
              component={InputField}
              wrapperClassName="col-lg-5"
              showErrorMessage
            />
            <Field
              name="identifier"
              label={attributeLabels.identifier}
              type="text"
              component={InputField}
              wrapperClassName="col-lg-5"
              showErrorMessage
            />
            <Field
              name="birthDate"
              label={attributeLabels.birthDate}
              wrapperClassName="col-lg-4"
              component={BirthdayField}
            />
            <Field
              name="gender"
              label={attributeLabels.gender}
              type="text"
              wrapperClassName="col-lg-3"
              component={SelectField}
            >
              {genders.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Field>
          </div>
        </form>
      </div>
    );
  }
}

export default reduxForm({
  form: 'updateProfilePersonal',
  validate: validator,
})(PersonalForm);
