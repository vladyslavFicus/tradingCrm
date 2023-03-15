import React from 'react';
import { useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { cloneDeep, set } from 'lodash';
import { State } from 'types';
import { Feed__AuditCategory__Enum as FeedAuditCategoryEnum } from '__generated__/types';
import FeedsFilters from './components/FeedsFilters';
import FeedsGrid from './components/FeedsGrid';
import { useFeedsQuery, FeedsQueryVariables } from './graphql/__generated__/FeedsQuery';
import './FeedsList.scss';

type Props = {
  targetUUID: string,
  auditCategory?: FeedAuditCategoryEnum,
  skipCategoryFilter?: boolean,
};

const FeedsList = (props: Props) => {
  const { targetUUID, auditCategory, skipCategoryFilter = false } = props;

  const { state } = useLocation<State<FeedsQueryVariables>>();

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
  const handleLoadMore = () => {
    if (!loading) {
      fetchMore({
        variables: set(cloneDeep(variables), 'page', number + 1),
      });
    }
  };

  return (
    <>
      <div className="FeedList__title">
        {I18n.t('COMMON.FEEDS.TITLE')}
      </div>

      <FeedsFilters
        targetUUID={targetUUID}
        auditCategory={auditCategory}
        skipCategoryFilter={skipCategoryFilter}
        onRefetch={refetch}
      />

      <FeedsGrid
        content={content}
        loading={loading}
        last={last}
        onLoadMore={handleLoadMore}
      />
    </>
  );
};

export default React.memo(FeedsList);
