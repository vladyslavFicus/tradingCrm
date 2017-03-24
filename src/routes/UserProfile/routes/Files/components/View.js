import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from '../../../../../constants/propTypes';
import GridView, { GridColumn } from '../../../../../components/GridView';
import { shortify } from '../../../../../utils/uuid';
import { targetTypes } from '../../../../../constants/note';
import NoteButton from '../../../../../components/NoteButton';
import { categoriesLabels } from '../../../../../constants/files';
import UploadModal from './UploadModal';
import FilesFilterForm from './FilesFilterForm';
import FileStatusDropDown from './FileStatusDropDown';
import DeleteModal from "./DeleteModal/DeleteModal";

const DELETE_MODAL = 'delete-modal';
const UPLOAD_MODAL = 'upload-modal';
const modalInitialState = {
  name: null,
  params: {},
};

class View extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    files: PropTypes.pageableState(PropTypes.fileEntity).isRequired,
    uploading: PropTypes.object.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    fetchFilesAndNotes: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
    downloadFile: PropTypes.func.isRequired,
    changeStatusByAction: PropTypes.func.isRequired,
    deleteFile: PropTypes.func.isRequired,
    saveFiles: PropTypes.func.isRequired,
    cancelFile: PropTypes.func.isRequired,
    resetUploading: PropTypes.func.isRequired,
  };

  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
  };

  state = {
    modal: { ...modalInitialState },
    filters: {},
    page: 0,
  };

  componentDidMount() {
    this.context.setNoteChangedCallback(this.handleRefresh);

    this.handleRefresh();
  }

  componentWillUnmount() {
    this.context.setNoteChangedCallback(null);
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

  handleUploadFile = (errors, file) => {
    this.props.uploadFile(file);
  };

  handleUploadFileClick = () => {
    this.setState({
      modal: {
        name: UPLOAD_MODAL,
        params: {
          profile: this.props.profile.data,
        },
      },
    });
  };

  handleDownloadClick = (e, data) => {
    e.preventDefault();

    this.props.downloadFile(data);
  };

  handleDeleteClick = (e, data) => {
    e.preventDefault();

    this.setState({
      modal: {
        name: DELETE_MODAL,
        params: {
          file: data,
          onSuccess: this.handleDelete.bind(null, data),
        },
      },
    });
  };

  handleDelete = async (data) => {
    this.handleCloseModal(async () => {
      await this.props.deleteFile(this.props.params.id, data.uuid);
      this.handleRefresh();
    });
  };

  handleUploadingFileDelete = (file) => {
    this.props.cancelFile(file);
  };

  handleStatusActionClick = (file, action) => {
    this.props.changeStatusByAction(file.uuid, action);
  };

  handleSubmitUploadModal = async (data) => {
    this.handleCloseModal(async () => {
      await this.props.saveFiles(this.props.params.id, data);
      this.props.resetUploading();
      this.handleRefresh();
    });
  };

  handleCloseUploadModal = () => {
    this.handleCloseModal(this.props.resetUploading);
  };

  handleCloseModal = (callback) => {
    this.setState({ modal: { ...modalInitialState } }, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  };

  renderFileName = data => (
    <div>
      <div className="font-weight-700">
        {data.name}
        <span className="margin-left-5">
          <a href="#" onClick={(e) => this.handleDownloadClick(e, data)}>
            <i className="fa fa-download" />
          </a>
          {' '}
          <a href="#" className="color-danger" onClick={(e) => this.handleDeleteClick(e, data)}>
            <i className="fa fa-trash" />
          </a>
        </span>
      </div>
      <div>
        {data.name === data.realName ? null : `${data.realName} - `}{shortify(data.uuid)}
      </div>
      <div>
        by {shortify(data.author, data.author.indexOf('OPERATOR') === -1 ? 'PL' : '')}
      </div>
    </div>
  );

  renderDate = column => data => (
    <div>
      <div className="font-weight-700">{moment(data[column]).format('DD.MM.YYYY')}</div>
      <div className="font-size-12">{moment(data[column]).format('HH:mm:ss')}</div>
    </div>
  );

  renderCategory = data => (
    <div className="font-weight-700">
      {
        data.category && categoriesLabels[data.category]
          ? categoriesLabels[data.category]
          : data.category
      }
    </div>
  );

  renderStatus = (data) => {
    return (
      <FileStatusDropDown
        file={data}
        onActionClick={this.handleStatusActionClick}
      />
    );
  };

  renderNote = data => (
    <NoteButton
      id={`file-item-note-button-${data.fileId}`}
      className="cursor-pointer margin-right-5"
      onClick={id => this.handleNoteClick(id, data)}
    >
      {data.note
        ? <i className="fa fa-sticky-note" />
        : <i className="fa fa-sticky-note-o" />
      }
    </NoteButton>
  );

  render() {
    const { modal } = this.state;
    const {
      files: {
        entities,
      },
      uploading,
    } = this.props;

    return (
      <div className={'tab-pane fade in active profile-tab-container'}>
        <div className="row margin-bottom-20">
          <div className="col-md-3">
            <span className="font-size-20">Files</span>
          </div>

          <div className="col-md-3 col-md-offset-6 text-right">
            <button className="btn btn-primary-outline" onClick={this.handleUploadFileClick}>
              + Upload file
            </button>
          </div>
        </div>

        <FilesFilterForm
          onSubmit={this.handleFiltersChanged}
        />

        <GridView
          dataSource={entities.content}
          tableClassName="table table-hovered data-grid-layout"
          headerClassName="text-uppercase"
          onFiltersChanged={this.handleFiltersChanged}
          onPageChange={this.handlePageChanged}
          activePage={entities.number + 1}
          totalPages={entities.totalPages}
          lazyLoad
        >
          <GridColumn
            name="fileName"
            header="File"
            render={this.renderFileName}
          />
          <GridColumn
            name="date"
            header="Date & Time"
            render={this.renderDate('uploadDate')}
          />
          <GridColumn
            name="category"
            header="Category"
            render={this.renderCategory}
          />
          <GridColumn
            name="status"
            header="Status"
            render={this.renderStatus}
          />
          <GridColumn
            name="note"
            header="Note"
            render={this.renderNote}
          />
        </GridView>

        {
          modal.name === UPLOAD_MODAL &&
          <UploadModal
            {...modal.params}
            isOpen
            uploading={Object.values(uploading)}
            onUploadFile={this.handleUploadFile}
            onCancelFile={this.handleUploadingFileDelete}
            onSubmit={this.handleSubmitUploadModal}
            onClose={this.handleCloseUploadModal}
          />
        }
        {
          modal.name === DELETE_MODAL &&
          <DeleteModal
            {...modal.params}
            isOpen
            profile={this.props.profile.data}
            onClose={this.handleCloseModal}
          />
        }
      </div>
    );
  }
}

export default View;
