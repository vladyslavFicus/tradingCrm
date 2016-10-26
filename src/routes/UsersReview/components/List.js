import React, { Component, PropTypes } from 'react';
import Panel, { Title, Content } from 'components/Panel';
import GridView, { GridColumn } from 'components/GridView';
import { TextFilter, DropDownFilter, DateRangeFilter } from 'components/Forms/Filters';
import GridWrapper from '../../../components/GridWrapper/PagenableFilterable';
import { Link } from 'react-router';

class List extends Component {
  constructor(props) {
    super(props);

    this.renderActions = this.renderActions.bind(this);
  }

  renderActions(data) {
    return <div>
      <Link to={`/profiles-review/${data.uuid}`} title={'Review user profile'}>
        <i className="fa fa-gear"/>
      </Link>
    </div>;
  }

  render() {
    const { list: { entities } } = this.props;

    return (

      <div className="page-content-inner">
        <Panel withBorders>
          <Title>
            <h3>InReview Profiles</h3>
          </Title>

          <Content>
            <GridView
              dataSource={entities.content}
              onFiltersChanged={this.props.handleFiltersChanged}
              onPageChange={this.props.handlePageChanged}
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
                className="text-center"
              />

              <GridColumn
                name="lastName"
                header="Lastname"
                headerClassName="text-center"
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
                name="address"
                header="Address"
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
      </div>
    );
  };

}

export default GridWrapper(List);
