import React from 'react';
import { ClientFile } from '__generated__/types';
import { ShortLoader } from 'components';
import NotFoundContent from 'components/NotFoundContent';
import useClientFilesGrid from 'routes/Clients/routes/Client/routes/ClientFilesTab/hooks/useClientFilesGrid';
import FileGrid from './components/FileGrid';
import './ClientFilesGrid.scss';

type Props = {
  verificationData: Array<ClientFile>,
  loading: boolean,
  onRefetch: () => void,
};

const ClientFilesGrid = (props: Props) => {
  const { verificationData, loading, onRefetch } = props;

  const {
    filesCategoriesQuery,
    categories,
    handleUpdateFileMeta,
    tokenRefreshMutation,
    handleStatusActionClick,
    handleVerificationTypeClick,
    handleChangeFileStatusClick,
    handleDownloadFileClick,
  } = useClientFilesGrid({ onRefetch });

  if (loading || filesCategoriesQuery.loading) {
    return <ShortLoader />;
  }

  if (!verificationData.length) {
    return <NotFoundContent />;
  }

  return (
    <div className="ClientFilesGrid">
      {
        verificationData.map(({ documents, verificationType }) => (
          documents.map(({ documentType, files, verificationStatus }) => (
            <FileGrid
              key={`${verificationType}-${documentType}-${files.length}`}
              data={files}
              categories={categories}
              verificationType={verificationType}
              verificationStatus={verificationStatus || ''}
              documentType={documentType}
              onRefetch={onRefetch}
              onUpdateFileMeta={handleUpdateFileMeta}
              onTokenRefresh={tokenRefreshMutation}
              onStatusActionClick={handleStatusActionClick}
              onVerificationTypeActionClick={handleVerificationTypeClick}
              onChangeFileStatusActionClick={handleChangeFileStatusClick}
              onDownloadFileClick={handleDownloadFileClick}
            />
          ))
        ))
      }
    </div>
  );
};

export default React.memo(ClientFilesGrid);
