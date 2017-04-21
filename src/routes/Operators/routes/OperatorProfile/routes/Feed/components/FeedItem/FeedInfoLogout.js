import React from 'react';
import moment from 'moment';
import humanizeDuration from 'humanize-duration';
import PropTypes from '../../../../../../../../constants/propTypes';

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
      data.details.sessionEnd &&
      <div>
        Session End:
        <span className="feed-item_info-details_value">
          {moment(data.details.sessionEnd).format('DD.MM.YYYY \\a\\t HH:mm:ss')}
        </span>
      </div>
    }
    {
      data.details.sessionDuration &&
      <div>
        Session duration:
        <span className="feed-item_info-details_value">
          {humanizeDuration(data.details.sessionDuration, humanizeDurationConfig)}
        </span>
      </div>
    }
  </div>
);

FeedInfoLogout.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoLogout;
