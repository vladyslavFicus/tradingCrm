import React from 'react';
import I18n from 'i18n-js';
import { Feed__AuditCategory__Enum as FeedAuditCategoryEnum } from '__generated__/types';
import useFeedsList from '../hooks/useFeedsList';
import FeedsFilters from './components/FeedsFilters';
import FeedsGrid from './components/FeedsGrid';
import './FeedsList.scss';

type Props = {
  targetUUID: string,
  auditCategory?: FeedAuditCategoryEnum,
  skipCategoryFilter?: boolean,
};

const FeedsList = (props: Props) => {
  const { targetUUID, auditCategory, skipCategoryFilter = false } = props;

  const { content, loading, last, refetch, handleLoadMore } = useFeedsList(props);

  return (
    <>
      <div className="FeedList__title">
        {I18n.t('COMMON.FEEDS.TITLE')}
      </div>

      <FeedsFilters
        targetUUID={targetUUID}
        auditCategory={auditCategory}
        skipCategoryFilter={skipCategoryFilter}
        onRefetch={refetch}
      />

      <FeedsGrid
        content={content}
        loading={loading}
        last={last}
        onLoadMore={handleLoadMore}
      />
    </>
  );
};

export default React.memo(FeedsList);
