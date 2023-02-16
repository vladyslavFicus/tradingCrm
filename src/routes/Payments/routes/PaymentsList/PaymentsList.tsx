import React from 'react';
import I18n from 'i18n-js';
import { useLocation, useHistory } from 'react-router-dom';
import { cloneDeep, set, compact } from 'lodash';
import { State } from 'types';
import { Sort__Input as Sort } from '__generated__/types';
import Placeholder from 'components/Placeholder';
import PaymentsListFilters from 'components/PaymentsListFilters';
import PaymentsListGrid from 'components/PaymentsListGrid';
import { statusMapper, statuses } from 'constants/payment';
import { usePaymentsQuery, PaymentsQueryVariables } from './graphql/__generated__/PaymentsQuery';
import { usePartnersQuery } from './graphql/__generated__/PartnersQuery';
import './PaymentsList.scss';

const PaymentsList = () => {
  const { state } = useLocation<State<PaymentsQueryVariables['args']>>();

  const history = useHistory();

  // ===== Requests ===== //
  const paymentsQuery = usePaymentsQuery({
    variables: {
      args: {
        ...state?.filters ? state.filters : { accountType: 'LIVE' },
        statuses: state?.filters?.statuses
          ? compact(state?.filters?.statuses).map(item => statusMapper[item as statuses]).flat()
          : undefined,
        page: {
          from: 0,
          size: 20,
          sorts: state?.sorts,
        },
      },
    },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    context: { batch: false },
  });

  const { data: paymentsData, fetchMore, variables = {} } = paymentsQuery;
  const { content = [], totalElements = 0, last = false } = paymentsData?.payments || {};

  const partnersQuery = usePartnersQuery();
  const { data: partnersData, loading: partnersLoading } = partnersQuery;

  const partners = partnersData?.partners?.content || [];

  // ===== Handlers ===== //
  const handleRefetch = () => {
    paymentsQuery.refetch({
      args: {
        ...state?.filters,
        requestId: Math.random().toString(36).slice(2),
        page: {
          from: 0,
          size: 20,
          sorts: state?.sorts,
        },
      },
    });
  };

  const handleFetchMore = () => {
    const page = paymentsQuery?.data?.payments?.number || 0;

    fetchMore({
      variables: set(cloneDeep(variables), 'args.page.from', page + 1),
    });
  };

  const handleSort = (sorts: Array<Sort>) => {
    history.replace({
      state: {
        ...state,
        sorts,
      },
    });
  };

  return (
    <div className="PaymentList">
      <div className="PaymentList__header">
        <Placeholder
          ready={!paymentsQuery.loading}
          rows={[{ width: 220, height: 20 }]}
        >
          <Choose>
            <When condition={!!totalElements}>
              <span className="PaymentList__title">
                <strong>{totalElements} </strong>
                {I18n.t('COMMON.PAYMENTS')}
              </span>
            </When>

            <Otherwise>
              <span className="PaymentList__title">
                {I18n.t('COMMON.PAYMENTS')}
              </span>
            </Otherwise>
          </Choose>
        </Placeholder>
      </div>

      <PaymentsListFilters
        partners={partners}
        partnersLoading={partnersLoading}
        paymentsLoading={paymentsQuery.loading}
        onRefetch={handleRefetch}
      />

      <PaymentsListGrid
        items={content}
        loading={paymentsQuery.loading}
        onRefetch={handleRefetch}
        headerStickyFromTop={126}
        last={last}
        sorts={state?.sorts || []}
        onFetchMore={handleFetchMore}
        onSort={handleSort}
      />
    </div>
  );
};

export default React.memo(PaymentsList);
