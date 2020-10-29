import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose, withApollo } from 'react-apollo';
import { withRequests } from 'apollo';
import { withStorage } from 'providers/StorageProvider';
import Preloader from 'components/Preloader';
import LogoutMutation from './graphql/LogoutMutation';

class Logout extends PureComponent {
  static propTypes = {
    ...withStorage.propTypes,
    client: PropTypes.shape({
      resetStore: PropTypes.func.isRequired,
    }).isRequired,
    logout: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    const { logout, storage, client } = this.props;

    try {
      await logout();
    } catch (e) {
      // Do nothing if token was invalid or something else...
    } finally {
      storage.remove('token');
      storage.remove('brand');
      storage.remove('brands');
      storage.remove('auth');
      client.resetStore();
    }
  }

  render() {
    // Redirect implemented inside Route component. If user unauthenticated and asked for private route --> redirect it.
    return <Preloader />;
  }
}

export default compose(
  withApollo,
  withStorage,
  withRequests({ logout: LogoutMutation }),
)(Logout);
