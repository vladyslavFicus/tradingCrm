import React, { Component } from 'react';
import PropTypes from '../../../../../constants/propTypes';
import { targetTypes } from '../../../../../constants/note';
import { targetTypes as fileTargetTypes } from '../../../../../components/Files/constants';
import FilesFilterForm from './FilesFilterForm';
import CommonFileGridView from '../../../components/CommonFileGridView';

class View extends Component {
  static propTypes = {
    files: PropTypes.pageableState(PropTypes.fileEntity).isRequired,
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    fetchFilesAndNotes: PropTypes.func.isRequired,
    changeFileStatusByAction: PropTypes.func.isRequired,
    downloadFile: PropTypes.func.isRequired,
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
    onUploadFileClick: PropTypes.func.isRequired,
    setFileChangedCallback: PropTypes.func.isRequired,
    onDeleteFileClick: PropTypes.func.isRequired,
  };
  state = {
    filters: {},
    page: 0,
  };

  componentDidMount() {
    this.context.setNoteChangedCallback(this.handleRefresh);
    this.context.setFileChangedCallback(this.handleRefresh);
    this.handleRefresh();
  }

  componentWillUnmount() {
    this.context.setNoteChangedCallback(null);
    this.context.setFileChangedCallback(null);
  }

  getNotePopoverParams = () => ({
    placement: 'left',
  });

  handleNoteClick = (target, data) => {
    if (data.note) {
      this.context.onEditNoteClick(target, data.note, this.getNotePopoverParams());
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
  }

  render() {
    const {
      files: {
        entities,
      },
    } = this.props;

    return (
      <div className={'tab-pane fade in active profile-tab-container'}>
        <div className="row margin-bottom-20">
          <div className="col-md-3">
            <span className="font-size-20">Files</span>
          </div>

          <div className="col-md-3 col-md-offset-6 text-right">
            <button
              className="btn btn-primary-outline"
              onClick={() => this.context.onUploadFileClick({
                targetType: fileTargetTypes.FILES,
              })}
            >
              + Upload file
            </button>
          </div>
        </div>

        <FilesFilterForm
          onSubmit={this.handleFiltersChanged}
        />

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
        />
      </div>
    );
  }
}

export default View;
