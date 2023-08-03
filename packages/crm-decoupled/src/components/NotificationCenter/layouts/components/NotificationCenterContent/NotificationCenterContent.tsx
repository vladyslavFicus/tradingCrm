import React from 'react';
import I18n from 'i18n-js';
import { Button } from 'components/Buttons';
import ReactSwitch from 'components/ReactSwitch';
import useNotificationCenterContent from 'components/NotificationCenter/hooks/useNotificationCenterContent';
import NotificationCenterForm from '../NotificationCenterForm';
import NotificationCenterTable from '../NotificationCenterTable';
import './NotificationCenterContent.scss';

type Props = {
  onSetEnableToggle: (enable: boolean) => void,
};

const NotificationCenterContent = (props: Props) => {
  const { onSetEnableToggle } = props;

  const {
    notificationCount,
    selectedCount,
    configurationLoading,
    showNotificationsPopUp,
    notificationsTypes,
    notificationQuery,
    filters,
    handleSelect,
    handleSubmit,
    handleBulkUpdate,
    handleSwitchNotificationConfiguration,
  } = useNotificationCenterContent();

  return (
    <div className="NotificationCenterContent">
      <div className="NotificationCenterContent__header">
        <div>
          <div className="NotificationCenterContent__headline">
            {notificationCount} {I18n.t('NOTIFICATION_CENTER.TOOLTIP.HEADLINE')}
          </div>

          <div className="NotificationCenterContent__subline">
            {selectedCount} {I18n.t('NOTIFICATION_CENTER.TOOLTIP.SUBLINE')}
          </div>
        </div>

        <div className="NotificationCenterContent__actions">
          <If condition={!configurationLoading}>
            <div className="NotificationCenterConfiguration">
              <div className="NotificationCenterConfiguration__title">
                {I18n.t('NOTIFICATION_CENTER.SHOW_POPUP')}
              </div>

              <ReactSwitch
                on={showNotificationsPopUp}
                className="NotificationCenterConfiguration__switcher"
                onClick={handleSwitchNotificationConfiguration}
              />
            </div>
          </If>

          <If condition={!!selectedCount}>
            <Button
              className="NotificationCenterContent__markAsRead"
              onClick={handleBulkUpdate}
              tertiary
            >
              {I18n.t('COMMON.MARK_AS_READ')}
            </Button>
          </If>
        </div>
      </div>

      <NotificationCenterForm
        className="NotificationCenterContent__form"
        notificationTypes={notificationsTypes}
        onSubmit={handleSubmit}
      />

      <NotificationCenterTable
        className="NotificationCenterContent__table"
        notificationQuery={notificationQuery}
        filters={filters}
        onSelect={handleSelect}
        onSetEnableToggle={onSetEnableToggle}
      />
    </div>
  );
};

export default React.memo(NotificationCenterContent);
