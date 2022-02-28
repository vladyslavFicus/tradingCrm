import React, { PureComponent } from 'react';
import { withApollo } from '@apollo/client/react/hoc';
import compose from 'compose-function';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import EventEmitter, { NOTIFICATION_CLICKED } from 'utils/EventEmitter';
import {
  REQUEST as NotificationCenterUnreadQuery,
} from '../../NotificationCenter/graphql/NotificationCenterUnreadQuery';
import NotificationItem from './components/NotificationItem';
import NotificationSubscription from './graphql/NotificationSubscription';
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
        totalUnreadNotificationsCount: PropTypes.number,
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
        totalUnreadNotificationsCount,
      } = notificationSubscription.data.onNotification;

      // Show notification with delay accepted from server
      setTimeout(() => {
        // Update count of unread notifications in apollo cache
        client.writeQuery({
          query: NotificationCenterUnreadQuery,
          data: { notificationCenterUnread: totalUnreadNotificationsCount },
        });

        // Render toast with notification if 'notification' object is present
        // 'notification' object can be absent if notifications popup was disabled by user
        if (notification) {
          toast(<NotificationItem {...notification} />, {
            onClick: () => EventEmitter.emit(NOTIFICATION_CLICKED, notification),
          });
        }
      }, configuration.popUpDelayMs);
    }
  }

  render() {
    return (
      <ToastContainer
        newestOnTop
        hideProgressBar
        closeOnClick={false}
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
