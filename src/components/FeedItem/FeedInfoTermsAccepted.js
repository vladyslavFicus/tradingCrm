import React, { Fragment } from 'react';
import I18n from 'i18n-js';
import PropTypes from '../../constants/propTypes';

const FeedInfoTermsAccepted = ({ data }) => (
  <Fragment>
    <If condition={data.details.acceptedTermsUUID}>
      {I18n.t('FEED_ITEM.ACCEPTED_TERMS.TERMS_UUID')}:
      <span className="feed-item__content-value">
        {data.details.acceptedTermsUUID}
      </span>
      <br />
    </If>
  </Fragment>
);

FeedInfoTermsAccepted.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoTermsAccepted;
