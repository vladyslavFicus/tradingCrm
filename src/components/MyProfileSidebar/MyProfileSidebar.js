import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import onClickOutside from 'react-onclickoutside';
import PropTypes from '../../constants/propTypes';
import { InputField, SelectField } from '../ReduxForm';
import { createValidator } from '../../utils/validator';
import { attributeLabels } from './constants';

export const formName = 'my-profile-side-bar';

const validator = createValidator({
  phoneNumber: 'numeric',
}, attributeLabels, false);

class MyProfileSidebar extends Component {
  static propTypes = {
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    onToggleProfile: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
  };
  static defaultProps = {
    handleSubmit: null,
    submitting: false,
  };

  constructor(props) {
    super(props);

    this.state = { initialized: props.isOpen };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.initialized && nextProps.isOpen && nextProps.isOpen !== this.props.isOpen) {
      this.setState({ initialized: true });
    }
  }

  handleClickOutside = () => {
    if (this.props.isOpen) {
      this.props.onToggleProfile();
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
    const { initialized } = this.state;

    return (
      <div
        className={classNames(
          'my-profile',
          { slideInRight: isOpen, slideOutRight: initialized && !isOpen }
        )}
      >
        <header className="my-profile__header">
          {I18n.t('MY_PROFILE_SIDEBAR.MY_PROFILE')}
        </header>
        <div className="my-profile__sections">
          <section className="my-profile__personal-details">
            <h1 className="my-profile__heading">{I18n.t('MY_PROFILE_SIDEBAR.DETAILS')}</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <Field
                  name="phoneNumber"
                  label={I18n.t(attributeLabels.phoneNumber)}
                  type="text"
                  component={InputField}
                  position="vertical"
                  showErrorMessage
                />
              </div>
              <div className="form-group">
                <Field
                  name="language"
                  label={I18n.t(attributeLabels.language)}
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
                <button disabled={submitting} className="btn btn-primary btn-sm" type="submit">
                  {I18n.t('MY_PROFILE_SIDEBAR.SAVE_BUTTON')}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: formName,
  validate: validator,
})(onClickOutside(MyProfileSidebar));
