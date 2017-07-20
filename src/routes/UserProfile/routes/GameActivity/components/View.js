import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../constants/propTypes';
import GridView, { GridColumn } from '../../../../../components/GridView';
import Amount from '../../../../../components/Amount';
import Uuid from '../../../../../components/Uuid';
import FilterForm from './FilterForm';

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

  renderGameRoundType = (data) => {
    if (data.gameRoundType === 'FREE_SPIN') {
      return (
        <div className="font-size-12 color-success font-weight-700">
          FREE SPIN
        </div>
      );
    } else if (data.gameRoundType === 'BONUS_ROUND') {
      return (
        <div className="font-size-12 color-primary font-weight-700">
          BONUS ROUND
        </div>
      );
    }


    return null;
  };

  renderGameRound = data => (
    <span className={classNames({ 'text-danger': data.rollback })}>
      <div className="font-weight-700">
        <Uuid uuid={data.gameRoundId} uuidPrefix="GR" />
      </div>
      {
        data.rollback &&
        <div className="font-size-12 text-uppercase">
          {I18n.t('COMMON.ROLLBACK')}
        </div>
      }
      <div className="font-size-12 text-uppercase">
        <Uuid uuid={data.gameSessionId} uuidPrefix="GS" />
      </div>
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
          {I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.PENDING_STATUS')}
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

  renderBetAmount = data => (
    <div>
      {this.renderAmount('totalBetAmount', 'realBetAmount', 'bonusBetAmount')(data)}
      {this.renderGameRoundType(data)}
    </div>
  );

  render() {
    const {
      activity: {
        entities,
        exporting,
      },
      filters: {
        data: { games, aggregators, providers },
      },
      games: { entities: gamesList },
      gameCategories: {
        entities: gameCategories,
      },
    } = this.props;

    return (
      <div className={classNames('tab-pane fade in active profile-tab-container')}>
        <div className="row margin-bottom-20">
          <div className="col-sm-3 col-xs-6">
            <span className="font-size-20">{I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.TITLE')}</span>
          </div>

          <div className="col-sm-9 col-xs-6 text-right">
            <button disabled={exporting} className="btn btn-sm btn-default-outline" onClick={this.handleExportClick}>
              {I18n.t('COMMON.EXPORT')}
            </button>
          </div>
        </div>

        <FilterForm
          providers={providers}
          aggregators={aggregators}
          games={games}
          gamesList={gamesList}
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
        </GridView>
      </div>
    );
  }
}

export default View;
