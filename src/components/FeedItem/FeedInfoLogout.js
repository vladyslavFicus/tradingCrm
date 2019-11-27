import React, { Fragment } from 'react';
import moment from 'moment';
import humanizeDuration from 'humanize-duration';
import I18n from 'i18n-js';
import PropTypes from '../../constants/propTypes';

const humanizeDurationConfig = {
  language: 'en',
  largest: 2,
  conjunction: ' ',
  round: true,
};

const FeedInfoLogout = ({ data }) => (
  <Fragment>
    <If condition={data.details.sessionId}>
      {I18n.t('FEED_ITEM.LOG_OUT.SESSION_ID')}:
      <span className="feed-item__content-value">
        {data.details.sessionId}
      </span>
      <br />
    </If>
    <If condition={data.ip}>
      {I18n.t('FEED_ITEM.LOG_OUT.SESSION_IP')}:
      <span className="feed-item__content-value">
        {data.ip}
      </span>
      <br />
    </If>
    <If condition={data.details.sessionStart}>
      {I18n.t('FEED_ITEM.LOG_OUT.SESSION_START')}:
      <span className="feed-item__content-value">
        {moment.utc(data.details.sessionStart).local().format('DD.MM.YYYY \\a\\t HH:mm:ss')}
      </span>
      <br />
    </If>
    <If condition={data.details.sessionEnd}>
      {I18n.t('FEED_ITEM.LOG_OUT.SESSION_END')}:
      <span className="feed-item__content-value">
        {moment.utc(data.details.sessionEnd).local().format('DD.MM.YYYY \\a\\t HH:mm:ss')}
      </span>
      <br />
    </If>
    <If condition={data.details.sessionDuration}>
      {I18n.t('FEED_ITEM.LOG_OUT.SESSION_DURATION')}:
      <span className="feed-item__content-value">
        {humanizeDuration(data.details.sessionDuration, humanizeDurationConfig)}
      </span>
      <br />
    </If>
    <If condition={data.details.device}>
      {I18n.t('FEED_ITEM.LOG_OUT.DEVICE')}:
      <span className="feed-item__content-value">
        {data.details.device}
      </span>
    </If>
  </Fragment>
);

FeedInfoLogout.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoLogout;
