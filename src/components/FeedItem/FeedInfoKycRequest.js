import React from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import { verifyRequestReasons } from '../../constants/kyc';
import renderLabel from '../../utils/renderLabel';

const FeedInfoKycRequest = ({ data }) => (
  <div className="feed-item_info-details">
    <div>
      {I18n.t('FEED_ITEM.KYC.LOGIN_EVENTS.REASON')}:{' '}
      <span className="feed-item_info-details_value">
        {renderLabel(data.details.reason, verifyRequestReasons)}
      </span>
    </div>
  </div>
);

FeedInfoKycRequest.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoKycRequest;
