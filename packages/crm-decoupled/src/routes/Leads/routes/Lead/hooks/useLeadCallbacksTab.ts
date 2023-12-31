import { useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Config, useModal, usePermission, Types } from '@crm/common';
import CreateLeadCallbackModal, { CreateLeadCallbackModalProps } from 'modals/CreateLeadCallbackModal';
import {
  LeadCallbacksListQueryVariables,
  useLeadCallbacksListQuery,
} from '../graphql/__generated__/LeadCallbacksListQuery';

const useLeadCallbacksTab = () => {
  const uuid = useParams().id as string;

  const state = useLocation().state as Types.State<LeadCallbacksListQueryVariables>;

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

  const handleSort = useCallback((sorts: Array<Types.Sort>) => {
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
