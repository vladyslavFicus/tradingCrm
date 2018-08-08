import React from 'react';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';

const FeedInfoLogin = ({ data }) => (
  <div className="feed-item_info-details">
    <If condition={data.details.sessionId}>
      <div>
        {I18n.t('FEED_ITEM.LOG_IN.SESSION_ID')}:
        <span className="feed-item_info-details_value">
          {data.details.sessionId}
        </span>
      </div>
    </If>
    <If condition={data.ip}>
      <div>
        {I18n.t('FEED_ITEM.LOG_IN.SESSION_IP')}:
        <span className="feed-item_info-details_value">
          {data.ip}
        </span>
      </div>
    </If>
    <If condition={data.details.sessionStart}>
      <div>
        {I18n.t('FEED_ITEM.LOG_IN.SESSION_START')}:
        <span className="feed-item_info-details_value">
          {moment.utc(data.details.sessionStart).local().format('DD.MM.YYYY \\a\\t HH:mm:ss')}
        </span>
      </div>
    </If>
    <If condition={data.details.device}>
      <div>
        {I18n.t('FEED_ITEM.LOG_IN.DEVICE')}:
        <span className="feed-item_info-details_value">
          {data.details.device}
        </span>
      </div>
    </If>
  </div>
);

FeedInfoLogin.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoLogin;
