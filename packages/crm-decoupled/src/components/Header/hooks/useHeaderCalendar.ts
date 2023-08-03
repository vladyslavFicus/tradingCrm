import { useCallback, useState } from 'react';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';

const useHeaderCalendar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLock, setIsLock] = useState<boolean>(false);

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowCalendar = permission.allowsAny([
    permissions.USER_PROFILE.CALLBACKS_LIST,
    permissions.LEAD_PROFILE.CALLBACKS_LIST,
  ]);

  // ===== Handlers ===== //
  const handleToggleCalendarPopover = useCallback(() => {
    if (!isLock) {
      setIsOpen(prevIsOpen => !prevIsOpen);
    }
  }, [isLock]);

  const handleLockToggle = useCallback((lock: boolean) => setIsLock(lock), []);

  return { isOpen, allowCalendar, handleToggleCalendarPopover, handleLockToggle };
};

export default useHeaderCalendar;
