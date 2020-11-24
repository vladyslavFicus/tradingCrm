import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import compose from 'compose-function';
import { get } from 'lodash';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { getBackofficeBrand } from 'config';
import { withModals } from 'hoc';
import { withRequests, parseErrors } from 'apollo';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import { Button } from 'components/UI';
import Copyrights from 'components/Copyrights';
import ChangeUnauthorizedPasswordModal from 'modals/ChangeUnauthorizedPasswordModal';
import { FormikInputField } from 'components/Formik';
import { createValidator } from 'utils/validator';
import SignInMutation from './graphql/SignInMutation';
import './SignIn.scss';

class SignIn extends PureComponent {
  static propTypes = {
    signIn: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      changeUnauthorizedPasswordModal: PropTypes.modalType,
    }).isRequired,
    ...PropTypes.router,
    ...withStorage.propTypes,
  }

  state = {
    formError: '',
  }

  handleSubmit = async (values, { setFieldValue }) => {
    const {
      signIn,
      storage,
      history,
      modals: { changeUnauthorizedPasswordModal },
    } = this.props;

    try {
      const signInData = await signIn({ variables: values });

      const { token } = get(signInData, 'data.auth.signIn') || {};

      storage.set('token', token);

      history.push('/brands');
    } catch (e) {
      const error = parseErrors(e);

      if (error.error === 'error.user.locked.password.expired') {
        changeUnauthorizedPasswordModal.show({
          uuid: error?.errorParameters?.uuid,
          onSuccess: () => setFieldValue('password', ''),
        });

        return;
      }

      this.setState({ formError: error.message });
    }
  }

  render() {
    const { formError } = this.state;

    const backofficeLogo = getBackofficeBrand().themeConfig.logo;

    return (
      <div className="SignIn">
        <div className="SignIn__logo">
          <If condition={backofficeLogo}>
            <img src={backofficeLogo} alt="logo" />
          </If>
        </div>

        <Formik
          initialValues={{}}
          onSubmit={this.handleSubmit}
          validate={createValidator({
            login: 'required|email',
            password: 'required|min:6',
          })}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {({ isSubmitting }) => (
            <Form className="SignIn__form">
              <If condition={formError}>
                <div className="SignIn__form-error alert alert-warning">
                  {formError}
                </div>
              </If>

              <div className="SignIn__form-fields">
                <Field
                  name="login"
                  type="email"
                  placeholder={I18n.t('SIGN_IN.EMAIL')}
                  component={FormikInputField}
                />

                <Field
                  name="password"
                  type="password"
                  placeholder={I18n.t('SIGN_IN.PASSWORD')}
                  component={FormikInputField}
                />
              </div>

              <div className="SignIn__form-buttons">
                <Button
                  primary
                  className="SignIn__form-button"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {I18n.t('SIGN_IN.LOGIN')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>

        <Copyrights />
      </div>
    );
  }
}

export default compose(
  withStorage,
  withRouter,
  withRequests({
    signIn: SignInMutation,
  }),
  withModals({
    changeUnauthorizedPasswordModal: ChangeUnauthorizedPasswordModal,
  }),
)(SignIn);
