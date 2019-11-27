import React, { Fragment } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import PropTypes from '../../constants/propTypes';

const FeedInfoFailedLoginAttempt = ({ data }) => (
  <Fragment>
    <If condition={data.details.ip}>
      IP:
      <span className="feed-item__content-value">
        {data.details.ip}
      </span>
      <br />
    </If>
    <If condition={data.details.attemptDateTime && moment(data.details.attemptDateTime).isValid()}>
      {I18n.t('FEED_ITEM.LOGIN_EVENTS.ATTEMPT_DATE_TIME')}:
      <span className="feed-item__content-value">
        {moment.utc(data.details.attemptDateTime).local().format('DD.MM.YYYY \\a\\t HH:mm:ss')}
      </span>
      <br />
    </If>
    <If condition={data.details.device}>
      {I18n.t('FEED_ITEM.LOGIN_EVENTS.DEVICE')}:
      <span className="feed-item__content-value">
        {data.details.device}
      </span>
    </If>
  </Fragment>
);

FeedInfoFailedLoginAttempt.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoFailedLoginAttempt;
