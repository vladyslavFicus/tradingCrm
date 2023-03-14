import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import { State } from 'types';
import ListView from 'components/ListView/index';
import FeedItem from 'components/FeedItem';
import DealingOperatorFeedTabFilter from './components/DealingOperatorFeedFilter';
import { useFeedsQuery, FeedsQueryVariables } from './graphql/__generated__/FeedsQuery';
import './DealingOperatorFeedTab.scss';

const DealingOperatorFeedTab = () => {
  const { id: targetUUID } = useParams<{ id: string }>();
  const { state } = useLocation<State<FeedsQueryVariables>>();

  const feedsQuery = useFeedsQuery({
    variables: {
      ...state?.filters as FeedsQueryVariables,
      targetUUID,
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
    <div className="DealingOperatorFeedTab">
      <DealingOperatorFeedTabFilter handleRefetch={refetch} />

      <div className="DealingOperatorFeedTab__grid">
        <ListView
          content={content}
          loading={loading}
          last={last}
          render={(item: React.ReactNode) => <FeedItem data={item} />}
          onLoadMore={handleLoadMore}
        />
      </div>
    </div>
  );
};

export default React.memo(DealingOperatorFeedTab);
