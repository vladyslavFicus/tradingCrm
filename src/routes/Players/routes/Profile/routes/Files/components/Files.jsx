import React, { Component, Fragment } from 'react';
import PropTypes from '../../../../../../../constants/propTypes';
import { targetTypes } from '../../../../../../../constants/note';
import { targetTypes as fileTargetTypes } from '../../../../../../../components/Files/constants';
import FilesFilterForm from './FilesFilterForm';
import CommonFileGridView from '../../../components/CommonFileGridView';
import TabHeader from '../../../../../../../components/TabHeader';

class Files extends Component {
  static propTypes = {
    filesUrl: PropTypes.string.isRequired,
    files: PropTypes.pageableState(PropTypes.fileEntity).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    fetchFilesAndNotes: PropTypes.func.isRequired,
    changeFileStatusByAction: PropTypes.func.isRequired,
    downloadFile: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
    onUploadFileClick: PropTypes.func.isRequired,
    setFileChangedCallback: PropTypes.func.isRequired,
    onDeleteFileClick: PropTypes.func.isRequired,
    showImages: PropTypes.func.isRequired,
    registerUpdateCacheListener: PropTypes.func.isRequired,
    unRegisterUpdateCacheListener: PropTypes.func.isRequired,
  };
  state = {
    filters: {},
    page: 0,
  };

  componentDidMount() {
    const {
      context: {
        registerUpdateCacheListener,
        setNoteChangedCallback,
        setFileChangedCallback
      },
      constructor: { name },
      handleRefresh,
    } = this;


    handleRefresh();
    setNoteChangedCallback(handleRefresh);
    setFileChangedCallback(handleRefresh);
    registerUpdateCacheListener(name, handleRefresh);
  }

  componentWillUnmount() {
    const {
      context: {
        unRegisterUpdateCacheListener,
        setNoteChangedCallback,
        setFileChangedCallback,
      },
      constructor: { name },
    } = this;

    setNoteChangedCallback(null);
    setFileChangedCallback(null);
    unRegisterUpdateCacheListener(name);
  }

  getNotePopoverParams = () => ({
    placement: 'left',
  });

  handleNoteClick = (target, note, data) => {
    if (note) {
      this.context.onEditNoteClick(target, note, this.getNotePopoverParams());
    } else {
      this.context.onAddNoteClick(data.uuid, targetTypes.FILE)(target, this.getNotePopoverParams());
    }
  };

  handleRefresh = () => {
    this.props.fetchFilesAndNotes(this.props.match.params.id, {
      ...this.state.filters,
      page: this.state.page,
    });
  };

  handlePageChanged = (page) => {
    if (!this.props.files.isLoading) {
      this.setState({ page: page - 1 }, () => this.handleRefresh());
    }
  };

  handleFiltersChanged = (filters = {}) => {
    this.setState({ filters, page: 0 }, this.handleRefresh);
  };

  handleStatusActionClick = (uuid, action) => {
    this.props.changeFileStatusByAction(uuid, action);
  };

  handleDownloadFileClick = (e, data) => {
    e.preventDefault();

    this.props.downloadFile(data);
  };

  handleDeleteFileClick = (e, data) => {
    this.context.onDeleteFileClick(e, data);
  };

  handlePreviewImageClick = (data) => {
    this.context.showImages(`${this.props.filesUrl}${data.uuid}`, data.type);
  };

  render() {
    const {
      files: { entities, noResults },
      locale,
    } = this.props;

    return (
      <Fragment>
        <TabHeader title="Files">
          <button
            type="button"
            className="btn btn-sm btn-primary-outline"
            onClick={() => this.context.onUploadFileClick({
              targetType: fileTargetTypes.FILES,
            })}
          >
            + Upload file
          </button>
        </TabHeader>
        <FilesFilterForm
          onSubmit={this.handleFiltersChanged}
        />
        <div className="tab-wrapper">
          <CommonFileGridView
            dataSource={entities.content}
            totalPages={entities.totalPages}
            activePage={entities.number + 1}
            lazyLoad
            onPageChange={this.handlePageChanged}
            onStatusActionClick={this.handleStatusActionClick}
            onDownloadFileClick={this.handleDownloadFileClick}
            onDeleteFileClick={this.handleDeleteFileClick}
            onPreviewImageClick={this.handlePreviewImageClick}
            locale={locale}
            showNoResults={noResults}
          />
        </div>
      </Fragment>
    );
  }
}

export default Files;
