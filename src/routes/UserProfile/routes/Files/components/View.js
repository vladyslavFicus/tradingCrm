import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import PropTypes from '../../../../../constants/propTypes';
import GridView, { GridColumn } from '../../../../../components/GridView';
import Amount from '../../../../../components/Amount';
import { shortify } from '../../../../../utils/uuid';
import { targetTypes } from '../../../../../constants/note';
import NoteButton from '../../../../../components/NoteButton';
import { categoriesLabels, statusesLabels } from '../../../../../constants/files';
import FilesFilterForm from './FilesFilterForm';

class View extends Component {
  static propTypes = {
    files: PropTypes.pageableState(PropTypes.fileEntity).isRequired,
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    fetchFiles: PropTypes.func.isRequired,
    downloadFile: PropTypes.func.isRequired,
    deleteFile: PropTypes.func.isRequired,
  };

  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
  };

  state = {
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
    this.props.fetchFiles(this.props.params.id, {
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

  handleUploadFileClick = () => {

  };

  handleDownloadClick = (e, data) => {
    e.preventDefault();

    this.props.downloadFile(this.props.params.id, data.uuid);
  };

  handleRemoveClick = (e, data) => {
    e.preventDefault();

    this.props.deleteFile(this.props.params.id, data.uuid);
  };

  renderFileName = data => (
    <div>
      <div className="font-weight-700">
        {data.name}
        <span className="margin-left-5">
          <a href="#" onClick={() => this.handleDownloadClick(e, data)}>
            <i className="fa fa-download" />
          </a>
          {' '}
          <a href="#" className="color-danger" onClick={() => this.handleDownloadClick(e, data)}>
            <i className="fa fa-trash" />
          </a>
        </span>
      </div>
      <div>
        {data.name === data.realName ? null : data.realName} - {shortify(data.uuid)}
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
    const { value: status } = data.status;

    return (
      <div className="font-weight-700">
        {
          status && statusesLabels[status]
            ? statusesLabels[status]
            : status
        }
      </div>
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
      </div>
    );
  }
}

export default View;
