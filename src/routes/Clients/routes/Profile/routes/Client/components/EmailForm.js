import React, { PureComponent } from 'react';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { Button } from 'components/UI';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { departments, roles } from 'constants/brands';
import { FormikInputField } from 'components/Formik';
import { createValidator } from 'utils/validator';
import { withStorage } from 'providers/StorageProvider';
import PermissionContent from 'components/PermissionContent/PermissionContent';

const validator = createValidator({
  email: 'required|email',
});

class EmailForm extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    formError: PropTypes.string,
    auth: PropTypes.auth.isRequired,
    verification: PropTypes.shape({
      emailVerified: PropTypes.bool,
    }),
    email: PropTypes.string.isRequired,
    onVerifyEmailClick: PropTypes.func.isRequired,
  }

  static defaultProps = {
    formError: '',
    verification: {},
  }

  onHandleSubmit = (values, { resetForm }) => {
    this.props.onSubmit(values);

    resetForm({ values });
  };

  handleVerifyEmailClick = () => {
    const { onVerifyEmailClick, email } = this.props;

    return onVerifyEmailClick(email);
  };

  render() {
    const {
      formError,
      auth: {
        department,
        role,
      },
      verification: {
        emailVerified,
      },
      email,
    } = this.props;

    const areFieldsDisabled = (department === departments.CS || department === departments.ADMINISTRATION)
      && role === roles.ROLE4;

    return (
      <Formik
        initialValues={{ email: email || '' }}
        onSubmit={this.onHandleSubmit}
        validate={validator}
      >
        {({ dirty, isValid, isSubmitting }) => (
          <Form>
            <If condition={formError}>
              <div className="alert alert-warning">
                {formError}
              </div>
            </If>
            <div className="form-row">
              <Field
                disabled={!areFieldsDisabled}
                name="email"
                label={I18n.t('COMMON.EMAIL')}
                type="text"
                component={FormikInputField}
                className="col-8"
              />
              <If condition={!emailVerified}>
                <PermissionContent permissions={permissions.USER_PROFILE.VERIFY_EMAIL}>
                  <div className="col-4 mt-4-profile">
                    <Button
                      className="btn"
                      onClick={this.handleVerifyEmailClick}
                      primary
                    >
                      {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFY_EMAIL')}
                    </Button>
                  </div>
                </PermissionContent>
              </If>
              <If condition={emailVerified}>
                <div className="col-4 mt-4-profile">
                  <Button
                    type="button"
                    verified
                  >
                    <i className="fa fa-check-circle-o" /> {I18n.t('PLAYER_PROFILE.PROFILE.CONTACTS.VERIFIED')}
                  </Button>
                </div>
              </If>
            </div>
            <If condition={!(!dirty || !isValid || isSubmitting)}>
              <PermissionContent permissions={permissions.USER_PROFILE.UPDATE_EMAIL}>
                <div className="auth__form-buttons">
                  <Button
                    primary
                    type="submit"
                  >
                    {I18n.t('COMMON.SAVE_CHANGES')}
                  </Button>
                </div>
              </PermissionContent>
            </If>
          </Form>
        )}
      </Formik>
    );
  }
}

export default withStorage(['auth'])(EmailForm);
