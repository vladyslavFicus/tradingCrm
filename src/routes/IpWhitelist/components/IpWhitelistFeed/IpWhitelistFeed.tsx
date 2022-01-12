import React from 'react';
import I18n from 'i18n-js';
import Tabs from 'components/Tabs';
import { ipWhitelistTabs } from '../../constants';
import './IpWhitelistFeed.scss';

const IpWhitelistFeed = () => (
  <div className="IpWhitelistFeed">
    <Tabs items={ipWhitelistTabs} className="IpWhitelistFeed__tabs" />
    <div className="IpWhitelistFeed__card">
      <div className="IpWhitelistFeed__headline">
        {I18n.t('IP_WHITELIST.FEED.HEADLINE')}
      </div>
      {/* // TODO: FS-4082 [BE] Add feeds (create, delete)  */}
    </div>
  </div>
);

export default IpWhitelistFeed;
