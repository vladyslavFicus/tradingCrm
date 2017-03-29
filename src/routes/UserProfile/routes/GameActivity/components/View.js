import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import PropTypes from '../../../../../constants/propTypes';
import GridView, { GridColumn } from '../../../../../components/GridView';
import Amount from '../../../../../components/Amount';
import { shortify } from '../../../../../utils/uuid';
import FilterForm from './FilterForm';

class View extends Component {
  static propTypes = {
    activity: PropTypes.pageableState(PropTypes.gamingActivityEntity).isRequired,
    games: PropTypes.shape({
      entities: PropTypes.object.isRequired,
      isLoading: PropTypes.bool.isRequired,
      receivedAt: PropTypes.number.isRequired,
    }).isRequired,
    gameCategories: PropTypes.shape({
      entities: PropTypes.object.isRequired,
      isLoading: PropTypes.bool.isRequired,
      receivedAt: PropTypes.number.isRequired,
    }).isRequired,
    providers: PropTypes.object.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    fetchGameActivity: PropTypes.func.isRequired,
    exportGameActivity: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isLoading: false,
  };

  state = {
    filters: {},
    page: 0,
  };

  componentWillMount() {
    this.handleFiltersChanged();
  }

  handleRefresh = () => {
    this.props.fetchGameActivity(this.props.params.id, {
      ...this.state.filters,
      page: this.state.page,
    });
  };

  handlePageChanged = (page) => {
    if (!this.props.activity.isLoading) {
      this.setState({ page: page - 1 }, () => this.handleRefresh());
    }
  };

  handleFiltersChanged = (filters = {}) => {
    this.setState({
      filters,
      page: 0,
    }, () => this.handleRefresh());
  };

  handleExportClick = () => {
    this.props.exportGameActivity(this.props.params.id, {
      ...this.state.filters,
      page: this.state.page,
    });
  };

  renderGameRound = data => (
    <span>
      <div className="font-weight-700">{shortify(data.gameRoundId, 'GR')}</div>
      <span className="font-size-12 text-uppercase">
        {shortify(data.gameSessionId, 'GS')}
      </span>
    </span>
  );

  renderGame = (data) => {
    const { games: { entities: games }, providers } = this.props;

    return (
      <span>
        <div className="font-weight-700">
          {
            data.gameId && games[data.gameId]
              ? games[data.gameId]
              : data.gameId
          }
        </div>
        <span className="font-size-12 text-uppercase">
          {
            data.gameProviderId && providers[data.gameProviderId]
              ? providers[data.gameProviderId]
              : data.gameProviderId
          }
        </span>
      </span>
    );
  };

  renderDate = (column, hasPendingStatus = false) => (data) => {
    if (!data[column]) {
      return hasPendingStatus ? (
        <span className="color-primary text-uppercase font-weight-700">
          Pending
        </span>
      ) : <span>&mdash;</span>;
    }

    return (
      <div>
        <div className="font-weight-700">{moment(data[column]).format('DD.MM.YYYY')}</div>
        <div className="font-size-12">{moment(data[column]).format('HH:mm:ss')}</div>
      </div>
    );
  };

  renderAmount = (total, real, bonus) => (data) => {
    let sources = null;

    if (!data[total]) {
      return null;
    }

    if (data[real] && data[real].amount && data[bonus] && data[bonus].amount) {
      sources = (
        <div>
          <div className="font-size-12 color-primary">
            RM <Amount {...data[real]} />
          </div>
          <div className="font-size-12 color-danger">
            BM <Amount {...data[bonus]} />
          </div>
        </div>
      );
    } else if (data[real] && data[real].amount) {
      sources = (
        <div className="font-size-12 color-primary">
          RM
        </div>
      );
    } else if (data[bonus] && data[bonus].amount) {
      sources = (
        <div className="font-size-12 color-danger">
          BM
        </div>
      );
    }

    return (
      <div>
        <Amount {...data[total]} className="font-weight-700" tag="div" />
        {sources}
      </div>
    );
  };

  render() {
    const {
      activity: {
        entities,
        exporting,
      },
      games: {
        entities: games,
      },
      gameCategories: {
        entities: gameCategories,
      },
    } = this.props;

    return (
      <div className={classNames('tab-pane fade in active profile-tab-container')}>
        <div className="row margin-bottom-20">
          <div className="col-md-3">
            <span className="font-size-20">Game Activity</span>
          </div>

          <div className="col-md-3 col-md-offset-6 text-right">
            <button disabled={exporting} className="btn btn-default-outline" onClick={this.handleExportClick}>
              Export
            </button>
          </div>
        </div>

        <FilterForm
          games={games}
          gameCategories={gameCategories}
          onSubmit={this.handleFiltersChanged}
        />

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
            name="gameRound"
            header="Game round"
            render={this.renderGameRound}
          />
          <GridColumn
            name="game"
            header="Game"
            render={this.renderGame}
          />
          <GridColumn
            name="betDate"
            header="Bet date"
            render={this.renderDate('betDate')}
          />
          <GridColumn
            name="betAmount"
            header="Bet amount"
            render={this.renderAmount('totalBetAmount', 'realBetAmount', 'bonusBetAmount')}
          />
          <GridColumn
            name="winDate"
            header="Win date"
            render={this.renderDate('winDate', true)}
          />
          <GridColumn
            name="winAmount"
            header="Win amount"
            render={this.renderAmount('totalWinAmount', 'realWinAmount', 'bonusWinAmount')}
          />
        </GridView>
      </div>
    );
  }
}

export default View;
