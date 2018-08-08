import React, { Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import { verifyRequestReasons } from '../../constants/kyc';
import renderLabel from '../../utils/renderLabel';

const FeedInfoKycRequest = ({ data }) => (
  <Fragment>
    {I18n.t('FEED_ITEM.KYC.LOGIN_EVENTS.REASON')}:
    <span className="feed-item__content-value">
      {
        data.details.reason &&
        renderLabel(data.details.reason, verifyRequestReasons)
      }
    </span>
  </Fragment>
);

FeedInfoKycRequest.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoKycRequest;
