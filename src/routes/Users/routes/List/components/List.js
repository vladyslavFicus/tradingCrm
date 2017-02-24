import React, { Component, PropTypes } from 'react';
import Panel, { Title, Content } from 'components/Panel';
import GridView, { GridColumn } from 'components/GridView';
import { Link } from 'react-router';
import { TextFilter } from 'components/Forms/Filters';
import classNames from 'classnames';

class List extends Component {
  handlePageChanged = (page, filters = {}) => {
    if (!this.props.list.isLoading) {
      this.props.fetchEntities({ ...filters, page: page - 1 });
    }
  };

  handleFiltersChanged = (filters = {}) => {
    this.props.fetchEntities({ ...filters, page: 0 });
  };

  componentWillMount() {
    this.handleFiltersChanged();
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
              name="firstName"
              header="Firstname"
              headerClassName="text-center"
              filter={(onFilterChange) => <TextFilter
                name="firstName"
                onFilterChange={onFilterChange}
              />}
              className="text-center"
            />

            <GridColumn
              name="lastName"
              header="Lastname"
              headerClassName="text-center"
              filter={(onFilterChange) => <TextFilter
                name="lastName"
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
              name="uuid"
              header="UUID"
              headerClassName="text-center"
              className="text-center"
              filter={(onFilterChange) => <TextFilter
                name="uuid"
                onFilterChange={onFilterChange}
              />}
            />

            <GridColumn
              name="country"
              header="Country"
              headerClassName="text-center"
              className="text-center"
            />

            <GridColumn
              name="profileStatus"
              header="Status"
              headerClassName="text-center"
              className="text-center"
            />

            <GridColumn
              name="verified"
              header="Verified"
              headerClassName="text-center"
              className="text-center"
              render={this.renderVerified}
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

  renderActions(data) {
    return <div>
      <Link target="_blank" to={`/users/${data.uuid}/profile`} title={'View user profile'}>
        <i className="fa fa-search"/>
      </Link>
    </div>;
  }

  renderVerified(data, column) {
    return <span className={
      classNames('donut', data[column.name] ? 'donut-success' : 'donut-danger')
    }/>;
  }

}

export default List;
