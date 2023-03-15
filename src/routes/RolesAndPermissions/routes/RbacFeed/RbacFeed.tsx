import React from 'react';
import { getBrand } from 'config';
import { Feed__AuditCategory__Enum as FeedAuditCategoryEnum } from '__generated__/types';
import Tabs from 'components/Tabs';
import FeedsList from 'components/FeedsList';
import { rbacTabs } from '../../constants';
import './RbacFeed.scss';

const RbacFeed = () => (
  <div className="RbacFeed">
    <Tabs items={rbacTabs} className="RbacFeed__tabs" />

    <FeedsList
      targetUUID={getBrand().id}
      auditCategory={FeedAuditCategoryEnum.RBAC}
      skipCategoryFilter
    />
  </div>
);

export default React.memo(RbacFeed);
