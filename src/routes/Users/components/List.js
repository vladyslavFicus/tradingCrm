import React, { Component, PropTypes } from 'react';
import Panel, { Title, Content } from 'components/Panel';
import GridView, { GridColumn } from 'components/GridView';
import { Link } from 'react-router';
import { TextFilter, DropDownFilter, DateRangeFilter } from 'components/Forms/Filters';

class List extends Component {
  constructor(props) {
    super(props);

    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.handleFiltersChanged = this.handleFiltersChanged.bind(this);
    this.renderActions = this.renderActions.bind(this);
  }

  handlePageChanged(page, filters = {}) {
    if (!this.props.list.isLoading) {
      this.props.fetchEntities({ ...filters, page: page - 1 });
    }
  }

  handleFiltersChanged(filters = {}) {
    this.props.fetchEntities({ ...filters, page: 0 });
  }

  componentWillMount() {
    this.handleFiltersChanged();
  }

  renderActions(data) {
    return <div>
      <Link to={`/users/${data.uuid}/profile`} title={'View user profile'}>
        <i className="fa fa-search"/>
      </Link>
    </div>;
  }

  render() {
    const { list: { entities } } = this.props;

    return <div className="page-content-inner">
      <Panel withBorders>
        <Title>
          <h3>Users</h3>
        </Title>

        <Content>
          <GridView
            dataSource={entities.content}
            onFiltersChanged={this.handleFiltersChanged}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            totalPages={entities.totalPages}
          >
            <GridColumn
              name="id"
              header="#"
              headerClassName="text-center"
              className="text-center"
            />
            <GridColumn
              name="username"
              header="Username"
              headerClassName="text-center"
              filter={(onFilterChange) => <TextFilter
                name="username"
                onFilterChange={onFilterChange}
              />}
              className="text-center"
            />
            <GridColumn
              name="email"
              header="Email"
              headerClassName="text-center"
              filter={(onFilterChange) => <TextFilter
                name="email"
                onFilterChange={onFilterChange}
              />}
              className="text-center"
            />
            <GridColumn
              name="currency"
              header="Currency"
              headerClassName="text-center"
              filter={(onFilterChange) => <DropDownFilter
                name="currency"
                items={{
                  '': 'All',
                  USD: 'USD',
                  EUR: 'EUR',
                  UAH: 'UAH',
                }}
                onFilterChange={onFilterChange}
              />}
              className="text-center"
            />
            <GridColumn
              name="uuid"
              header="UUID"
              headerClassName="text-center"
              className="text-center"
            />
            <GridColumn
              name="actions"
              header="Actions"
              headerClassName="text-center"
              className="text-center"
              render={this.renderActions}
            />
          </GridView>
        </Content>
      </Panel>
    </div>;
  }
}

export default List;
