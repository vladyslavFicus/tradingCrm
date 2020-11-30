import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { get } from 'lodash';
import { withRequests } from 'apollo';
import { Button } from 'components/UI';
import EventEmitter, { NOTIFICATIONS_READ } from 'utils/EventEmitter';
import NotificationCenterUnreadQuery from '../../graphql/NotificationCenterUnreadQuery';
import { ReactComponent as Icon } from './icon.svg';
import './NotificationCenterTrigger.scss';

class NotificationCenterTrigger extends PureComponent {
  static propTypes = {
    notificationCenterUnread: PropTypes.query({
      notificationCenterUnread: PropTypes.number,
    }).isRequired,
  };

  componentDidMount() {
    EventEmitter.on(NOTIFICATIONS_READ, this.handleReadEvent);
  }

  componentWillUnmount() {
    EventEmitter.off(NOTIFICATIONS_READ, this.handleReadEvent);
  }

  /**
   * Handle event when "Mark as Read" button was pushed
   */
  handleReadEvent = () => {
    this.props.notificationCenterUnread.refetch();
  };

  render() {
    const { notificationCenterUnread, ...props } = this.props;

    const unreadAmount = get(notificationCenterUnread, 'data.notificationCenterUnread') || 0;

    return (
      <Button
        counter={unreadAmount}
        className={classNames('NotificationCenterTrigger', {
          'NotificationCenterTrigger--beep': unreadAmount,
        })}
        {...props}
      >
        <Icon className="NotificationCenterTrigger__icon" />
      </Button>
    );
  }
}

export default withRequests({
  notificationCenterUnread: NotificationCenterUnreadQuery,
})(NotificationCenterTrigger);
