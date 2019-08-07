import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router-dom';
import { createValidator, translateLabels } from '../../utils/validator';
import { InputField } from '../ReduxForm';
import attributeLabels from './constants';

const formName = 'resetPasswordForm';

const validator = createValidator({
  password: ['required', 'regex:^.{6,32}$'],
  repeatPassword: [
    'required',
    'same:password',
  ],
}, translateLabels(attributeLabels), false);

const ViewForm = (props) => {
  const {
    handleSubmit,
    pristine,
    submitting,
    onSubmit,
    error,
    disabled,
    valid,
    submitSucceeded,
  } = props;

  return (
    <Choose>
      <When condition={submitSucceeded}>
        <div className="form-page__success fadeInUp">
          <div className="form-page__success-title">
            {I18n.t('SET_PASSWORD.PASSWORD_SETTLED')}
          </div>
          <Link
            to="/"
            className="btn btn-primary-outline"
          >
            {I18n.t('SET_PASSWORD.LOGIN')}
          </Link>
        </div>
      </When>
      <Otherwise>
        <form
          name="form-validation"
          className="form-page__form fadeInUp"
          onSubmit={handleSubmit(onSubmit)}
        >
          <If condition={error}>
            <div className="alert alert-warning">
              {error}
            </div>
          </If>
          <h2>
            {I18n.t('SET_PASSWORD.TITLE')}
          </h2>
          <Field
            name="password"
            label={I18n.t(attributeLabels.password)}
            type="password"
            disabled={disabled}
            component={InputField}
          />
          <Field
            name="repeatPassword"
            label={I18n.t(attributeLabels.repeatPassword)}
            type="password"
            disabled={disabled}
            component={InputField}
          />
          <div className="form-page__form_submit">
            <button
              type="submit"
              className="btn btn-primary form-page__form_btn"
              disabled={pristine || submitting || disabled || !valid}
            >
              {I18n.t('COMMON.SUBMIT')}
            </button>
          </div>
        </form>
      </Otherwise>
    </Choose>
  );
};

ViewForm.propTypes = {
  handleSubmit: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  valid: PropTypes.bool,
  submitSucceeded: PropTypes.bool.isRequired,
};
ViewForm.defaultProps = {
  handleSubmit: null,
  pristine: false,
  submitting: false,
  error: null,
  disabled: false,
  valid: false,
};

export default reduxForm({
  form: formName,
  validate: validator,
})(ViewForm);
