import React from 'react';
import I18n from '../../utils/fake-i18n';
import PropTypes from '../../constants/propTypes';
import FeedDetails from './FeedDetails';

const attributeLabels = {
  identifier: I18n.t('COMMON.IDENTIFIER'),
  email: I18n.t('COMMON.EMAIL'),
  action: I18n.t('CONSTANTS.AUDIT.ROFUS_VERIFICATION.ACTION'),
  result: I18n.t('CONSTANTS.AUDIT.ROFUS_VERIFICATION.RESULT'),
};

const FeedInfoRofusVerification = ({ data: { details } }) => (
  <FeedDetails
    items={details}
    attributeLabels={attributeLabels}
  />
);

FeedInfoRofusVerification.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoRofusVerification;
