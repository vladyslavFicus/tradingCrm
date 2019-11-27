import React from 'react';
import PropTypes from '../../constants/propTypes';
import FeedDetails from './FeedDetails';

const attributeLabels = {
  identifier: 'COMMON.IDENTIFIER',
  email: 'COMMON.EMAIL',
  action: 'CONSTANTS.AUDIT.ROFUS_VERIFICATION.ACTION',
  result: 'CONSTANTS.AUDIT.ROFUS_VERIFICATION.RESULT',
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
