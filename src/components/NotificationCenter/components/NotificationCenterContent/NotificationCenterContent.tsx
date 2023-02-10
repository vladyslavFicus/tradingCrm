import React, { useState } from 'react';
import I18n from 'i18n-js';
import { compact } from 'lodash';
import { parseErrors } from 'apollo';
import { TableSelection } from 'types';
import { notify, LevelType } from 'providers/NotificationProvider';
import EventEmitter, { NOTIFICATIONS_READ } from 'utils/EventEmitter';
import { Button } from 'components/Buttons';
import ReactSwitch from 'components/ReactSwitch';
import { Filter } from '../types';
import { MAX_SELECTED_ROWS } from '../constants';
import NotificationCenterForm from '../NotificationCenterForm';
import NotificationCenterTable from '../NotificationCenterTable';
import { useNotificationQuery } from '../../graphql/__generated__/NotificationQuery';
import { useNotificationUpdateMutation } from '../../graphql/__generated__/NotificationUpdateMutation';
import { useConfigurationQuery } from '../../graphql/__generated__/ConfigurationQuery';
import { useConfigurationUpdateMutation } from '../../graphql/__generated__/ConfigurationUpdateMutation';
import { useNotificationTypesQuery } from '../../graphql/__generated__/NotificationTypesQuery';
import './NotificationCenterContent.scss';

type Select = TableSelection | null;

type Props = {
  onSetEnableToggle: (enable: boolean) => void,
};

const NotificationCenterContent = (props: Props) => {
  const { onSetEnableToggle } = props;

  const [select, setSelect] = useState<Select>(null);
  const [filters, setFilters] = useState<Filter>({});

  const selectedCount = select?.selected || 0;

  // ===== Requests ===== //
  const notificationQuery = useNotificationQuery({
    variables: {
      args: {
        page: {
          from: 0,
          size: 10,
        },
      },
    },
    context: { batch: false },
  });

  const notificationCount = notificationQuery.data?.notificationCenter.totalElements;

  const [notificationUpdateMutation] = useNotificationUpdateMutation();

  const { data: configurationData, loading: configurationLoading } = useConfigurationQuery();
  const showNotificationsPopUp = configurationData?.notificationCenterConfiguration?.showNotificationsPopUp || false;

  const [configurationUpdateMutation] = useConfigurationUpdateMutation();

  const notificationTypesQuery = useNotificationTypesQuery();
  const typesData = notificationTypesQuery.data?.notificationCenterTypes || {};
  const notificationsTypes = Object.keys(typesData);

  // ===== Handlers ===== //
  const handleSelect = (value: Select) => {
    setSelect(value);
  };

  const handleSubmit = (filterParams: Filter) => {
    setFilters(filterParams);

    notificationQuery.refetch({
      args: {
        ...notificationQuery.variables?.args,
        ...filterParams,
      },
    });

    select?.reset();
  };

  const handleBulkUpdate = async () => {
    if (select) {
      const { totalElements = 0, content = [] } = notificationQuery.data?.notificationCenter || {};

      const uuids = select.all
        ? []
        : compact(content.map(({ uuid }, index) => select.touched.includes(index) && uuid));

      try {
        await notificationUpdateMutation({
          variables: {
            searchParams: {
              ...notificationQuery.variables?.args,
              ...filters,
            },
            totalElements: totalElements > MAX_SELECTED_ROWS ? MAX_SELECTED_ROWS : totalElements,
            selectAll: select.all,
            incUuids: uuids,
          },
        });

        EventEmitter.emit(NOTIFICATIONS_READ);

        notify({
          level: LevelType.SUCCESS,
          title: I18n.t('COMMON.ACTIONS.SUCCESSFULLY'),
          message: I18n.t('COMMON.ACTIONS.UPDATED'),
        });

        await notificationQuery.refetch();
      } catch (e) {
        const { error } = parseErrors(e);

        notify({
          level: LevelType.ERROR,
          title: I18n.t('NOTIFICATION_CENTER.TOOLTIP.UPDATE_FAILED'),
          message: error,
        });
      }

      select.reset();
    }
  };

  const handleSwitchNotificationConfiguration = async (value: boolean) => {
    try {
      await configurationUpdateMutation({ variables: { showNotificationsPopUp: value } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.ACTIONS.SUCCESSFULLY'),
        message: I18n.t('COMMON.ACTIONS.UPDATED'),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY'),
        message: I18n.t('NOTIFICATION_CENTER.TOOLTIP.UPDATE_FAILED'),
      });
    }
  };

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
