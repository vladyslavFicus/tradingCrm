import React from 'react';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';

const FeedInfoLogin = ({ data }) => (
  <div className="feed-item_info-details">
    {
      data.details.sessionId &&
      <div>
        {I18n.t('FEED_ITEM.LOG_IN.SESSION_ID')}:
        <span className="feed-item_info-details_value">
          {data.details.sessionId}
        </span>
      </div>
    }
    {
      data.ip &&
      <div>
        {I18n.t('FEED_ITEM.LOG_IN.SESSION_IP')}:
        <span className="feed-item_info-details_value">
          {data.ip}
        </span>
      </div>
    }
    {
      data.details.sessionStart &&
      <div>
        {I18n.t('FEED_ITEM.LOG_IN.SESSION_START')}:
        <span className="feed-item_info-details_value">
          {moment(data.details.sessionStart).format('DD.MM.YYYY \\a\\t HH:mm:ss')}
        </span>
      </div>
    }
    {
      data.details.device &&
      <div>
        {I18n.t('FEED_ITEM.LOG_IN.DEVICE')}:
        <span className="feed-item_info-details_value">
          {data.details.device}
        </span>
      </div>
    }
  </div>
);

FeedInfoLogin.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoLogin;
