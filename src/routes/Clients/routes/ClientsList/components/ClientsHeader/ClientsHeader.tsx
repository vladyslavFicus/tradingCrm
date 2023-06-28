import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { QueryResult, NetworkStatus } from '@apollo/client';
import { State, TableSelection } from 'types';
import { FiltersTogglerButton } from 'components/FiltersToggler';
import Placeholder from 'components/Placeholder';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import ClientsBulkActions from '../ClientsBulkActions';
import { MAX_QUERY_CLIENTS } from '../../constants';
import { ClientsListQuery, ClientsListQueryVariables } from '../../graphql/__generated__/ClientsQuery';
import { useClientsCountQueryLazyQuery } from './graphql/__generated__/ClientsCountQuery';
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
      variables,
    },
    clientsQuery,
  } = props;

  const { state } = useLocation<State<ClientsListQueryVariables['args']>>();

  const [clientsTotalCount, setClientsTotalCount] = useState<number | null>(null);
  const [clientsTotalCountLoading, setClientsTotalCountLoading] = useState(false);

  const totalElements = data?.profiles?.totalElements || 0;
  const searchLimit = state?.filters?.searchLimit;

  const clientsListCount = (searchLimit && searchLimit < totalElements)
    ? searchLimit
    : totalElements;

  const selectedCount = select?.selected || 0;

  // ===== Requests ===== //
  const [clientsCountQuery] = useClientsCountQueryLazyQuery({
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
    context: { batch: false },
  });

  // ===== Handlers ===== //
  const handleClearClientsCount = () => {
    setClientsTotalCount(null);
  };

  const handleGetClientsCount = async () => {
    setClientsTotalCountLoading(true);

    try {
      const { data: clientsCountData } = await clientsCountQuery({
        variables: variables as ClientsListQueryVariables,
      });

      if (clientsCountData?.profilesCount) {
        setClientsTotalCount(clientsCountData.profilesCount);
      }
    } catch (e) {
      // Do nothing...
    }

    setClientsTotalCountLoading(false);
  };

  useEffect(() => {
    if (clientsQuery.networkStatus === NetworkStatus.setVariables) {
      handleClearClientsCount();
    }
  }, [clientsQuery.networkStatus]);

  return (
    <div className="ClientsHeader">
      <div className="ClientsHeader__left">
        <Placeholder
          ready={!loading}
          rows={[{ width: 220, height: 20 }, { width: 220, height: 12 }]}
        >
          <Choose>
            <When condition={!!clientsListCount}>
              <Choose>
                <When condition={clientsListCount === MAX_QUERY_CLIENTS && !clientsTotalCount}>
                  <div className="ClientsHeader__title ClientsHeader__title--total-count">
                    <Placeholder
                      ready={!clientsTotalCountLoading}
                      rows={[{ width: 75, height: 20 }]}
                    >
                      <span
                        id="clientsTotalCount"
                        className="ClientsHeader__active-text"
                        onClick={handleGetClientsCount}
                      >
                        {`${clientsListCount} +`}
                      </span>
                    </Placeholder>

                    <If condition={!clientsTotalCountLoading}>
                      <UncontrolledTooltip
                        placement="bottom-start"
                        target="clientsTotalCount"
                        delay={{ show: 350, hide: 250 }}
                        fade={false}
                      >
                        {I18n.t('CLIENTS.TOTAL_COUNT_TOOLTIP')}
                      </UncontrolledTooltip>
                    </If>

                    &nbsp;{I18n.t('COMMON.CLIENTS_FOUND')}
                  </div>
                </When>

                <When condition={clientsListCount === MAX_QUERY_CLIENTS && !!clientsTotalCount}>
                  <div className="ClientsHeader__title">
                    <b>{clientsTotalCount} </b> {I18n.t('COMMON.CLIENTS_FOUND')}
                  </div>
                </When>

                <Otherwise>
                  <div className="ClientsHeader__title">
                    <b>{clientsListCount} </b> {I18n.t('COMMON.CLIENTS_FOUND')}
                  </div>
                </Otherwise>
              </Choose>

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

        <FiltersTogglerButton
          className="ClientsHeader__filters-toggler-button"
          data-testid="ClientsHeader-filtersTogglerButton"
        />
      </div>
    </div>
  );
};

export default React.memo(ClientsHeader);
