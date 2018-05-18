import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../../../constants/propTypes';
import GridView, { GridViewColumn } from '../../../../../../../../../components/GridView';
import Amount from '../../../../../../../../../components/Amount';
import Uuid from '../../../../../../../../../components/Uuid';
import FilterForm from './FilterForm';
import GameRoundType from './GameRoundType/GameRoundType';
import StickyNavigation from '../../../../../components/StickyNavigation';
import './View.scss';

class View extends Component {
  static propTypes = {
    activity: PropTypes.pageableState(PropTypes.gamingActivityEntity).isRequired,
    games: PropTypes.shape({
      entities: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
      isLoading: PropTypes.bool.isRequired,
      receivedAt: PropTypes.number,
    }).isRequired,
    filters: PropTypes.shape({
      data: PropTypes.shape({
        aggregators: PropTypes.arrayOf(PropTypes.string).isRequired,
        games: PropTypes.arrayOf(PropTypes.string).isRequired,
        providers: PropTypes.arrayOf(PropTypes.string).isRequired,
      }).isRequired,
      isLoading: PropTypes.bool.isRequired,
      receivedAt: PropTypes.number,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    fetchGameActivity: PropTypes.func.isRequired,
    exportGameActivity: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    subTabRoutes: PropTypes.arrayOf(PropTypes.subTabRouteEntity).isRequired,
    filterErrors: PropTypes.objectOf(PropTypes.string).isRequired,
    notify: PropTypes.func.isRequired,
    fetchFilters: PropTypes.func.isRequired,
    fetchGames: PropTypes.func.isRequired,
  };
  static contextTypes = {
    cacheChildrenComponent: PropTypes.func.isRequired,
  };

  state = {
    filters: {},
    page: 0,
  };

  componentWillMount() {
    this.handleFiltersChanged();
    this.context.cacheChildrenComponent(this);
  }

  componentDidMount() {
    const { fetchGames, fetchFilters, match: { params: { id } } } = this.props;

    fetchGames();
    fetchFilters(id);
  }


  componentWillUnmount() {
    this.context.cacheChildrenComponent(null);
  }

  handleRefresh = () => {
    this.props.fetchGameActivity(this.props.match.params.id, {
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
    this.setState({ filters, page: 0 }, this.handleRefresh);
  };

  handleExportClick = () => {
    const { filterErrors, notify } = this.props;

    if (filterErrors.startDate && filterErrors.endDate) {
      notify({
        level: 'error',
        title: I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.NOTIFICATIONS.INVALID_DATE_RANGE.TITLE'),
        message: I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.NOTIFICATIONS.INVALID_DATE_RANGE.MESSAGE'),
      });
    } else {
      this.props.exportGameActivity(this.props.match.params.id, {
        ...this.state.filters,
        page: this.state.page,
      });
    }
  };

  renderGameRound = data => (
    <div className={classNames({ 'text-danger': data.rollback })}>
      <div className="font-weight-700">
        <Uuid uuid={data.gameRoundId} uuidPrefix="GR" />
      </div>
      {
        data.rollback &&
        <div className="font-size-11 text-uppercase">
          {I18n.t('COMMON.ROLLBACK')}
        </div>
      }
      <div className="font-size-11 text-uppercase">
        <Uuid uuid={data.gameSessionId} uuidPrefix="GS" />
      </div>
    </div>
  );

  renderGame = (data) => {
    const { games: { entities: games } } = this.props;
    const game = games.find(item => item.internalGameId === data.internalGameId || item.gameId === data.gameId);

    return (
      <div>
        <div className="font-weight-700">
          <Choose>
            <When condition={game}>{game.fullGameName}</When>
            <When condition={data.internalGameId}>{data.internalGameId}</When>
            <When condition={data.gameId}>{data.gameId}</When>
          </Choose>
        </div>
        <If condition={data.gameProviderId}>
          <div className="font-size-11 text-uppercase">
            {data.gameProviderId}
          </div>
        </If>
      </div>
    );
  };

  renderDate = (column, hasPendingStatus = false) => (data) => {
    if (!data[column]) {
      return hasPendingStatus ? (
        <span className="color-primary text-uppercase font-weight-700">
          {I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.PENDING_STATUS')}
        </span>
      ) : <span>&mdash;</span>;
    }

    return (
      <div>
        <div className="font-weight-700">{moment.utc(data[column]).local().format('DD.MM.YYYY')}</div>
        <div className="font-size-11">{moment.utc(data[column]).local().format('HH:mm:ss')}</div>
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
        <div className="game-activity__amount">
          <div className="font-size-11 color-primary">
            RM <Amount {...data[real]} />
          </div>
          <div className="font-size-11 color-danger">
            BM <Amount {...data[bonus]} />
          </div>
        </div>
      );
    } else if (data[real] && data[real].amount) {
      sources = (
        <div className="game-activity__amount font-size-11 color-primary">
          RM
        </div>
      );
    } else if (data[bonus] && data[bonus].amount) {
      sources = (
        <div className="game-activity__amount font-size-11 color-danger">
          BM
        </div>
      );
    }

    return (
      <div>
        <Amount {...data[total]} className="game-activity__amount font-weight-700" tag="div" />
        {sources}
      </div>
    );
  };

  renderBetAmount = data => (
    <div>
      {this.renderAmount('totalBetAmount', 'realBetAmount', 'bonusBetAmount')(data)}
      <GameRoundType gameRound={data} />
    </div>
  );

  renderWinAmount = data => (
    <div>
      {this.renderAmount('totalWinAmount', 'realWinAmount', 'bonusWinAmount')(data)}
      <If condition={data.jackpot}>
        <span className="game-activity__jackpot">{I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GRID_VIEW.JACKPOT')}</span>
      </If>
    </div>
  );

  renderBalance = data => (
    <div>
      <div>
        {I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GRID_VIEW.BALANCE_BEFORE')}
        {': '}
        <Amount {...data.balanceBeforeAmount} />
      </div>
      {
        data.balanceAfterAmount ? (
          <div>
            {I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GRID_VIEW.BALANCE_AFTER')}
            {': '}
            <Amount {...data.balanceAfterAmount} />
          </div>
        ) : I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GRID_VIEW.PENDING_BALANCE')
      }
    </div>
  );

  render() {
    const {
      activity: { entities, exporting, noResults },
      filters: {
        data: { games, aggregators, providers },
      },
      games: { entities: gamesList },
      locale,
      subTabRoutes,
    } = this.props;

    return (
      <div>
        <StickyNavigation links={subTabRoutes}>
          <button
            disabled={exporting}
            className="btn btn-sm btn-default-outline"
            onClick={this.handleExportClick}
          >
            {I18n.t('COMMON.EXPORT')}
          </button>
        </StickyNavigation>

        <FilterForm
          providers={providers}
          aggregators={aggregators}
          games={games}
          gamesList={gamesList}
          onSubmit={this.handleFiltersChanged}
        />

        <div className="tab-wrapper">
          <GridView
            dataSource={entities.content}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            totalPages={entities.totalPages}
            lazyLoad
            rowClassName={data => classNames({ 'round-rollback-row': data.rollback, 'game-activity__row--jackpot': data.jackpot })}
            locale={locale}
            showNoResults={noResults}
          >
            <GridViewColumn
              name="gameRound"
              header={I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GRID_VIEW.GAME_ROUND')}
              render={this.renderGameRound}
            />
            <GridViewColumn
              name="game"
              header={I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GRID_VIEW.GAME')}
              render={this.renderGame}
            />
            <GridViewColumn
              name="betDate"
              header={I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GRID_VIEW.BET_DATE')}
              render={this.renderDate('betDate')}
            />
            <GridViewColumn
              name="betAmount"
              header={I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GRID_VIEW.BET_AMOUNT')}
              render={this.renderBetAmount}
            />
            <GridViewColumn
              name="winDate"
              header={I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GRID_VIEW.WIN_DATE')}
              render={this.renderDate('winDate', true)}
            />
            <GridViewColumn
              name="winAmount"
              header={I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GRID_VIEW.WIN_AMOUNT')}
              render={this.renderWinAmount}
            />
            <GridViewColumn
              name="winDate"
              header={I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GRID_VIEW.BALANCE')}
              render={this.renderBalance}
            />
          </GridView>
        </div>
      </div>
    );
  }
}

export default View;
