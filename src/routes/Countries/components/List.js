import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import CountriesGridFilter from './CountriesGridFilter';
import GridView, { GridColumn } from '../../../components/GridView';
import StatusDropDown from './StatusDropDown';
import { accessTypes } from '../../../constants/countries';
import PropTypes from '../../../constants/propTypes';

class List extends Component {
  static propTypes = {
    loadCountries: PropTypes.func.isRequired,
    changeStatus: PropTypes.func.isRequired,
    list: PropTypes.pageableState(PropTypes.countryAccessEntity).isRequired,
    locale: PropTypes.string.isRequired,
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
        <div className="card">
          <div className="card-heading font-size-20">
            {I18n.t('COUNTRIES.TITLE')}
          </div>

          <CountriesGridFilter
            onSubmit={this.handleFiltersChanged}
            locale={this.props.locale}
          />

          <div className="card-body">
            <GridView
              dataSource={entities.content}
              onPageChange={this.handlePageChanged}
              activePage={entities.number + 1}
              totalPages={entities.totalPages}
              locale={this.props.locale}
              lazyLoad
            >
              <GridColumn
                name="countryName"
                header={I18n.t('COUNTRIES.GRID.LABEL.COUNTRY')}
                className="font-weight-700"
                headerStyle={{ width: '350px' }}
              />
              <GridColumn
                name="access"
                header={I18n.t('COUNTRIES.GRID.LABEL.ACCESS')}
                className="text-uppercase"
                render={this.renderStatus}
              />
            </GridView>
          </div>
        </div>
      </div>
    );
  }
}

export default List;
