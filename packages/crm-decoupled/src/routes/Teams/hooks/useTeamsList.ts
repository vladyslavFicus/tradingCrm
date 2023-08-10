import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Config, usePermission, useModal } from '@crm/common';
import { State } from 'types';
import CreateTeamModal, { CreateTeamModalProps } from 'modals/CreateTeamModal';
import { useTeamsListQuery, TeamsListQueryVariables } from '../graphql/__generated__/TeamsListQuery';

const useTeamsList = () => {
  const state = useLocation().state as State<TeamsListQueryVariables>;

  const permission = usePermission();
  const allowCreateBranch = permission.allows(Config.permissions.HIERARCHY.CREATE_BRANCH);

  // ===== Modals ===== //
  const createTeamModal = useModal<CreateTeamModalProps>(CreateTeamModal);

  // ===== Requests ===== //
  const { data, loading, refetch } = useTeamsListQuery({
    variables: {
      ...state?.filters as TeamsListQueryVariables,
      branchType: 'team',
    },
  });

  const teamsList = data?.branch || [];
  const totalCount = teamsList.length || 0;

  // ===== Handlers ===== //
  const handleOpenAddTeamModal = useCallback(() => {
    createTeamModal.show({
      onSuccess: refetch,
    });
  }, []);

  return {
    allowCreateBranch,
    loading,
    teamsList,
    totalCount,
    refetch,
    handleOpenAddTeamModal,
  };
};

export default useTeamsList;
