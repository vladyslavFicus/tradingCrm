import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import './TransactionMiniProfile.scss';

const TransactionMiniProfile = ({ transactionInfo }) => (
  <div className={`mini-profile mini-profile_${transactionInfo.status}`}>
    {console.log(transactionInfo)}
    <div className="mini-profile-header">
      <label className="mini-profile-label">{transactionInfo.status}</label>
      <div className="mini-profile-type">{I18n.t('MINI_PROFILE.TRANSACTION')}</div>
    </div>
  </div>
);

TransactionMiniProfile.propTypes = {
  transactionInfo: PropTypes.object.isRequired,
};

export default TransactionMiniProfile;
