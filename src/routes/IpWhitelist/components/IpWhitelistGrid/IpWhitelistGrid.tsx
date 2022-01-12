import React from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import { useHistory, useLocation } from 'react-router-dom';
import compose from 'compose-function';
import { withRequests } from 'apollo';
import { State, Sort } from 'types';
import { Table, Column } from 'components/Table';
import Tabs from 'components/Tabs';
import { Button } from 'components/UI';
import PermissionContent from 'components/PermissionContent';
import permissions from 'config/permissions';
import IpWhitelistQuery from './graphql/IpWhitelistQuery';
import IpWhitelistFilter from './components/IpWhitelistFilter';
import { WitelististSearchQueryResult, IpWitelistAddress, IpWhitelistFilters } from './types';
import { ipWhitelistTabs } from '../../constants';
import './IpWhitelistGrid.scss';

interface Props {
  ipWhitelistQuery: WitelististSearchQueryResult,
}

const DescriptionColumnRender = ({ description }: IpWitelistAddress) => (
  <div className="IpWhitelistGrid__cell-primary">
    {description}
  </div>
);

const CreatedAtColumnRender = ({ createdAt }: IpWitelistAddress) => (
  <div className="IpWhitelistGrid__cell-primary">
    <div className="IpWhitelistGrid__cell-primary-date">{moment.utc(createdAt).local().format('DD.MM.YYYY')}</div>
    <div className="IpWhitelistGrid__cell-primary-time">
      {moment.utc(createdAt).local().format('HH:mm:ss')}
    </div>
  </div>
);

const AddressColumnRender = ({ ip }: IpWitelistAddress) => (
  <div className="IpWhitelistGrid__cell-primary">
    {ip}
  </div>
);

const ActionsColumn = ({ item }: { item: IpWitelistAddress }) => (
  <div className="IpWhitelistGrid__cell-primary">
    <PermissionContent permissions={permissions.IP_WHITELIST.DELETE_IP_ADDRESS}>
      <Button
        transparent
      >
        <i
          onClick={() => console.log('not implemented yet', item)}
          className="IpWhitelistGrid__action-icon fa fa-trash color-danger"
        />
      </Button>
    </PermissionContent>
    <PermissionContent permissions={permissions.IP_WHITELIST.EDIT_IP_ADDRESS_DESCRIPTION}>
      <Button
        transparent
      >
        <i
          onClick={() => console.log('not implemented yet', item)}
          className="IpWhitelistGrid__action-icon fa fa-edit"
        />
      </Button>
    </PermissionContent>
  </div>
);

const IpWhitelistGrid = ({ ipWhitelistQuery }: Props) => {
  const { ipWhitelistSearch = { content: [], last: true, totalElements: 0, number: 0 } } = ipWhitelistQuery.data || {};
  const { content, last, totalElements } = ipWhitelistSearch;
  const { state } = useLocation<State<IpWhitelistFilters>>();
  const history = useHistory();

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
    const { loadMore, variables: { args: { page: { size } } } } = ipWhitelistQuery;
    const { sorts = [], filters = {} } = state;

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
            onClick={() => console.log('not implemented yet')}
            type="button"
          >
            {I18n.t('IP_WHITELIST.GRID.ADD_IP')}
          </button>
        </PermissionContent>
      </div>

      <IpWhitelistFilter refetch={ipWhitelistQuery.refetch} />

      <div className="IpWhitelistGrid">
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
            render={AddressColumnRender}
          />
          <Column
            header={I18n.t('IP_WHITELIST.GRID.CREATED_AT')}
            render={CreatedAtColumnRender}
            sortBy="createdAt"
          />
          <Column
            header={I18n.t('IP_WHITELIST.GRID.DESCRIPTION')}
            render={DescriptionColumnRender}
            sortBy="description"
          />
          <Column
            header={I18n.t('IP_WHITELIST.GRID.ACTION')}
            render={ActionsColumn}
          />
        </Table>
      </div>
    </div>
  );
};

export default compose<React.ComponentType<Props>>(
  withRequests({
    ipWhitelistQuery: IpWhitelistQuery,
  }),
)(IpWhitelistGrid);
