import React from 'react';
import moment from 'moment';
import PropTypes from '../../../../../../constants/propTypes';

const FeedInfoLogin = ({ data }) => (
  <div className="information">
    {
      data.details.sessionId &&
      <div>
        Session ID:
        <span className="information_value">
          {data.details.sessionId}
        </span>
      </div>
    }
    {
      data.ip &&
      <div>
        Session IP:
        <span className="information_value">
          {data.ip}
        </span>
      </div>
    }
    {
      data.details.sessionStart &&
      <div>
        Session Start:
        <span className="information_value">
          {moment(data.details.sessionStart).format('YYYY-MM-DD \\a\\t HH:mm:ss')}
        </span>
      </div>
    }
    {
      data.details.device &&
      <div>
        Device:
        <span className="information_value">
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
