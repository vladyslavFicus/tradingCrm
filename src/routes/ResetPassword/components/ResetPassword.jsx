import React, { Component } from 'react';
import { getBackofficeBrand } from 'config';
import { parse } from 'qs';
import PropTypes from 'prop-types';
import { parseErrors } from 'apollo';
import Preloader from 'components/Preloader';
import Copyrights from 'components/Copyrights';
import ResetPasswordForm from './ResetPasswordForm';

class ResetPassword extends Component {
  static propTypes = {
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
    const { location: { search }, resetPasswordMutation } = this.props;
    const { token } = parse(search, {
      ignoreQueryPrefix: true,
    });

    try {
      await resetPasswordMutation({ variables: { ...data, token } });

      this.setState({
        resetPasswordFormError: '',
        hasSubmittedForm: true,
      });
    } catch (e) {
      this.setState({ resetPasswordFormError: parseErrors(e).message });
    }
  };

  render() {
    const {
      loading,
      hasSubmittedForm,
      resetPasswordFormError,
    } = this.state;

    if (loading) {
      return <Preloader />;
    }

    return (
      <div className="auth">
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
