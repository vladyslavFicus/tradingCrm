import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../constants/propTypes';
import Panel, { Title, Content } from '../../../../../components/Panel';
import FileUpload from '../../../../../components/FileUpload';
import GridView, { GridColumn } from '../../../../../components/GridView';

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
    uploadFile: PropTypes.func.isRequired,
    downloadFile: PropTypes.func.isRequired,
    clearAll: PropTypes.func.isRequired,
    resetServerGames: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
  };

  componentDidMount() {
    this.props.fetchGames();
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

  renderGame = data => (
    <div>
      <div className="font-weight-700">{data.fullGameName}</div>
      <div className="font-size-11">{data.gameId}</div>
    </div>
  );

  renderProvider = data => <div className="font-weight-700">{data.gameProviderId}</div>;

  renderPlatform = data => <div className="font-weight-700">{data.gameInfoType}</div>;

  renderTechnology = () => <div className="font-weight-700">HTML5</div>;

  renderFreeSpins = () => <div className="font-weight-700">Available</div>;

  renderStatus = () => <div className="font-weight-700 color-success text-uppercase">Active</div>

  render() {
    const {
      files: { upload, download },
      resetServerGames,
      games: { entities, noResults },
      locale,
    } = this.props;
    const disabled = upload.uploading || download.loading;

    console.log(entities);

    return (
      <div className="page-content-inner">
        <Panel withBorders>
          <Title>
            <div className="row">
              <div className="col-sm-2">
                <span className="font-size-20" id="operators-list-header">{I18n.t('GAMES.TITLE')}</span>
              </div>
              <div className="col-sm-10 text-right">
                <button
                  disabled={disabled}
                  className="btn btn-default-outline"
                  onClick={this.handleDownloadClick}
                >
                  {I18n.t('GAMES.EXPORT_BUTTON')}
                </button>
                <span className="m-x-1">
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
              </div>
            </div>
          </Title>

          <Content>
            <GridView
              locale={locale}
              tableClassName="table table-hovered data-grid-layout"
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
                header="Game"
                render={this.renderGame}
              />

              <GridColumn
                name="provider"
                header="Provider"
                render={this.renderProvider}
              />

              <GridColumn
                name="platform"
                header="Platform"
                render={this.renderPlatform}
              />

              <GridColumn
                name="technology"
                header="Technology"
                render={this.renderTechnology}
              />

              <GridColumn
                name="freeSpins"
                header="Free-spins"
                render={this.renderFreeSpins}
              />

              <GridColumn
                name="gameStatus"
                header="Status"
                render={this.renderStatus}
              />
            </GridView>
          </Content>
        </Panel>
      </div>
    );
  }
}

export default View;
