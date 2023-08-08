import React from 'react';
import { Config } from '@crm/common';
import FeedsList from 'components/FeedsList';
import { Feed__AuditCategory__Enum as FeedAuditCategoryEnum } from '__generated__/types';

const FeatureFeed = () => (
  <FeedsList
    targetUUID={Config.getBrand().id}
    auditCategory={FeedAuditCategoryEnum.BRAND_CONFIG}
    skipCategoryFilter
  />
);

export default React.memo(FeatureFeed);
