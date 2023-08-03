import React, { useCallback } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { File } from '__generated__/types';
import Link from 'components/Link';
import { Table, Column } from 'components/Table';
import Uuid from 'components/Uuid';
import { categoriesLabels, categories, documentsTypeLabels, documentsType } from 'constants/files';
import './FilesGrid.scss';

type Props = {
  content: Array<File>,
  loading: boolean,
  last: boolean,
  onLoadMore: () => void,
};

const FilesGrid = (props: Props) => {
  const { content, loading, last, onLoadMore } = props;

  // ===== Renders ===== //
  const renderFullName = useCallback(({ clientUuid, client }: File) => (
    <>
      <Choose>
        <When condition={!!client}>
          <Link
            className="FilesGrid__client-name"
            to={`/clients/${clientUuid}`}
            target="_blank"
          >
            {client?.fullName}
          </Link>
        </When>

        <Otherwise>
          {I18n.t('COMMON.NONE')}
        </Otherwise>
      </Choose>

      <div>
        <Uuid className="FilesGrid__uuid" uuid={clientUuid} />
      </div>
    </>
  ), []);

  const renderFileName = useCallback((data: File) => {
    const playerPrefix = data.clientUuid.indexOf('PLAYER') === -1 ? 'PL' : undefined;
    const uuidPrefix = data.clientUuid.indexOf('OPERATOR') === -1 ? playerPrefix : undefined;

    return (
      <>
        <div className="FilesGrid__file-title">{data.title}</div>

        <Uuid className="FilesGrid__uuid" uuid={data.uuid} />

        <div className="FilesGrid__uuid">
          {'by '}
          <Uuid
            uuid={data.uploadBy}
            uuidPrefix={uuidPrefix}
          />
        </div>
      </>
    );
  }, []);

  const renderExpirationTime = useCallback(({ expirationDate }: File) => {
    if (!expirationDate) {
      return <>&mdash;</>;
    }

    return <div className="FilesGrid__date">{moment.utc(expirationDate).local().format('DD.MM.YYYY')}</div>;
  }, []);

  const renderDate = useCallback(({ uploadDate }: File) => (
    <>
      <div className="FilesGrid__date">{moment.utc(uploadDate).local().format('DD.MM.YYYY')}</div>
      <div className="FilesGrid__time">{moment.utc(uploadDate).local().format('HH:mm:ss')}</div>
    </>
  ), []);

  const renderCategory = useCallback(({ verificationType }: File) => (
    <div className="FilesGrid__category">
      {
        verificationType && categoriesLabels[verificationType as categories]
          ? I18n.t(categoriesLabels[verificationType as categories])
          : verificationType
      }
    </div>
  ), []);

  const renderDocumentType = useCallback(({ documentType }: File) => (
    <div className="FilesGrid__document-type">
      {
        documentType && documentsTypeLabels[documentType as documentsType]
          ? I18n.t(documentsTypeLabels[documentType as documentsType])
          : documentType
      }
    </div>
  ), []);

  return (
    <div className="FilesGrid">
      <Table
        stickyFromTop={128}
        items={content}
        loading={loading}
        hasMore={!last}
        onMore={onLoadMore}
      >
        <Column
          name="fullName"
          header={I18n.t('FILES.GRID.COLUMN.CLIENT')}
          render={renderFullName}
        />

        <Column
          name="fileName"
          header={I18n.t('FILES.GRID.COLUMN.NAME')}
          render={renderFileName}
        />

        <Column
          name="expirationTime"
          header={I18n.t('FILES.GRID.COLUMN.EXPIRATION_DATE')}
          render={renderExpirationTime}
        />

        <Column
          name="date"
          header={I18n.t('FILES.GRID.COLUMN.DATE_TIME')}
          render={renderDate}
        />

        <Column
          name="category"
          header={I18n.t('FILES.GRID.COLUMN.CATEGORY')}
          render={renderCategory}
        />

        <Column
          name="documentType"
          header={I18n.t('FILES.GRID.COLUMN.DOCUMENT_TYPE')}
          render={renderDocumentType}
        />
      </Table>
    </div>
  );
};

export default React.memo(FilesGrid);
