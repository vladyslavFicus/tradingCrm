import React, { PureComponent, Fragment } from 'react';
import { Link } from 'react-router-dom';
import I18n from 'i18n-js';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import Uuid from 'components/Uuid';
import Grid, { GridColumn } from 'components/Grid';
import './TeamsGrid.scss';

class TeamsGrid extends PureComponent {
  static propTypes = {
    teamsData: PropTypes.branchHierarchyResponse.isRequired,
  };

  renderTeamCell = ({ name, uuid, parentBranch: { deskType } }) => (
    <Fragment>
      <div className="TeamsGrid__cell-primary">
        <Link to={`/teams/${uuid}/rules/${deskType.toLowerCase()}-rules`}>{name}</Link>
      </div>
      <div className="TeamsGrid__cell-secondary">
        <Uuid uuid={uuid} uuidPrefix="TE" />
      </div>
    </Fragment>
  );

  renderOfficeCell = ({ parentBranch }) => {
    const office = get(parentBranch, 'parentBranch') || null;

    return (
      <Choose>
        <When condition={office}>
          <div className="TeamsGrid__cell-primary">{office.name}</div>
          <div className="TeamsGrid__cell-secondary">
            <Uuid uuid={office.uuid} uuidPrefix="OF" />
          </div>
        </When>
        <Otherwise>
          <span>&mdash;</span>
        </Otherwise>
      </Choose>
    );
  };

  renderDeskCell = ({ parentBranch }) => (
    <Choose>
      <When condition={parentBranch}>
        <div className="TeamsGrid__cell-primary">{parentBranch.name}</div>
        <div className="TeamsGrid__cell-secondary">
          <Uuid uuid={parentBranch.uuid} uuidPrefix="DE" />
        </div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  render() {
    const { teamsData } = this.props;

    const isLoading = teamsData.loading;
    const teams = get(teamsData, 'data.hierarchy.branchHierarchy.data') || [];

    return (
      <div className="TeamsGrid">
        <Grid
          data={teams}
          isLoading={isLoading}
          withNoResults={!isLoading && teams.length === 0}
        >
          <GridColumn
            header={I18n.t('TEAMS.GRID_HEADER.TEAM')}
            render={this.renderTeamCell}
          />
          <GridColumn
            header={I18n.t('TEAMS.GRID_HEADER.OFFICE')}
            render={this.renderOfficeCell}
          />
          <GridColumn
            header={I18n.t('TEAMS.GRID_HEADER.DESK')}
            render={this.renderDeskCell}
          />
        </Grid>
      </div>
    );
  }
}

export default TeamsGrid;
