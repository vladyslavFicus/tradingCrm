import React, { PureComponent } from 'react';
import { getBackofficeBrand } from 'config';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { parse } from 'qs';
import PropTypes from 'prop-types';
import { Button } from 'components/UI';
import Preloader from 'components/Preloader';
import Copyrights from 'components/Copyrights';
import { FormikInputField } from 'components/Formik';
import parseErrors from 'utils/parseErrors';
import { createValidator } from 'utils/validator';
import './ResetPassword.scss';

const validator = createValidator({
  password: ['required', 'regex:^((?=.*\\d)(?=.*[a-zA-Z]).{6,16})$'],
  repeatPassword: ['required', 'same:password'],
});

class ResetPassword extends PureComponent {
  static propTypes = {
    history: PropTypes.func.isRequired,
    resetPasswordMutation: PropTypes.func.isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
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
    const { loading } = this.state;

    return loading === true ? this.removePreloader() : null;
  }

  removePreloader = () => {
    this.setState({ loading: false });
  };

  handleSubmit = async (data) => {
    try {
      const { location: { search }, resetPasswordMutation } = this.props;
      const { token } = parse(search, {
        ignoreQueryPrefix: true,
      });

      const {
        data: {
          auth: {
            resetPassword: {
              success,
            },
          },
        },
      } = await resetPasswordMutation({ variables: { ...data, token } });

      this.setState({
        resetPasswordFormError: '',
        hasSubmittedForm: success,
      });

      return null;
    } catch (e) {
      this.setState({ resetPasswordFormError: parseErrors(e).message });
      return null;
    }
  };

  render() {
    const { history } = this.props;
    const {
      loading,
      hasSubmittedForm,
      resetPasswordFormError,
    } = this.state;

    return (
      <div className="ForgotPassword">
        <Preloader isVisible={loading} />

        <div className="ForgotPassword__logo">
          <If condition={getBackofficeBrand().themeConfig.logo}>
            <img src={getBackofficeBrand().themeConfig.logo} alt="logo" />
          </If>
        </div>

        <Choose>
          <When condition={hasSubmittedForm}>
            <div className="ForgotPassword__form">
              <div className="ForgotPassword__form-title">
                {I18n.t('RESET_PASSWORD.PASSWORD_SETTLED')}
              </div>
              <Button
                primary
                className="ForgotPassword__form-button"
                onClick={() => history.push('/logout')}
              >
                {I18n.t('RESET_PASSWORD.LOGIN')}
              </Button>
            </div>
          </When>
          <Otherwise>
            <Formik
              initialValues={{ password: '', repeatPassword: '' }}
              onSubmit={this.handleSubmit}
              validate={validator}
            >
              {({ isSubmitting, dirty }) => (
                <Form className="ForgotPassword__form">
                  <div className="ForgotPassword__form-title">
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
                    label={I18n.t('RESET_PASSWORD.PASSWORD')}
                    component={FormikInputField}
                  />
                  <Field
                    name="repeatPassword"
                    type="password"
                    placeholder={I18n.t('RESET_PASSWORD.REPEAT_PASSWORD')}
                    label={I18n.t('RESET_PASSWORD.REPEAT_PASSWORD')}
                    component={FormikInputField}
                  />
                  <div className="ForgotPassword__form-buttons">
                    <Button
                      primary
                      type="submit"
                      disabled={!dirty || isSubmitting}
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

export default ResetPassword;
