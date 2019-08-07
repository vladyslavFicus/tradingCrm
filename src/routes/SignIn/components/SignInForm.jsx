import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import { createValidator, translateLabels } from '../../../utils/validator';
import { InputField } from '../../../components/ReduxForm';
import PropTypes from '../../../constants/propTypes';
import attributeLabels from './constants';

const validator = createValidator({
  email: 'required',
  password: 'required|min:6',
}, translateLabels(attributeLabels), false);

class SignInForm extends Component {
  static propTypes = {
    logged: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
    error: PropTypes.string,
  };

  static defaultProps = {
    handleSubmit: null,
    submitting: false,
    error: null,
  };

  timeouts = [];

  state = {
    step: 0,
  };

  componentWillReceiveProps(nextProps) {
    const { logged } = this.props;

    if (logged !== nextProps.logged) {
      if (nextProps.logged) {
        this.setState({ step: 1 }, () => {
          this.timeouts.push(
            setTimeout(() => {
              this.setState({ step: 2 });
            }, 350),
          );
        });
      } else {
        this.setState({ step: 0 });
      }
    }
  }

  componentWillUnmount() {
    if (this.timeouts.length > 0) {
      this.timeouts.map(clearTimeout);
    }
  }

  handleSubmit = data => this.props.onSubmit(data);

  render() {
    const { step } = this.state;
    const {
      handleSubmit,
      submitting,
      error,
    } = this.props;

    const className = classNames('form-page__form', {
      fadeInUp: step === 0,
      fadeOutLeft: step > 0,
      'position-absolute': step > 1,
    });

    return (
      <form
        name="form-validation"
        className={className}
        onSubmit={handleSubmit(this.handleSubmit)}
      >
        <If condition={error}>
          <div className="alert alert-warning">
            {error}
          </div>
        </If>
        <Field
          id="sign-in-email-field"
          name="login"
          type="text"
          label={I18n.t(attributeLabels.email)}
          component={InputField}
        />
        <Field
          id="sign-in-password-field"
          name="password"
          type="password"
          label={I18n.t(attributeLabels.password)}
          component={InputField}
        />
        <div className="form-page__form_submit">
          <button
            type="submit"
            id="sign-in-submit-button"
            className="btn btn-primary form-page__form_btn"
            disabled={submitting}
          >
            {I18n.t('SIGN_IN.LOGIN')}
          </button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'signInForm',
  validate: validator,
})(SignInForm);
