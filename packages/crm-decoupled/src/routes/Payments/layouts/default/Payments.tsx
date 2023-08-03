import React from 'react';
import PaymentsFilters from 'components/PaymentsListFilters';
import PaymentsGrid from 'components/PaymentsListGrid';
import usePayments from 'routes/Payments/hooks/usePayments';
import PaymentsHeader from './components/PaymentsHeader';
import './Payments.scss';

const Payments = () => {
  const {
    state,
    totalElements,
    partners,
    partnersLoading,
    paymentsQuery,
    paymentsLoading,
    content,
    last,
    refetch,
    handleRefetch,
    handleFetchMore,
    handleSort,
  } = usePayments();

  return (
    <div className="Payments">
      <PaymentsHeader
        totalElements={totalElements}
        partnersLoading={partnersLoading}
        paymentsQuery={paymentsQuery}
      />

      <PaymentsFilters
        partners={partners}
        partnersLoading={partnersLoading}
        paymentsLoading={paymentsLoading}
        onRefetch={refetch}
      />

      <PaymentsGrid
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

export default React.memo(Payments);
