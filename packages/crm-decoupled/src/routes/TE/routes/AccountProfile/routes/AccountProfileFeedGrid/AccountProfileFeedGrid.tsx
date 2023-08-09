import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import { Utils } from '@crm/common';
import { State } from 'types';
import { Feed } from '__generated__/types';
import ListView from 'components/ListView/index';
import FeedItem from 'components/FeedItem';
import AccountProfileFeedGridFilter from './components/AccountProfileFeedGridFilter';
import { useFeedsQuery, FeedsQueryVariables } from './graphql/__generated__/FeedsQuery';
import './AccountProfileFeedGrid.scss';

const AccountProfileFeedGrid = () => {
  const targetUUID = useParams().id as string;
  const state = useLocation().state as State<FeedsQueryVariables>;

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
      Utils.EventEmitter.on(Utils.CLIENT_RELOAD, refetch);
      return () => {
        Utils.EventEmitter.off(Utils.CLIENT_RELOAD, refetch);
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
          render={(item: React.ReactNode) => <FeedItem data={item as Feed} />}
          onLoadMore={handleLoadMore}
        />
      </div>
    </div>
  );
};

export default React.memo(AccountProfileFeedGrid);
