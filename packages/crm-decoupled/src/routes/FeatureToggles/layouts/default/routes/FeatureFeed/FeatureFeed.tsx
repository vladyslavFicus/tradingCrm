import React from 'react';
import { getBrand } from 'config';
import FeedsList from 'components/FeedsList';
import { Feed__AuditCategory__Enum as FeedAuditCategoryEnum } from '__generated__/types';

const FeatureFeed = () => (
  <FeedsList
    targetUUID={getBrand().id}
    auditCategory={FeedAuditCategoryEnum.BRAND_CONFIG}
    skipCategoryFilter
  />
);

export default React.memo(FeatureFeed);
