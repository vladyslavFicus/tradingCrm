import React from 'react';
import { getBrand } from 'config';
import { Feed__AuditCategory__Enum as FeedAuditCategoryEnum } from '__generated__/types';
import FeedsList from 'components/FeedsList';

const RbacFeed = () => (
  <FeedsList
    targetUUID={getBrand().id}
    auditCategory={FeedAuditCategoryEnum.RBAC}
    skipCategoryFilter
  />
);

export default React.memo(RbacFeed);
