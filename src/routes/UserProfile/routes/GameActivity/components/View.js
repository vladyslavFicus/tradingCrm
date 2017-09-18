import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import Sticky from 'react-stickynode';
import PropTypes from '../../../../../constants/propTypes';
import GridView, { GridColumn } from '../../../../../components/GridView';
import Amount from '../../../../../components/Amount';
import Uuid from '../../../../../components/Uuid';
import FilterForm from './FilterForm';
import GameRoundType from './GameRoundType/GameRoundType';

class View extends Component {
  static propTypes = {
    activity: PropTypes.pageableState(PropTypes.gamingActivityEntity).isRequired,
    games: PropTypes.shape({
      entities: PropTypes.object.isRequired,
      isLoading: PropTypes.bool.isRequired,
      receivedAt: PropTypes.number.isRequired,
    }).isRequired,
    filters: PropTypes.shape({
      data: PropTypes.shape({
        aggregators: PropTypes.arrayOf(PropTypes.string).isRequired,
        games: PropTypes.arrayOf(PropTypes.string).isRequired,
        providers: PropTypes.arrayOf(PropTypes.string).isRequired,
      }).isRequired,
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
    locale: PropTypes.string.isRequired,
  };
  static contextTypes = {
    cacheChildrenComponent: PropTypes.func.isRequired,
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
    this.context.cacheChildrenComponent(this);
  }

  componentWillUnmount() {
    this.context.cacheChildrenComponent(null);
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
    this.setState({ filters, page: 0 }, this.handleRefresh);
  };

  handleExportClick = () => {
    this.props.exportGameActivity(this.props.params.id, {
      ...this.state.filters,
      page: this.state.page,
    });
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
    const { games: { entities: games }, providers } = this.props;

    return (
      <div>
        <div className="font-weight-700">
          {
            data.gameId && games[data.gameId]
              ? games[data.gameId]
              : data.gameId
          }
        </div>
        <div className="font-size-11 text-uppercase">
          {
            data.gameProviderId && providers[data.gameProviderId]
              ? providers[data.gameProviderId]
              : data.gameProviderId
          }
        </div>
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
        <div>
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
        <div className="font-size-11 color-primary">
          RM
        </div>
      );
    } else if (data[bonus] && data[bonus].amount) {
      sources = (
        <div className="font-size-11 color-danger">
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

  renderBetAmount = data => (
    <div>
      {this.renderAmount('totalBetAmount', 'realBetAmount', 'bonusBetAmount')(data)}
      <GameRoundType gameRound={data} />
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
      gameCategories: {
        entities: gameCategories,
      },
      locale,
    } = this.props;

    return (
      <div className="profile-tab-container">
        <Sticky top=".panel-heading-row" bottomBoundary={0} innerZ="2">
          <div className="tab-header">
            <div className="tab-header__heading">
              {I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.TITLE')}
            </div>
            <div className="tab-header__actions">
              <button disabled={exporting} className="btn btn-sm btn-default-outline" onClick={this.handleExportClick}>
                {I18n.t('COMMON.EXPORT')}
              </button>
            </div>
          </div>
        </Sticky>

        <FilterForm
          providers={providers}
          aggregators={aggregators}
          games={games}
          gamesList={gamesList}
          gameCategories={gameCategories}
          onSubmit={this.handleFiltersChanged}
        />

        <div className="tab-content">
          <GridView
            dataSource={entities.content}
            tableClassName="table table-hovered data-grid-layout"
            headerClassName="text-uppercase"
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            totalPages={entities.totalPages}
            lazyLoad
            rowClassName={data => classNames({ 'round-rollback-row': data.rollback })}
            locale={locale}
            showNoResults={noResults}
          >
            <GridColumn
              name="gameRound"
              header={I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GRID_VIEW.GAME_ROUND')}
              render={this.renderGameRound}
            />
            <GridColumn
              name="game"
              header={I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GRID_VIEW.GAME')}
              render={this.renderGame}
            />
            <GridColumn
              name="betDate"
              header={I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GRID_VIEW.BET_DATE')}
              render={this.renderDate('betDate')}
            />
            <GridColumn
              name="betAmount"
              header={I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GRID_VIEW.BET_AMOUNT')}
              render={this.renderBetAmount}
            />
            <GridColumn
              name="winDate"
              header={I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GRID_VIEW.WIN_DATE')}
              render={this.renderDate('winDate', true)}
            />
            <GridColumn
              name="winAmount"
              header={I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.GRID_VIEW.WIN_AMOUNT')}
              render={this.renderAmount('totalWinAmount', 'realWinAmount', 'bonusWinAmount')}
            />
            <GridColumn
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
