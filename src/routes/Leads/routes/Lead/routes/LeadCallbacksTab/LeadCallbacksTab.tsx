import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withModals } from 'hoc';
import { Modal, State } from 'types';
import EventEmitter, { LEAD_CALLBACK_CREATED } from 'utils/EventEmitter';
import permissions from 'config/permissions';
import PermissionContent from 'components/PermissionContent';
import TabHeader from 'components/TabHeader';
import { Button } from 'components/UI';
import CreateLeadCallbackModal from 'modals/CreateLeadCallbackModal';
import LeadCallbacksGridFilter from './components/LeadCallbacksGridFilter';
import LeadCallbacksGrid from './components/LeadCallbacksGrid';
import { LeadCallbacksQueryVariables, useLeadCallbacksQuery } from './graphql/__generated__/LeadCallbacksQuery';
import './LeadCallbacksTab.scss';

type Props = {
  modals: {
    createLeadCallbackModal: Modal,
  },
};

const LeadCallbacksTab = (props: Props) => {
  const { modals: { createLeadCallbackModal } } = props;
  const { id: uuid } = useParams<{ id: string }>();

  const { state } = useLocation<State<LeadCallbacksQueryVariables>>();

  const leadCallbacksQuery = useLeadCallbacksQuery({
    variables: {
      ...state?.filters as LeadCallbacksQueryVariables,
      userId: uuid,
      limit: 20,
      page: 0,
    },
  });

  const handleOpenAddCallbackModal = () => {
    createLeadCallbackModal.show();
  };

  useEffect(() => {
    EventEmitter.on(LEAD_CALLBACK_CREATED, leadCallbacksQuery.refetch);

    return () => {
      EventEmitter.off(LEAD_CALLBACK_CREATED, leadCallbacksQuery.refetch);
    };
  }, []);

  return (
    <div className="LeadCallbacksTab">
      <TabHeader
        title={I18n.t('LEAD_PROFILE.TABS.CALLBACKS')}
        className="LeadCallbacksTab__header"
      >
        <PermissionContent permissions={permissions.LEAD_PROFILE.CREATE_CALLBACK}>
          <Button
            data-testid="addCallbackButton"
            small
            tertiary
            onClick={handleOpenAddCallbackModal}
          >
            {I18n.t('LEAD_PROFILE.CALLBACKS.ADD_CALLBACK')}
          </Button>
        </PermissionContent>
      </TabHeader>

      <LeadCallbacksGridFilter handleRefetch={leadCallbacksQuery.refetch} />
      <LeadCallbacksGrid leadCallbacksQuery={leadCallbacksQuery} />
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    createLeadCallbackModal: CreateLeadCallbackModal,
  }),
)(LeadCallbacksTab);
