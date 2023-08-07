import { useCallback } from 'react';
import I18n from 'i18n-js';
import { permissions } from 'config';
import { IpWhitelistAddress } from '__generated__/types';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import { notify, LevelType } from 'providers/NotificationProvider';
import UpdateIpWhiteListModal,
{ UpdateIpWhiteListModalProps } from 'modals/UpdateIpWhiteListModal';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { useIpWhitelistDeleteMutation } from '../graphql/__generated__/IpWhitelistDeleteMutation';

type Props = {
  onRefetch: () => void,
};

const useIpWhitelistGrid = (props: Props) => {
  const { onRefetch } = props;

  const permission = usePermission();

  const allowUpdateIp = permission.allows(permissions.IP_WHITELIST.EDIT_IP_ADDRESS_DESCRIPTION);
  const allowDeleteIp = permission.allows(permissions.IP_WHITELIST.DELETE_IP_ADDRESS);

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);
  const updateIpWhiteListModal = useModal<UpdateIpWhiteListModalProps>(UpdateIpWhiteListModal);

  // ===== Requests ===== //
  const [ipWhitelistDeleteMutation] = useIpWhitelistDeleteMutation();

  // ====== Handlers ====== //
  const handleDeleteIp = useCallback(({ uuid, ip }: IpWhitelistAddress) => async () => {
    try {
      await ipWhitelistDeleteMutation({ variables: { uuid } });

      onRefetch();
      confirmActionModal.hide();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('IP_WHITELIST.MODALS.DELETE_MODAL.NOTIFICATIONS.IP_DELETED', { ip }),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('IP_WHITELIST.MODALS.DELETE_MODAL.NOTIFICATIONS.IP_NOT_DELETED'),
      });
    }
  }, []);

  return {
    confirmActionModal,
    allowUpdateIp,
    allowDeleteIp,
    updateIpWhiteListModal,
    handleDeleteIp,
  };
};

export default useIpWhitelistGrid;
