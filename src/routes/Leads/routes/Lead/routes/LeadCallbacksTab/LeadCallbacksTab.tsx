import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import I18n from 'i18n-js';
import { State } from 'types';
import EventEmitter, { LEAD_CALLBACK_RELOAD } from 'utils/EventEmitter';
import permissions from 'config/permissions';
import { useModal } from 'providers/ModalProvider';
import PermissionContent from 'components/PermissionContent';
import TabHeader from 'components/TabHeader';
import { Button } from 'components/Buttons';
import CreateLeadCallbackModal, { CreateLeadCallbackModalProps } from 'modals/CreateLeadCallbackModal';
import LeadCallbacksGridFilter from './components/LeadCallbacksGridFilter';
import LeadCallbacksGrid from './components/LeadCallbacksGrid';
import {
  LeadCallbacksListQueryVariables,
  useLeadCallbacksListQuery,
} from './graphql/__generated__/LeadCallbacksListQuery';
import './LeadCallbacksTab.scss';

const LeadCallbacksTab = () => {
  const { id: uuid } = useParams<{ id: string }>();

  const { state } = useLocation<State<LeadCallbacksListQueryVariables>>();

  // ===== Modals ===== //
  const createLeadCallbackModal = useModal<CreateLeadCallbackModalProps>(CreateLeadCallbackModal);

  // ===== Requests ===== //
  const leadCallbacksListQuery = useLeadCallbacksListQuery({
    variables: {
      ...state?.filters as LeadCallbacksListQueryVariables,
      userId: uuid,
      limit: 20,
      page: 0,
    },
  });

  // ===== Handlers ===== //
  const handleOpenAddCallbackModal = () => {
    createLeadCallbackModal.show({
      userId: uuid,
    });
  };

  // ===== Effects ===== //
  useEffect(() => {
    EventEmitter.on(LEAD_CALLBACK_RELOAD, leadCallbacksListQuery.refetch);

    return () => {
      EventEmitter.off(LEAD_CALLBACK_RELOAD, leadCallbacksListQuery.refetch);
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

      <LeadCallbacksGridFilter onRefetch={leadCallbacksListQuery.refetch} />
      <LeadCallbacksGrid leadCallbacksListQuery={leadCallbacksListQuery} />
    </div>
  );
};

export default React.memo(LeadCallbacksTab);
