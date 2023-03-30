import React from 'react';
import { useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { State, TableSelection } from 'types';
import { IpWhitelistAddress } from '__generated__/types';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import { LevelType, notify } from 'providers/NotificationProvider';
import { Button } from 'components/Buttons';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import CreateIpWhiteListModal, { CreateIpWhiteListModalProps } from 'modals/CreateIpWhiteListModal';
import { useIpWhitelistBulkDeleteMutation } from './graphql/__generated__/IpWhitelistBulkDeleteMutation';
import './IpWhitelistHeader.scss';

type Props = {
  content: Array<IpWhitelistAddress>,
  totalElements: number,
  selected: TableSelection | null,
  onRefetch: () => void,
};

const IpWhitelistHeader = (props: Props) => {
  const {
    content,
    totalElements,
    selected,
    onRefetch,
  } = props;

  const { state } = useLocation<State>();

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

  const getSelectedList = (fieldName: 'ip' | 'uuid'): Array<string> => {
    if (!selected) {
      return [];
    }

    const items = content.filter((_, index) => (selected.all
      ? !selected.touched.includes(index)
      : selected.touched.includes(index)));

    return items.map(item => item[fieldName]);
  };

  const getUuids = (): Array<string> => {
    if (!selected) {
      return [];
    }

    const items = content
      .filter((_, index) => selected.touched.includes(index))
      .map(({ uuid }) => uuid);

    return items;
  };

  // ===== Handlers ===== //
  const handleBulkDelete = async () => {
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
  };

  const handleOpenBulkDeleteModal = () => {
    confirmActionModal.show({
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
            onClick={() => createIpWhiteListModal.show({ onSuccess: onRefetch })}
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

export default React.memo(IpWhitelistHeader);
