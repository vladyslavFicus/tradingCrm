import React from 'react';
import { Config } from '@crm/common';
import { Feed__AuditCategory__Enum as FeedAuditCategoryEnum } from '__generated__/types';
import FeedsList from 'components/FeedsList';

const FeatureFeed = () => (
  <FeedsList
    targetUUID={Config.getBrand().id}
    auditCategory={FeedAuditCategoryEnum.BRAND_CONFIG}
    skipCategoryFilter
  />
);

export default React.memo(FeatureFeed);
