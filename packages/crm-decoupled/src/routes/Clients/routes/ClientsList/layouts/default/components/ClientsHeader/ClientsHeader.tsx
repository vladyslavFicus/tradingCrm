import React from 'react';
import I18n from 'i18n-js';
import { QueryResult } from '@apollo/client';
import { TableSelection } from 'types';
import { FiltersTogglerButton } from 'components/FiltersToggler';
import Placeholder from 'components/Placeholder';
import { UncontrolledTooltip } from 'components';
import { MAX_QUERY_CLIENTS } from 'routes/Clients/routes/ClientsList/constants';
import { ClientsListQuery } from 'routes/Clients/routes/ClientsList/graphql/__generated__/ClientsQuery';
import useClientsHeader from 'routes/Clients/routes/ClientsList/hooks/useClientsHeader';
import ClientsBulkActions from '../ClientsBulkActions';
import './ClientsHeader.scss';

type Props = {
  select: TableSelection | null,
  clientsQuery: QueryResult<ClientsListQuery>,
};

const ClientsHeader = (props: Props) => {
  const { select, clientsQuery } = props;

  const {
    loading,
    clientsListCount,
    clientsTotalCountLoading,
    clientsTotalCount,
    selectedCount,
    totalElements,
    handleGetClientsCount,
  } = useClientsHeader(props);

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
