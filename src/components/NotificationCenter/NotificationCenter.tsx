import React, { useState, useEffect } from 'react';
import { Popover } from 'reactstrap';
import EventEmitter, { NOTIFICATION_CLICKED } from 'utils/EventEmitter';
import PermissionContent from 'components/PermissionContent';
import permissions from 'config/permissions';
import NotificationCenterContent from './components/NotificationCenterContent';
import NotificationCenterTrigger from './components/NotificationCenterTrigger';
import './NotificationCenter.scss';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [enableToggle, setEnableToggle] = useState(true);

  const handleOpen = () => setIsOpen(true);

  const handleToggle = () => setIsOpen(!isOpen);

  // This trick needs to prevent popover closing when modal opened in popover
  const onSetEnableToggle = (enable: boolean) => setTimeout(() => setEnableToggle(enable), 500);

  useEffect(() => {
    EventEmitter.on(NOTIFICATION_CLICKED, handleOpen);

    return () => {
      EventEmitter.off(NOTIFICATION_CLICKED, handleOpen);
    };
  }, []);

  const id = 'NotificationCenterTrigger';

  return (
    <PermissionContent permissions={permissions.NOTIFICATION_CENTER.GET_UNREAD_COUNT}>
      <NotificationCenterTrigger
        id={id}
        onClick={handleToggle}
      />

      <Popover
        container=".Header"
        id="NotificationCenterContainer"
        target={id}
        isOpen={isOpen}
        toggle={enableToggle ? handleToggle : () => {}}
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
    </PermissionContent>
  );
};

export default React.memo(NotificationCenter);
