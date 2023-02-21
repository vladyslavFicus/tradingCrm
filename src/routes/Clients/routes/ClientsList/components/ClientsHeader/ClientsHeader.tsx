import React from 'react';
import { useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { QueryResult } from '@apollo/client';
import { State, TableSelection } from 'types';
import { FiltersTogglerButton } from 'components/FiltersToggler';
import Placeholder from 'components/Placeholder';
import ClientsBulkActions from '../ClientsBulkActions';
import { ClientsListQuery, ClientsListQueryVariables } from '../../graphql/__generated__/ClientsQuery';
import './ClientsHeader.scss';

type Props = {
  select: TableSelection | null,
  clientsQuery: QueryResult<ClientsListQuery>,
};

const ClientsHeader = (props: Props) => {
  const {
    select,
    clientsQuery: {
      data,
      loading,
    },
    clientsQuery,
  } = props;

  const { state } = useLocation<State<ClientsListQueryVariables>>();

  const totalElements = data?.profiles?.totalElements || 0;
  const searchLimit = state?.filters?.args?.searchLimit;

  const clientsListCount = (searchLimit && searchLimit < totalElements)
    ? searchLimit
    : totalElements;

  const selectedCount = select?.selected || 0;

  return (
    <div className="ClientsHeader">
      <div className="ClientsHeader__left">
        <Placeholder
          ready={!loading}
          rows={[{ width: 220, height: 20 }, { width: 220, height: 12 }]}
        >
          <Choose>
            <When condition={!!clientsListCount}>
              <div className="ClientsHeader__title">
                <b>{clientsListCount} </b> {I18n.t('COMMON.CLIENTS_FOUND')}
              </div>

              <div className="ClientsHeader__selected">
                <b>{selectedCount}</b> {I18n.t('COMMON.CLIENTS_SELECTED')}
              </div>
            </When>

            <Otherwise>
              <div className="ClientsHeader__title">
                {I18n.t('COMMON.CLIENTS')}
              </div>
            </Otherwise>
          </Choose>
        </Placeholder>
      </div>

      <div className="ClientsHeader__right">
        <If condition={!!totalElements && !!selectedCount}>
          <ClientsBulkActions
            select={select}
            selectedRowsLength={selectedCount}
            clientsQuery={clientsQuery}
          />
        </If>

        <FiltersTogglerButton className="ClientsHeader__filters-toggler-button" />
      </div>
    </div>
  );
};

export default React.memo(ClientsHeader);
