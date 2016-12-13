import React, { Component, PropTypes } from 'react';
import GridView, { GridColumn } from 'components/GridView';
import classNames from 'classnames';
import { TextFilter, DropDownFilter, DateRangeFilter } from 'components/Forms/Filters';
import moment from 'moment';
import { ITEMS_PER_PAGE } from '../modules/view';
import Amount from 'components/Amount';

class View extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      filters: {
        playerUUID: this.props.params.id,
      },
      page: 0,
    };

    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.handleFiltersChanged = this.handleFiltersChanged.bind(this);
  }

  componentDidMount() {
    this.onFiltersChanged();
  }

  handleFiltersChanged(filters) {
    this.setState({
      filters: {
        ...this.state.filters,
        ...filters,
      },
      page: 0,
    }, this.onFiltersChanged);
  }

  handlePageChanged(page, filters) {
    if (!this.props.isLoading) {
      this.setState({
        filters: {
          ...this.state.filters,
          ...filters,
        },
        page: page - 1,
      }, this.onFiltersChanged);
    }
  }

  onFiltersChanged() {
    this.props.fetchGameActivity(this.state.filters, this.state.page);
  }

  render() {
    const {
      items,
      totalItems,
      currency,
      games, actions, providers,
    } = this.props;

    return <div className={classNames('tab-pane fade in active')}>
      <GridView
        dataSource={items || []}
        onFiltersChanged={this.handleFiltersChanged}
        onPageChange={this.handlePageChanged}
        activePage={this.state.page + 1}
        totalPages={Math.ceil(totalItems / ITEMS_PER_PAGE)}
      >

        <GridColumn
          name="name"
          header="Action"
          filter={(onFilterChange) => <DropDownFilter
            name="name"
            items={{
              '': 'All',
              ...actions,
            }}
            onFilterChange={onFilterChange}
          />}
        />

        <GridColumn
          name="gameProviderId"
          header="Game Provider"
          filter={(onFilterChange) => <DropDownFilter
            name="gameProviderId"
            items={{
              '': 'All',
              ...providers,
            }}
            onFilterChange={onFilterChange}
          />}
        />

        <GridColumn
          name="gameId"
          header="Game"
          filter={(onFilterChange) => <DropDownFilter
            name="gameId"
            items={{
              '': 'All',
              ...games,
            }}
            onFilterChange={onFilterChange}
          />}
        />

        <GridColumn
          name="gameSessionUUID"
          header="Game Session"
          filter={(onFilterChange) => <TextFilter
            name="gameSessionUUID"
            onFilterChange={onFilterChange}
          />}
        />

        <GridColumn
          name="playerIpAddress"
          header="Action IP"
          headerStyle={{ width: '10%' }}
          filter={(onFilterChange) => <TextFilter
            name="playerIpAddress"
            onFilterChange={onFilterChange}
          />}
        />

        <GridColumn
          name="amountWin"
          header="Amount"
          headerStyle={{ width: '5%' }}
          filter={(onFilterChange) => <TextFilter
            name="amountWin"
            onFilterChange={onFilterChange}
          />}
          render={(data, column) => <Amount amount={data[column.name]} />}
        />

        <GridColumn
          name="balance"
          header="Balance"
          headerStyle={{ width: '5%' }}
          filter={(onFilterChange) => <TextFilter
            name="balance"
            onFilterChange={onFilterChange}
          />}
          render={(data, column) => <Amount amount={data[column.name]} />}
        />

        <GridColumn
          name="stake"
          header="Stake"
          headerStyle={{ width: '5%' }}
          filter={(onFilterChange) => <TextFilter
            name="stake"
            onFilterChange={onFilterChange}
          />}
          render={(data, column) => <Amount amount={data[column.name]} />}
        />

        <GridColumn
          name="timestamp"
          header="Date"
          render={(data, column) => moment(data[column.name]).format('DD.MM.YYYY HH:mm:ss')}
          filter={(onFilterChange) => <DateRangeFilter
            onFilterChange={onFilterChange}
            isOutsideRange={(date) => date.isAfter(moment())}
          />}
        />
      </GridView>
    </div>;
  }
}

View.defaultProps = {
  items: [],
  games: {},
  providers: {},
  actions: {},
};

View.propTypes = {
  items: PropTypes.array.isRequired,
  games: PropTypes.object.isRequired,
  providers: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

export default View;
