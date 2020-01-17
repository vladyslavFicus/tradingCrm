import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import GridView, { GridViewColumn } from 'components/GridView';
import Uuid from 'components/Uuid';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';

class OfficesGrid extends Component {
  static propTypes = {
    ...PropTypes.router,
    isLoading: PropTypes.bool.isRequired,
    officesList: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  handleOfficeClick = ({ office: { uuid } }) => {
    this.props.history.push(`/offices/${uuid}`);
  };

  renderOfficeColumn = ({ office: { name, uuid } }) => (
    <Fragment>
      <div className="font-weight-700 cursor-pointer">
        {name}
      </div>
      <div className="font-size-11">
        <Uuid uuid={uuid} uuidPrefix="OF" />
      </div>
    </Fragment>
  );

  renderCountryColumn = ({ office: { country } }) => (
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
    const {
      isLoading,
      officesList,
    } = this.props;

    return (
      <div className="card-body">
        <GridView
          dataSource={officesList}
          last
          showNoResults={!isLoading && officesList.length === 0}
          onRowClick={this.handleOfficeClick}
        >
          <GridViewColumn
            name="office"
            header={I18n.t('OFFICES.GRID_HEADER.OFFICE')}
            render={this.renderOfficeColumn}
          />
          <GridViewColumn
            name="country"
            header={I18n.t('OFFICES.GRID_HEADER.COUNTRY')}
            render={this.renderCountryColumn}
          />
        </GridView>
      </div>
    );
  }
}

export default withRouter(OfficesGrid);
