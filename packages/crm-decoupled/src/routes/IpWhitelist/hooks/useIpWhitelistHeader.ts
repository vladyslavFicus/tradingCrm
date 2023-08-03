import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { State, TableSelection } from 'types';
import { IpWhitelistAddress } from '__generated__/types';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import { LevelType, notify } from 'providers/NotificationProvider';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import CreateIpWhiteListModal, { CreateIpWhiteListModalProps } from 'modals/CreateIpWhiteListModal';
import { useIpWhitelistBulkDeleteMutation } from '../graphql/__generated__/IpWhitelistBulkDeleteMutation';

type Props = {
  content: Array<IpWhitelistAddress>,
  totalElements: number,
  selected: TableSelection | null,
  onRefetch: () => void,
};

const useIpWhitelistHeader = (props: Props) => {
  const {
    content,
    totalElements,
    selected,
    onRefetch,
  } = props;

  const state = useLocation().state as State;

  const searchParams = state?.filters;
  const sorts = state?.sorts;

  const permission = usePermission();

  const allowAddIp = permission.allows(permissions.IP_WHITELIST.ADD_IP_ADDRESS);
  const allowDeleteIp = permission.allows(permissions.IP_WHITELIST.DELETE_IP_ADDRESS);

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);
  const createIpWhiteListModal = useModal<CreateIpWhiteListModalProps>(CreateIpWhiteListModal);

  // ===== Requests ===== //
  const [ipWhitelistBulkDeleteMutation] = useIpWhitelistBulkDeleteMutation();

  const getSelectedList = useCallback((fieldName: 'ip' | 'uuid') => {
    if (!selected) {
      return [];
    }

    const items = content.filter((_, index) => (selected.all
      ? !selected.touched.includes(index)
      : selected.touched.includes(index)));

    return items.map(item => item[fieldName]);
  }, [selected, content]);

  const getUuids = useCallback(() => {
    if (!selected) {
      return [];
    }

    const items = content
      .filter((_, index) => selected.touched.includes(index))
      .map(({ uuid }) => uuid);

    return items;
  }, [selected, content]);

  // ===== Handlers ===== //
  const handleBulkDelete = useCallback(async () => {
    try {
      await ipWhitelistBulkDeleteMutation({
        variables: {
          uuids: getUuids(),
          bulkSize: selected?.all ? totalElements : 0,
          searchParams: selected?.all && searchParams ? searchParams : {},
          sorts: selected?.all && sorts?.length ? sorts : [],
        },
      });

      selected?.reset();
      onRefetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('IP_WHITELIST.MODALS.DELETE_MANY_MODAL.NOTIFICATIONS.IP_DELETED',
          { ips: getSelectedList('ip').join(', ') }),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('IP_WHITELIST.MODALS.DELETE_MANY_MODAL.NOTIFICATIONS.IP_NOT_DELETED'),
      });
    }

    confirmActionModal.hide();
  }, [selected, totalElements, searchParams, sorts]);

  const handleOpenBulkDeleteModal = useCallback(() => {
    confirmActionModal.show({
      onSubmit: handleBulkDelete,
      modalTitle: I18n.t('IP_WHITELIST.MODALS.DELETE_MANY_MODAL.HEADER'),
      actionText: I18n.t('IP_WHITELIST.MODALS.DELETE_MANY_MODAL.ACTION_TEXT',
        {
          ips: getSelectedList('ip').join(', '),
        }),
      submitButtonLabel: I18n.t('IP_WHITELIST.MODALS.DELETE_MODAL.DELETE'),
    });
  }, []);

  return {
    allowAddIp,
    allowDeleteIp,
    createIpWhiteListModal,
    handleOpenBulkDeleteModal,
  };
};

export default useIpWhitelistHeader;
