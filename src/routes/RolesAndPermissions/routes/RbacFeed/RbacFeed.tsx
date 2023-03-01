import React from 'react';
import I18n from 'i18n-js';
import { cloneDeep, set } from 'lodash';
import { useLocation } from 'react-router-dom';
import { getBrand } from 'config';
import { State } from 'types';
import { Feed } from '__generated__/types';
import Tabs from 'components/Tabs';
import ListView from 'components/ListView';
import FeedItem from 'components/FeedItem';
import { rbacTabs } from '../../constants';
import RbacFeedsFilters from './components/RbacFeedsFilters';
import { useFeedsQuery, FeedsQueryVariables } from './graphql/__generated__/FeedsQuery';
import './RbacFeed.scss';

const RbacFeed = () => {
  const { state } = useLocation<State<FeedsQueryVariables>>();

  // ===== Requests ===== //
  const { data, loading, variables, refetch, fetchMore } = useFeedsQuery({
    variables: {
      ...state?.filters as FeedsQueryVariables,
      targetUUID: getBrand().id,
      limit: 20,
      page: 0,
    },
  });

  const { content = [], last, number = 0, totalElements } = data?.feeds || {};

  // ===== Handlers ===== //
  const handlePageChanged = () => {
    fetchMore({
      variables: set(cloneDeep(variables as FeedsQueryVariables), 'page', number + 1),
    });
  };

  return (
    <div className="RbacFeed">
      <Tabs items={rbacTabs} className="RbacFeed__tabs" />

      <div className="RbacFeed__card">
        {I18n.t('ROLES_AND_PERMISSIONS.FEED.HEADLINE')}
      </div>

      <RbacFeedsFilters onRefetch={refetch} />

      <div className="RbacFeed__grid">
        <ListView
          loading={loading}
          dataSource={content || []}
          last={last}
          totalPages={totalElements}
          onPageChange={handlePageChanged}
          showNoResults={!loading && !content?.length}
          render={(feed: Feed, key: number) => <FeedItem key={key} data={feed} />}
        />
      </div>
    </div>
  );
};

export default React.memo(RbacFeed);
