import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import I18n from 'i18n-js';
import { cloneDeep, set } from 'lodash';
import { State } from 'types';
import ListView from 'components/ListView';
import FeedItem from 'components/FeedItem';
import PartnerFeedsFilter from './components/PartnerFeedsFilter';
import { useFeedsQuery, FeedsQueryVariables } from './graphql/__generated__/FeedsQuery';
import './PartnerFeedsTab.scss';

const PartnerFeedsTab = () => {
  const { state } = useLocation<State<FeedsQueryVariables>>();

  const { id: targetUuid } = useParams<{ id: string }>();

  // ===== Requests ===== //
  const feedsQuery = useFeedsQuery({
    variables: {
      ...state?.filters as FeedsQueryVariables,
      targetUuid,
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
    <div className="PartnerFeedsTab">
      <div className="PartnerFeedsTab__header">
        <div className="PartnerFeedsTab__title">
          {I18n.t('PARTNER_PROFILE.FEED.TITLE')}
        </div>
      </div>

      <PartnerFeedsFilter onRefetch={refetch} />

      <div className="PartnerFeedsTab__list">
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

export default React.memo(PartnerFeedsTab);
