import React from 'react';
import { getBrand } from 'config';
import { Feed__AuditCategory__Enum as FeedAuditCategoryEnum } from '__generated__/types';
import FeedsList from 'components/FeedsList';

const PSPFeed = () => (
  <FeedsList
    targetUUID={getBrand().id}
    auditCategory={FeedAuditCategoryEnum.FAVOURITE_PAYMENT_SYSTEMS}
  />
);

export default React.memo(PSPFeed);
