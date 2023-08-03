import React from 'react';
import { Button } from 'components/Buttons';
import useNotificationCenterTrigger from 'components/NotificationCenter/hooks/useNotificationCenterTrigger';
import './NotificationCenterTrigger.scss';

type Props = {
  id: string,
  onClick: () => void,
};

const NotificationCenterTrigger = (props: Props) => {
  const { id, onClick } = props;

  const { unreadCount } = useNotificationCenterTrigger();

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
