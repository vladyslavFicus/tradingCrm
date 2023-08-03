import React from 'react';
import I18n from 'i18n-js';
import useFiles from 'routes/Clients/routes/Files/hooks/useFiles';
import FilesGrid from './components/FilesGrid';
import FilesGridFilter from './components/FilesGridFilter';
import './Files.scss';

const Files = () => {
  const {
    totalElements,
    refetch,
    content,
    loading,
    last,
    handleLoadMore,
  } = useFiles();

  return (
    <div className="Files">
      <div className="Files__header">
        <strong>{totalElements} </strong>

        {I18n.t('COMMON.KYC_DOCUMENTS')}
      </div>

      <FilesGridFilter onRefetch={refetch} />

      <FilesGrid
        content={content}
        loading={loading}
        last={last}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
};

export default React.memo(Files);
