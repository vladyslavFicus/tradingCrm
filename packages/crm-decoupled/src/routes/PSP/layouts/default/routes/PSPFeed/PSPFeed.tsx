import React from 'react';
import { Config } from '@crm/common';
import { Feed__AuditCategory__Enum as FeedAuditCategoryEnum } from '__generated__/types';
import FeedsList from 'components/FeedsList';

const PSPFeed = () => (
  <FeedsList
    targetUUID={Config.getBrand().id}
    auditCategory={FeedAuditCategoryEnum.FAVOURITE_PAYMENT_SYSTEMS}
  />
);

export default React.memo(PSPFeed);
