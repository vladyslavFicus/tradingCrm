import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { shortifyInMiddle } from 'utils/stringFormat';
import { categoriesLabels } from 'constants/files';
import { targetTypes } from 'constants/note';
import PermissionContent from 'components/PermissionContent';
import GridView, { GridViewColumn } from 'components/GridView';
import FileStatusDropDown from 'components/FileStatusDropDown';
import NoteButton from 'components/NoteButton';
import GridEmptyValue from 'components/GridEmptyValue';
import Uuid from 'components/Uuid';
import permissions from 'config/permissions';

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
    headerClassName: null,
    tableClassName: null,
    onPreviewImageClick: null,
  };

  renderFileName = (data) => {
    const isClickable = /image/.test(data.type) && this.props.onPreviewImageClick;
    const onClick = isClickable
      ? () => this.props.onPreviewImageClick(data)
      : null;
    const playerPrefix = data.author.indexOf('PLAYER') === -1 ? 'PL' : null;
    const uuidPrefix = data.author.indexOf('OPERATOR') === -1 ? playerPrefix : null;

    return (
      <div>
        <div
          className={classNames('font-weight-700', { 'cursor-pointer': isClickable })}
          onClick={onClick}
        >
          {data.name}
        </div>
        <div title={data.realName} className="font-size-11">
          {data.name === data.realName ? null : `${shortifyInMiddle(data.realName, 40)} - `}
          <Uuid uuid={data.uuid} />
        </div>
        <div className="font-size-11">
          {'by '}
          <Uuid
            uuid={data.author}
            uuidPrefix={uuidPrefix}
          />
        </div>
      </div>
    );
  };

  renderActions = data => (
    <span className="margin-left-5">
      <button type="button" className="btn-transparent" onClick={() => this.props.onDownloadFileClick(data)}>
        <i className="fa fa-download" />
      </button>
      {' '}
      <PermissionContent permissions={permissions.USER_PROFILE.DELETE_FILE}>
        <button
          type="button"
          className="btn-transparent color-danger"
          onClick={() => this.props.onDeleteFileClick(data)}
        >
          <i className="fa fa-trash" />
        </button>
      </PermissionContent>
    </span>
  );

  renderDate = (column, withTime = true) => data => (
    <Choose>
      <When condition={data[column]}>
        <div>
          <div className="font-weight-700">{moment.utc(data[column]).local().format('DD.MM.YYYY')}</div>
          <If condition={withTime}>
            <div className="font-size-11">{moment.utc(data[column]).local().format('HH:mm:ss')}</div>
          </If>
        </div>
      </When>
      <Otherwise>
        <GridEmptyValue I18n={I18n} />
      </Otherwise>
    </Choose>
  );

  renderCategory = data => (
    <div className="font-weight-700">
      {
        data.category && categoriesLabels[data.category]
          ? I18n.t(categoriesLabels[data.category])
          : data.category
      }
    </div>
  );

  renderStatus = data => (
    <FileStatusDropDown
      status={data.status}
      statusDocument={data.statusDocument}
      onStatusChange={action => this.props.onStatusActionClick(data.uuid, action)}
    />
  );

  renderNote = data => (
    <NoteButton
      playerUUID={data.playerUUID}
      targetUUID={data.uuid}
      noteTargetType={targetTypes.FILE}
      note={data.note}
    />
  );

  render() {
    const {
      onStatusActionClick, onDownloadFileClick, onDeleteFileClick, ...rest
    } = this.props;

    return (
      <GridView
        {...rest}
      >
        <GridViewColumn
          name="fileName"
          header={I18n.t('FILES.GRID.COLUMN.NAME')}
          render={this.renderFileName}
        />
        <GridViewColumn
          name="actions"
          header=""
          headerClassName="width-60"
          render={this.renderActions}
        />
        <GridViewColumn
          name="expirationTime"
          header={I18n.t('FILES.GRID.COLUMN.EXPIRATION_DATE')}
          render={this.renderDate('expirationTime', false)}
        />
        <GridViewColumn
          name="date"
          header={I18n.t('FILES.GRID.COLUMN.DATE_TIME')}
          render={this.renderDate('uploadDate')}
        />
        <GridViewColumn
          name="category"
          header={I18n.t('FILES.GRID.COLUMN.CATEGORY')}
          render={this.renderCategory}
        />
        <GridViewColumn
          name="status"
          header={I18n.t('FILES.GRID.COLUMN.STATUS')}
          render={this.renderStatus}
        />
        <GridViewColumn
          name="note"
          header={I18n.t('FILES.GRID.COLUMN.NOTE')}
          render={this.renderNote}
        />
      </GridView>
    );
  }
}

export default CommonFileGridView;
