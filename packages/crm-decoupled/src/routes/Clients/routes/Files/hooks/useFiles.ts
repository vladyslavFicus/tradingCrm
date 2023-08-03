import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import { State } from 'types';
import { useFilesQuery, FilesQueryVariables } from '../graphql/__generated__/FilesQuery';

const useFiles = () => {
  const state = useLocation().state as State<FilesQueryVariables>;

  const { data, loading, variables = {}, refetch, fetchMore } = useFilesQuery({
    variables: {
      ...state?.filters as FilesQueryVariables,
      page: 0,
      size: 20,
    },
  });

  const { content = [], last = true, totalElements = 0, number = 0 } = data?.files || {};

  // ===== Handlers ===== //
  const handleLoadMore = useCallback(() => {
    if (!loading) {
      fetchMore({
        variables: set(cloneDeep(variables), 'page', number + 1),
      });
    }
  }, [loading, fetchMore, variables, number]);

  return {
    totalElements,
    refetch,
    content,
    loading,
    last,
    handleLoadMore,
  };
};

export default useFiles;
