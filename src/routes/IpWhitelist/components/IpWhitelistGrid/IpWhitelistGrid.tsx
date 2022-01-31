import React from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import { useHistory, useLocation } from 'react-router-dom';
import { MutationOptions, MutationResult } from 'react-apollo';
import compose from 'compose-function';
import { withRequests } from 'apollo';
import { withModals, withNotifications } from 'hoc';
import { LevelType, Modal, Notify, Sort, State } from 'types';
import permissions from 'config/permissions';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { Table, Column } from 'components/Table';
import Tabs from 'components/Tabs';
import PermissionContent from 'components/PermissionContent';
import WhiteListUpdateDescriptionModal from 'modals/WhiteListUpdateDescriptionModal';
import WhiteListAddIpModal from 'modals/WhiteListAddIpModal';
import { ipWhitelistTabs } from '../../constants';
import IpWhitelistDeleteIpMutation from './graphql/IpWhitelistDeleteMutation';
import IpWhitelistQuery from './graphql/IpWhitelistQuery';
import IpWhitelistFilter from './components/IpWhitelistFilter';
import {
  WitelististSearchQueryResult,
  IpWhitelistAddress,
  IpWhitelistFilters,
} from './types';
import './IpWhitelistGrid.scss';

interface Props {
  ipWhitelistQuery: WitelististSearchQueryResult,
  notify: Notify,
  modals: {
    addAddressModal: Modal<{
      onSuccess: () => void
    }>,
    updateDescriptionModal: Modal<{
      item: IpWhitelistAddress,
      onSuccess: () => void
    }>,
    deleteModal: Modal<{
      onSubmit: (item: IpWhitelistAddress) => void,
      modalTitle: string,
      actionText: string,
      submitButtonLabel: string,
    }>,
  },
  deleteIpMutation: (options: MutationOptions) => MutationResult<Boolean>
}

const IpWhitelistGrid = (props: Props) => {
  const { ipWhitelistQuery, notify, modals, deleteIpMutation } = props;
  const { updateDescriptionModal, deleteModal, addAddressModal } = modals;
  const { ipWhitelistSearch = { content: [], last: true, totalElements: 0, number: 0 } } = ipWhitelistQuery.data || {};
  const { content, last, totalElements } = ipWhitelistSearch;
  const { state } = useLocation<State<IpWhitelistFilters>>();
  const history = useHistory();

  const handleDeleteIp = ({ uuid, ip }: IpWhitelistAddress) => async () => {
    try {
      await deleteIpMutation({ variables: { uuid } });
      deleteModal.hide();
      ipWhitelistQuery.refetch();
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

  const descriptionColumnRender = (item: IpWhitelistAddress) => (
    <div className="IpWhitelistGrid__cell-primary">
      {item.description}
    </div>
  );

  const createdAtColumnRender = (item: IpWhitelistAddress) => (
    <div className="IpWhitelistGrid__cell-primary">
      <div className="IpWhitelistGrid__cell-primary-date">
        {moment.utc(item.createdAt).local().format('DD.MM.YYYY')}
      </div>
      <div className="IpWhitelistGrid__cell-primary-time">
        {moment.utc(item.createdAt).local().format('HH:mm:ss')}
      </div>
    </div>
  );

  const addressColumnRender = (item: IpWhitelistAddress) => (
    <div className="IpWhitelistGrid__cell-primary">
      {item.ip}
    </div>
  );

  const actionsColumnRender = (item: IpWhitelistAddress) => (
    <div className="IpWhitelistGrid__cell-primary">
      <PermissionContent permissions={permissions.IP_WHITELIST.DELETE_IP_ADDRESS}>

        <i
          onClick={() => deleteModal.show({
            onSubmit: handleDeleteIp(item),
            modalTitle: I18n.t('IP_WHITELIST.MODALS.DELETE_MODAL.HEADER'),
            actionText: I18n.t('IP_WHITELIST.MODALS.DELETE_MODAL.ACTION_TEXT', { ip: item.ip }),
            submitButtonLabel: I18n.t('IP_WHITELIST.MODALS.DELETE_MODAL.DELETE'),
          })}
          className="IpWhitelistGrid__action-icon fa fa-trash color-danger"
        />

      </PermissionContent>
      <PermissionContent permissions={permissions.IP_WHITELIST.EDIT_IP_ADDRESS_DESCRIPTION}>
        <i
          onClick={() => updateDescriptionModal.show({ item, onSuccess: ipWhitelistQuery.refetch })}
          className="IpWhitelistGrid__action-icon fa fa-edit"
        />
      </PermissionContent>
    </div>
  );

  const handleSort = (sorts: Sort[]) => {
    history.replace({
      state: {
        ...state,
        sorts,
      },
    });
  };

  const handlePageChanged = () => {
    const { number = 0 } = ipWhitelistSearch;
    const { loadMore, variables } = ipWhitelistQuery;
    const filters = state?.filters || {};
    const size = variables?.args?.page?.size;
    const sorts = state?.sorts;

    loadMore({
      args: {
        ...filters,
        page: {
          from: number + 1,
          size,
          sorts,
        },
      },
    });
  };

  return (
    <div className="IpWhitelistGrid">
      <Tabs items={ipWhitelistTabs} className="IpWhitelistGrid__tabs" />
      <div className="IpWhitelistGrid__card">
        <div className="IpWhitelistGrid__headline">
          <strong>{totalElements} </strong>
          {I18n.t('IP_WHITELIST.GRID.HEADLINE')}
        </div>
        <PermissionContent permissions={permissions.IP_WHITELIST.ADD_IP_ADDRESS}>
          <button
            className="IpWhitelistGrid__header-button"
            onClick={() => addAddressModal.show({ onSuccess: ipWhitelistQuery.refetch })}
            type="button"
          >
            {I18n.t('IP_WHITELIST.GRID.ADD_IP')}
          </button>
        </PermissionContent>
      </div>
      <IpWhitelistFilter refetch={ipWhitelistQuery.refetch} />
      <Table
        items={content}
        loading={ipWhitelistQuery.loading}
        onMore={handlePageChanged}
        hasMore={!last}
        stickyFromTop={123}
        onSort={handleSort}
      >
        <Column
          header={I18n.t('IP_WHITELIST.GRID.IP_ADDRESS')}
          render={addressColumnRender}
        />
        <Column
          header={I18n.t('IP_WHITELIST.GRID.CREATED_AT')}
          render={createdAtColumnRender}
          sortBy="createdAt"
        />
        <Column
          header={I18n.t('IP_WHITELIST.GRID.DESCRIPTION')}
          render={descriptionColumnRender}
          sortBy="description"
        />
        <Column
          header={I18n.t('IP_WHITELIST.GRID.ACTION')}
          render={actionsColumnRender}
        />
      </Table>
    </div>
  );
};

export default compose<React.ComponentType<Props>>(
  withNotifications,
  withModals({
    deleteModal: ConfirmActionModal,
    updateDescriptionModal: WhiteListUpdateDescriptionModal,
    addAddressModal: WhiteListAddIpModal,
  }),
  withRequests({
    ipWhitelistQuery: IpWhitelistQuery,
    deleteIpMutation: IpWhitelistDeleteIpMutation,
  }),
)(IpWhitelistGrid);
