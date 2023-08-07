import React from 'react';
import I18n from 'i18n-js';
import { Button } from 'components';
import TabHeader from 'components/TabHeader';
import useClientCallbacksTab from 'routes/Clients/routes/Client/routes/ClientCallbacksTab/hooks/useClientCallbacksTab';
import ClientCallbacksGridFilter from './components/ClientCallbacksGridFilter';
import ClientCallbacksGrid from './components/ClientCallbacksGrid';
import './ClientCallbacksTab.scss';

const ClientCallbacksTab = () => {
  const {
    clientCallbacksListQuery,
    sorts,
    handleSort,
    handleOpenAddCallbackModal,
    allowCreateCallback,
  } = useClientCallbacksTab();

  return (
    <div className="ClientCallbacksTab">
      <TabHeader
        title={I18n.t('CLIENT_PROFILE.TABS.CALLBACKS')}
        className="ClientCallbacksTab__header"
      >
        <If condition={allowCreateCallback}>
          <Button
            data-testid="ClientCallbacksTab-addCallbackButton"
            small
            tertiary
            onClick={handleOpenAddCallbackModal}
          >
            {I18n.t('CLIENT_PROFILE.CALLBACKS.ADD_CALLBACK')}
          </Button>
        </If>
      </TabHeader>

      <ClientCallbacksGridFilter onRefetch={clientCallbacksListQuery.refetch} />

      <ClientCallbacksGrid
        sorts={sorts}
        onSort={handleSort}
        clientCallbacksListQuery={clientCallbacksListQuery}
      />
    </div>
  );
};

export default React.memo(ClientCallbacksTab);
