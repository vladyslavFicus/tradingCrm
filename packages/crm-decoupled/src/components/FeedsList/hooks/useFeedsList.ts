import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import { Types } from '@crm/common';
import { Feed__AuditCategory__Enum as FeedAuditCategoryEnum } from '__generated__/types';
import { FeedsQueryVariables, useFeedsQuery } from '../graphql/__generated__/FeedsQuery';

type Props = {
  targetUUID: string,
  auditCategory?: FeedAuditCategoryEnum,
  skipCategoryFilter?: boolean,
};

const useFeedsList = (props: Props) => {
  const { targetUUID, auditCategory } = props;

  const state = useLocation().state as Types.State<FeedsQueryVariables>;

  // ===== Requests ===== //
  const feedsQuery = useFeedsQuery({
    variables: {
      ...state?.filters as FeedsQueryVariables,
      targetUUID,
      ...(auditCategory && { auditCategory }),
      limit: 20,
      page: 0,
    },
  });

  const { data, loading, variables = {}, refetch, fetchMore } = feedsQuery;
  const { content = [], last = true, number = 0 } = data?.feeds || {};

  // ===== Handlers ===== //
  const handleLoadMore = useCallback(() => {
    if (!loading) {
      fetchMore({
        variables: set(cloneDeep(variables), 'page', number + 1),
      });
    }
  }, [loading, variables, number]);

  return {
    content,
    loading,
    last,
    refetch,
    handleLoadMore,
  };
};

export default useFeedsList;
