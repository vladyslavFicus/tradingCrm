import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../constants/propTypes';
import GridView, { GridViewColumn } from '../../../../../components/GridView';
import GameStatus from './GameStatus';
import GamesGridFilter from './GamesGridFilter';
import { withLines } from '../../../../../constants/games';
import Uuid from '../../../../../components/Uuid/Uuid';

class View extends Component {
  static propTypes = {
    files: PropTypes.shape({
      download: PropTypes.shape({
        error: PropTypes.object,
        loading: PropTypes.bool.isRequired,
      }).isRequired,
      upload: PropTypes.shape({
        error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        uploading: PropTypes.bool.isRequired,
        progress: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
    fetchGames: PropTypes.func.isRequired,
    games: PropTypes.pageableState(PropTypes.gameEntity).isRequired,
    downloadFile: PropTypes.func.isRequired,
    clearAll: PropTypes.func.isRequired,
    resetServerGames: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    getFilterProviders: PropTypes.func.isRequired,
    resetGames: PropTypes.func.isRequired,
    filters: PropTypes.shape({
      data: PropTypes.shape({
        withLines: PropTypes.object.isRequired,
        type: PropTypes.object.isRequired,
        gameProvider: PropTypes.arrayOf(PropTypes.string).isRequired,
      }).isRequired,
    }).isRequired,
    modals: PropTypes.shape({
      importModal: PropTypes.shape({
        show: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = {
    filters: {},
    page: 0,
  };

  componentDidMount() {
    this.handleRefresh();
    this.props.getFilterProviders();
  }

  componentWillUnmount() {
    this.props.clearAll();
  }

  handleDownloadClick = () => {
    this.props.downloadFile();
  };

  handleUploadFile = () => {
    this.props.modals.importModal.show();
  };

  handleRefresh = () => this.props.fetchGames({
    ...this.state.filters,
    page: this.state.page,
  });

  handlePageChanged = (page) => {
    if (!this.props.games.isLoading) {
      this.setState({ page: page - 1 }, () => this.handleRefresh());
    }
  };

  handleFiltersChanged = (data = {}) => {
    const filters = { ...data };

    if (filters.withLines === withLines.AVAILABLE) {
      filters.withLines = true;
    }

    if (filters.withLines === withLines.UNAVAILABLE) {
      filters.withLines = false;
    }

    return this.setState({ filters, page: 0 }, this.handleRefresh);
  };

  handleFilterReset = () => {
    this.props.resetGames();
    this.setState({ filters: {}, page: 0 }, this.handleRefresh);
  };

  renderGame = data => (
    <div>
      <div className="font-weight-700">{data.fullGameName}</div>
      <div className="font-size-11">{data.gameId}</div>
      <div className="font-size-11">
        <strong>ID</strong>{': '}
        <Uuid
          uuid={data.internalGameId}
          notificationMessage={I18n.t('COMMON.NOTIFICATIONS.COPY_INTERNAL_GAME_ID.MESSAGE')}
        />
      </div>
    </div>
  );

  renderProvider = data => <div className="font-weight-700 first-letter-big">{data.gameProviderId}</div>;

  renderPlatform = data => <div className="font-weight-700">{data.gameInfoType}</div>;

  renderFreeSpins = data => (
    <div className="font-weight-700">
      <Choose>
        <When condition={data.freeSpinSupported}>
          {I18n.t('GAMES.GRID.FREE_SPINS_AVAILABLE')}
        </When>
        <Otherwise>
          {I18n.t('GAMES.GRID.FREE_SPINS_UNAVAILABLE')}
        </Otherwise>
      </Choose>
    </div>
  );

  render() {
    const {
      files: { upload, download },
      resetServerGames,
      games: { entities, noResults },
      locale,
      filters: { data: availableFilters },
    } = this.props;
    const disabled = upload.uploading || download.loading;
    const { filters } = this.state;
    const allowActions = Object.keys(filters).filter(i => filters[i]).length > 0;

    return (
      <div className="card">
        <div className="card-heading">
          <span className="font-size-20 mr-auto" id="operators-list-header">
            {I18n.t('GAMES.TITLE')}
          </span>

          <button
            disabled={disabled}
            className="btn btn-default-outline"
            onClick={this.handleDownloadClick}
          >
            {I18n.t('GAMES.EXPORT_BUTTON')}
          </button>
          <span className="mx-3">
            <button
              disabled={disabled}
              className="btn btn-default-outline"
              onClick={this.handleUploadFile}
            >
              {I18n.t('GAMES.UPLOAD_FILE_BUTTON')}
            </button>
          </span>
          <button
            disabled={disabled}
            className="btn btn-default-outline"
            onClick={resetServerGames}
          >
            {I18n.t('GAMES.RESET_BUTTON')}
          </button>
        </div>

        <GamesGridFilter
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          disabled={!allowActions}
          {...availableFilters}
        />

        <div className="card-body">
          <GridView
            locale={locale}
            dataSource={entities.content}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            totalPages={entities.totalPages}
            lazyLoad
            showNoResults={noResults}
          >
            <GridViewColumn
              name="game"
              header={I18n.t('GAMES.GRID.GAME')}
              render={this.renderGame}
            />

            <GridViewColumn
              name="provider"
              header={I18n.t('GAMES.GRID.PROVIDER')}
              render={this.renderProvider}
            />

            <GridViewColumn
              name="platform"
              header={I18n.t('GAMES.GRID.PLATFORM')}
              render={this.renderPlatform}
            />

            <GridViewColumn
              name="freeSpins"
              header={I18n.t('GAMES.GRID.FREE_SPINS')}
              render={this.renderFreeSpins}
            />

            <GridViewColumn
              name="gameStatus"
              header={I18n.t('GAMES.GRID.STATUS')}
              render={data => <GameStatus status={data} />}
            />
          </GridView>
        </div>
      </div>
    );
  }
}

export default View;
