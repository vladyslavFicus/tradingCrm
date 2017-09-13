import React from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import PropTypes from '../../constants/propTypes';

const FeedInfoFailedLoginAttempt = ({ data }) => (
  <div className="feed-item_info-details">
    {
      data.details.ip &&
      <div>
        IP: <span className="feed-item_info-details_value">{data.details.ip}</span>
      </div>
    }
    {
      data.details.attemptDateTime && moment(data.details.attemptDateTime).isValid() &&
      <div>
        {I18n.t('FEED_ITEM.LOGIN_EVENTS.ATTEMPT_DATE_TIME')}:{' '}
        <span
          className="feed-item_info-details_value"
        >
          {moment.utc(data.details.attemptDateTime).local().format('DD.MM.YYYY \\a\\t HH:mm:ss')}
        </span>
      </div>
    }
    {
      data.details.device &&
      <div>
        {I18n.t('FEED_ITEM.LOGIN_EVENTS.DEVICE')}:{' '}
        <span className="feed-item_info-details_value">
          {data.details.device}
        </span>
      </div>
    }
  </div>
);

FeedInfoFailedLoginAttempt.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoFailedLoginAttempt;
