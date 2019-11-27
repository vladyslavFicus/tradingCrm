import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import I18n from 'i18n-js';
import renderLabel from '../../utils/renderLabel';
import { statusesLabels } from '../../constants/user';

const FeedInfoPlayerProfileStatusChanged = ({ data: { details } }) => (
  <Fragment>
    <If condition={details.profileStatus}>
      {I18n.t('FEED_ITEM.PLAYER_PROFILE_STATUS_CHANGED.STATUS')}:
      <span className="feed-item__content-value">
        {I18n.t('FEED_ITEM.PLAYER_PROFILE_STATUS_CHANGED.NEXT_STATUS')}{': '}
      </span>
      {renderLabel(details.profileStatus, statusesLabels)}
      <br />
    </If>
    <If condition={details.suspendEndDate}>
      {I18n.t('FEED_ITEM.PLAYER_PROFILE_STATUS_CHANGED.SUSPEND_END_DATE')}:
      <span className="feed-item__content-value">
        {moment.utc(details.suspendEndDate).local().format('DD.MM.YYYY \\a\\t HH:mm:ss')}
      </span>
      <br />
    </If>
    <If condition={details.cooloffEndDate}>
      {I18n.t('FEED_ITEM.PLAYER_PROFILE_STATUS_CHANGED.COOLOFF_END_DATE')}:
      <span className="feed-item__content-value">
        {moment.utc(details.cooloffEndDate).local().format('DD.MM.YYYY \\a\\t HH:mm:ss')}
      </span>
      <br />
    </If>
    <If condition={details.comment}>
      {I18n.t('FEED_ITEM.PLAYER_PROFILE_STATUS_CHANGED.COMMENT')}:
      <span className="feed-item__content-value">
        {details.comment}
      </span>
      <br />
    </If>

    <If condition={details.reason}>
      <div className="feed-item__rejection">
        <b className="mr-1">{I18n.t('FEED_ITEM.PLAYER_PROFILE_STATUS_CHANGED.REASON')}:</b>
        {I18n.t(details.reason)}
      </div>
    </If>
  </Fragment>
);

FeedInfoPlayerProfileStatusChanged.propTypes = {
  data: PropTypes.shape({
    details: PropTypes.shape({
      prevProfileStatus: PropTypes.string,
      profileStatus: PropTypes.string,
      comment: PropTypes.string,
      cooloffEndDate: PropTypes.string,
      reason: PropTypes.string,
      suspendEndDate: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default FeedInfoPlayerProfileStatusChanged;
