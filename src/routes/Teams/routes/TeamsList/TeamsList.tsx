import React from 'react';
import { useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { State } from 'types';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import permissions from 'config/permissions';
import { Button } from 'components/Buttons';
import CreateTeamModal, { CreateTeamModalProps } from 'modals/CreateTeamModal';
import TeamsGridFilter from './components/TeamsGridFilter';
import TeamsGrid from './components/TeamsGrid';
import { useTeamsListQuery, TeamsListQueryVariables } from './graphql/__generated__/TeamsListQuery';
import './TeamsList.scss';

const TeamsList = () => {
  const { state } = useLocation<State<TeamsListQueryVariables>>();

  const permission = usePermission();
  const allowCreateBranch = permission.allows(permissions.HIERARCHY.CREATE_BRANCH);

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
  const handleOpenAddTeamModal = () => {
    createTeamModal.show({
      onSuccess: refetch,
    });
  };

  return (
    <div className="TeamsList">
      <div className="TeamsList__header">
        <div className="TeamsList__title">
          <strong>{totalCount} </strong>

          {I18n.t('TEAMS.TEAMS')}
        </div>

        <If condition={allowCreateBranch}>
          <Button
            onClick={handleOpenAddTeamModal}
            tertiary
          >
            {I18n.t('TEAMS.ADD_TEAM')}
          </Button>
        </If>
      </div>

      <TeamsGridFilter onRefetch={refetch} />

      <TeamsGrid loading={loading} teamsList={teamsList} onRefetch={refetch} />
    </div>
  );
};

export default React.memo(TeamsList);
