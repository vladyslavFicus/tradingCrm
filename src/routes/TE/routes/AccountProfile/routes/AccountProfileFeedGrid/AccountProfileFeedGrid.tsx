import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import { State } from 'types';
import ListView from 'components/ListView';
import FeedItem from 'components/FeedItem';
import EventEmitter, { CLIENT_RELOAD } from 'utils/EventEmitter';
import AccountProfileFeedGridFilter from './components/AccountProfileFeedGridFilter';
import { useFeedsQuery, FeedsQueryVariables, FeedsQuery } from './graphql/__generated__/FeedsQuery';
import './AccountProfileFeedGrid.scss';

type Feed = FeedsQuery['feeds']['content'];

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

  const { content = [], last, number = 0, totalElements } = feedsQuery.data?.feeds || {};

  useEffect(
    () => {
      EventEmitter.on(CLIENT_RELOAD, feedsQuery.refetch);
      return () => {
        EventEmitter.off(CLIENT_RELOAD, feedsQuery.refetch);
      };
    },
  );

  const handlePageChange = () => {
    const { data, variables, fetchMore } = feedsQuery;
    const page = data?.feeds.page || 0;

    fetchMore({
      variables: set(cloneDeep(variables as FeedsQueryVariables), 'page', page + 1),
    });
  };

  return (
    <div className="AccountProfileFeedGrid">
      <AccountProfileFeedGridFilter handleRefetch={feedsQuery.refetch} />

      <div className="AccountProfileFeedGrid__grid">
        <ListView
          dataSource={content}
          activePage={number + 1}
          last={last}
          totalPages={totalElements}
          render={(feed: Feed, key: string) => <FeedItem key={key} data={feed} />}
          onPageChange={handlePageChange}
          showNoResults={!feedsQuery.loading && !content?.length}
        />
      </div>
    </div>
  );
};

export default React.memo(AccountProfileFeedGrid);
