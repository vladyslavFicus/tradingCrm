import React, { useMemo, useState } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import { useHistory, useLocation } from 'react-router-dom';
import compose from 'compose-function';
import { withModals } from 'hoc';
import { Modal, Sort, State, TableSelection } from 'types';
import { notify, LevelType } from 'providers/NotificationProvider';
import permissions from 'config/permissions';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { Table, Column } from 'components/Table';
import { Button, TrashButton, EditButton } from 'components/UI';
import Tabs from 'components/Tabs';
import PermissionContent from 'components/PermissionContent';
import WhiteListUpdateDescriptionModal from 'modals/WhiteListUpdateDescriptionModal';
import WhiteListAddIpModal from 'modals/WhiteListAddIpModal';
import { ipWhitelistTabs } from '../../constants';
import { useDeleteIpMutation } from './graphql/__generated__/IpWhitelistDeleteMutation';
import { useDeleteManyIpMutation } from './graphql/__generated__/IpWhitelistDeleteManyMutations';
import {
  useIpWhitelistSearchQuery,
  IpWhitelistSearchQuery,
  IpWhitelistSearchQueryVariables,
} from './graphql/__generated__/IpWhitelistQuery';
import IpWhitelistFilter from './components/IpWhitelistFilter';
import './IpWhitelistGrid.scss';

type IpWhitelistAddress = ExtractApolloTypeFromPageable<IpWhitelistSearchQuery['ipWhitelistSearch']>;

type Props = {
  modals: {
    addAddressModal: Modal<{
      onSuccess: () => void,
    }>,
    updateDescriptionModal: Modal<{
      item: IpWhitelistAddress,
      onSuccess: () => void,
    }>,
    deleteModal: Modal<{
      onSubmit: (item: IpWhitelistAddress) => void,
      modalTitle: string,
      actionText: string,
      submitButtonLabel: string,
    }>,
  },
};

const IpWhitelistGrid = (props: Props) => {
  const { modals } = props;
  const { state } = useLocation<State<IpWhitelistSearchQueryVariables['args']>>();
  const [deleteManyIpMutation] = useDeleteManyIpMutation();
  const [deleteIpMutation] = useDeleteIpMutation();
  const ipWhitelistQuery = useIpWhitelistSearchQuery({
    variables: {
      args: {
        ...state?.filters,
        page: {
          from: 0,
          size: 20,
          sorts: state?.sorts,
        },
      },
    },
  });
  const { updateDescriptionModal, deleteModal, addAddressModal } = modals;
  const { ipWhitelistSearch = { content: [], last: true, totalElements: 0, number: 0 } } = ipWhitelistQuery.data || {};
  const { content = [], last = true, totalElements } = ipWhitelistQuery.data?.ipWhitelistSearch || {};
  const history = useHistory();
  const [selected, setSelected] = useState<TableSelection | null>(null);

  const getIpsListFromSelectedItems = ({ all, touched }: TableSelection) => (
    all ? content : touched.map(idx => content[idx])
  );

  const getFieldsFromSelected = useMemo(
    () => (fieldName: 'ip' | 'uuid') => (
      selected ? getIpsListFromSelectedItems(selected).map(item => item[fieldName]) : []
    ),
    [selected],
  );


  const handleDeleteManyIps = async () => {
    try {
      await deleteManyIpMutation({
        variables: { uuids: getFieldsFromSelected('uuid') },
      });

      selected?.reset();
      ipWhitelistQuery.refetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('IP_WHITELIST.MODALS.DELETE_MANY_MODAL.NOTIFICATIONS.IP_DELETED',
          { ips: getFieldsFromSelected('ip').join(', ') }),
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
        <TrashButton
          className="IpWhitelistGrid__action-icon"
          onClick={() => deleteModal.show({
            onSubmit: handleDeleteIp(item),
            modalTitle: I18n.t('IP_WHITELIST.MODALS.DELETE_MODAL.HEADER'),
            actionText: I18n.t('IP_WHITELIST.MODALS.DELETE_MODAL.ACTION_TEXT', { ip: item.ip }),
            submitButtonLabel: I18n.t('IP_WHITELIST.MODALS.DELETE_MODAL.DELETE'),
          })}
        />
      </PermissionContent>
      <PermissionContent permissions={permissions.IP_WHITELIST.EDIT_IP_ADDRESS_DESCRIPTION}>
        <EditButton
          className="IpWhitelistGrid__action-icon"
          onClick={() => updateDescriptionModal.show({ item, onSuccess: ipWhitelistQuery.refetch })}
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
    const { fetchMore, variables } = ipWhitelistQuery;
    const filters = state?.filters || {};
    const size = variables?.args?.page?.size;
    const sorts = state?.sorts;

    fetchMore({
      variables: {
        args: {
          ...filters,
          page: {
            from: number + 1,
            size,
            sorts,
          },
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
          <div className="IpWhitelistGrid__buttons-container">
            <Button
              secondary
              className="IpWhitelistGrid__header-button"
              onClick={() => addAddressModal.show({ onSuccess: ipWhitelistQuery.refetch })}
              type="button"
            >
              {I18n.t('IP_WHITELIST.GRID.ADD_IP')}
            </Button>
            <If condition={!!selected?.selected}>
              <Button
                danger
                className="IpWhitelistGrid__header-button"
                onClick={() => deleteModal.show({
                  onSubmit: handleDeleteManyIps,
                  modalTitle: I18n.t('IP_WHITELIST.MODALS.DELETE_MANY_MODAL.HEADER'),
                  actionText: I18n.t('IP_WHITELIST.MODALS.DELETE_MANY_MODAL.ACTION_TEXT',
                    {
                      ips: getFieldsFromSelected('ip').join(', '),
                    }),
                  submitButtonLabel: I18n.t('IP_WHITELIST.MODALS.DELETE_MODAL.DELETE'),
                })}
                type="button"
              >
                {I18n.t('IP_WHITELIST.GRID.DELETE_IPS')}
              </Button>
            </If>
          </div>
        </PermissionContent>
      </div>
      <IpWhitelistFilter onRefetch={ipWhitelistQuery.refetch} />
      <Table
        items={content}
        loading={ipWhitelistQuery.loading}
        onMore={handlePageChanged}
        hasMore={!last}
        stickyFromTop={123}
        onSort={handleSort}
        onSelect={setSelected}
        withMultiSelect
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

export default compose(
  withModals({
    deleteModal: ConfirmActionModal,
    updateDescriptionModal: WhiteListUpdateDescriptionModal,
    addAddressModal: WhiteListAddIpModal,
  }),
)(IpWhitelistGrid);
