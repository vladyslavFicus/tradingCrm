import React, { Component } from 'react';
import { getBackofficeBrand } from 'config';
import { parse } from 'qs';
import PropTypes from 'prop-types';
import Preloader from 'components/Preloader';
import Copyrights from 'components/Copyrights';
import parseErrors from 'utils/parseErrors';
import ResetPasswordForm from './ResetPasswordForm';

class ResetPassword extends Component {
  static propTypes = {
    resetPasswordMutation: PropTypes.func.isRequired,
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
    const {
      loading,
      hasSubmittedForm,
      resetPasswordFormError,
    } = this.state;

    return (
      <div className="auth">
        <Preloader isVisible={loading} />

        <div className="auth__logo">
          <If condition={getBackofficeBrand().themeConfig.logo}>
            <img src={getBackofficeBrand().themeConfig.logo} alt="logo" />
          </If>
        </div>

        <div className="auth__page">
          <ResetPasswordForm
            onSubmit={this.handleSubmit}
            formError={resetPasswordFormError}
            hasSubmittedForm={hasSubmittedForm}
          />
        </div>

        <Copyrights />
      </div>
    );
  }
}

export default ResetPassword;
