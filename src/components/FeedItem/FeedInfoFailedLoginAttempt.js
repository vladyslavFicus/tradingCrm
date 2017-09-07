import React from 'react';
import { I18n } from 'react-redux-i18n';

const FeedInfoFailedLoginAttempt = () => (
  <div className="feed-item_info-details">
    <div>IP: <span className="feed-item_info-details_value">14.161.121.243 - Ukraine</span></div>
    <div>
      {I18n.t('FEED_ITEM.LOGIN_EVENTS.ATTEMPT_DATE_TIME')}:{' '}
      <span className="feed-item_info-details_value">19.10.2016 at 10:15:36</span>
    </div>
    <div>
      {I18n.t('FEED_ITEM.LOGIN_EVENTS.DEVICE')}:{' '}
      <span className="feed-item_info-details_value">Desktop (macOS 10.12.3, Chrome V56.0.2924.87 64bit English, 2880x1800px )</span>
    </div>
  </div>
);

export default FeedInfoFailedLoginAttempt;
