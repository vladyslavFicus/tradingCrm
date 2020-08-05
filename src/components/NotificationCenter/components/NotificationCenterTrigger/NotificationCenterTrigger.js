import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { get } from 'lodash';
import { withRequests } from 'apollo';
import { Button } from 'components/UI';
import NotificationCenterUnreadQuery from '../../graphql/NotificationCenterUnreadQuery';
import { ReactComponent as Icon } from './icon.svg';
import './NotificationCenterTrigger.scss';

class NotificationCenterTrigger extends PureComponent {
  static propTypes = {
    notificationCenterUnread: PropTypes.query({
      notificationCenterUnread: PropTypes.number,
    }).isRequired,
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
