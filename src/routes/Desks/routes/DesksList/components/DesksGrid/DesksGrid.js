import React, { PureComponent, Fragment } from 'react';
import { Link } from 'react-router-dom';
import I18n from 'i18n-js';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import Uuid from 'components/Uuid';
import Grid, { GridColumn } from 'components/Grid';
import './DesksGrid.scss';

class DesksGrid extends PureComponent {
  static propTypes = {
    desksData: PropTypes.branchHierarchyResponse.isRequired,
  };

  renderDeskCell = ({ desk: { name, uuid, deskType } }) => (
    <Fragment>
      <div className="DesksGrid__cell-primary">
        <Link to={`/desks/${uuid}/rules/${deskType.toLowerCase()}-rules`}>{name}</Link>
      </div>
      <div className="DesksGrid__cell-secondary">
        <Uuid uuid={uuid} uuidPrefix="DE" />
      </div>
    </Fragment>
  );

  renderOfficeCell = ({ office }) => (
    <Choose>
      <When condition={office}>
        <div className="DesksGrid__cell-primary">{office.name}</div>
        <div className="DesksGrid__cell-secondary">
          <Uuid uuid={office.uuid} uuidPrefix="OF" />
        </div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderDeskTypesCell = ({ desk: { deskType } }) => (
    <div className="DesksGrid__cell-primary">
      {I18n.t(`DESKS.MODAL.LABELS.DESK_TYPE_OPTIONS.${deskType}`)}
    </div>
  );

  renderDefaultDeskCell = ({ desk: { isDefault } }) => {
    console.log('isDefault', isDefault);

    return (
      <div className="DesksGrid__cell-primary">
        {isDefault ? I18n.t('COMMON.YES') : I18n.t('COMMON.NO')}
      </div>
    );
  };

  render() {
    const { desksData } = this.props;

    const isLoading = desksData.loading;
    const desks = get(desksData, 'data.hierarchy.branchHierarchy.data') || [];

    console.log('desks', desks);

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
          <GridColumn
            header={I18n.t('DESKS.GRID_HEADER.DEFAULT_DESK')}
            render={this.renderDefaultDeskCell}
          />
        </Grid>
      </div>
    );
  }
}

export default DesksGrid;
