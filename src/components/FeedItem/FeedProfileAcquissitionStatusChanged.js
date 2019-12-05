import React from 'react';
import PropTypes from '../../constants/propTypes';
import FeedDetails from './FeedDetails';

const attributeLabels = {
  acquisitionStatus: 'CONSTANTS.AUDIT.PROFILE_ASQUISSITION_CHANGED.ACQUISITION_STATUS',
  retentionRep: 'CONSTANTS.AUDIT.PROFILE_ASQUISSITION_CHANGED.RETENTION_REP',
  retentionStatus: 'CONSTANTS.AUDIT.PROFILE_ASQUISSITION_CHANGED.RETENTION_STATUS',
  salesRep: 'CONSTANTS.AUDIT.PROFILE_ASQUISSITION_CHANGED.SALES_REP',
  salesStatus: 'CONSTANTS.AUDIT.PROFILE_ASQUISSITION_CHANGED.SALES_STATUS',
};

const FeedProfileAcquissitionStatusChanged = ({ data: { details } }) => (
  <FeedDetails
    items={{ ...details }}
    attributeLabels={attributeLabels}
  />
);

FeedProfileAcquissitionStatusChanged.propTypes = {
  data: PropTypes.changedAsquissitionStatusEntity.isRequired,
};

export default FeedProfileAcquissitionStatusChanged;
