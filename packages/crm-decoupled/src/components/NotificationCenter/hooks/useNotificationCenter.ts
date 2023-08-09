import { useCallback, useEffect, useState } from 'react';
import { Config, Utils } from '@crm/common';
import { usePermission } from 'providers/PermissionsProvider';

const useNotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [enableToggle, setEnableToggle] = useState(true);

  const permission = usePermission();
  const allowGetUnreadCount = permission.allows(Config.permissions.NOTIFICATION_CENTER.GET_UNREAD_COUNT);

  const handleOpen = useCallback(() => setIsOpen(true), []);

  const handleToggle = useCallback(() => setIsOpen(prevIsOpen => !prevIsOpen), []);

  // This trick needs to prevent popover closing when modal opened in popover
  const onSetEnableToggle = useCallback(
    (enable: boolean) => setTimeout(() => setEnableToggle(enable), 500),
    [],
  );

  useEffect(() => {
    Utils.EventEmitter.on(Utils.NOTIFICATION_CLICKED, handleOpen);

    return () => {
      Utils.EventEmitter.off(Utils.NOTIFICATION_CLICKED, handleOpen);
    };
  }, []);

  const id = 'NotificationCenterTrigger';

  return {
    isOpen,
    enableToggle,
    handleToggle,
    onSetEnableToggle,
    id,
    allowGetUnreadCount,
  };
};

export default useNotificationCenter;
