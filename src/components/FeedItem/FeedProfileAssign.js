import React from 'react';
import I18n from 'i18n-js';
import PropTypes from '../../constants/propTypes';
import FeedDetails from './FeedDetails';

const attributeLabels = {
  triggeredByName: I18n.t('CONSTANTS.AUDIT.PROFILE_ASSIGN.ASSIGNED_BY_NAME'),
  triggeredByUuid: I18n.t('CONSTANTS.AUDIT.PROFILE_ASSIGN.ASSIGNED_BY_UUID'),
  acquisitionType: I18n.t('CONSTANTS.AUDIT.PROFILE_ASSIGN.ACQUISITION_STATUS'),
  acquisitionRepresentativeUuid: I18n.t('CONSTANTS.AUDIT.PROFILE_ASSIGN.ASSIGNED_TO_UUID'),
  fullName: I18n.t('CONSTANTS.AUDIT.PROFILE_ASSIGN.ASSIGNED_TO_NAME'),
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
