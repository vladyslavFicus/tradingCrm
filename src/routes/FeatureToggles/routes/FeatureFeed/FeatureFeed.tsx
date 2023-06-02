import React from 'react';
import Tabs from 'components/Tabs';
import { featureTabs } from 'routes/FeatureToggles/constants';
import FeedsList from 'components/FeedsList';
import { getBrand } from 'config';
import { Feed__AuditCategory__Enum as FeedAuditCategoryEnum } from '__generated__/types';

const FeatureFeed = () => (
  <div className="FeatureFeed">
    <Tabs items={featureTabs} className="FeatureFeed__tabs" />

    <FeedsList
      targetUUID={getBrand().id}
      auditCategory={FeedAuditCategoryEnum.BRAND_CONFIG}
      skipCategoryFilter
    />
  </div>
);

export default React.memo(FeatureFeed);
