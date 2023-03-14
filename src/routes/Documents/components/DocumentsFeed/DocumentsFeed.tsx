import React from 'react';
import { useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { cloneDeep, set } from 'lodash';
import { State } from 'types';
import { getBrand } from 'config';
import Tabs from 'components/Tabs';
import ListView from 'components/ListView';
import FeedItem from 'components/FeedItem';
import { DocumentsTabs } from '../../constants';
import DocumentsFeedsFilters from './components/DocumentsFeedsFilters';
import { FeedsDocumentQueryVariables, useFeedsDocumentQuery } from './graphql/__generated__/FeedsDocumentQuery';
import './DocumentsFeed.scss';

const DocumentsFeed = () => {
  const { state } = useLocation<State<FeedsDocumentQueryVariables>>();

  // ===== Request ===== //
  const feedsQuery = useFeedsDocumentQuery({
    variables: {
      ...state?.filters as FeedsDocumentQueryVariables,
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
    <div className="DocumentsFeed">
      <Tabs items={DocumentsTabs} className="DocumentsFeed__tabs" />

      <div className="DocumentsFeed__card">
        {I18n.t('DOCUMENTS.FEED.HEADLINE')}
      </div>

      <DocumentsFeedsFilters onRefetch={refetch} />

      <div className="DocumentsFeed__grid">
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

export default React.memo(DocumentsFeed);
