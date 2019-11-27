import React, { Fragment } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import PropTypes from '../../constants/propTypes';

const FeedInfoLogin = ({ data }) => (
  <Fragment>
    <If condition={data.details.sessionId}>
      {I18n.t('FEED_ITEM.LOG_IN.SESSION_ID')}:
      <span className="feed-item__content-value">
        {data.details.sessionId}
      </span>
      <br />
    </If>
    <If condition={data.ip}>
      {I18n.t('FEED_ITEM.LOG_IN.SESSION_IP')}:
      <span className="feed-item__content-value">
        {data.ip}
      </span>
      <br />
    </If>
    <If condition={data.details.sessionStart}>
      {I18n.t('FEED_ITEM.LOG_IN.SESSION_START')}:
      <span className="feed-item__content-value">
        {moment.utc(data.details.sessionStart).local().format('DD.MM.YYYY \\a\\t HH:mm:ss')}
      </span>
      <br />
    </If>
    <If condition={data.details.device}>
      {I18n.t('FEED_ITEM.LOG_IN.DEVICE')}:
      <span className="feed-item__content-value">
        {data.details.device}
      </span>
    </If>
  </Fragment>
);

FeedInfoLogin.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoLogin;
