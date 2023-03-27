import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { cloneDeep, set, compact } from 'lodash';
import { State } from 'types';
import { Sort__Input as Sort } from '__generated__/types';
import { statusMapper, statuses } from 'constants/payment';
import PaymentsListFilters from 'components/PaymentsListFilters';
import PaymentsListGrid from 'components/PaymentsListGrid';
import PaymentsHeader from './components/PaymentsHeader';
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

  const { data: paymentsData, fetchMore, variables = {}, refetch, loading: paymentsLoading } = paymentsQuery;
  const { content = [], totalElements = 0, last = false } = paymentsData?.payments || {};

  const partnersQuery = usePartnersQuery();
  const { data: partnersData, loading: partnersLoading } = partnersQuery;

  const partners = partnersData?.partners?.content || [];

  // ===== Handlers ===== //
  const handleRefetch = () => {
    refetch({
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
      <PaymentsHeader
        totalElements={totalElements}
        partnersLoading={partnersLoading}
        paymentsQuery={paymentsQuery}
      />

      <PaymentsListFilters
        partners={partners}
        partnersLoading={partnersLoading}
        paymentsLoading={paymentsLoading}
        onRefetch={refetch}
      />

      <PaymentsListGrid
        items={content}
        loading={paymentsLoading}
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
