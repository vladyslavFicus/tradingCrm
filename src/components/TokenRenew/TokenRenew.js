/* eslint-disable react/no-unused-state */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import jwtDecode from 'jwt-decode';
import * as Sentry from '@sentry/browser';
import { compose, graphql } from 'react-apollo';
import { withStorage } from 'providers/StorageProvider';
import Preloader from 'components/Preloader';
import { tokenRenew } from 'graphql/mutations/auth';

/**
 * Working example step by step:
 *
 * CASE 1 (public page):
 * 1. Public page (token === null) -> clear timeout (timerID can be null, no worries, and do nothing else...)
 * 2. Force reload page --> GOTO 1. Nothing else...
 *
 * =======================================
 *
 * CASE 2 (Login from /sign-in page):
 * 1. Public page (token === null) -> getDerivedStateFromProps--> clear timeout (timerID can be null,
 *    no worries, and do nothing else...), componentDidMount --> do nothing,
 * 2. Login and redirect to private page.
 * 3. getDerivedStateFromProps --> props.token !== state.token, ok, start timer to token renew
 *    before 60 sec it will be expired and set new token and timerID to state.
 * 4. Renew token timer execution: get new token from server and set it to storage.
 * 5. getDerivedStateFromProps --> GOTO 3.
 *
 * =======================================
 *
 * CASE 3 (Already authorized, after force reload or application first time loading...):
 * 1. Private page (token === 'some-token') -> getDerivedStateFromProps--> props.token === state.token, do nothing...
 *    componentDidMount --> renew token and set to storage and state.
 * 2. Executing getDerivedStateFromProps (again) --> props.token !== state.token, ok, start timer to renew token...
 * 3. Renew token timer execution: get new token from server and set it to storage.
 * 4. getDerivedStateFromProps --> GOTO 2.
 */
class TokenRenew extends PureComponent {
  static propTypes = {
    ...withStorage.propTypes,
    token: PropTypes.string,
    renew: PropTypes.func.isRequired, // eslint-disable-line
  };

  static defaultProps = {
    token: null,
  };

  /**
   * Token renew mutation from props
   *
   * @param props
   *
   * @return {Promise<void>}
   */
  static async tokenRenew(props) {
    try {
      const { data: { auth: { tokenRenew: { token } } } } = await props.renew();

      props.storage.set('token', token);

      return token;
    } catch (e) {
      // Return null if request failed
      return null;
    }
  }

  state = {
    loading: !!this.props.token,
    token: this.props.token,
    timerID: null,
  };

  /**
   * Renew token first time, when component mounted.
   * It should be present here to renew token on each page reload (hard reload)
   * After that token will be renewed and timer will starting to renew token again before it will be expired
   *
   * @return {Promise<void>}
   */
  async componentDidMount() {
    if (this.props.token) {
      const token = await this.constructor.tokenRenew(this.props);

      this.setState({ loading: false, token });
    }

    this.setState({ loading: false });
  }

  static getDerivedStateFromProps(props, state) {
    // If token doesn't exist --> clear token renew timeout and set empty token to state (STOP RENEWING)
    if (!props.token) {
      clearTimeout(state.timerID);

      return { token: null, timerID: null };
    }

    // If next token not equal current token --> set timer to renew token (START RENEWING)
    if (props.token !== state.token) {
      clearTimeout(state.timerID);

      const jwt = jwtDecode(props.token);

      const timeout = (jwt.exp - jwt.iat) * 0.8;

      // Start timer to renew token after 80% of token ttl before token will be expired
      const timerID = setTimeout(() => TokenRenew.tokenRenew(props), timeout * 1000);

      // Set user scope for Sentry exceptions
      Sentry.configureScope((scope) => {
        scope.setUser({ id: jwt.uuid, email: jwt.sub });
      });

      // Set new token and timerID to state for future timeout clearing
      return { token: props.token, timerID };
    }

    return null;
  }

  render() {
    // Show preloader while token will renewing first time when component did mount
    return (
      <Choose>
        <When condition={this.state.loading}>
          <Preloader />
        </When>
        <Otherwise>
          {this.props.children}
        </Otherwise>
      </Choose>
    );
  }
}

export default compose(
  withStorage(['token']),
  graphql(tokenRenew, {
    name: 'renew',
  }),
)(TokenRenew);
