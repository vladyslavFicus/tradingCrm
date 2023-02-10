import React, { useEffect } from 'react';
import { Button } from 'components/Buttons';
import EventEmitter, { NOTIFICATIONS_READ } from 'utils/EventEmitter';
import './NotificationCenterTrigger.scss';
import { useNotificationUnreadQuery } from '../../graphql/__generated__/NotificationUnreadQuery';

type Props = {
  id: string,
  onClick: () => void,
};

const NotificationCenterTrigger = (props: Props) => {
  const { id, onClick } = props;

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

  return (
    <Button
      id={id}
      onClick={onClick}
      className="NotificationCenterTrigger"
    >
      <i className="icon-notifications NotificationCenterTrigger__icon" />

      <If condition={unreadCount > 0}>
        <span className="NotificationCenterTrigger__counter">{unreadCount}</span>
      </If>
    </Button>
  );
};

export default React.memo(NotificationCenterTrigger);
