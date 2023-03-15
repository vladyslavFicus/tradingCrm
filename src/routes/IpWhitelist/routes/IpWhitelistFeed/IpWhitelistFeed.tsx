import React from 'react';
import { getBrand } from 'config';
import { Feed__AuditCategory__Enum as FeedAuditCategoryEnum } from '__generated__/types';
import Tabs from 'components/Tabs';
import FeedsList from 'components/FeedsList';
import { ipWhitelistTabs } from '../../constants';
import './IpWhitelistFeed.scss';

const IpWhitelistFeed = () => (
  <div className="IpWhitelistFeed">
    <Tabs items={ipWhitelistTabs} className="IpWhitelistFeed__tabs" />

    <FeedsList
      targetUUID={getBrand().id}
      auditCategory={FeedAuditCategoryEnum.WHITELIST}
    />
  </div>
);

export default React.memo(IpWhitelistFeed);
