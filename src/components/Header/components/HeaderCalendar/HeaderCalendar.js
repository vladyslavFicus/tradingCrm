import React, { PureComponent } from 'react';
import { Popover } from 'reactstrap';
import CallbacksCalendar from 'components/CallbacksCalendar';
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
      <div className="HeaderCalendar">
        <button
          className="HeaderCalendar__head"
          onClick={this.handleToggleState}
          id="id-toggle-button"
          type="button"
        >
          <i className="fa fa-calendar" />
        </button>
        <Popover
          className="HeaderCalendar__popover"
          toggle={this.handleToggleState}
          target="id-toggle-button"
          placement="bottom"
          isOpen={isOpen}
        >
          <CallbacksCalendar
            calendarClassName="HeaderCalendar__view"
            componentRef={(ref) => { this.callbacksCalendar = ref; }}
          />
        </Popover>
      </div>
    );
  }
}

export default HeaderCalendar;
