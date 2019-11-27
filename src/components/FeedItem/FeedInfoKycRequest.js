import React, { Fragment } from 'react';
import I18n from 'i18n-js';
import PropTypes from '../../constants/propTypes';
import { verifyRequestReasons } from '../../constants/kyc';
import renderLabel from '../../utils/renderLabel';

const FeedInfoKycRequest = ({ data }) => (
  <Fragment>
    {I18n.t('FEED_ITEM.KYC.LOGIN_EVENTS.REASON')}:
    <If condition={data.details.reason}>
      <span className="feed-item__content-value">
        {renderLabel(data.details.reason, verifyRequestReasons)}
      </span>
    </If>
  </Fragment>
);

FeedInfoKycRequest.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoKycRequest;
