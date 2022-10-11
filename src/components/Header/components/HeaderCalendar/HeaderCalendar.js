import React, { PureComponent } from 'react';
import { Popover } from 'reactstrap';
import permissions from 'config/permissions';
import CallbacksCalendar from 'components/CallbacksCalendar';
import PermissionContent from 'components/PermissionContent';
import './HeaderCalendar.scss';

class HeaderCalendar extends PureComponent {
  state = {
    isOpen: false,
  };

  handleToggleState = () => {
    if (!this.callbacksCalendar || !this.callbacksCalendar.props.modals.callbackDetails.isOpen) {
      this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
    }
  };

  render() {
    const { isOpen } = this.state;

    return (
      <PermissionContent permissions={permissions.CALLBACKS.CLIENT.LIST}>
        <div className="HeaderCalendar">
          <button
            className="HeaderCalendar__head"
            onClick={this.handleToggleState}
            id="id-toggle-button"
            type="button"
          >
            <i className="icon-calendar" />
          </button>
          <Popover
            popperClassName="HeaderCalendar__popper"
            toggle={this.handleToggleState}
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
            <CallbacksCalendar
              connectionKey="HEADER_CALLBACKS_CALENDAR"
              calendarClassName="HeaderCalendar__view"
              componentRef={(ref) => { this.callbacksCalendar = ref; }}
            />
          </Popover>
        </div>
      </PermissionContent>
    );
  }
}

export default HeaderCalendar;
