import React from 'react';
import I18n from 'i18n-js';
import { Button } from 'components';
import useTeamsList from 'routes/Teams/hooks/useTeamsList';
import TeamsGridFilter from './components/TeamsGridFilter';
import TeamsGrid from './components/TeamsGrid';
import './TeamsList.scss';

const TeamsList = () => {
  const {
    allowCreateBranch,
    loading,
    teamsList,
    totalCount,
    refetch,
    handleOpenAddTeamModal,
  } = useTeamsList();

  return (
    <div className="TeamsList">
      <div className="TeamsList__header">
        <div className="TeamsList__title">
          <strong>{totalCount} </strong>

          {I18n.t('TEAMS.TEAMS')}
        </div>

        <If condition={allowCreateBranch}>
          <Button
            data-testid="TeamsList-addTeamButton"
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
