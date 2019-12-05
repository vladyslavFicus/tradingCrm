import React from 'react';
import PropTypes from '../../constants/propTypes';
import FeedDetails from './FeedDetails';

const attributeLabels = {
  triggeredByName: 'CONSTANTS.AUDIT.PROFILE_ASSIGN.ASSIGNED_BY_NAME',
  triggeredByUuid: 'CONSTANTS.AUDIT.PROFILE_ASSIGN.ASSIGNED_BY_UUID',
  acquisitionType: 'CONSTANTS.AUDIT.PROFILE_ASSIGN.ACQUISITION_STATUS',
  acquisitionRepresentativeUuid: 'CONSTANTS.AUDIT.PROFILE_ASSIGN.ASSIGNED_TO_UUID',
  fullName: 'CONSTANTS.AUDIT.PROFILE_ASSIGN.ASSIGNED_TO_NAME',
};

const FeedProfileAssign = ({ data: { details, operator: { fullName } } }) => (
  <FeedDetails
    items={{ ...details, fullName }}
    attributeLabels={attributeLabels}
  />
);

FeedProfileAssign.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedProfileAssign;
