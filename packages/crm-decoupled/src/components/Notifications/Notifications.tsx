import React, { useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import { toast } from 'react-toastify';
import EventEmitter, { NOTIFICATION_CLICKED } from 'utils/EventEmitter';
import NotificationItem from './components/NotificationItem';
import { useNotificationSubscription } from './graphql/__generated__/NotificationSubscription';
import {
  UnreadNotificationsQueryDocument,
} from './graphql/__generated__/UnreadNotificationsQuery';
import './Notifications.scss';
import 'react-toastify/dist/ReactToastify.css';

const Notifications = () => {
  const {
    data: notificationSubscriptionData,
    loading: notificationSubscriptionLoading,
    error: notificationSubscriptionError,
  } = useNotificationSubscription();

  const client = useApolloClient();

  useEffect(() => {
    if (!notificationSubscriptionError && !notificationSubscriptionLoading && notificationSubscriptionData) {
      const { onNotification } = notificationSubscriptionData;
      if (onNotification) {
        const { notification, configuration, totalUnreadNotificationsCount } = onNotification;

        // Show notification with delay accepted from server
        setTimeout(() => {
          // Update count of unread notifications in apollo cache
          client.writeQuery({
            query: UnreadNotificationsQueryDocument,
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
  }, [
    notificationSubscriptionData,
    notificationSubscriptionLoading,
    notificationSubscriptionError,
  ]);

  return null;
};

export default React.memo(Notifications);
