import React from 'react';
import { I18n } from 'react-redux-i18n';

const FeedInfoLoginLocked = () => (
  <div className="feed-item_info-details">
    <div>
      {I18n.t('FEED_ITEM.LOGIN_EVENTS.REASON')}:{' - '}
      <span className="feed-item_info-details_value">{I18n.t('FEED_ITEM.LOGIN_EVENTS.FAILED_LOGIN_ATTEMPTS')}</span>
    </div>
    <div>{I18n.t('FEED_ITEM.LOGIN_EVENTS.LOCKED_UNTIL')}:{' - '}
      <span className="feed-item_info-details_value">2016-10-20 17:50:07</span>
    </div>
  </div>
);

export default FeedInfoLoginLocked;
