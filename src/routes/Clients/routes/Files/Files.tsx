import React from 'react';
import I18n from 'i18n-js';
import { useLocation } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import { State } from 'types';
import FilesGrid from './components/FilesGrid';
import FilesGridFilter from './components/FilesGridFilter';
import { useFilesQuery, FilesQueryVariables } from './graphql/__generated__/FilesQuery';
import './Files.scss';

const Files = () => {
  const { state } = useLocation<State<FilesQueryVariables>>();

  const { data, loading, variables = {}, refetch, fetchMore } = useFilesQuery({
    variables: {
      ...state?.filters as FilesQueryVariables,
      page: 0,
      size: 20,
    },
  });

  const { content = [], last = true, totalElements = 0, number = 0 } = data?.files || {};

  // ===== Handlers ===== //
  const handleLoadMore = () => {
    if (!loading) {
      fetchMore({
        variables: set(cloneDeep(variables), 'page', number + 1),
      });
    }
  };

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
