import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../constants/propTypes';
import { InputField, SelectField, BirthdayField } from '../../../../../components/ReduxForm';
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
  };
  static defaultProps = {
    handleSubmit: null,
    pristine: false,
    submitting: false,
  };

  render() {
    const {
      handleSubmit,
      onSubmit,
      pristine,
      submitting,
    } = this.props;

    return (
      <form className="padding-bottom-20" role="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="row margin-bottom-20">
          <div className="col-xl-6">
            <span className="personal-form-heading">{I18n.t('PLAYER_PROFILE.PROFILE.PERSONAL.TITLE')}</span>
          </div>
          <div className="col-xl-6 text-right">
            {
              !(pristine || submitting) &&
              <button className="btn btn-sm btn-primary" type="submit">
                {I18n.t('COMMON.SAVE_CHANGES')}
              </button>
            }
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-row__small">
            <Field
              name="title"
              label={attributeLabels.title}
              component={SelectField}
              position="vertical"
            >
              <option value="">None</option>
              {titles.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Field>
          </div>
          <div className="filter-row__big">
            <Field
              name="firstName"
              label={attributeLabels.firstName}
              type="text"
              component={InputField}
              position="vertical"
              showErrorMessage
            />
          </div>
          <div className="filter-row__big">
            <Field
              name="lastName"
              label={attributeLabels.lastName}
              type="text"
              component={InputField}
              position="vertical"
              showErrorMessage
            />
          </div>
          <div className="filter-row__medium">
            <Field
              name="identifier"
              label={attributeLabels.identifier}
              type="text"
              component={InputField}
              position="vertical"
              showErrorMessage
            />
          </div>
          <div className="filter-row__medium">
            <Field
              name="birthDate"
              label={attributeLabels.birthDate}
              component={BirthdayField}
            />
          </div>
          <div className="filter-row__small">
            <Field
              name="gender"
              label={attributeLabels.gender}
              type="text"
              component={SelectField}
              position="vertical"
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
})(PersonalForm);
