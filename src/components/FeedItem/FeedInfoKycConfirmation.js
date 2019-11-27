import React from 'react';
import I18n from 'i18n-js';
import PropTypes from '../../constants/propTypes';
import FeedDetails from './FeedDetails';

const attributeLabels = {
  identifier: I18n.t('CONSTANTS.AUDIT.KYC_CONFIRMATION.IDENTIFIER'),
  transactionId: I18n.t('CONSTANTS.AUDIT.KYC_CONFIRMATION.TRANSACTION'),
  merchantTransactionId: I18n.t('CONSTANTS.AUDIT.KYC_CONFIRMATION.MERCHANT_TRANSACTION'),
  description: I18n.t('CONSTANTS.AUDIT.KYC_CONFIRMATION.DESCRIPTION'),
  error: I18n.t('COMMON.ERROR'),
  state: I18n.t('CONSTANTS.AUDIT.KYC_CONFIRMATION.STATE'),
};

const FeedInfoKycConfirmation = ({ data: { details } }) => (
  <FeedDetails
    items={details}
    attributeLabels={attributeLabels}
  />
);

FeedInfoKycConfirmation.propTypes = {
  data: PropTypes.auditEntity.isRequired,
};

export default FeedInfoKycConfirmation;
