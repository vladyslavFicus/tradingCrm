import { useCallback } from 'react';
import { cloneDeep, set } from 'lodash';
import { OperationVariables, QueryResult } from '@apollo/client';
import { Page__Input as PageInput } from '__generated__/types';

type PagePath = 'page.from' | 'page' | 'args.page' | 'args.page.from';

type Props<TQuery, TQueryVars> = {
  query: QueryResult<TQuery, TQueryVars>,
  page: number | PageInput,
  path?: PagePath,
};

type UseHandlePageChanged = () => void;

const useHandlePageChanged = <TQuery,
  TQueryVars extends OperationVariables>(props: Props<TQuery, TQueryVars>): UseHandlePageChanged => {
  const {
    query: { variables, fetchMore },
    page = 0,
    path = 'args.page.from',
  } = props;

  const handlePageChanged = useCallback(() => {
    fetchMore({
      variables: set(cloneDeep(variables as TQueryVars),
        path,
        typeof page === 'number' ? page + 1 : { ...page }),
    });
  }, [variables, fetchMore, page, path]);

  return handlePageChanged;
};

export default useHandlePageChanged;
