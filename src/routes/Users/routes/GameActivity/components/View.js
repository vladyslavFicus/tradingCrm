import React, { Component, PropTypes } from 'react';
import GridView, { GridColumn } from 'components/GridView';
import classNames from 'classnames';
import { TextFilter, DropDownFilter, DateRangeFilter } from 'components/Forms/Filters';
import moment from 'moment';
import { ITEMS_PER_PAGE } from '../modules/view';

const config = { tabName: 'profile' };

class View extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      filters: {
        playerUUID: this.props.params.id,
        gl2_source_input: '584ac1472ab79c00014020bc',
        'NOT gameId': 'unknown',
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
      allGames, allActions, allProviders,
    } = this.props;

    return <div id={`tab-${config.tabName}`} className={classNames('tab-pane fade in active')}>
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
              ...allActions,
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
              ...allProviders,
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
              ...allGames,
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
          header={`Amount ${currency}`}
          headerStyle={{ width: '5%' }}
          filter={(onFilterChange) => <TextFilter
            name="amountWin"
            onFilterChange={onFilterChange}
          />}
        />

        <GridColumn
          name="balance"
          header={`Balance ${currency}`}
          headerStyle={{ width: '5%' }}
          filter={(onFilterChange) => <TextFilter
            name="balance"
            onFilterChange={onFilterChange}
          />}
        />

        <GridColumn
          name="stake"
          header={`Stake ${currency}`}
          headerStyle={{ width: '5%' }}
          filter={(onFilterChange) => <TextFilter
            name="Stake"
            onFilterChange={onFilterChange}
          />}
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

View.defaultProp = {
  items: [],
};

export default View;
