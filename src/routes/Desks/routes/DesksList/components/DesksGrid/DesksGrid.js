import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import { Link } from 'components/Link';
import Uuid from 'components/Uuid';
import Grid, { GridColumn } from 'components/Grid';
import './DesksGrid.scss';

class DesksGrid extends PureComponent {
  static propTypes = {
    desksData: PropTypes.branchHierarchyResponse.isRequired,
  };

  renderDeskCell = ({ name, uuid }) => (
    <Fragment>
      <div className="DesksGrid__cell-primary">
        <Link to={`/desks/${uuid}`}>{name}</Link>
      </div>
      <div className="DesksGrid__cell-secondary">
        <Uuid uuid={uuid} uuidPrefix="DE" />
      </div>
    </Fragment>
  );

  renderOfficeCell = ({ parentBranch }) => (
    <Choose>
      <When condition={parentBranch}>
        <div className="DesksGrid__cell-primary">{parentBranch.name}</div>
        <div className="DesksGrid__cell-secondary">
          <Uuid uuid={parentBranch.uuid} uuidPrefix="OF" />
        </div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderDeskTypesCell = ({ deskType }) => (
    <div className="DesksGrid__cell-primary">
      {I18n.t(`DESKS.MODAL.LABELS.DESK_TYPE_OPTIONS.${deskType}`)}
    </div>
  );

  render() {
    const { desksData } = this.props;

    const isLoading = desksData.loading;
    const desks = get(desksData, 'data.branch') || [];

    return (
      <div className="DesksGrid">
        <Grid
          data={desks}
          isLoading={isLoading}
        >
          <GridColumn
            header={I18n.t('DESKS.GRID_HEADER.DESK')}
            render={this.renderDeskCell}
          />
          <GridColumn
            header={I18n.t('DESKS.GRID_HEADER.OFFICE')}
            render={this.renderOfficeCell}
          />
          <GridColumn
            header={I18n.t('DESKS.GRID_HEADER.DESK_TYPE')}
            render={this.renderDeskTypesCell}
          />
        </Grid>
      </div>
    );
  }
}

export default DesksGrid;
