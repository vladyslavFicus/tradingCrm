import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import classNames from 'classnames';
import onClickOutside from 'react-onclickoutside';
import PropTypes from '../../constants/propTypes';
import { InputField, SelectField } from '../ReduxForm';
import { createValidator } from '../../utils/validator';

export const formName = 'my-profile-side-bar';
const attributeLabels = {
  phoneNumber: 'Phone',
  language: 'Language',
};

const validator = createValidator({
  phoneNumber: ['numeric'],
}, attributeLabels, false);

class MyProfileSidebar extends Component {
  static propTypes = {
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    isOpen: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
  };

  handleClickOutside = () => {
    if (this.props.isOpen) {
      this.props.onToggleProfile(false);
    }
  };

  render() {
    const {
      isOpen,
      languages,
      handleSubmit,
      onSubmit,
      submitting,
    } = this.props;

    return (<aside
      className={classNames(
        'my-profile',
        { slideInRight: isOpen, slideOutRight: isOpen === false }
        )}
    >
      <header className="my-profile__header">
        My profile
      </header>
      <div className="my-profile__sections">
        <section className="my-profile__personal-details">
          <h1 className="my-profile__heading">Personal details</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <Field
                name="phoneNumber"
                label={attributeLabels.phoneNumber}
                type="text"
                component={InputField}
                position="vertical"
                showErrorMessage
              />
            </div>
            <div className="form-group">
              <Field
                name="language"
                label={attributeLabels.language}
                component={SelectField}
                position="vertical"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </Field>
            </div>
            <div className="text-right">
              <button disabled={submitting} className="btn btn-primary btn-sm" type="submit">Save changes</button>
            </div>
          </form>
        </section>
      </div>
    </aside>);
  }
}

MyProfileSidebar = onClickOutside(MyProfileSidebar);

export default reduxForm({
  form: formName,
  validate: validator,
})(MyProfileSidebar);
