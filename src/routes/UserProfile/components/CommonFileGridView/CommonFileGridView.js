import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { shortify } from '../../../../utils/uuid';
import { categoriesLabels } from '../../../../constants/files';
import { targetTypes } from '../../../../constants/note';
import GridView, { GridColumn } from '../../../../components/GridView';
import FileStatusDropDown from '../../../../components/FileStatusDropDown';
import PopoverButton from '../../../../components/PopoverButton';

class CommonFileGridView extends Component {
  static propTypes = {
    headerClassName: PropTypes.string,
    tableClassName: PropTypes.string,
    dataSource: PropTypes.array.isRequired,
    onStatusActionClick: PropTypes.func.isRequired,
    onDownloadFileClick: PropTypes.func.isRequired,
    onDeleteFileClick: PropTypes.func.isRequired,
  }

  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
  };

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

  renderFileName = data => (
    <div>
      <div className="font-weight-700">
        {data.name}
      </div>
      <div className="font-size-12">
        {data.name === data.realName ? null : `${data.realName} - `}{shortify(data.uuid)}
      </div>
      <div className="font-size-12">
        by {shortify(data.author, data.author.indexOf('OPERATOR') === -1 ? 'PL' : '')}
      </div>
    </div>
  );

  renderActions = data => (
    <span className="margin-left-5">
      <button className="btn-transparent" onClick={e => this.props.onDownloadFileClick(e, data)}>
        <i className="fa fa-download" />
      </button>
      {' '}
      <button className="btn-transparent color-danger" onClick={e => this.props.onDeleteFileClick(e, data)}>
        <i className="fa fa-trash" />
      </button>
    </span>
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

  renderStatus = data => (
    <FileStatusDropDown
      status={data.status}
      onStatusChange={action => this.props.onStatusActionClick(data.uuid, action)}
    />
  );

  renderNote = data => (
    <PopoverButton
      id={`file-item-note-button-${data.fileId}`}
      className="cursor-pointer margin-right-5"
      onClick={id => this.handleNoteClick(id, data)}
    >
      {data.note
        ? <i className="fa fa-sticky-note" />
        : <i className="fa fa-sticky-note-o" />
      }
    </PopoverButton>
  );

  render() {
    const { onStatusActionClick, onDownloadFileClick, onDeleteFileClick, ...rest } = this.props;

    return (
      <GridView
        {...rest}
      >
        <GridColumn
          name="fileName"
          header="File"
          render={this.renderFileName}
        />
        <GridColumn
          name="actions"
          header=""
          headerClassName="width-60"
          render={this.renderActions}
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
    );
  }
}

export default CommonFileGridView;
