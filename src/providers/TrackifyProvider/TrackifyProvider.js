import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Trackify from '@hrzn/trackify';
import { withRequests } from 'apollo';
import compose from 'compose-function';
import { getVersion } from 'config';
import { withStorage } from 'providers/StorageProvider';
import TrackifyMutation from './graphql/TrackifyMutation';

/**
 * Setup Trackify as React Component
 */
class TrackifyProvider extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    track: PropTypes.func.isRequired,
    token: PropTypes.string,
  };

  static defaultProps = {
    token: null,
  };

  constructor(...args) {
    super(...args);

    Trackify.setup('backoffice', getVersion());

    Trackify.request(async (queue) => {
      // Send events to server only for authorized clients
      if (this.props.token) {
        try {
          await this.props.track({ variables: { args: queue } });
        } catch (e) {
          // Do nothing...
        }
      }
    });
  }

  render() {
    return this.props.children;
  }
}

export default compose(
  withStorage(['token']),
  withRequests({
    track: TrackifyMutation,
  }),
)(TrackifyProvider);
