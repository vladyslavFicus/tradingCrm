import { useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Config } from '@crm/common';
import { Sort__Input as Sort } from '__generated__/types';
import { State } from 'types';
import { useModal } from 'providers/ModalProvider';
import CreateLeadCallbackModal, { CreateLeadCallbackModalProps } from 'modals/CreateLeadCallbackModal';
import { usePermission } from 'providers/PermissionsProvider';
import {
  LeadCallbacksListQueryVariables,
  useLeadCallbacksListQuery,
} from '../graphql/__generated__/LeadCallbacksListQuery';

const useLeadCallbacksTab = () => {
  const uuid = useParams().id as string;

  const state = useLocation().state as State<LeadCallbacksListQueryVariables>;

  const navigate = useNavigate();

  const permission = usePermission();
  const allowCreateCallback = permission.allows(Config.permissions.LEAD_PROFILE.CREATE_CALLBACK);

  // ===== Modals ===== //
  const createLeadCallbackModal = useModal<CreateLeadCallbackModalProps>(CreateLeadCallbackModal);

  // ===== Requests ===== //
  const leadCallbacksListQuery = useLeadCallbacksListQuery({
    variables: {
      ...state?.filters as LeadCallbacksListQueryVariables,
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

  const { refetch } = leadCallbacksListQuery;

  // ===== Handlers ===== //
  const handleOpenAddCallbackModal = useCallback(() => {
    createLeadCallbackModal.show({
      userId: uuid,
      onSuccess: refetch,
    });
  }, [createLeadCallbackModal, uuid, refetch]);

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
    state,
    leadCallbacksListQuery,
    handleOpenAddCallbackModal,
    handleSort,
    allowCreateCallback,
  };
};

export default useLeadCallbacksTab;
