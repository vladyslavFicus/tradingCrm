import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withModals } from 'hoc';
import { Modal, State } from 'types';
import EventEmitter, { CLIENT_CALLBACK_CREATED } from 'utils/EventEmitter';
import permissions from 'config/permissions';
import PermissionContent from 'components/PermissionContent';
import TabHeader from 'components/TabHeader';
import { Button } from 'components/UI';
import CreateClientCallbackModal from 'modals/CreateClientCallbackModal';
import ClientCallbacksGridFilter from './components/ClientCallbacksGridFilter';
import ClientCallbacksGrid from './components/ClientCallbacksGrid';
import { ClientCallbacksQueryVariables, useClientCallbacksQuery } from './graphql/__generated__/ClientCallbacksQuery';
import './ClientCallbacksTab.scss';

type Props = {
  modals: {
    createClientCallbackModal: Modal,
  },
};

const ClientCallbacksTab = (props: Props) => {
  const { modals: { createClientCallbackModal } } = props;
  const { id: uuid } = useParams<{ id: string }>();

  const { state } = useLocation<State<ClientCallbacksQueryVariables>>();

  const clientCallbacksQuery = useClientCallbacksQuery({
    variables: {
      ...state?.filters as ClientCallbacksQueryVariables,
      userId: uuid,
      limit: 20,
      page: 0,
    },
  });

  const handleOpenAddCallbackModal = () => {
    createClientCallbackModal.show();
  };

  useEffect(() => {
    EventEmitter.on(CLIENT_CALLBACK_CREATED, clientCallbacksQuery.refetch);

    return () => {
      EventEmitter.off(CLIENT_CALLBACK_CREATED, clientCallbacksQuery.refetch);
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

      <ClientCallbacksGridFilter handleRefetch={clientCallbacksQuery.refetch} />
      <ClientCallbacksGrid clientCallbacksQuery={clientCallbacksQuery} />
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    createClientCallbackModal: CreateClientCallbackModal,
  }),
)(ClientCallbacksTab);
