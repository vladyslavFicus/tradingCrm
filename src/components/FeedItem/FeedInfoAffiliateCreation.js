import React, { Fragment } from 'react';
import I18n from 'i18n-js';
import PropTypes from '../../constants/propTypes';

const FeedInfoAffiliateCreation = ({ data }) => (
  <Fragment>
    <If condition={data.details.affiliateName}>
      {I18n.t('FEED_ITEM.AFFILIATE_CREATION.AFFILIATE_NAME')}:
      <span className="feed-item__content-value">
        {data.details.affiliateName}
      </span>
      <br />
    </If>
    <If condition={data.details.email}>
      {I18n.t('COMMON.EMAIL')}:
      <span className="feed-item__content-value">
        {data.details.email}
      </span>
      <br />
    </If>
    <If condition={data.details.phone}>
      {I18n.t('COMMON.PHONE')}:
      <span className="feed-item__content-value">
        {data.details.phone}
      </span>
      <br />
    </If>
  </Fragment>
);

FeedInfoAffiliateCreation.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoAffiliateCreation;
