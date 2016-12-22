import React, { Component, PropTypes } from 'react';
import Panel, { Title, Content } from 'components/Panel';
import GridView, { GridColumn } from 'components/GridView';
import { Link } from 'react-router';
import { TextFilter, DropDownFilter, DateRangeFilter } from 'components/Forms/Filters';
import moment from 'moment';
import Amount from 'components/Amount';

class List extends Component {
  constructor(props) {
    super(props);

    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.handleFiltersChanged = this.handleFiltersChanged.bind(this);
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
              headerClassName="text-center"
              filter={(onFilterChange) => <TextFilter
                name="label"
                onFilterChange={onFilterChange}
              />}
              filterClassName="text-center"
              className="text-center"
            />
            <GridColumn
              name="optIn"
              header="Opt-in"
              headerClassName="text-center"
              className="text-center"
              render={(data, column) => (
                <input type="checkbox" checked={data[column.name]} disabled/>
              )}
            />
            <GridColumn
              name="playerUUID"
              header="Player"
              headerClassName="text-center"
              filter={(onFilterChange) => <TextFilter
                name="playerUUID"
                onFilterChange={onFilterChange}
              />}
              filterClassName="text-center"
              className="text-center"
            />
            <GridColumn
              name="grantedAmount"
              header="Granted amount"
              headerClassName="text-center"
              className="text-center"
              render={(data, column) => <Amount amount={data[column.name]} />}
            />
            <GridColumn
              name="capping"
              header="Capping"
              headerClassName="text-center"
              className="text-center"
              render={(data, column) => <Amount amount={data[column.name]} />}
            />
            <GridColumn
              name="prize"
              header="Prize"
              headerClassName="text-center"
              className="text-center"
              render={(data, column) => <Amount amount={data[column.name]} />}
            />
            <GridColumn
              name="amountToWage"
              header="Amount to wage"
              headerClassName="text-center"
              className="text-center"
              render={(data, column) => <Amount amount={data[column.name]} />}
            />
            <GridColumn
              name="state"
              header="Status"
              headerClassName="text-center"
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
              filterClassName="text-center"
              className="text-center"
            />
            <GridColumn
              name="createdDate"
              header="Created at"
              headerClassName="text-center"
              headerStyle={{ width: '20%' }}
              render={(data, column) => moment(data[column.name]).format('DD.MM.YYYY HH:mm:ss')}
              filter={(onFilterChange) => <DateRangeFilter
                isOutsideRange={(date) => moment() <= date}
                onFilterChange={onFilterChange}
              />}
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
