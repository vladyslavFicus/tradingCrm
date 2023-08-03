import React from 'react';
import { Popover } from 'reactstrap';
import useNotificationCenter from 'components/NotificationCenter/hooks/useNotificationCenter';
import NotificationCenterContent from './components/NotificationCenterContent';
import NotificationCenterTrigger from './components/NotificationCenterTrigger';
import './NotificationCenter.scss';

const NotificationCenter = () => {
  const {
    isOpen,
    enableToggle,
    handleToggle,
    onSetEnableToggle,
    id,
    allowGetUnreadCount,
  } = useNotificationCenter();


  return (
    <If condition={allowGetUnreadCount}>
      <NotificationCenterTrigger
        id={id}
        onClick={handleToggle}
      />

      <Popover
        container=".Header"
        id="NotificationCenterContainer"
        target={id}
        isOpen={isOpen}
        toggle={enableToggle ? handleToggle : () => {
        }}
        placement="bottom"
        popperClassName="NotificationCenter__popper"
        innerClassName="NotificationCenter__popover-inner"
        trigger="legacy"
        // @ts-ignore
        modifiers={[{
          name: 'preventOverflow',
          options: {
            padding: 10,
          },
        }]}
      >
        <NotificationCenterContent onSetEnableToggle={onSetEnableToggle} />
      </Popover>
    </If>
  );
};

export default React.memo(NotificationCenter);
