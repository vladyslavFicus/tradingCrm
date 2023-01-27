import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { cloneDeep, set } from 'lodash';
import { withRequests } from 'apollo';
import Tabs from 'components/Tabs';
import ListView from 'components/ListView/index';
import FeedItem from 'components/FeedItem';
import { Feed } from '__generated__/types';
import { ipWhitelistTabs } from '../../constants';
import IpWhitelistFeedsFilters from './components/IpWhitelistFeedsFilters';
import IpWhitelistFeedsQuery from './graphql/IpWhitelistFeedsQuery';
import { WhitelistFeedsQueryResult } from './types';

import './IpWhitelistFeed.scss';

type Props = {
  ipWhitelistFeedsQuery: WhitelistFeedsQueryResult,
}

const IpWhitelistFeed = (props: Props) => {
  const { ipWhitelistFeedsQuery } = props;

  const { content, last, number = 0, totalElements } = ipWhitelistFeedsQuery?.data?.feeds || {};

  // ===== Handlers ===== //
  const handlePageChanged = () => {
    const { fetchMore, variables = {} } = ipWhitelistFeedsQuery;

    fetchMore({
      variables: set(cloneDeep(variables), 'page', number + 1),
    });
  };

  return (
    <div className="IpWhitelistFeed">
      <Tabs items={ipWhitelistTabs} className="IpWhitelistFeed__tabs" />
      <div className="IpWhitelistFeed__card">
        <div className="IpWhitelistFeed__headline">
          {I18n.t('IP_WHITELIST.FEED.HEADLINE')}
        </div>
      </div>

      <IpWhitelistFeedsFilters onRefetch={ipWhitelistFeedsQuery.refetch} />

      <div className="IpWhitelistFeed__grid">
        <ListView
          loading={ipWhitelistFeedsQuery.loading}
          dataSource={content || []}
          last={last}
          totalPages={totalElements}
          onPageChange={handlePageChanged}
          showNoResults={!ipWhitelistFeedsQuery.loading && !content?.length}
          render={(feed: Feed, key: number) => <FeedItem key={key} data={feed} />}
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
