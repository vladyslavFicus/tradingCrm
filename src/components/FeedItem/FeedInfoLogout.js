import React from 'react';
import moment from 'moment';
import humanizeDuration from 'humanize-duration';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';

const humanizeDurationConfig = {
  language: 'en',
  largest: 2,
  conjunction: ' ',
  round: true,
};
const FeedInfoLogout = ({ data }) => (
  <div className="feed-item_info-details">
    {
      data.details.sessionId &&
      <div>
        {I18n.t('FEED_ITEM.LOG_OUT.SESSION_ID')}:
        <span className="feed-item_info-details_value">
          {data.details.sessionId}
        </span>
      </div>
    }
    {
      data.ip &&
      <div>
        {I18n.t('FEED_ITEM.LOG_OUT.SESSION_IP')}:
        <span className="feed-item_info-details_value">
          {data.ip}
        </span>
      </div>
    }
    {
      data.details.sessionStart &&
      <div>
        {I18n.t('FEED_ITEM.LOG_OUT.SESSION_START')}:
        <span className="feed-item_info-details_value">
          {moment.utc(data.details.sessionStart).local().format('DD.MM.YYYY \\a\\t HH:mm:ss')}
        </span>
      </div>
    }
    {
      data.details.sessionEnd &&
      <div>
        {I18n.t('FEED_ITEM.LOG_OUT.SESSION_END')}:
        <span className="feed-item_info-details_value">
          {moment.utc(data.details.sessionEnd).local().format('DD.MM.YYYY \\a\\t HH:mm:ss')}
        </span>
      </div>
    }
    {
      data.details.sessionDuration &&
      <div>
        {I18n.t('FEED_ITEM.LOG_OUT.SESSION_DURATION')}:
        <span className="feed-item_info-details_value">
          {humanizeDuration(data.details.sessionDuration, humanizeDurationConfig)}
        </span>
      </div>
    }
    {
      data.details.device &&
      <div>
        {I18n.t('FEED_ITEM.LOG_OUT.DEVICE')}:
        <span className="feed-item_info-details_value">
          {data.details.device}
        </span>
      </div>
    }
  </div>
);

FeedInfoLogout.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoLogout;
