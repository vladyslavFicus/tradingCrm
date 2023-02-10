import React from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import compose from 'compose-function';
import { withModals } from 'hoc';
import { Modal, Sorts } from 'types';
import { IpWhitelistAddress } from '__generated__/types';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { notify, LevelType } from 'providers/NotificationProvider';
import { Table, Column } from 'components/Table';
import { TrashButton, EditButton } from 'components/Buttons';
import WhiteListUpdateDescriptionModal from 'modals/WhiteListUpdateDescriptionModal';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { useIpWhitelistDeleteMutation } from './graphql/__generated__/IpWhitelistDeleteMutation';
import './IpWhitelistGrid.scss';

type Props = {
  content: Array<IpWhitelistAddress>,
  loading: boolean,
  last: boolean,
  modals: {
    updateDescriptionModal: Modal,
    deleteModal: Modal,
  },
  onRefetch: () => void,
  onFetchMore: () => void,
  onSort: (sorts: Sorts) => void,
  onSelect: () => void,
};

const IpWhitelistGrid = (props: Props) => {
  const {
    content,
    loading,
    last,
    modals: {
      updateDescriptionModal,
      deleteModal,
    },
    onRefetch,
    onFetchMore,
    onSort,
    onSelect,
  } = props;

  const permission = usePermission();

  const allowUpdateIp = permission.allows(permissions.IP_WHITELIST.EDIT_IP_ADDRESS_DESCRIPTION);
  const allowDeleteIp = permission.allows(permissions.IP_WHITELIST.DELETE_IP_ADDRESS);

  // ===== Requests ===== //
  const [ipWhitelistDeleteMutation] = useIpWhitelistDeleteMutation();

  // ====== Handlers ====== //
  const handleDeleteIp = ({ uuid, ip }: IpWhitelistAddress) => async () => {
    try {
      await ipWhitelistDeleteMutation({ variables: { uuid } });

      onRefetch();
      deleteModal.hide();

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
  };

  // ===== Renderers ===== //
  const renderIp = (item: IpWhitelistAddress) => (
    <div className="IpWhitelistGrid__cell-primary">
      {item.ip}
    </div>
  );

  const renderCreatedAt = (item: IpWhitelistAddress) => (
    <div className="IpWhitelistGrid__cell-primary">
      <div className="IpWhitelistGrid__cell-primary-date">
        {moment.utc(item.createdAt).local().format('DD.MM.YYYY')}
      </div>

      <div className="IpWhitelistGrid__cell-primary-time">
        {moment.utc(item.createdAt).local().format('HH:mm:ss')}
      </div>
    </div>
  );

  const renderDescription = (item: IpWhitelistAddress) => (
    <div className="IpWhitelistGrid__cell-primary">
      {item.description}
    </div>
  );

  const renderActions = (item: IpWhitelistAddress) => (
    <div className="IpWhitelistGrid__cell-primary">
      <If condition={allowDeleteIp}>
        <TrashButton
          className="IpWhitelistGrid__action-icon"
          onClick={() => deleteModal.show({
            onSubmit: handleDeleteIp(item),
            modalTitle: I18n.t('IP_WHITELIST.MODALS.DELETE_MODAL.HEADER'),
            actionText: I18n.t('IP_WHITELIST.MODALS.DELETE_MODAL.ACTION_TEXT', { ip: item.ip }),
            submitButtonLabel: I18n.t('IP_WHITELIST.MODALS.DELETE_MODAL.DELETE'),
          })}
        />
      </If>

      <If condition={allowUpdateIp}>
        <EditButton
          className="IpWhitelistGrid__action-icon"
          onClick={() => updateDescriptionModal.show({ item, onSuccess: onRefetch })}
        />
      </If>
    </div>
  );

  return (
    <Table
      items={content}
      loading={loading}
      onMore={onFetchMore}
      hasMore={!last}
      stickyFromTop={123}
      onSort={onSort}
      onSelect={onSelect}
      withMultiSelect
    >
      <Column
        header={I18n.t('IP_WHITELIST.GRID.IP_ADDRESS')}
        render={renderIp}
      />

      <Column
        header={I18n.t('IP_WHITELIST.GRID.CREATED_AT')}
        render={renderCreatedAt}
        sortBy="createdAt"
      />

      <Column
        header={I18n.t('IP_WHITELIST.GRID.DESCRIPTION')}
        render={renderDescription}
        sortBy="description"
      />

      <Column
        header={I18n.t('IP_WHITELIST.GRID.ACTION')}
        render={renderActions}
      />
    </Table>
  );
};

export default compose(
  React.memo,
  withModals({
    updateDescriptionModal: WhiteListUpdateDescriptionModal,
    deleteModal: ConfirmActionModal,
  }),
)(IpWhitelistGrid);
