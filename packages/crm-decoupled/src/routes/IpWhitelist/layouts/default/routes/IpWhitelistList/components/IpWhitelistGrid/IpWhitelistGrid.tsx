import React, { useCallback } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import { Types } from '@crm/common';
import { TrashButton, EditButton } from 'components';
import { IpWhitelistAddress } from '__generated__/types';
import { Table, Column } from 'components/Table';
import useIpWhitelistGrid from 'routes/IpWhitelist/hooks/useIpWhitelistGrid';
import './IpWhitelistGrid.scss';

type Props = {
  content: Array<IpWhitelistAddress>,
  loading: boolean,
  last: boolean,
  onRefetch: () => void,
  onFetchMore: () => void,
  onSort: (sorts: Types.Sorts) => void,
  onSelect: Function,
};

const IpWhitelistGrid = (props: Props) => {
  const {
    content,
    loading,
    last,
    onRefetch,
    onFetchMore,
    onSort,
    onSelect,
  } = props;

  const {
    confirmActionModal,
    allowUpdateIp,
    allowDeleteIp,
    updateIpWhiteListModal,
    handleDeleteIp,
  } = useIpWhitelistGrid({ onRefetch });

  // ===== Renderers ===== //
  const renderIp = useCallback((item: IpWhitelistAddress) => (
    <div className="IpWhitelistGrid__cell-primary">
      {item.ip}
    </div>
  ), []);

  const renderCreatedAt = useCallback((item: IpWhitelistAddress) => (
    <div className="IpWhitelistGrid__cell-primary">
      <div className="IpWhitelistGrid__cell-primary-date">
        {moment.utc(item.createdAt).local().format('DD.MM.YYYY')}
      </div>

      <div className="IpWhitelistGrid__cell-primary-time">
        {moment.utc(item.createdAt).local().format('HH:mm:ss')}
      </div>
    </div>
  ), []);

  const renderDescription = useCallback((item: IpWhitelistAddress) => (
    <div className="IpWhitelistGrid__cell-primary">
      {item.description}
    </div>
  ), []);

  const renderActions = useCallback((item: IpWhitelistAddress) => (
    <div className="IpWhitelistGrid__cell-primary">
      <If condition={allowDeleteIp}>
        <TrashButton
          className="IpWhitelistGrid__action-icon"
          data-testid="IpWhitelistGrid-trashButton"
          onClick={() => confirmActionModal.show({
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
          data-testid="IpWhitelistGrid-editButton"
          onClick={() => updateIpWhiteListModal.show({ item, onSuccess: onRefetch })}
        />
      </If>
    </div>
  ), [allowDeleteIp, allowUpdateIp]);

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

export default React.memo(IpWhitelistGrid);
