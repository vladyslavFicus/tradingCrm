import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popover } from 'reactstrap';
import CallbacksCalendar from '../CallbacksCalendar';
import './HeaderCallbacksCalendarDropdown.scss';

class HeaderCallbacksCalendarDropdown extends Component {
  static propTypes = {
    operatorId: PropTypes.string.isRequired,
  };

  state = {
    isOpen: false,
  };

  handleToggleState = () => {
    // Additional check if callback details modal is open for prevent dropdown close
    if (!this.callbacksCalendar || !this.callbacksCalendar.props.modals.callbackDetails.isOpen) {
      this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
    }
  };

  render() {
    const { operatorId } = this.props;
    const { isOpen } = this.state;

    return (
      <div className="HeaderCallbacksCalendarDropdown">
        <button
          id="CallbacksCalendar"
          type="button"
          className="HeaderCallbacksCalendarDropdown__toggle"
          onClick={this.handleToggleState}
        >
          <i className="fa fa-calendar" />
        </button>
        <Popover
          placement="bottom"
          target="CallbacksCalendar"
          className="HeaderCallbacksCalendarDropdown__popover"
          isOpen={isOpen}
          toggle={this.handleToggleState}
        >
          <CallbacksCalendar
            operatorId={operatorId}
            calendarClassName="HeaderCallbacksCalendarDropdown__calendar"
            componentRef={(ref) => { this.callbacksCalendar = ref; }}
          />
        </Popover>
      </div>
    );
  }
}

export default HeaderCallbacksCalendarDropdown;
