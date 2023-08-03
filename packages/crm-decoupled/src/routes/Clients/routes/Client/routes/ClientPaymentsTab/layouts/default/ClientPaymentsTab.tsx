import React from 'react';
import I18n from 'i18n-js';
import { Button } from 'components/Buttons';
import PaymentsListFilters from 'components/PaymentsListFilters';
import PaymentsListGrid from 'components/PaymentsListGrid';
import TabHeader from 'components/TabHeader';
import useClientPaymentsTab from 'routes/Clients/routes/Client/routes/ClientPaymentsTab/hooks/useClientPaymentsTab';
import './ClientPaymentsTab.scss';

const ClientPaymentsTab = () => {
  const {
    allowCreateTransaction,
    paymentsLoading,
    content,
    last,
    sorts,
    handleOpenAddPaymentModal,
    handleRefetch,
    handleFetchMore,
    handleSort,
  } = useClientPaymentsTab();

  return (
    <div className="ClientPaymentsTab">
      <TabHeader
        title={I18n.t('CONSTANTS.TRANSACTIONS.ROUTES.PAYMENTS')}
        className="ClientPaymentsTab__header"
      >
        <If condition={allowCreateTransaction}>
          <Button
            data-testid="ClientPaymentsTab-addTransactionButton"
            onClick={handleOpenAddPaymentModal}
            tertiary
            small
          >
            {I18n.t('PLAYER_PROFILE.TRANSACTIONS.ADD_TRANSACTION')}
          </Button>
        </If>
      </TabHeader>

      <PaymentsListFilters
        paymentsLoading={paymentsLoading}
        onRefetch={handleRefetch}
        clientView
      />

      <PaymentsListGrid
        items={content}
        loading={paymentsLoading}
        onRefetch={handleRefetch}
        headerStickyFromTop={189}
        last={last}
        sorts={sorts}
        onFetchMore={handleFetchMore}
        onSort={handleSort}
        clientView
      />
    </div>
  );
};

export default React.memo(ClientPaymentsTab);
