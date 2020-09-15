import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import moment from 'moment';
import { get } from 'lodash';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import { categoriesLabels, documentsTypeLabels } from 'constants/files';
import { Link } from 'components/Link';
import Grid, { GridColumn } from 'components/Grid';
import GridEmptyValue from 'components/GridEmptyValue';
import Uuid from 'components/Uuid';
import FilesQuery from './graphql/FilesQuery';
import './FilesGrid.scss';

class FilesGrid extends PureComponent {
  static propTypes = {
    filesData: PropTypes.query({
      files: PropTypes.pageable(PropTypes.fileEntity),
    }).isRequired,
  };

  handlePageChanged = () => {
    const {
      filesData,
      filesData: {
        loadMore,
        loading,
      },
    } = this.props;

    const page = get(filesData, 'data.files.number') || 0;

    if (!loading) {
      loadMore(page + 1);
    }
  };

  renderFullName = ({ clientUuid, client }) => (
    <div>
      <Choose>
        <When condition={client}>
          <Link
            className="FilesGrid__client-name"
            to={`/clients/${clientUuid}/profile`}
            target="_blank"
          >
            {client.fullName}
          </Link>
        </When>
        <Otherwise>
          {I18n.t('COMMON.NONE')}
        </Otherwise>
      </Choose>

      <div>
        <Uuid className="FilesGrid__uuid" uuid={clientUuid} />
      </div>
    </div>
  );

  renderFileName = (data) => {
    const playerPrefix = data.clientUuid.indexOf('PLAYER') === -1 ? 'PL' : null;
    const uuidPrefix = data.clientUuid.indexOf('OPERATOR') === -1 ? playerPrefix : null;

    return (
      <div>
        <div className="FilesGrid__file-title">{data.title}</div>
        <Uuid className="FilesGrid__uuid" uuid={data.uuid} />
        <div className="FilesGrid__uuid">
          {'by '}
          <Uuid
            uuid={data.uploadBy}
            uuidPrefix={uuidPrefix}
          />
        </div>
      </div>
    );
  };

  renderExpirationTime = ({ expirationDate }) => (
    <Choose>
      <When condition={expirationDate}>
        <div className="FilesGrid__date">{moment.utc(expirationDate).local().format('DD.MM.YYYY')}</div>
      </When>
      <Otherwise>
        <GridEmptyValue />
      </Otherwise>
    </Choose>
  );

  renderDate = ({ uploadDate }) => (
    <div>
      <div className="FilesGrid__date">{moment.utc(uploadDate).local().format('DD.MM.YYYY')}</div>
      <div className="FilesGrid__time">{moment.utc(uploadDate).local().format('HH:mm:ss')}</div>
    </div>
  );

  renderCategory = ({ verificationType }) => (
    <div className="FilesGrid__category">
      {
        verificationType && categoriesLabels[verificationType]
          ? I18n.t(categoriesLabels[verificationType])
          : verificationType
      }
    </div>
  );

  renderDocumentType = ({ documentType }) => (
    <div className="FilesGrid__document-type">
      {
        documentType && documentsTypeLabels[documentType]
          ? I18n.t(documentsTypeLabels[documentType])
          : documentType
      }
    </div>
  );

  render() {
    const { filesData } = this.props;

    const isLoading = filesData.loading;
    const isLastPage = get(filesData, 'data.files.last');
    const files = get(filesData, 'data.files.content') || [];

    return (
      <div className="FilesGrid">
        <Grid
          data={files}
          isLoading={isLoading}
          isLastPage={isLastPage}
          handlePageChanged={this.handlePageChanged}
          withNoResults={!isLoading && files.length === 0}
        >
          <GridColumn
            name="fullName"
            header={I18n.t('FILES.GRID.COLUMN.CLIENT')}
            render={this.renderFullName}
          />
          <GridColumn
            name="fileName"
            header={I18n.t('FILES.GRID.COLUMN.NAME')}
            render={this.renderFileName}
          />
          <GridColumn
            name="expirationTime"
            header={I18n.t('FILES.GRID.COLUMN.EXPIRATION_DATE')}
            render={this.renderExpirationTime}
          />
          <GridColumn
            name="date"
            header={I18n.t('FILES.GRID.COLUMN.DATE_TIME')}
            render={this.renderDate}
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
      </div>
    );
  }
}

export default compose(
  withRouter,
  withRequests({
    filesData: FilesQuery,
  }),
)(FilesGrid);
