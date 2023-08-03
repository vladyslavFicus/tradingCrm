import React from 'react';
import { getBrand } from 'config';
import { Feed__AuditCategory__Enum as FeedAuditCategoryEnum } from '__generated__/types';
import FeedsList from 'components/FeedsList';

const IpWhitelistFeed = () => (
  <FeedsList
    targetUUID={getBrand().id}
    auditCategory={FeedAuditCategoryEnum.WHITELIST}
  />
);

export default React.memo(IpWhitelistFeed);
