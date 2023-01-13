import React, { PureComponent } from 'react';
import { Popover } from 'reactstrap';
import PermissionContent from 'components/PermissionContent';
import permissions from 'config/permissions';
import { CONDITIONS } from 'utils/permissions';
import CallbacksCalendar from './components/CallbacksCalendar';
import './HeaderCalendar.scss';

class HeaderCalendar extends PureComponent {
  state = {
    isOpen: false,
    isLock: false,
  };

  componentDidUpdate(_, prevState) {
    const { isLock } = this.state;

    if (prevState.isLock !== isLock && !isLock) {
      this.handleToggleCalendarPopover();
    }
  }

  handleToggleCalendarPopover = () => {
    const { isLock } = this.state;

    if (!isLock) {
      this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
    }
  };

  handleLockToggle = isLock => this.setState({ isLock });

  render() {
    const { isOpen } = this.state;

    return (
      <PermissionContent
        permissions={[
          permissions.USER_PROFILE.CALLBACKS_LIST,
          permissions.LEAD_PROFILE.CALLBACKS_LIST,
        ]}
        permissionsCondition={CONDITIONS.OR}
      >
        <div className="HeaderCalendar">
          <button
            className="HeaderCalendar__head"
            onClick={this.handleToggleCalendarPopover}
            id="id-toggle-button"
            type="button"
          >
            <i className="icon-calendar" />
          </button>
          <Popover
            container=".HeaderCalendar"
            popperClassName="HeaderCalendar__popper"
            toggle={this.handleToggleCalendarPopover}
            target="id-toggle-button"
            placement="bottom"
            isOpen={isOpen}
            trigger="legacy"
            modifiers={[{
              name: 'preventOverflow',
              options: {
                altAxis: true,
                padding: 10,
              },
            }]}
          >
            <CallbacksCalendar onLockToggle={this.handleLockToggle} />
          </Popover>
        </div>
      </PermissionContent>
    );
  }
}

export default HeaderCalendar;
