import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Config } from '@crm/common';
import { Sort__Input as Sort } from '__generated__/types';
import { State } from 'types';
import { useModal } from 'providers/ModalProvider';
import { usePermission } from 'providers/PermissionsProvider';
import EventEmitter, { CREATE_CLIENT_CALLBACK } from 'utils/EventEmitter';
import CreateClientCallbackModal, { CreateClientCallbackModalProps } from 'modals/CreateClientCallbackModal';
import {
  ClientCallbacksListQueryVariables,
  useClientCallbacksListQuery,
} from 'routes/Clients/routes/Client/routes/ClientCallbacksTab/graphql/__generated__/ClientCallbacksListQuery';

const useClientCallbacksTab = () => {
  const uuid = useParams().id as string;

  const state = useLocation().state as State<ClientCallbacksListQueryVariables>;

  const navigate = useNavigate();

  const createClientCallbackModal = useModal<CreateClientCallbackModalProps>(CreateClientCallbackModal);

  const permission = usePermission();
  const allowCreateCallback = permission.allows(Config.permissions.USER_PROFILE.CREATE_CALLBACK);

  // ===== Requests ===== //
  const clientCallbacksListQuery = useClientCallbacksListQuery({
    variables: {
      ...state?.filters as ClientCallbacksListQueryVariables,
      userId: uuid,
      page: {
        from: 0,
        size: 20,
        sorts: state?.sorts,
      },
    },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    context: { batch: false },
  });

  const { refetch } = clientCallbacksListQuery;

  // ===== Effects ===== //
  useEffect(() => {
    EventEmitter.on(CREATE_CLIENT_CALLBACK, refetch);

    return () => {
      EventEmitter.off(CREATE_CLIENT_CALLBACK, refetch);
    };
  }, []);

  // ===== Handlers ===== //
  // TODO there is a problem with NotePopover
  const handleOpenAddCallbackModal = useCallback(() => {
    createClientCallbackModal.show({
      userId: uuid,
      onSuccess: refetch,
    });
  }, [createClientCallbackModal, uuid, refetch]);

  const handleSort = useCallback((sorts: Array<Sort>) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        sorts,
      },
    });
  }, [navigate, state]);

  return {
    clientCallbacksListQuery,
    sorts: state?.sorts || [],
    handleSort,
    handleOpenAddCallbackModal,
    allowCreateCallback,
  };
};

export default useClientCallbacksTab;
