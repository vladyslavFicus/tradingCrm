import React from 'react';
import { useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { cloneDeep, set } from 'lodash';
import { State } from 'types';
import { getBrand } from 'config';
import Tabs from 'components/Tabs';
import ListView from 'components/ListView';
import FeedItem from 'components/FeedItem';
import { Feed } from '__generated__/types';
import { DocumentsTabs } from '../../constants';
import DocumentsFeedsFilters from './components/DocumentsFeedsFilters';
import { FeedsDocumentQueryVariables, useFeedsDocumentQuery } from './graphql/__generated__/FeedsDocumentQuery';
import './DocumentsFeed.scss';

const DocumentsFeed = () => {
  const { state } = useLocation<State<FeedsDocumentQueryVariables>>();

  // ===== Request ===== //
  // const feedsDocumentQuery = useFeedsDocumentQuery({
  const { data, loading, refetch, fetchMore, variables = {} } = useFeedsDocumentQuery({
    variables: {
      ...state?.filters as FeedsDocumentQueryVariables,
      targetUUID: getBrand().id,
      limit: 20,
      page: 0,
    },
  });

  const { content = [], last, number = 0, totalElements } = data?.feeds || {};

  // ===== Handlers ===== //
  const handlePageChanged = () => fetchMore({
    variables: set(cloneDeep(variables), 'page', number + 1),
  });

  return (
    <div className="DocumentsFeed">
      <Tabs items={DocumentsTabs} className="DocumentsFeed__tabs" />

      <div className="DocumentsFeed__card">
        {I18n.t('DOCUMENTS.FEED.HEADLINE')}
      </div>

      <DocumentsFeedsFilters onRefetch={refetch} />

      <div className="DocumentsFeed__grid">
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

export default React.memo(DocumentsFeed);
