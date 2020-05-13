import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import I18n from 'i18n-js';
import { shortifyInMiddle } from 'utils/stringFormat';
import { categoriesLabels, documentsTypeLabels } from 'constants/files';
import Grid, { GridColumn } from 'components/Grid';
import GridEmptyValue from 'components/GridEmptyValue';
import Uuid from 'components/Uuid';

class FileGridView extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    isLoading: PropTypes.bool.isRequired,
    isLastPage: PropTypes.bool.isRequired,
    handlePageChanged: PropTypes.func.isRequired,
    withLazyLoad: PropTypes.bool.isRequired,
    withNoResults: PropTypes.bool.isRequired,
    renderFullName: PropTypes.func.isRequired,
  };

  renderFileName = (data) => {
    const playerPrefix = data.clientUuid.indexOf('PLAYER') === -1 ? 'PL' : null;
    const uuidPrefix = data.clientUuid.indexOf('OPERATOR') === -1 ? playerPrefix : null;

    return (
      <div>
        <div className="font-weight-700">{data.title}</div>
        <div title={data.title} className="font-size-11">
          {data.fileName === data.title ? null : shortifyInMiddle(data.fileName, 40)}
        </div>
        <Uuid className="font-size-11" uuid={data.uuid} />
        <div className="font-size-11">
          {'by '}
          <Uuid
            uuid={data.uploadBy}
            uuidPrefix={uuidPrefix}
          />
        </div>
      </div>
    );
  };

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
        <GridEmptyValue />
      </Otherwise>
    </Choose>
  );

  renderCategory = ({ verificationType }) => (
    <div className="font-weight-700">
      {
        verificationType && categoriesLabels[verificationType]
          ? I18n.t(categoriesLabels[verificationType])
          : verificationType
      }
    </div>
  );

  renderDocumentType = ({ documentType }) => (
    <div className="font-weight-700">
      {
        documentType && documentsTypeLabels[documentType]
          ? I18n.t(documentsTypeLabels[documentType])
          : documentType
      }
    </div>
  );

  render() {
    const {
      data,
      isLoading,
      isLastPage,
      handlePageChanged,
      withLazyLoad,
      withNoResults,
    } = this.props;

    return (
      <Grid
        data={data}
        isLoading={isLoading}
        isLastPage={isLastPage}
        handlePageChanged={handlePageChanged}
        withLazyLoad={withLazyLoad}
        withNoResults={withNoResults}
      >
        <GridColumn
          name="fullName"
          header={I18n.t('FILES.GRID.COLUMN.CLIENT')}
          render={this.props.renderFullName}
        />
        <GridColumn
          name="fileName"
          header={I18n.t('FILES.GRID.COLUMN.NAME')}
          render={this.renderFileName}
        />
        <GridColumn
          name="expirationTime"
          header={I18n.t('FILES.GRID.COLUMN.EXPIRATION_DATE')}
          render={this.renderDate('expirationDate', false)}
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
          name="documentType"
          header={I18n.t('FILES.GRID.COLUMN.DOCUMENT_TYPE')}
          render={this.renderDocumentType}
        />
      </Grid>
    );
  }
}

export default FileGridView;
