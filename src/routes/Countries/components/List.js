import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import Panel, { Title, Content } from '../../../components/Panel';
import CountriesGridFilter from './CountriesGridFilter';
import GridView, { GridColumn } from '../../../components/GridView';
import StatusDropDown from './StatusDropDown';
import { accessTypes } from '../../../constants/countries';
import PropTypes from '../../../constants/propTypes';

class List extends Component {
  static propTypes = {
    loadCountries: PropTypes.func.isRequired,
    changeStatus: PropTypes.func.isRequired,
    list: PropTypes.pageableState(PropTypes.countryAccessEntity),
  };

  state = {
    filters: {},
  };

  componentDidMount() {
    this.handleRefresh();
  }

  handleRefresh = () => {
    this.props.loadCountries({
      ...this.state.filters,
      page: this.state.page,
    });
  };

  handleFiltersChanged = (filters = {}) => {
    this.setState({ filters, page: 0 }, () => this.handleRefresh());
  };

  handlePageChanged = (page) => {
    if (!this.props.list.isLoading) {
      this.setState({ page: page - 1 }, () => this.handleRefresh());
    }
  };

  handleChangeStatus = countryCode => (action) => {
    this.props.changeStatus(action, countryCode);
  };

  renderStatus = data => (
    <StatusDropDown
      status={data.allowed ? accessTypes.ALLOWED : accessTypes.FORBIDDEN}
      onStatusChange={this.handleChangeStatus(data.countryCode)}
    />
  );

  render() {
    const { list: { entities } } = this.props;

    return (
      <div className="page-content-inner">
        <Panel withBorders>
          <Title>
            <h3>{I18n.t('COUNTRIES.TITLE')}</h3>
          </Title>

          <CountriesGridFilter
            onSubmit={this.handleFiltersChanged}
          />

          <Content>
            <GridView
              dataSource={entities.content}
              tableClassName="table table-hovered data-grid-layout"
              headerClassName="text-uppercase"
              onPageChange={this.handlePageChanged}
              activePage={entities.number + 1}
              totalPages={entities.totalPages}
              lazyLoad
            >
              <GridColumn
                name="countryName"
                header={I18n.t('COUNTRIES.GRID.LABEL.COUNTRY')}
                headerClassName="text-uppercase"
                className="font-weight-700"
                headerStyle={{ width: '20%' }}
              />
              <GridColumn
                name="access"
                header={I18n.t('COUNTRIES.GRID.LABEL.ACCESS')}
                headerClassName="text-uppercase"
                className="text-uppercase"
                render={this.renderStatus}
              />
            </GridView>
          </Content>
        </Panel>
      </div>
    );
  }
}

export default List;
