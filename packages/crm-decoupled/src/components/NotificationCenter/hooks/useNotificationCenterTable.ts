import { useCallback } from 'react';
import I18n from 'i18n-js';
import { useModal } from '@crm/common';
import useHandlePageChanged from 'hooks/useHandlePageChanged';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { MAX_SELECTED_ROWS } from '../constants';
import {
  NotificationQueryQueryResult,
} from '../graphql/__generated__/NotificationQuery';
import { Filter } from '../types';

type Props = {
  notificationQuery: NotificationQueryQueryResult,
  filters: Filter,
  onSetEnableToggle: (enable: boolean) => void,
};

const useNotificationCenterTable = (props: Props) => {
  const { notificationQuery, onSetEnableToggle } = props;

  const { data, loading } = notificationQuery;

  const {
    content = [],
    totalElements = 0,
    number = 0,
    last = true,
  } = data?.notificationCenter || {};

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  // ===== Handlers ===== //
  const handlePageChanged = useHandlePageChanged({
    query: notificationQuery,
    page: number,
  });

  const handleSelectError = useCallback(() => {
    onSetEnableToggle(false);

    confirmActionModal.show({
      onSubmit: confirmActionModal.hide,
      onCloseCallback: () => onSetEnableToggle(true),
      modalTitle: `${MAX_SELECTED_ROWS} ${I18n.t('NOTIFICATION_CENTER.TOOLTIP.MAX_ITEM_SELECTED')}`,
      actionText: I18n.t('NOTIFICATION_CENTER.TOOLTIP.ERRORS.SELECTED_MORE_THAN_MAX', { max: MAX_SELECTED_ROWS }),
      submitButtonLabel: I18n.t('COMMON.OK'),
      hideCancel: true,
    });
  }, []);

  return {
    content,
    totalElements,
    last,
    loading,
    handlePageChanged,
    handleSelectError,
  };
};

export default useNotificationCenterTable;
