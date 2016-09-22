import React, { Component, PropTypes } from 'react';
import Panel, { Title, Content } from 'components/Panel';
import GridView, { GridColumn } from 'components/GridView';
import { Link } from 'react-router';
import { TextFilter, DropDownFilter, DateRangeFilter } from 'components/Forms/Filters';
import moment from 'moment';

class List extends Component {
  constructor(props) {
    super(props);

    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.handleFiltersChanged = this.handleFiltersChanged.bind(this);
  }

  handlePageChanged(page, filters) {
    if (!this.props.list.isLoading) {
      this.props.fetchEntities({ ...filters, page: page - 1 });
    }
  }

  handleFiltersChanged(filters) {
    this.props.fetchEntities({ ...filters, page: 0 });
  }

  componentWillMount() {
    this.handleFiltersChanged({});
  }

  render() {
    const { list: { entities } } = this.props;

    return <div className="page-content-inner">
      <Panel withBorders>
        <Title>
          <h3>Bonuses</h3>
        </Title>

        <Content>
          <div className="row margin-bottom-15">
            <div className="col-lg-12">
              <div className="text-right">
                <Link to={'/bonuses/create'} className="btn btn-primary">Create bonus</Link>
              </div>
            </div>
          </div>

          <GridView
            dataSource={entities.content}
            onFiltersChanged={this.handleFiltersChanged}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            totalPages={entities.totalPages}
          >
            <GridColumn name="id" header="ID"/>
            <GridColumn
              name="label"
              header="Name"
              filter={(onFilterChange) => <TextFilter
                name="label"
                onFilterChange={onFilterChange}
              />}
            />
            <GridColumn name="playerUUID" header="Player"/>
            <GridColumn name="grantedAmount" header="Granted amount"/>
            <GridColumn name="converted" header="Converted"/>
            <GridColumn name="wagered" header="Wagered"/>
            <GridColumn name="amountToWage" header="Amount to wage"/>
            <GridColumn
              name="state"
              header="Status"
              filter={(onFilterChange) => <DropDownFilter
                name="state"
                items={{
                  '': 'All',
                  INACTIVE: 'INACTIVE',
                  IN_PROGRESS: 'IN_PROGRESS',
                  WAGERING_COMPLETE: 'WAGERING_COMPLETE',
                  CONSUMED: 'CONSUMED',
                  CANCELLED: 'CANCELLED',
                  EXPIRED: 'EXPIRED',
                }}
                onFilterChange={onFilterChange}
              />}
            />
            <GridColumn
              name="createdDate"
              header="Created at"
              headerClassName="text-center"
              headerStyle={{ width: '20%' }}
              render={(data, column) => moment(data[column.name]).format('DD.MM.YYYY HH:mm:ss')}
              filter={(onFilterChange) => <DateRangeFilter onFilterChange={onFilterChange}/>}
              filterClassName="text-center"
              className="text-center"
            />
          </GridView>
        </Content>
      </Panel>
    </div>;
  }
}

export default List;
