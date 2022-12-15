import React from 'react';
import I18n from 'i18n-js';
import { cloneDeep, set } from 'lodash';
import { useLocation } from 'react-router-dom';
import { getBrand } from 'config';
import Tabs from 'components/Tabs';
import ListView from 'components/ListView';
import FeedItem from 'components/FeedItem';
import { State } from 'types';
import { rbacTabs } from '../../constants';
import RbacFeedsFilters from './components/RbacFeedsFilters';
import { useRbacFeedsQuery, RbacFeedsQuery, RbacFeedsQueryVariables } from './graphql/__generated__/RbacFeedsQuery';
import './RbacFeed.scss';

type Feed = ExtractApolloTypeFromPageable<RbacFeedsQuery['feeds']>

const RbacFeed = () => {
  const { state } = useLocation<State<RbacFeedsQueryVariables>>();

  const rbacFeedsQuery = useRbacFeedsQuery({
    variables: {
      ...state?.filters as RbacFeedsQueryVariables,
      targetUUID: getBrand().id,
      limit: 20,
      page: 0,
    },
  });

  const { content = [], last, number = 0, totalElements } = rbacFeedsQuery?.data?.feeds || {};

  const handlePageChanged = () => {
    const { fetchMore, variables = {} } = rbacFeedsQuery;

    fetchMore({
      variables: set(cloneDeep(variables), 'page', number + 1),
    });
  };

  return (
    <div className="RbacFeed">
      <Tabs items={rbacTabs} className="RbacFeed__tabs" />
      <div className="RbacFeed__card">
        <div className="RbacFeed__headline">
          {I18n.t('ROLES_AND_PERMISSIONS.FEED.HEADLINE')}
        </div>
      </div>
      <RbacFeedsFilters onRefetch={rbacFeedsQuery.refetch} />
      <div className="RbacFeed__grid">
        <ListView
          dataSource={content}
          last={last}
          totalPages={totalElements}
          onPageChange={handlePageChanged}
          lazyLoad
          showNoResults={!rbacFeedsQuery.loading && !content?.length}
          render={(feed: Feed, key: string) => <FeedItem key={key} data={feed} />}
        />
      </div>
    </div>
  );
};

export default React.memo(RbacFeed);
