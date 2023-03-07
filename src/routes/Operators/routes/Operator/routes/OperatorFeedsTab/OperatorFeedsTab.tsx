import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import I18n from 'i18n-js';
import { cloneDeep, set } from 'lodash';
import { State } from 'types';
import { Feed } from '__generated__/types';
import ListView from 'components/ListView';
import FeedItem from 'components/FeedItem';
import OperatorFeedsFilterForm from './components/OperatorFeedsFilter';
import { useFeedsQuery, FeedsQueryVariables } from './graphql/__generated__/FeedsQuery';
import './OperatorFeedsTab.scss';

const OperatorFeedsTab = () => {
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
  const { content = [], last = true, number = 0, totalElements = 0 } = data?.feeds || {};

  // ===== Handlers ===== //
  const handlePageChanged = () => {
    fetchMore({
      variables: set(cloneDeep(variables), 'page', number + 1),
    });
  };

  return (
    <div className="OperatorFeedsTab">
      <div className="OperatorFeedsTab__header">
        <div className="OperatorFeedsTab__title">
          {I18n.t('OPERATOR_PROFILE.FEED.TITLE')}
        </div>
      </div>

      <OperatorFeedsFilterForm onRefetch={refetch} />

      <div className="OperatorFeedsTab__list">
        <ListView
          loading={loading}
          dataSource={content}
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

export default React.memo(OperatorFeedsTab);
