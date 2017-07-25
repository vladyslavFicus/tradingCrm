import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { SubmissionError } from 'redux-form';
import ViewForm from './ViewForm';
import LoggedForbidden from '../LoggedForbidden';

class View extends Component {
  static propTypes = {
    logged: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    router: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
  };

  handleSubmit = async (data) => {
    const { location: { query } } = this.props;
    const action = await this.props.onSubmit({ ...data, token: query.token });

    if (action) {
      if (action.error) {
        throw new SubmissionError({
          _error: action.payload.response.error
            ? action.payload.response.error
            : action.payload.message,
        });
      }

      return this.props.router.replace('/');
    }

    throw new SubmissionError({ _error: 'Something went wrong...' });
  };

  render() {
    const { logged, logout } = this.props;

    if (logged) {
      return (
        <LoggedForbidden
          logged={logged}
          logout={logout}
        />
      );
    }

    return (
      <div className="sign-in-page" style={{ height: '100%' }}>
        <div className="wrapper">
          <div className="sign-in">
            <div className="sign-in__logo">
              <img src="/img/horizon-logo.svg" alt="logo" />
            </div>

            <ViewForm
              onSubmit={this.handleSubmit}
            />

          </div>
        </div>

        <div className="sign-in__copyright">Copyright © {(new Date()).getFullYear()} by Newage</div>
      </div>
    );
  }
}

export default withRouter(View);
