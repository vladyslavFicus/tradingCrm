import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import { shortifyInMiddle } from 'utils/stringFormat';
import { categoriesLabels, statusesLabels } from 'constants/files';
import GridView, { GridViewColumn } from 'components/GridView';
import GridEmptyValue from 'components/GridEmptyValue';
import Uuid from 'components/Uuid';

class CommonFileListGridView extends Component {
  static propTypes = {
    headerClassName: PropTypes.string,
    tableClassName: PropTypes.string,
    dataSource: PropTypes.array.isRequired,
    onPreviewImageClick: PropTypes.func,
    renderFullName: PropTypes.func,
  };

  static defaultProps = {
    headerClassName: null,
    tableClassName: null,
    onPreviewImageClick: null,
    renderFullName: () => {},
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
          {data.fileName}
        </div>
        <div title={data.realName} className="font-size-11">
          {data.fileName === data.realName ? null : shortifyInMiddle(data.realName, 40)}
        </div>
        <Uuid className="font-size-11" uuid={data.uuid} />
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

  renderDate = column => (data, withTime = true) => (
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
        data.documentCategory && categoriesLabels[data.documentCategory]
          ? I18n.t(categoriesLabels[data.documentCategory])
          : data.documentCategory
      }
    </div>
  );

  render() {
    return (
      <GridView
        {...this.props}
      >
        <GridViewColumn
          name="fullName"
          header={I18n.t('FILES.GRID.COLUMN.CLIENT')}
          render={this.props.renderFullName}
        />
        <GridViewColumn
          name="fileName"
          header={I18n.t('FILES.GRID.COLUMN.NAME')}
          render={this.renderFileName}
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
          render={data => (
            <div className="text-uppercase font-weight-700">
              {I18n.t(statusesLabels[data.statusDocument])}
            </div>
          )}
        />
      </GridView>
    );
  }
}

export default CommonFileListGridView;
