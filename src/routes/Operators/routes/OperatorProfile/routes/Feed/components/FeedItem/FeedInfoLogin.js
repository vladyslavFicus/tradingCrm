import React from 'react';
import moment from 'moment';
import PropTypes from '../../../../../../../../constants/propTypes';

const FeedInfoLogin = ({ data }) => (
  <div className="feed-item_info-details">
    {
      data.details.sessionId &&
      <div>
        Session ID:
        <span className="feed-item_info-details_value">
          {data.details.sessionId}
        </span>
      </div>
    }
    {
      data.ip &&
      <div>
        Session IP:
        <span className="feed-item_info-details_value">
          {data.ip}
        </span>
      </div>
    }
    {
      data.details.sessionStart &&
      <div>
        Session Start:
        <span className="feed-item_info-details_value">
          {moment(data.details.sessionStart).format('DD.MM.YYYY \\a\\t HH:mm:ss')}
        </span>
      </div>
    }
    {
      data.details.device &&
      <div>
        Device:
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
