import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../constants/propTypes';
import Panel, { Title, Content } from '../../../../../components/Panel';
import FileUpload from '../../../../../components/FileUpload';

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
    }),
    uploadFile: PropTypes.func.isRequired,
    downloadFile: PropTypes.func.isRequired,
    clearAll: PropTypes.func.isRequired,
    resetGames: PropTypes.func.isRequired,
  };

  componentWillUnmount() {
    this.props.clearAll();
  }

  handleDownloadClick = () => {
    this.props.downloadFile();
  };

  handleUploadFile = (errors, file) => {
    this.props.uploadFile(file, errors);
  };

  renderError = (error) => {
    try {
      return I18n.t(error);
    } catch (e) {
      return error;
    }
  };

  render() {
    const { files: { upload, download }, resetGames } = this.props;
    const error = upload.error || download.error;
    const disabled = upload.uploading || download.loading;

    return (
      <div className="page-content-inner">
        <Panel withBorders>
          <Title>
            <span className="font-size-20">{I18n.t('GAMES.TITLE')}</span>
          </Title>

          <Content>
            <div className="row">
              {
                error &&
                <div className="alert alert-danger">
                  {this.renderError(error)}
                </div>
              }
              <div className="col-md-12">
                <button disabled={disabled} className="btn btn-default-outline" onClick={resetGames}>
                  {I18n.t('GAMES.RESET_BUTTON')}
                </button>
                {` ${I18n.t('COMMON.OR')} `}
                <button disabled={disabled} className="btn btn-default-outline" onClick={this.handleDownloadClick}>
                  {I18n.t('GAMES.EXPORT_BUTTON')}
                </button>
                {` ${I18n.t('COMMON.OR')} `}
                <FileUpload
                  disabled={disabled}
                  label={I18n.t('GAMES.UPLOAD_FILE_BUTTON')}
                  allowedSize={5}
                  allowedTypes={['text/csv', 'application/vnd.ms-excel']}
                  incorrectFileType={I18n.t('ERRORS.FILE.INVALID_FILE_EXTENSION')}
                  incorrectFileSize={I18n.t('ERRORS.FILE.INVALID_FILE_SIZE')}
                  onChosen={this.handleUploadFile}
                />
              </div>
            </div>
          </Content>
        </Panel>
      </div>
    );
  }
}

export default View;
