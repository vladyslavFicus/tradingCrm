import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import onClickOutside from 'react-onclickoutside';
import PropTypes from '../../constants/propTypes';
import locales from '../../i18n';
import { InputField, SelectField } from '../ReduxForm';
import { createValidator, translateLabels } from '../../utils/validator';
import { attributeLabels } from './constants';
import './MyProfileSidebar.scss';

const validator = createValidator({
  phoneNumber: 'numeric',
}, translateLabels(attributeLabels), false);

class MyProfileSidebar extends Component {
  static propTypes = {
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
        <div className="my-profile__header">
          {I18n.t('MY_PROFILE_SIDEBAR.MY_PROFILE')}
        </div>
        <div className="my-profile__content">
          <div className="my-profile__content-heading">
            {I18n.t('MY_PROFILE_SIDEBAR.DETAILS')}
          </div>
          <form className="my-profile__personal-details" onSubmit={handleSubmit(onSubmit)}>
            <Field
              name="phoneNumber"
              label={I18n.t(attributeLabels.phoneNumber)}
              type="text"
              component={InputField}
              position="vertical"
            />
            <Field
              name="language"
              label={I18n.t(attributeLabels.language)}
              component={SelectField}
              position="vertical"
            >
              {Object.keys(locales).map(lang => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </Field>
            <div className="text-right">
              <button
                type="submit"
                className="btn btn-primary btn-sm font-weight-700"
                disabled={submitting}
              >
                {I18n.t('MY_PROFILE_SIDEBAR.SAVE_BUTTON')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: 'my-profile-side-bar',
  validate: validator,
})(onClickOutside(MyProfileSidebar));
