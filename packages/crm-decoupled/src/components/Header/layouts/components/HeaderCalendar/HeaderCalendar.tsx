import React from 'react';
import { Popover } from 'reactstrap';
import { Button } from 'components/Buttons';
import useHeaderCalendar from 'components/Header/hooks/useHeaderCalendar';
import CallbacksCalendar from './components/CallbacksCalendar';
import './HeaderCalendar.scss';

const HeaderCalendar = () => {
  const { isOpen, allowCalendar, handleToggleCalendarPopover, handleLockToggle } = useHeaderCalendar();

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
