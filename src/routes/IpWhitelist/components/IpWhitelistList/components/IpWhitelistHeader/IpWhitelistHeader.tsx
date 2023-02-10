import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withModals } from 'hoc';
import { Modal, TableSelection } from 'types';
import { IpWhitelistAddress } from '__generated__/types';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { notify, LevelType } from 'providers/NotificationProvider';
import { Button } from 'components/Buttons';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import WhiteListAddIpModal from 'modals/WhiteListAddIpModal';
import { useIpWhitelistBulkDeleteMutation } from './graphql/__generated__/IpWhitelistBulkDeleteMutation';
import './IpWhitelistHeader.scss';

type Props = {
  content: Array<IpWhitelistAddress>,
  totalElements: number,
  selected: TableSelection | null,
  modals: {
    addAddressModal: Modal,
    deleteModal: Modal,
  },
  onRefetch: () => void,
};

const IpWhitelistHeader = (props: Props) => {
  const {
    content,
    totalElements,
    selected,
    modals: {
      addAddressModal,
      deleteModal,
    },
    onRefetch,
  } = props;

  const permission = usePermission();

  const allowAddIp = permission.allows(permissions.IP_WHITELIST.ADD_IP_ADDRESS);
  const allowDeleteIp = permission.allows(permissions.IP_WHITELIST.DELETE_IP_ADDRESS);

  // ===== Requests ===== //
  const [ipWhitelistBulkDeleteMutation] = useIpWhitelistBulkDeleteMutation();

  const getSelectedList = (fieldName: 'ip' | 'uuid'): Array<string> => {
    if (!selected) {
      return [];
    }

    content.filter((_, idx) => selected.all || selected.touched.includes(idx));
    const items = selected.all ? content : content.filter((_, index) => selected.touched.includes(index));

    return items.map(item => item[fieldName]);
  };

  // ===== Handlers ===== //
  const handleBulkDelete = async () => {
    try {
      await ipWhitelistBulkDeleteMutation({
        variables: { uuids: getSelectedList('uuid') },
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

    deleteModal.hide();
  };

  const handleOpenBulkDeleteModal = () => {
    deleteModal.show({
      onSubmit: handleBulkDelete,
      modalTitle: I18n.t('IP_WHITELIST.MODALS.DELETE_MANY_MODAL.HEADER'),
      actionText: I18n.t('IP_WHITELIST.MODALS.DELETE_MANY_MODAL.ACTION_TEXT',
        {
          ips: getSelectedList('ip').join(', '),
        }),
      submitButtonLabel: I18n.t('IP_WHITELIST.MODALS.DELETE_MODAL.DELETE'),
    });
  };

  return (
    <div className="IpWhitelistHeader">
      <div className="IpWhitelistHeader__headline">
        <strong>{totalElements} </strong>

        {I18n.t('IP_WHITELIST.GRID.HEADLINE')}
      </div>

      <If condition={allowAddIp}>
        <div className="IpWhitelistHeader__actions">
          <Button
            secondary
            className="IpWhitelistHeader__actions-button"
            onClick={() => addAddressModal.show({ onSuccess: onRefetch })}
            type="button"
          >
            {I18n.t('IP_WHITELIST.GRID.ADD_IP')}
          </Button>

          <If condition={!!selected?.selected && allowDeleteIp}>
            <Button
              danger
              className="IpWhitelistHeader__actions-button"
              onClick={handleOpenBulkDeleteModal}
              type="button"
            >
              {I18n.t('IP_WHITELIST.GRID.DELETE_IPS')}
            </Button>
          </If>
        </div>
      </If>
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    addAddressModal: WhiteListAddIpModal,
    deleteModal: ConfirmActionModal,
  }),
)(IpWhitelistHeader);
