import React from 'react';
import { Config } from '@crm/common';
import { Feed__AuditCategory__Enum as FeedAuditCategoryEnum } from '__generated__/types';
import FeedsList from 'components/FeedsList';

const RbacFeed = () => (
  <FeedsList
    targetUUID={Config.getBrand().id}
    auditCategory={FeedAuditCategoryEnum.RBAC}
    skipCategoryFilter
  />
);

export default React.memo(RbacFeed);
