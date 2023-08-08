import { useCallback, useState } from 'react';
import { compact } from 'lodash';
import I18n from 'i18n-js';
import { Utils } from '@crm/common';
import { parseErrors } from 'apollo';
import { TableSelection } from 'types';
import { LevelType, notify } from 'providers/NotificationProvider';
import { useNotificationQuery } from '../graphql/__generated__/NotificationQuery';
import { useNotificationUpdateMutation } from '../graphql/__generated__/NotificationUpdateMutation';
import { useConfigurationQuery } from '../graphql/__generated__/ConfigurationQuery';
import { useConfigurationUpdateMutation } from '../graphql/__generated__/ConfigurationUpdateMutation';
import { useNotificationTypesQuery } from '../graphql/__generated__/NotificationTypesQuery';
import { MAX_SELECTED_ROWS } from '../constants';
import { Filter } from '../types';

type Select = TableSelection | null;

const useNotificationCenterContent = () => {
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
  const handleSelect = useCallback((value: Select) => {
    setSelect(value);
  }, []);

  const handleSubmit = useCallback((filterParams: Filter) => {
    setFilters(filterParams);

    notificationQuery.refetch({
      args: {
        ...notificationQuery.variables?.args,
        ...filterParams,
      },
    });

    select?.reset();
  }, [select, notificationQuery.variables?.args]);

  const handleBulkUpdate = useCallback(async () => {
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

        Utils.EventEmitter.emit(Utils.NOTIFICATIONS_READ);

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
  }, [select, notificationQuery, filters]);

  const handleSwitchNotificationConfiguration = useCallback(async (value: boolean) => {
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
  }, []);

  return {
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
  };
};

export default useNotificationCenterContent;
