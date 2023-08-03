import React from 'react';
import I18n from 'i18n-js';
import useNotifications from 'routes/Notifications/hooks/useNotifications';
import NotificationsGridFilters from './components/NotificationsGridFilters';
import NotificationsGrid from './components/NotificationsGrid';
import './Notifications.scss';

const Notifications = () => {
  const {
    content,
    loading,
    last,
    totalElements,
    refetch,
    handleFetchMore,
  } = useNotifications();

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
        onMore={handleFetchMore}
      />
    </div>
  );
};

export default React.memo(Notifications);
