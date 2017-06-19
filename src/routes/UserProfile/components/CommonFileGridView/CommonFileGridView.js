import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import { shortifyInMiddle } from '../../../../utils/stringFormat';
import { categoriesLabels } from '../../../../constants/files';
import { targetTypes } from '../../../../constants/note';
import GridView, { GridColumn } from '../../../../components/GridView';
import FileStatusDropDown from '../../../../components/FileStatusDropDown';
import PopoverButton from '../../../../components/PopoverButton';
import Uuid from '../../../../components/Uuid';

class CommonFileGridView extends Component {
  static propTypes = {
    headerClassName: PropTypes.string,
    tableClassName: PropTypes.string,
    dataSource: PropTypes.array.isRequired,
    onStatusActionClick: PropTypes.func.isRequired,
    onDownloadFileClick: PropTypes.func.isRequired,
    onDeleteFileClick: PropTypes.func.isRequired,
    onPreviewImageClick: PropTypes.func,
  };
  static defaultProps = {
    onPreviewImageClick: null,
  };

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

  renderFileName = (data) => {
    const isClickable = /image/.test(data.type) && this.props.onPreviewImageClick;

    return (
      <div>
        <div
          className={classNames('font-weight-700', { 'cursor-pointer': isClickable })}
          onClick={
            isClickable
              ? () => this.props.onPreviewImageClick(data)
              : null
          }
        >
          {data.name}
        </div>
        <div title={data.realName} className="font-size-12">
          {data.name === data.realName ? null : `${shortifyInMiddle(data.realName, 40)} - `}
          <Uuid uuid={data.uuid} />
        </div>
        <div className="font-size-12">
          by <Uuid uuid={data.author} uuidPrefix={
          data.author.indexOf('OPERATOR') === -1
            ? data.author.indexOf('PLAYER') === -1 ? 'PL' : null
            : null
        } />
        </div>
      </div>
    );
  };

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
        ? (data.note.pinned ? <i className="note-icon note-pinned-note" /> : <i className="note-icon note-with-text" />)
        : <i className="note-icon note-add-note" />
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
          header={I18n.t('FILES.GRID.COLUMN.NAME')}
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
          header={I18n.t('FILES.GRID.COLUMN.DATE_TIME')}
          render={this.renderDate('uploadDate')}
        />
        <GridColumn
          name="category"
          header={I18n.t('FILES.GRID.COLUMN.CATEGORY')}
          render={this.renderCategory}
        />
        <GridColumn
          name="status"
          header={I18n.t('FILES.GRID.COLUMN.STATUS')}
          render={this.renderStatus}
        />
        <GridColumn
          name="note"
          header={I18n.t('FILES.GRID.COLUMN.NOTE')}
          render={this.renderNote}
        />
      </GridView>
    );
  }
}

export default CommonFileGridView;
