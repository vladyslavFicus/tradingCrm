import React from 'react';
import { getBrand } from 'config';
import { Feed__AuditCategory__Enum as FeedAuditCategoryEnum } from '__generated__/types';
import Tabs from 'components/Tabs';
import FeedsList from 'components/FeedsList';
import { DocumentsTabs } from '../../constants';
import './DocumentsFeed.scss';

const DocumentsFeed = () => (
  <div className="DocumentsFeed">
    <Tabs items={DocumentsTabs} className="DocumentsFeed__tabs" />

    <FeedsList
      targetUUID={getBrand().id}
      auditCategory={FeedAuditCategoryEnum.BRAND_DOCUMENTS}
    />
  </div>
);

export default React.memo(DocumentsFeed);
