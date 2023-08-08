import React from 'react';
import { Config } from '@crm/common';
import { Feed__AuditCategory__Enum as FeedAuditCategoryEnum } from '__generated__/types';
import FeedsList from 'components/FeedsList';

const IpWhitelistFeed = () => (
  <FeedsList
    targetUUID={Config.getBrand().id}
    auditCategory={FeedAuditCategoryEnum.WHITELIST}
  />
);

export default React.memo(IpWhitelistFeed);
