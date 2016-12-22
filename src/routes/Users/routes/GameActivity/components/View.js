import React, { Component, PropTypes } from 'react';
import GridView, { GridColumn } from 'components/GridView';
import classNames from 'classnames';
import { TextFilter, DropDownFilter, DateRangeFilter } from 'components/Forms/Filters';
import { actions, actionsLabels } from '../constants';
import moment from 'moment';
import Amount from 'components/Amount';

class View extends Component {
  constructor(props) {
    super(props);

    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.handleFiltersChanged = this.handleFiltersChanged.bind(this);

    this.renderGame = this.renderGame.bind(this);
    this.renderProvider = this.renderProvider.bind(this);
  }

  handlePageChanged(page, filters) {
    if (!this.props.isLoading) {
      this.props.fetchGameActivity(this.props.params.id, { ...filters, page: page - 1, });
    }
  }

  handleFiltersChanged(filters) {
    this.props.fetchGameActivity(this.props.params.id, { ...filters, page: 0, });
  }

  componentWillMount() {
    this.handleFiltersChanged();
  }

  renderEntityAction(data, column) {
    return actionsLabels[data.gameEvent[column.name]] || data.gameEvent[column.name];
  }

  renderGame(data, column) {
    const { games } = this.props;

    return games[data.gameEvent[column.name]] || data.gameEvent[column.name];
  }

  renderProvider(data, column) {
    const { providers } = this.props;

    return providers[data.gameEvent[column.name]] || data.gameEvent[column.name];
  }

  renderAmount(data) {
    return <Amount amount={actions.WinCollectedEvent === data.name ? data.gameEvent.amountWin : data.gameEvent.stake}/>;
  }

  render() {
    const {
      entities,
      games,
      providers,
    } = this.props;

    return <div className={classNames('tab-pane fade in active')}>
      <GridView
        dataSource={entities.content}
        onFiltersChanged={this.handleFiltersChanged}
        onPageChange={this.handlePageChanged}
        activePage={entities.number + 1}
        totalPages={entities.totalPages}
      >
        <GridColumn
          name="name"
          header="Action"
          render={this.renderEntityAction}
          filter={(onFilterChange) => <DropDownFilter
            name="name"
            items={{
              '': 'All',
              ...actionsLabels,
            }}
            onFilterChange={onFilterChange}
          />}
        />

        <GridColumn
          name="gameProviderId"
          header="Game Provider"
          render={this.renderProvider}
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
          render={this.renderGame}
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
          render={(data, column) => data.gameEvent[column.name]}
          filter={(onFilterChange) => <TextFilter
            name="gameSessionUUID"
            onFilterChange={onFilterChange}
          />}
        />

        <GridColumn
          name="playerIpAddress"
          header="Action IP"
          headerStyle={{ width: '10%' }}
          render={(data, column) => data.gameEvent[column.name]}
        />

        <GridColumn
          name="amount"
          header="Amount"
          headerStyle={{ width: '5%' }}
          render={this.renderAmount}
        />

        <GridColumn
          name="balance"
          header="Balance"
          headerStyle={{ width: '5%' }}
          render={(data, column) => <Amount amount={data.gameEvent[column.name]}/>}
        />

        <GridColumn
          name="dateTime"
          header="Date"
          render={(data, column) => data[column.name]
            ? moment(data[column.name]).format('DD.MM.YYYY HH:mm:ss')
            : null
          }
          filter={(onFilterChange) => <DateRangeFilter
            onFilterChange={onFilterChange}
            isOutsideRange={(date) => moment() <= date}
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
};

export default View;
