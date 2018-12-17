import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

class Logout extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    logged: PropTypes.bool.isRequired,
    client: PropTypes.object.isRequired,
  };

  state = {
    logged: this.props.logged,
  };

  async componentWillMount() {
    if (this.state.logged) {
      await this.props.logout();
      await this.props.client.resetStore();
      this.setState({ logged: false });
    }
  }

  render() {
    if (this.state.logged) {
      return null;
    }

    return <Redirect to="/" />;
  }
}

export default Logout;
