import { useEffect } from 'react';
import { Utils } from '@crm/common';
import { useNotificationUnreadQuery } from '../graphql/__generated__/NotificationUnreadQuery';

const useNotificationCenterTrigger = () => {
  // ===== Requests ===== //
  const { data, refetch } = useNotificationUnreadQuery();

  const unreadCount = data?.notificationCenterUnread || 0;

  // ===== Effects ===== //
  useEffect(() => {
    Utils.EventEmitter.on(Utils.NOTIFICATIONS_READ, refetch);

    return () => {
      Utils.EventEmitter.off(Utils.NOTIFICATIONS_READ, refetch);
    };
  }, []);

  return { unreadCount };
};

export default useNotificationCenterTrigger;
