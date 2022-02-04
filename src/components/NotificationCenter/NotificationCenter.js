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

  onCloseModal = () => {
    this.setState(({ enableToggle: false }));

    /**
     * this trick needs to prevent popover closing after closing of modal opened in popover
     */
    return () => {
      setTimeout(() => {
        this.setState(({ enableToggle: true }));
      }, 500);
    };
  };

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
          id="NotificationCenterContainer"
          target={id}
          isOpen={isOpen}
          toggle={enableToggle ? this.toggle : () => {}}
          placement="bottom"
          popperClassName="NotificationCenter__popper"
          innerClassName="NotificationCenter__popover-inner"
          trigger="manual"
          modifiers={[{
            name: 'preventOverflow',
            options: {
              altAxis: true,
              padding: 10,
            },
          }]}
        >
          <NotificationCenterContent
            close={this.close}
            onCloseModal={this.onCloseModal}
          />
        </Popover>
      </PermissionContent>
    );
  }
}

export default NotificationCenter;
