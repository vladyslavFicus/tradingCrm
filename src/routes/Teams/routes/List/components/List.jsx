import React, { Component, Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { TextRow } from 'react-placeholder/lib/placeholders';
import history from 'router/history';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import PermissionContent from 'components/PermissionContent';
import GridView, { GridViewColumn } from 'components/GridView';
import Placeholder from 'components/Placeholder';
import Uuid from 'components/Uuid';
import TeamsGridFilter from './TeamsGridFilter';

class List extends Component {
  static propTypes = {
    locale: PropTypes.string.isRequired,
    createTeam: PropTypes.func.isRequired,
    userBranchHierarchy: PropTypes.shape({
      hierarchy: PropTypes.shape({
        userBranchHierarchy: PropTypes.shape({
          data: PropTypes.shape({
            OFFICE: PropTypes.arrayOf(PropTypes.branchHierarchyType),
            DESK: PropTypes.arrayOf(PropTypes.branchHierarchyType),
          }),
          error: PropTypes.object,
        }),
      }),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.shape({
        filters: PropTypes.object,
      }),
    }).isRequired,
    modals: PropTypes.shape({
      teamModal: PropTypes.modalType,
      infoModal: PropTypes.modalType,
    }).isRequired,
    auth: PropTypes.shape({
      userId: PropTypes.string.isRequired,
    }).isRequired,
    teams: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      refetch: PropTypes.func.isRequired,
      hierarchy: PropTypes.shape({
        branchHierarchy: PropTypes.shape({
          error: PropTypes.object,
          data: PropTypes.arrayOf(PropTypes.object),
        }),
      }),
    }).isRequired,
  };

  componentWillUnmount() {
    this.handleFilterReset();
  }

  handleFiltersChanged = (filters = {}) => history.replace({ query: { filters } });

  handleFilterReset = () => history.replace({ query: { filters: {} } });

  handleTeamClick = ({ team: { uuid }, desk: { deskType } }) => {
    history.push(`/teams/${uuid}/rules/${deskType.toLowerCase()}-rules`);
  };

  triggerTeamModal = () => {
    const {
      modals: { teamModal },
      userBranchHierarchy: { hierarchy: { userBranchHierarchy: { data: { OFFICE, DESK } } } },
    } = this.props;

    teamModal.show({
      onSubmit: values => this.handleAddTeam(values),
      offices: OFFICE || [],
      desks: DESK || [],
    });
  }

  handleAddTeam = async (variables) => {
    const {
      createTeam,
      teams: { refetch },
      modals: { teamModal, infoModal },
      auth: { userId: operatorId },
    } = this.props;

    const { data: { hierarchy: { createTeam: { data, error } } } } = await createTeam(
      {
        variables: {
          operatorId,
          ...variables,
        },
      },
    );

    refetch();
    teamModal.hide();
    infoModal.show({
      header: I18n.t('HIERARCHY.INFO_MODAL.TEAM_BODY'),
      status: error.length === 0
        ? I18n.t('COMMON.SUCCESS')
        : I18n.t('COMMON.FAIL'),
      data,
      error,
    });
  };

  renderTeam = ({ team: { name, uuid } }) => (
    <Fragment>
      <div className="font-weight-700 cursor-pointer">
        {name}
      </div>
      <div className="font-size-11">
        <Uuid uuid={uuid} uuidPrefix="TE" />
      </div>
    </Fragment>
  );

  renderOffice = ({ office }) => (
    <Choose>
      <When condition={office}>
        <div className="font-weight-700">
          {office.name}
        </div>
        <div className="font-size-11">
          <Uuid uuid={office.uuid} uuidPrefix="OF" />
        </div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderDesk = ({ desk }) => (
    <Choose>
      <When condition={desk}>
        <div className="font-weight-700">
          {desk.name}
        </div>
        <div className="font-size-11">
          <Uuid uuid={desk.uuid} uuidPrefix="DE" />
        </div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  render() {
    const {
      locale,
      teams: {
        loading,
        hierarchy: teams,
      },
      userBranchHierarchy: { hierarchy, loading: userBranchHierarchyLoading },
      location: { query },
    } = this.props;

    const entities = get(teams, 'branchHierarchy.data') || [];
    const offices = get(hierarchy, 'userBranchHierarchy.data.OFFICE') || [];
    const desks = get(hierarchy, 'userBranchHierarchy.data.DESK') || [];
    const error = get(teams, 'branchHierarchy.error') || get(hierarchy, 'userBranchHierarchy.error');
    const filters = get(query, 'filters', {});

    const allowActions = Object
      .keys(filters)
      .filter(i => (filters[i] && Array.isArray(filters[i]) && filters[i].length > 0) || filters[i]).length > 0;

    return (
      <div className="card">
        <div className="card-heading">
          <Placeholder
            ready={!loading && !!teams}
            className={null}
            customPlaceholder={(
              <div>
                <TextRow className="animated-background" style={{ width: '220px', height: '20px' }} />
                <TextRow className="animated-background" style={{ width: '220px', height: '12px' }} />
              </div>
            )}
          >
            <span className="font-size-20">
              {I18n.t('TEAMS.TEAMS')}
            </span>
          </Placeholder>
          <PermissionContent permissions={permissions.HIERARCHY.CREATE_BRANCH}>
            <div className="ml-auto">
              <button
                className="btn btn-default-outline"
                onClick={this.triggerTeamModal}
                disabled={userBranchHierarchyLoading || error}
                type="button"
              >
                {I18n.t('TEAMS.ADD_TEAM')}
              </button>
            </div>
          </PermissionContent>
        </div>

        <TeamsGridFilter
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          disabled={!allowActions || error}
          offices={offices}
          desks={desks}
          hierarchyBranchesLoading={userBranchHierarchyLoading}
        />

        <div className="card-body">
          <GridView
            dataSource={entities}
            last
            locale={locale}
            showNoResults={!loading && entities.length === 0}
            onRowClick={this.handleTeamClick}
          >
            <GridViewColumn
              name="desk"
              header={I18n.t('TEAMS.GRID_HEADER.TEAM')}
              render={this.renderTeam}
            />
            <GridViewColumn
              name="office"
              header={I18n.t('TEAMS.GRID_HEADER.OFFICE')}
              render={this.renderOffice}
            />
            <GridViewColumn
              name="deskType"
              header={I18n.t('TEAMS.GRID_HEADER.DESK')}
              render={this.renderDesk}
            />
          </GridView>
        </div>
      </div>
    );
  }
}

export default List;
