import React, { Component, Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { TextRow } from 'react-placeholder/lib/placeholders';
import TeamsGridFilter from './TeamsGridFilter';
import history from '../../../../../router/history';
import PropTypes from '../../../../../constants/propTypes';
import GridView, { GridViewColumn } from '../../../../../components/GridView';
import Placeholder from '../../../../../components/Placeholder';
import Uuid from '../../../../../components/Uuid';

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
      isAdministration: PropTypes.bool.isRequired,
      userId: PropTypes.string.isRequired,
    }).isRequired,
  };

  componentWillUnmount() {
    this.handleFilterReset();
  }

  handleFiltersChanged = (filters = {}) => history.replace({ query: { filters } });

  handleFilterReset = () => history.replace({ query: { filters: {} } });

  handleTeamClick = ({ id }) => {
    history.push(`/team/${id}`);
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
      // leads: { refetch },
      modals: { teamModal, infoModal },
      auth: { userId: operatorId },
    } = this.props;

    const { data: { hierarchy: { createTeam: { data, error } } } } = await createTeam(
      {
        variables: {
          operatorId,
          ...variables,
        },
      }
    );

    // refetch();
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

  renderTeam = data => (
    <Fragment>
      <div className="font-weight-700">
        {data.name} {data.surname}
      </div>
      <div className="font-size-11">
        <Uuid uuid={data.id} uuidPrefix="TE" />
      </div>
    </Fragment>
  );

  renderOffice = data => (
    <Fragment>
      <div className="font-weight-700">
        {data.name} {data.surname}
      </div>
      <div className="font-size-11">
        <Uuid uuid={data.id} uuidPrefix="OF" />
      </div>
    </Fragment>
  );

  renderDesk = data => (
    <Fragment>
      <div className="font-weight-700">
        {data.name} {data.surname}
      </div>
      <div className="font-size-11">
        <Uuid uuid={data.id} uuidPrefix="DE" />
      </div>
    </Fragment>
  );

  render() {
    const {
      locale,
      // leads: {
      //   loading,
      //   leads,
      // },
      userBranchHierarchy: { hierarchy, loading: userBranchHierarchyLoading },
      location: { query },
      auth: { isAdministration },
    } = this.props;

    const loading = false;

    const entities = get(this.props, 'leads.data') || { content: [] };
    const offices = get(hierarchy, 'userBranchHierarchy.data.OFFICE') || [];
    const desks = get(hierarchy, 'userBranchHierarchy.data.DESK') || [];
    const error = get(hierarchy, 'userBranchHierarchy.error');
    const filters = get(query, 'filters', {});

    const allowActions = Object
      .keys(filters)
      .filter(i => (filters[i] && Array.isArray(filters[i]) && filters[i].length > 0) || filters[i]).length > 0;

    return (
      <div className="card">
        <div className="card-heading">
          <Placeholder
            // ready={!loading && !!leads}
            ready={!error}
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
          <If condition={isAdministration}>
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
          </If>
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
            dataSource={entities.content}
            last
            locale={locale}
            showNoResults={!loading && entities.content.length === 0}
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
