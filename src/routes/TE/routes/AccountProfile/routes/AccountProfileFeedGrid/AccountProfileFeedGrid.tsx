import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import { State } from 'types';
import ListView from 'components/ListView/index';
import FeedItem from 'components/FeedItem';
import EventEmitter, { CLIENT_RELOAD } from 'utils/EventEmitter';
import AccountProfileFeedGridFilter from './components/AccountProfileFeedGridFilter';
import { useFeedsQuery, FeedsQueryVariables } from './graphql/__generated__/FeedsQuery';
import './AccountProfileFeedGrid.scss';

const AccountProfileFeedGrid = () => {
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

  useEffect(
    () => {
      EventEmitter.on(CLIENT_RELOAD, refetch);
      return () => {
        EventEmitter.off(CLIENT_RELOAD, refetch);
      };
    },
  );

  // ===== Handlers ===== //
  const handleLoadMore = () => {
    if (!loading) {
      fetchMore({
        variables: set(cloneDeep(variables), 'page', number + 1),
      });
    }
  };

  return (
    <div className="AccountProfileFeedGrid">
      <AccountProfileFeedGridFilter handleRefetch={feedsQuery.refetch} />

      <div className="AccountProfileFeedGrid__grid">
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

export default React.memo(AccountProfileFeedGrid);
