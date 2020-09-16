import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { getBackofficeBrand } from 'config';
import { Formik, Form, Field } from 'formik';
import { compose } from 'react-apollo';
import { withRequests, parseErrors } from 'apollo';
import I18n from 'i18n-js';
import { parse } from 'qs';
import PropTypes from 'prop-types';
import { Button } from 'components/UI';
import Preloader from 'components/Preloader';
import Copyrights from 'components/Copyrights';
import {
  passwordPattern,
  passwordMaxSize,
  passwordCustomError,
} from 'constants/operators';
import { FormikInputField } from 'components/Formik';
import { createValidator, translateLabels } from 'utils/validator';
import resetPasswordMutation from './graphql/ResetPasswordMutation';
import './ResetPassword.scss';

const attributeLabels = {
  password: 'COMMON.PASSWORD',
  repeatPassword: 'COMMON.REPEAT_PASSWORD',
};

const customErrors = {
  'regex.password': passwordCustomError,
};

const validator = createValidator({
  password: ['required', `regex:${passwordPattern}`, `max:${passwordMaxSize}`],
  repeatPassword: ['required', 'same:password'],
}, translateLabels(attributeLabels), false, customErrors);

class ResetPassword extends PureComponent {
  static propTypes = {
    resetPassword: PropTypes.func.isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
    ...PropTypes.router,
  };

  state = {
    resetPasswordFormError: '',
    hasSubmittedForm: false,
    loading: true,
  };

  componentDidMount() {
    setTimeout(() => this.setState({ loading: false }), 500);
  }

  componentDidUpdate() {
    return this.state.loading ? this.removePreloader() : null;
  }

  removePreloader = () => {
    this.setState({ loading: false });
  };

  handleSubmit = async (data) => {
    try {
      const { location: { search }, resetPassword } = this.props;
      const { token } = parse(search, {
        ignoreQueryPrefix: true,
      });

      await resetPassword({ variables: { ...data, token } });

      this.setState({
        resetPasswordFormError: '',
        hasSubmittedForm: true,
      });
    } catch (error) {
      this.setState({ resetPasswordFormError: parseErrors(error).message });
    }
  };

  render() {
    const { history } = this.props;

    const {
      loading,
      hasSubmittedForm,
      resetPasswordFormError,
    } = this.state;

    if (loading) {
      return <Preloader isVisible={loading} />;
    }

    return (
      <div className="ResetPassword">
        <div className="ResetPassword__logo">
          <If condition={getBackofficeBrand().themeConfig.logo}>
            <img src={getBackofficeBrand().themeConfig.logo} alt="Brand logo" />
          </If>
        </div>

        <Choose>
          <When condition={hasSubmittedForm}>
            <div className="ResetPassword__form">
              <div className="ResetPassword__form-title">
                {I18n.t('RESET_PASSWORD.PASSWORD_SETTLED')}
              </div>
              <Button
                primary
                className="ResetPassword__form-button"
                onClick={() => history.push('/logout')}
              >
                {I18n.t('RESET_PASSWORD.LOGIN')}
              </Button>
            </div>
          </When>
          <Otherwise>
            <Formik
              initialValues={{}}
              onSubmit={this.handleSubmit}
              validateOnBlur={false}
              validateOnChange={false}
              validate={validator}
            >
              {({ isSubmitting }) => (
                <Form className="ResetPassword__form">
                  <div className="ResetPassword__form-title">
                    {I18n.t('RESET_PASSWORD.TITLE')}
                  </div>

                  <If condition={resetPasswordFormError}>
                    <div className="alert alert-warning">
                      {resetPasswordFormError}
                    </div>
                  </If>

                  <Field
                    name="password"
                    type="password"
                    placeholder={I18n.t('RESET_PASSWORD.PASSWORD')}
                    component={FormikInputField}
                  />
                  <Field
                    name="repeatPassword"
                    type="password"
                    placeholder={I18n.t('RESET_PASSWORD.REPEAT_PASSWORD')}
                    component={FormikInputField}
                  />

                  <div className="ResetPassword__form-buttons">
                    <Button
                      primary
                      type="submit"
                      className="ResetPassword__form-button"
                      disabled={isSubmitting}
                    >
                      {I18n.t('COMMON.SUBMIT')}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Otherwise>
        </Choose>

        <Copyrights />
      </div>
    );
  }
}

export default compose(
  withRouter,
  withRequests({
    resetPassword: resetPasswordMutation,
  }),
)(ResetPassword);
