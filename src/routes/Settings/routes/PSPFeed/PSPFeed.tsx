import React from 'react';
import { getBrand } from 'config';
import { Feed__AuditCategory__Enum as FeedAuditCategoryEnum } from '__generated__/types';
import Tabs from 'components/Tabs';
import FeedsList from 'components/FeedsList';
import { PSPTabs } from '../../constants';
import './PSPFeed.scss';

const PSPFeed = () => (
  <div className="PSPFeed">
    <Tabs items={PSPTabs} className="PSPFeed__tabs" />

    <FeedsList
      targetUUID={getBrand().id}
      auditCategory={FeedAuditCategoryEnum.FAVOURITE_PAYMENT_SYSTEMS}
    />
  </div>
);

export default React.memo(PSPFeed);
