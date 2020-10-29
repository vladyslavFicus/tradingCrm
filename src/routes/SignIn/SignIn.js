import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
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
import { getMappedBrands } from './utils';
import SignInMutation from './graphql/SignInMutation';
import ChooseDepartmentMutation from './graphql/ChooseDepartmentMutation';
import './SignIn.scss';

class SignIn extends PureComponent {
  static propTypes = {
    signIn: PropTypes.func.isRequired,
    chooseDepartment: PropTypes.func.isRequired,
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

      const { brandToAuthorities, token } = get(signInData, 'data.auth.signIn') || {};
      const brands = getMappedBrands(brandToAuthorities);

      storage.set('token', token);
      storage.set('brands', brands);

      // If just one brand available we can skip 'select brand' step
      // If we have just one department we can skip 'select department' step
      // and make request automaticaly and push user to dashboard page
      if (brands.length === 1) {
        const { id: brandId, departments } = brands[0];

        storage.set('brand', brands[0]);

        if (departments.length === 1) {
          this.handleSelectDepartment(brandId, departments[0]);
        } else {
          history.push('/departments');
        }
      } else {
        history.push('/brands');
      }
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

  handleSelectDepartment = async (brand, { department, role }) => {
    const { chooseDepartment, storage, history } = this.props;

    try {
      const { data: { auth: { chooseDepartment: { token, uuid } } } } = await chooseDepartment({
        variables: {
          brand,
          department,
          role,
        },
      });

      storage.set('token', token);
      storage.set('auth', { department, role, uuid });

      history.push('/dashboard');
    } catch (e) {
      // Do nothing...
    }
  };

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
  withStorage(['auth', 'token', 'brands']),
  withRouter,
  withRequests({
    signIn: SignInMutation,
    chooseDepartment: ChooseDepartmentMutation,
  }),
  withModals({
    changeUnauthorizedPasswordModal: ChangeUnauthorizedPasswordModal,
  }),
)(SignIn);
