import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import Preloader from 'components/Preloader';

class Logout extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    logged: PropTypes.bool.isRequired,
    client: PropTypes.object.isRequired,
  };

  async componentDidMount() {
    await this.props.client.resetStore();
    await this.props.logout();
  }

  render() {
    if (this.props.logged) {
      return <Preloader show />;
    }

    return <Redirect to="/" />;
  }
}

export default Logout;
