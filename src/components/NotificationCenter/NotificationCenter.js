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

    document.addEventListener('click', this.onCloseHandler);
  }

  componentWillUnmount() {
    EventEmitter.off(NOTIFICATION_CLICKED, this.open);

    document.removeEventListener('click', this.onCloseHandler);
  }

  open = () => this.setState({ isOpen: true });

  toggle = () => this.setState(({ isOpen }) => ({ isOpen: !isOpen }));

  /**
   * Manual control closing of popover with notifications to prevent close when clicked
   * on content inside NotificationCenterContainer and inside Notifications__toast elements.
   *
   * @param e
   */
  onCloseHandler = (e) => {
    const element = e.target;
    const notificationCenterTrigger = document.getElementById('NotificationCenterTrigger');
    const notificationCenterContainer = document.getElementById('NotificationCenterContainer');
    const notificationWSContainers = [...document.getElementsByClassName('Notifications__toast')];

    const shouldClose = !(
      element === notificationCenterTrigger
      || element === notificationCenterContainer
      || (notificationCenterContainer && notificationCenterContainer.contains(element))
      || notificationWSContainers.includes(element)
      || notificationWSContainers.some(container => container.contains(element))
    );

    if (shouldClose) {
      this.setState({ isOpen: false });
    }
  };

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
          className="NotificationCenter__popover"
          innerClassName="NotificationCenter__popover-inner"
          trigger="manual"
        >
          <NotificationCenterContent onCloseModal={this.onCloseModal} />
        </Popover>
      </PermissionContent>
    );
  }
}

export default NotificationCenter;
