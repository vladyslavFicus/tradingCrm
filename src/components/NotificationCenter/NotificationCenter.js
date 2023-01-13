import React, { PureComponent } from 'react';
import { Popover } from 'reactstrap';
import EventEmitter, { NOTIFICATION_CLICKED } from 'utils/EventEmitter';
import PermissionContent from 'components/PermissionContent';
import permissions from 'config/permissions';
import NotificationCenterContent from './components/NotificationCenterContent';
import NotificationCenterTrigger from './components/NotificationCenterTrigger';
import './NotificationCenter.scss';

class NotificationCenter extends PureComponent {
  state = {
    isOpen: false,
    enableToggle: true,
  };

  componentDidMount() {
    EventEmitter.on(NOTIFICATION_CLICKED, this.open);
  }

  componentWillUnmount() {
    EventEmitter.off(NOTIFICATION_CLICKED, this.open);
  }

  open = () => this.setState({ isOpen: true });

  close = () => this.setState({ isOpen: false });

  toggle = () => this.setState(({ isOpen }) => ({ isOpen: !isOpen }));

  // This trick needs to prevent popover closing when modal opened in popover
  onSetEnableToggle = enableToggle => setTimeout(() => this.setState(({ enableToggle })), 500);

  render() {
    const { isOpen, enableToggle } = this.state;
    const id = 'NotificationCenterTrigger';

    return (
      <PermissionContent permissions={permissions.NOTIFICATION_CENTER.GET_UNREAD_COUNT}>
        <NotificationCenterTrigger
          id={id}
          onClick={this.toggle}
        />
        <Popover
          container=".Header"
          id="NotificationCenterContainer"
          target={id}
          isOpen={isOpen}
          toggle={enableToggle ? this.toggle : () => {}}
          placement="bottom"
          popperClassName="NotificationCenter__popper"
          innerClassName="NotificationCenter__popover-inner"
          trigger="legacy"
          modifiers={[{
            name: 'preventOverflow',
            options: {
              altAxis: true,
              padding: 10,
            },
          }]}
        >
          <NotificationCenterContent
            onSetEnableToggle={this.onSetEnableToggle}
          />
        </Popover>
      </PermissionContent>
    );
  }
}

export default NotificationCenter;
