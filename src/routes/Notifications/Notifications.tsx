import React from 'react';
import I18n from 'i18n-js';
import { useLocation } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import { State } from 'types';
import NotificationsGridFilters from './components/NotificationGridFilter';
import NotificationsGrid from './components/NotificationsGrid';
import { useNotificationsQuery, NotificationsQueryVariables } from './graphql/__generated__/NotificationsQuery';
import './Notifications.scss';

const Notifications = () => {
  const { state } = useLocation<State<NotificationsQueryVariables>>();

  // ===== Requests ===== //
  const { data, loading, variables, refetch, fetchMore } = useNotificationsQuery({
    variables: {
      args: {
        ...state?.filters as NotificationsQueryVariables,
        hierarchical: true,
        page: {
          from: 0,
          size: 20,
        },
      },
    },
  });

  const { content = [], last = true, totalElements = 0, number = 0 } = data?.notificationCenter || {};

  // ===== Handlers ===== //
  const handlePageChanged = () => {
    fetchMore({
      variables: set(cloneDeep(variables as NotificationsQueryVariables), 'args.page.from', number + 1),
    });
  };

  return (
    <div className="Notifications">
      <div className="Notifications__header">
        <b>{totalElements}</b> {I18n.t('NOTIFICATION_CENTER.TITLE')}
      </div>

      <NotificationsGridFilters onRefetch={refetch} />

      <NotificationsGrid
        content={content}
        loading={loading}
        last={last}
        onMore={handlePageChanged}
      />
    </div>
  );
};

export default React.memo(Notifications);
