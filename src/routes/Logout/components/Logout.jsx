import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStorage } from 'providers/StorageProvider';
import Preloader from 'components/Preloader';

class Logout extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
  };

  async componentDidMount() {
    const { logout, storage, client } = this.props;

    try {
      await logout();
    } catch (e) {
      // Do nothing if token was invalid or something else...
    } finally {
      storage.remove('token');
      storage.remove('auth');
      client.resetStore();
    }
  }

  render() {
    return <Preloader isVisible />;
  }
}

export default withStorage(Logout);
