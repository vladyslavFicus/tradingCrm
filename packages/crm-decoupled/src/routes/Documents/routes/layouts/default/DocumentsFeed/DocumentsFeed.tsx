import React from 'react';
import { getBrand } from 'config';
import { Feed__AuditCategory__Enum as FeedAuditCategoryEnum } from '__generated__/types';
import FeedsList from 'components/FeedsList';

const DocumentsFeed = () => (
  <FeedsList
    targetUUID={getBrand().id}
    auditCategory={FeedAuditCategoryEnum.BRAND_DOCUMENTS}
  />
);

export default React.memo(DocumentsFeed);
