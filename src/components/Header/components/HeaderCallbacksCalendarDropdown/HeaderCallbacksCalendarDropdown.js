import React, { Component } from 'react';
import { Popover } from 'reactstrap';
import CallbacksCalendar from '../../../CallbacksCalendar';
import './header-calendar.scss';

class HeaderCallbacksCalendarDropdown extends Component {
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
      <div className="header-calendar">
        <button
          type="button"
          id="header-calendar"
          className="header-calendar__head"
          onClick={this.handleToggleState}
        >
          <i className="fa fa-calendar" />
        </button>
        <Popover
          placement="bottom"
          target="header-calendar"
          className="header-calendar__popover"
          toggle={this.handleToggleState}
          isOpen={isOpen}
        >
          <CallbacksCalendar
            calendarClassName="header-calendar__view"
            componentRef={(ref) => { this.callbacksCalendar = ref; }}
          />
        </Popover>
      </div>
    );
  }
}

export default HeaderCallbacksCalendarDropdown;
