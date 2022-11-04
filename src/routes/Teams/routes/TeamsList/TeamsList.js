import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withRequests } from 'apollo';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import PermissionContent from 'components/PermissionContent';
import { Button } from 'components/UI';
import CreateTeamModal from 'modals/CreateTeamModal';
import getTeamsQuery from './graphql/getTeamsQuery';
import getDesksAndOfficesQuery from './graphql/getDesksAndOfficesQuery';
import TeamsGridFilter from './components/TeamsGridFilter';
import TeamsGrid from './components/TeamsGrid';
import './TeamsList.scss';

class TeamsList extends PureComponent {
  static propTypes = {
    teamsData: PropTypes.branchHierarchyResponse.isRequired,
    desksAndOffices: PropTypes.userBranchHierarchyResponse.isRequired,
    modals: PropTypes.shape({
      createTeamModal: PropTypes.modalType,
    }).isRequired,
  };

  handleOpenAddTeamModal = () => {
    const {
      teamsData,
      modals: {
        createTeamModal,
      },
    } = this.props;

    createTeamModal.show({
      onSuccess: () => {
        teamsData.refetch();
      },
    });
  };

  render() {
    const { teamsData, desksAndOffices } = this.props;

    const totalCount = teamsData?.data?.branch?.length;

    return (
      <div className="TeamsList">
        <div className="TeamsList__header">
          <div className="TeamsList__title">
            <strong>{totalCount} </strong>
            {I18n.t('TEAMS.TEAMS')}
          </div>
          <PermissionContent permissions={permissions.HIERARCHY.CREATE_BRANCH}>
            <Button
              onClick={this.handleOpenAddTeamModal}
              tertiary
            >
              {I18n.t('TEAMS.ADD_TEAM')}
            </Button>
          </PermissionContent>
        </div>

        <TeamsGridFilter
          desksAndOffices={desksAndOffices}
          handleRefetch={teamsData.refetch}
        />

        <TeamsGrid teamsData={teamsData} />
      </div>
    );
  }
}

export default compose(
  withRequests({
    teamsData: getTeamsQuery,
    desksAndOffices: getDesksAndOfficesQuery,
  }),
  withModals({
    createTeamModal: CreateTeamModal,
  }),
)(TeamsList);
