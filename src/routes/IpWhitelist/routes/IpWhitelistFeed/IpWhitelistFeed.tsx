import React from 'react';
import { useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { cloneDeep, set } from 'lodash';
import { getBrand } from 'config';
import { State } from 'types';
import Tabs from 'components/Tabs';
import ListView from 'components/ListView/index';
import FeedItem from 'components/FeedItem';
import { ipWhitelistTabs } from '../../constants';
import IpWhitelistFeedsFilters from './components/IpWhitelistFeedsFilters';
import { useFeedsQuery, FeedsQueryVariables } from './graphql/__generated__/FeedsQuery';
import './IpWhitelistFeed.scss';

const IpWhitelistFeed = () => {
  const { state } = useLocation<State<FeedsQueryVariables>>();

  // ===== Requests ===== //
  const feedsQuery = useFeedsQuery({
    variables: {
      ...state?.filters as FeedsQueryVariables,
      targetUUID: getBrand().id,
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
    <div className="IpWhitelistFeed">
      <Tabs items={ipWhitelistTabs} className="IpWhitelistFeed__tabs" />

      <div className="IpWhitelistFeed__card">
        <div className="IpWhitelistFeed__headline">
          {I18n.t('IP_WHITELIST.FEED.HEADLINE')}
        </div>
      </div>

      <IpWhitelistFeedsFilters onRefetch={refetch} />

      <div className="IpWhitelistFeed__grid">
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

export default React.memo(IpWhitelistFeed);
