import React, { useState } from 'react';
import { Popover } from 'reactstrap';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import { Button } from 'components/Buttons';
import CallbacksCalendar from './components/CallbacksCalendar';
import './HeaderCalendar.scss';

const HeaderCalendar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLock, setIsLock] = useState<boolean>(false);

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowCalendar = permission.allowsAny([
    permissions.USER_PROFILE.CALLBACKS_LIST,
    permissions.LEAD_PROFILE.CALLBACKS_LIST,
  ]);

  // ===== Handlers ===== //
  const handleToggleCalendarPopover = () => {
    if (!isLock) {
      setIsOpen(!isOpen);
    }
  };

  const handleLockToggle = (lock: boolean) => setIsLock(lock);

  return (
    <If condition={allowCalendar}>
      <div className="HeaderCalendar">
        <Button
          className="HeaderCalendar__button"
          onClick={handleToggleCalendarPopover}
          id="id-toggle-button"
          type="button"
        >
          <i className="icon-calendar" />
        </Button>

        <Popover
          container=".HeaderCalendar"
          popperClassName="HeaderCalendar__popper"
          toggle={handleToggleCalendarPopover}
          target="id-toggle-button"
          placement="bottom"
          isOpen={isOpen}
          trigger="legacy"
          // @ts-ignore
          modifiers={[{
            name: 'preventOverflow',
            options: {
              altAxis: true,
              padding: 10,
            },
          }]}
        >
          <CallbacksCalendar onLockToggle={handleLockToggle} />
        </Popover>
      </div>
    </If>
  );
};

export default React.memo(HeaderCalendar);
