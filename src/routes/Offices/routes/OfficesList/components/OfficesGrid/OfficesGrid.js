import React, { PureComponent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import I18n from 'i18n-js';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import { Link } from 'components/Link';
import Grid, { GridColumn } from 'components/Grid';
import Uuid from 'components/Uuid';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import './OfficesGrid.scss';

class OfficesGrid extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    officesData: PropTypes.branchHierarchyResponse.isRequired,
  };

  renderOfficeColumn = ({ name, uuid }) => (
    <Fragment>
      <Link
        className="OfficesGrid__cell-primary"
        to={`/offices/${uuid}`}
      >
        {name}
      </Link>
      <div className="OfficesGrid__cell-secondary">
        <Uuid uuid={uuid} uuidPrefix="OF" />
      </div>
    </Fragment>
  );

  renderCountryColumn = ({ country }) => (
    <Choose>
      <When condition={country}>
        <CountryLabelWithFlag
          code={country}
          height="14"
        />
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  render() {
    const { officesData } = this.props;

    const officesList = get(officesData, 'data.branch') || [];
    const isLoading = officesData.loading;

    return (
      <div className="OfficesGrid">
        <Grid
          data={officesList}
          isLoading={isLoading}
          headerStickyFromTop={138}
          withNoResults={!isLoading && officesList.length === 0}
        >
          <GridColumn
            name="office"
            header={I18n.t('OFFICES.GRID_HEADER.OFFICE')}
            render={this.renderOfficeColumn}
          />
          <GridColumn
            name="country"
            header={I18n.t('OFFICES.GRID_HEADER.COUNTRY')}
            render={this.renderCountryColumn}
          />
        </Grid>
      </div>
    );
  }
}

export default withRouter(OfficesGrid);
