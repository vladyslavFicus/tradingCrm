import React, { PureComponent } from 'react';
import moment from 'moment';
import { get } from 'lodash';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { categoriesLabels, documentsTypeLabels } from 'constants/files';
import { Link } from 'components/Link';
import { Table, Column } from 'components/Table';
import Uuid from 'components/Uuid';
import './FilesGrid.scss';

class FilesGrid extends PureComponent {
  static propTypes = {
    filesQuery: PropTypes.query({
      files: PropTypes.pageable(PropTypes.fileEntity),
    }).isRequired,
  };

  handlePageChanged = () => {
    const {
      filesQuery,
      filesQuery: {
        loadMore,
        loading,
      },
    } = this.props;

    const page = get(filesQuery, 'data.files.number') || 0;

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
        <span>&mdash;</span>
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
    const { filesQuery } = this.props;

    const isLoading = filesQuery.loading;
    const { content = [], last = true } = filesQuery.data?.files || {};

    return (
      <div className="FilesGrid">
        <Table
          stickyFromTop={128}
          items={content}
          loading={isLoading}
          hasMore={!last}
          onMore={this.handlePageChanged}
        >
          <Column
            name="fullName"
            header={I18n.t('FILES.GRID.COLUMN.CLIENT')}
            render={this.renderFullName}
          />
          <Column
            name="fileName"
            header={I18n.t('FILES.GRID.COLUMN.NAME')}
            render={this.renderFileName}
          />
          <Column
            name="expirationTime"
            header={I18n.t('FILES.GRID.COLUMN.EXPIRATION_DATE')}
            render={this.renderExpirationTime}
          />
          <Column
            name="date"
            header={I18n.t('FILES.GRID.COLUMN.DATE_TIME')}
            render={this.renderDate}
          />
          <Column
            name="category"
            header={I18n.t('FILES.GRID.COLUMN.CATEGORY')}
            render={this.renderCategory}
          />
          <Column
            name="documentType"
            header={I18n.t('FILES.GRID.COLUMN.DOCUMENT_TYPE')}
            render={this.renderDocumentType}
          />
        </Table>
      </div>
    );
  }
}

export default FilesGrid;
