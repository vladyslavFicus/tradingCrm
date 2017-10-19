import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../constants/propTypes';
import Card, { Title, Content } from '../../../../../components/Card';
import FileUpload from '../../../../../components/FileUpload';
import GridView, { GridColumn } from '../../../../../components/GridView';
import GameStatus from './GameStatus';
import GamesGridFilter from './GamesGridFilter';
import { withLines } from '../../../../../constants/games';

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
    fetchCategories: PropTypes.func.isRequired,
    games: PropTypes.pageableState(PropTypes.gameEntity).isRequired,
    uploadFile: PropTypes.func.isRequired,
    downloadFile: PropTypes.func.isRequired,
    clearAll: PropTypes.func.isRequired,
    resetServerGames: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    resetGames: PropTypes.func.isRequired,
    filters: PropTypes.shape({
      data: PropTypes.shape({
        categories: PropTypes.arrayOf(PropTypes.string).isRequired,
        withLines: PropTypes.object.isRequired,
        type: PropTypes.object.isRequired,
        gameProvider: PropTypes.object.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = {
    filters: {},
    page: 0,
  };

  componentDidMount() {
    this.props.fetchCategories();
    this.handleRefresh();
  }

  componentWillUnmount() {
    this.props.clearAll();
  }

  handleDownloadClick = () => {
    this.props.downloadFile();
  };

  handleUploadFile = (errors, file) => {
    this.props.uploadFile(file, errors);
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
    </div>
  );

  renderProvider = data => <div className="font-weight-700 first-letter-big">{data.gameProviderId}</div>;

  renderPlatform = data => <div className="font-weight-700">{data.gameInfoType}</div>;

  renderFreeSpins = data => (
    <div className="font-weight-700">
      {
        data.lines
          ? <span>{I18n.t('GAMES.GRID.FREE_SPINS_AVAILABLE')}</span>
          : <span>{I18n.t('GAMES.GRID.FREE_SPINS_UNAVAILABLE')}</span>
      }
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
      <div className="page-content-inner">
        <Card>
          <Title>
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
              <FileUpload
                disabled={disabled}
                label={I18n.t('GAMES.UPLOAD_FILE_BUTTON')}
                allowedSize={5}
                allowedTypes={['text/csv', 'application/vnd.ms-excel']}
                incorrectFileType={I18n.t('ERRORS.FILE.INVALID_FILE_EXTENSION')}
                incorrectFileSize={I18n.t('ERRORS.FILE.INVALID_FILE_SIZE')}
                onChosen={this.handleUploadFile}
              />
            </span>
            <button
              disabled={disabled}
              className="btn btn-default-outline"
              onClick={resetServerGames}
            >
              {I18n.t('GAMES.RESET_BUTTON')}
            </button>
          </Title>

          <GamesGridFilter
            onSubmit={this.handleFiltersChanged}
            onReset={this.handleFilterReset}
            disabled={!allowActions}
            {...availableFilters}
          />

          <Content>
            <GridView
              locale={locale}
              tableClassName="table data-grid-layout"
              headerClassName="text-uppercase"
              dataSource={entities.content}
              onPageChange={this.handlePageChanged}
              activePage={entities.number + 1}
              totalPages={entities.totalPages}
              lazyLoad
              showNoResults={noResults}
            >
              <GridColumn
                name="game"
                header={I18n.t('GAMES.GRID.GAME')}
                render={this.renderGame}
              />

              <GridColumn
                name="provider"
                header={I18n.t('GAMES.GRID.PROVIDER')}
                render={this.renderProvider}
              />

              <GridColumn
                name="platform"
                header={I18n.t('GAMES.GRID.PLATFORM')}
                render={this.renderPlatform}
              />

              <GridColumn
                name="freeSpins"
                header={I18n.t('GAMES.GRID.FREE_SPINS')}
                render={this.renderFreeSpins}
              />

              <GridColumn
                name="gameStatus"
                header={I18n.t('GAMES.GRID.STATUS')}
                render={data => <GameStatus status={data} />}
              />
            </GridView>
          </Content>
        </Card>
      </div>
    );
  }
}

export default View;
