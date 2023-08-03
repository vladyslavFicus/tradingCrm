import { useEffect } from 'react';
import EventEmitter, { NOTIFICATIONS_READ } from 'utils/EventEmitter';
import { useNotificationUnreadQuery } from '../graphql/__generated__/NotificationUnreadQuery';

const useNotificationCenterTrigger = () => {
  // ===== Requests ===== //
  const { data, refetch } = useNotificationUnreadQuery();

  const unreadCount = data?.notificationCenterUnread || 0;

  // ===== Effects ===== //
  useEffect(() => {
    EventEmitter.on(NOTIFICATIONS_READ, refetch);

    return () => {
      EventEmitter.off(NOTIFICATIONS_READ, refetch);
    };
  }, []);

  return { unreadCount };
};

export default useNotificationCenterTrigger;
