import React from 'react';
import I18n from 'i18n-js';
import TabHeader from 'components/TabHeader';
import { Button } from 'components';
import useLeadCallbacksTab from 'routes/Leads/routes/Lead/hooks/useLeadCallbacksTab';
import LeadCallbacksGridFilter from './components/LeadCallbacksGridFilter';
import LeadCallbacksGrid from './components/LeadCallbacksGrid';
import './LeadCallbacksTab.scss';

const LeadCallbacksTab = () => {
  const {
    state,
    leadCallbacksListQuery,
    handleOpenAddCallbackModal,
    handleSort,
    allowCreateCallback,
  } = useLeadCallbacksTab();

  return (
    <div className="LeadCallbacksTab">
      <TabHeader
        title={I18n.t('LEAD_PROFILE.TABS.CALLBACKS')}
        className="LeadCallbacksTab__header"
      >
        <If condition={allowCreateCallback}>
          <Button
            data-testid="LeadCallbacksTab-addCallbackButton"
            small
            tertiary
            onClick={handleOpenAddCallbackModal}
          >
            {I18n.t('LEAD_PROFILE.CALLBACKS.ADD_CALLBACK')}
          </Button>
        </If>
      </TabHeader>

      <LeadCallbacksGridFilter onRefetch={leadCallbacksListQuery.refetch} />

      <LeadCallbacksGrid
        sorts={state?.sorts || []}
        onSort={handleSort}
        leadCallbacksListQuery={leadCallbacksListQuery}
      />
    </div>
  );
};

export default React.memo(LeadCallbacksTab);
