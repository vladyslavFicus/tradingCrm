import React, { PureComponent } from 'react';
import { compose, withApollo } from 'react-apollo';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import NotificationItem from './components/NotificationItem';
import NotificationSubscription from './graphql/NotificationSubscription';
import {
  REQUEST as NotificationCenterUnreadQuery,
} from '../../NotificationCenter/graphql/NotificationCenterUnreadQuery';
import 'react-toastify/dist/ReactToastify.css';
import './Notifications.scss';

class Notifications extends PureComponent {
  static propTypes = {
    client: PropTypes.object.isRequired,
    notificationSubscription: PropTypes.subscription({
      onNotification: PropTypes.shape({
        notification: PropTypes.object,
        configuration: PropTypes.shape({
          popUpDelayMs: PropTypes.number,
        }),
        totalNotificationsCount: PropTypes.number,
      }),
    }).isRequired,
  };

  componentDidUpdate() {
    const {
      client,
      notificationSubscription,
    } = this.props;

    if (!notificationSubscription.error && !notificationSubscription.loading) {
      const {
        notification,
        configuration,
        totalNotificationsCount,
      } = notificationSubscription.data.onNotification;

      // Show notification with delay accepted from server
      setTimeout(() => {
        // Update count of unread notifications in apollo cache
        client.writeQuery({
          query: NotificationCenterUnreadQuery,
          data: { notificationCenterUnread: totalNotificationsCount },
        });

        // Render toast with notification if 'notification' object is present
        // 'notification' object can be absent if notifications popup was disabled by user
        if (notification) {
          toast(<NotificationItem {...notification} />);
        }
      }, configuration.popUpDelayMs);
    }
  }

  render() {
    return (
      <ToastContainer
        newestOnTop
        hideProgressBar
        limit={3}
        className="Notifications__toast"
        position="bottom-right"
        transition={Slide}
      />
    );
  }
}

export default compose(
  withApollo,
  withRequests({
    notificationSubscription: NotificationSubscription,
  }),
)(Notifications);
