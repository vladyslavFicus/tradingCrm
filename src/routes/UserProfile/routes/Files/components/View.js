import React, { Component } from 'react';
import Sticky from 'react-stickynode';
import PropTypes from '../../../../../constants/propTypes';
import { targetTypes } from '../../../../../constants/note';
import { targetTypes as fileTargetTypes } from '../../../../../components/Files/constants';
import FilesFilterForm from './FilesFilterForm';
import CommonFileGridView from '../../../components/CommonFileGridView';

class View extends Component {
  static propTypes = {
    filesUrl: PropTypes.string.isRequired,
    files: PropTypes.pageableState(PropTypes.fileEntity).isRequired,
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
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
    cacheChildrenComponent: PropTypes.func.isRequired,
  };
  state = {
    filters: {},
    page: 0,
  };

  componentWillMount() {
    this.context.cacheChildrenComponent(this);
  }

  componentDidMount() {
    this.context.setNoteChangedCallback(this.handleRefresh);
    this.context.setFileChangedCallback(this.handleRefresh);
    this.handleRefresh();
  }

  componentWillUnmount() {
    this.context.setNoteChangedCallback(null);
    this.context.setFileChangedCallback(null);
    this.context.cacheChildrenComponent(null);
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
    this.props.fetchFilesAndNotes(this.props.params.id, {
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
    this.setState({
      filters,
      page: 0,
    }, () => this.handleRefresh());
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
      files: { entities, isLoading, receivedAt },
      locale,
    } = this.props;

    return (
      <div className="profile-tab-container">
        <Sticky top=".panel-heading-row" bottomBoundary={0}>
          <div className="tab-header">
            <div className="tab-header__heading">Files</div>
            <div className="tab-header__actions">
              <button
                className="btn btn-sm btn-primary-outline"
                onClick={() => this.context.onUploadFileClick({
                  targetType: fileTargetTypes.FILES,
                })}
              >
                + Upload file
              </button>
            </div>
          </div>
        </Sticky>

        <FilesFilterForm
          onSubmit={this.handleFiltersChanged}
        />

        <div className="tab-content">
          <CommonFileGridView
            dataSource={entities.content}
            tableClassName="table table-hovered data-grid-layout"
            headerClassName="text-uppercase"
            totalPages={entities.totalPages}
            activePage={entities.number + 1}
            lazyLoad
            onPageChange={this.handlePageChanged}
            onStatusActionClick={this.handleStatusActionClick}
            onDownloadFileClick={this.handleDownloadFileClick}
            onDeleteFileClick={this.handleDeleteFileClick}
            onPreviewImageClick={this.handlePreviewImageClick}
            locale={locale}
            notFound={entities.content.length === 0 && isLoading === false && !!receivedAt}
          />
        </div>
      </div>
    );
  }
}

export default View;
