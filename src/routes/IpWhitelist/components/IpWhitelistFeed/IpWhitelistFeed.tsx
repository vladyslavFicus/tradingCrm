import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withRequests } from 'apollo';
import { useLocation } from 'react-router-dom';
import { State } from 'types';
import Tabs from 'components/Tabs';
import ListView from 'components/ListView';
import FeedItem from 'components/FeedItem';
import IpWhitelistFeedsQuery from './graphql/IpWhitelistFeedsQuery';
import { Feed, WitelististFeedsQueryResult, IpWhitelistFeedFilters } from './types';
import IpWhitelistFeedsFilters from './components/IpWhitelistFeedsFilters';
import { ipWhitelistTabs } from '../../constants';
import './IpWhitelistFeed.scss';

interface Props {
  ipWhitelistFeedsQuery: WitelististFeedsQueryResult
}

const IpWhitelistFeed = ({ ipWhitelistFeedsQuery }: Props) => {
  const { content, last, page = 0, totalElements } = ipWhitelistFeedsQuery?.data?.feeds || {};
  const { state } = useLocation<State<IpWhitelistFeedFilters>>();

  const handlePageChanged = () => {
    const { loadMore, loading } = ipWhitelistFeedsQuery;
    const filters = state?.filters || {};
    if (!loading) {
      loadMore({
        ...filters,
        page: page + 1,
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
      <IpWhitelistFeedsFilters refetch={ipWhitelistFeedsQuery.refetch} />
      <div className="IpWhitelistFeed__grid">
        <ListView
          dataSource={content || []}
          activePage={page + 1}
          last={last}
          totalPages={totalElements}
          onPageChange={handlePageChanged}
          lazyLoad
          showNoResults={!ipWhitelistFeedsQuery.loading && !content?.length}
          render={(feed: Feed, key: string) => <FeedItem key={key} data={feed} />}
        />
      </div>
    </div>
  );
};

export default compose(
  React.memo,
  withRequests({
    ipWhitelistFeedsQuery: IpWhitelistFeedsQuery,
  }),
)(IpWhitelistFeed);
