import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import I18n from 'i18n-js';
import { State } from 'types';
import { useModal } from 'providers/ModalProvider';
import EventEmitter, { CLIENT_CALLBACK_RELOAD } from 'utils/EventEmitter';
import permissions from 'config/permissions';
import PermissionContent from 'components/PermissionContent';
import TabHeader from 'components/TabHeader';
import { Button } from 'components/Buttons';
import CreateClientCallbackModal, { CreateClientCallbackModalProps } from 'modals/CreateClientCallbackModal';
import ClientCallbacksGridFilter from './components/ClientCallbacksGridFilter';
import ClientCallbacksGrid from './components/ClientCallbacksGrid';
import {
  ClientCallbacksListQueryVariables,
  useClientCallbacksListQuery,
} from './graphql/__generated__/ClientCallbacksListQuery';
import './ClientCallbacksTab.scss';

const ClientCallbacksTab = () => {
  const { id: uuid } = useParams<{ id: string }>();

  const { state } = useLocation<State<ClientCallbacksListQueryVariables>>();

  const createClientCallbackModal = useModal<CreateClientCallbackModalProps>(CreateClientCallbackModal);

  // ===== Requests ===== //
  const clientCallbacksListQuery = useClientCallbacksListQuery({
    variables: {
      ...state?.filters as ClientCallbacksListQueryVariables,
      userId: uuid,
      limit: 20,
      page: 0,
    },
  });

  // ===== Handlers ===== //
  const handleOpenAddCallbackModal = () => {
    createClientCallbackModal.show({
      id: uuid,
    });
  };

  // ===== Effects ===== //
  useEffect(() => {
    EventEmitter.on(CLIENT_CALLBACK_RELOAD, clientCallbacksListQuery.refetch);

    return () => {
      EventEmitter.off(CLIENT_CALLBACK_RELOAD, clientCallbacksListQuery.refetch);
    };
  }, []);

  return (
    <div className="ClientCallbacksTab">
      <TabHeader
        title={I18n.t('CLIENT_PROFILE.TABS.CALLBACKS')}
        className="ClientCallbacksTab__header"
      >
        <PermissionContent permissions={permissions.USER_PROFILE.CREATE_CALLBACK}>
          <Button
            data-testid="addCallbackButton"
            small
            tertiary
            onClick={handleOpenAddCallbackModal}
          >
            {I18n.t('CLIENT_PROFILE.CALLBACKS.ADD_CALLBACK')}
          </Button>
        </PermissionContent>
      </TabHeader>

      <ClientCallbacksGridFilter onRefetch={clientCallbacksListQuery.refetch} />
      <ClientCallbacksGrid clientCallbacksListQuery={clientCallbacksListQuery} />
    </div>
  );
};

export default React.memo(ClientCallbacksTab);
