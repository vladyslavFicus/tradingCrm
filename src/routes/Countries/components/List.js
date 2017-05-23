import React, { Component, PropTypes } from 'react';
import Panel, { Title, Content } from '../../../components/Panel';
import CountriesGridFilter from './CountriesGridFilter';
import GridView, { GridColumn } from '../../../components/GridView';
import StatusDropDown from './StatusDropDown';
import { accessTypes } from '../../../constants/countries';

class List extends Component {
  static propTypes = {
    loadCountries: PropTypes.func.isRequired,
    changeStatus: PropTypes.func.isRequired,
  };

  state = {
    filters: {},
  };

  /*componentDidMount() {
    this.handleRefresh();
  }*/

  handleRefresh = () => {
    this.props.loadCountries(this.state.filters);
  };

  handleFiltersChanged = (filters = {}) => {
    this.setState({ filters }, () => this.handleRefresh());
  };

  handlePageChanged = (page) => {
    if (!this.props.list.isLoading) {
      this.setState({ page: page - 1 }, () => this.handleRefresh());
    }
  };

  handleChangeStatus = countryCode => async (action) => {
    const responseAction = await this.props.changeStatus(action, countryCode);
    /*if (responseAction && !responseAction.error) {
      this.handleRefresh();
    }*/
  };

  renderCountry = () => {
    return (
      <div>Country</div>
    );
  }

  renderStatus = data => (
    <StatusDropDown
      status={data.allowed ? accessTypes.ALLOWED : accessTypes.FORBIDDEN}
      onStatusChange={this.handleChangeStatus(data.countryCode)}
    />
  );

  render() {
    const { list: { entities } } = this.props;
    const { filters } = this.state;

    console.log('entities', entities);

    return (
      <div className="page-content-inner">
        <Panel withBorders>
          <Title>
            <h3>Countries</h3>
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
                name="country"
                header="Country"
                headerClassName="text-uppercase"
                className="font-weight-700"
                headerStyle={{ width: '20%' }}
                render={this.renderCountry}
              />
              <GridColumn
                name="access"
                header="Access"
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
