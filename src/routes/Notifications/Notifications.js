import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import NotificationsGridFilters from './components/NotificationGridFilter';
import NotificationsGrid from './components/NotificationsGrid';
import NotificationCenterQuery from './graphql/NotificationCenterQuery';
import './Notifications.scss';

class Notifications extends PureComponent {
  static propTypes = {
    notificationCenterQuery: PropTypes.query({
      notificationCenter: PropTypes.pageable(PropTypes.notificationCenter),
    }).isRequired,
  };

  render() {
    const { notificationCenterQuery } = this.props;

    const totalElements = notificationCenterQuery.data?.notificationCenter?.totalElements;

    return (
      <div className="Notifications">
        <div className="Notifications__header">
          <div className="Notifications__title">
            <b>{totalElements}</b> {I18n.t('NOTIFICATION_CENTER.TITLE')}
          </div>
        </div>

        <NotificationsGridFilters handleRefetch={notificationCenterQuery.refetch} />
        <NotificationsGrid notificationCenterQuery={notificationCenterQuery} />
      </div>
    );
  }
}

export default withRequests({
  notificationCenterQuery: NotificationCenterQuery,
})(Notifications);
