import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { parse } from 'qs';
import { SubmissionError } from 'redux-form';
import { get } from 'lodash';
import ViewForm from './ViewForm';
import LoggedForbidden from '../LoggedForbidden';

class View extends Component {
  static propTypes = {
    logged: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
  };

  handleSubmit = async (data) => {
    const { location: { search } } = this.props;
    const { token } = parse(search, {
      ignoreQueryPrefix: true,
    });

    const action = await this.props.onSubmit({ ...data, token });

    if (action) {
      if (action.error) {
        throw new SubmissionError({
          _error: get(action, 'payload.response.error', action.payload.message),
        });
      }
    }
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
      <div className="form-page-container">
        <div className="wrapper">
          <div className="form-page">
            <div className="form-page__logo">
              <img src="/img/falcon-full-logo.svg" alt="logo" />
            </div>
            <ViewForm onSubmit={this.handleSubmit} />
          </div>
        </div>
        <div className="form-page__copyright">
          Copyright © {(new Date()).getFullYear()} by Newage
        </div>
      </div>
    );
  }
}

export default View;
