import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { shortify } from '../../../utils/uuid';
import Uuid from '../../../components/Uuid';
import Amount from '../../Amount';
import './TransactionMiniProfile.scss';

const TransactionMiniProfile = ({ transactionInfo }) => {
  let uuidPrefix = null;

  if (transactionInfo.creatorUUID.indexOf('OPERATOR') === -1) {
    uuidPrefix = transactionInfo.creatorUUID.indexOf('PLAYER') === -1 ? 'PL' : null;
  }

  return (
    <div className={`mini-profile mini-profile_${transactionInfo.status}`}>
      {console.log(transactionInfo)}
      <div className="mini-profile-header">
        <label className="mini-profile-label">{transactionInfo.status}</label>
        <div className="mini-profile-type">{I18n.t('MINI_PROFILE.TRANSACTION')}</div>
        <div className="mini-profile-title">
          <span className={`transaction-status transaction-status_${transactionInfo.paymentType}`}>
            {transactionInfo.paymentType}
          </span>
          {' '}
          <span className="font-weight-700">{shortify(transactionInfo.paymentId, 'TA')}</span>
          <i className="note-icon note-pinned-note" />
        </div>
        <div className="mini-profile-ids">
          {I18n.t('COMMON.AUTHOR_BY')}
          {' '}
          <Uuid
            uuid={transactionInfo.creatorUUID}
            uuidPrefix={uuidPrefix}
          />
        </div>
        <div className="mini-profile-ids">
          {I18n.t('COMMON.DATE_ON', {
            date: moment(transactionInfo.creationTime).format('DD.MM.YYYY - HH:mm:ss'),
          })}
        </div>
      </div>
      {
        transactionInfo.status === 'FAILED' &&
        <div className="mini-profile-status-reason">
          <div className="info-block">
            <div className="info-block_status-reason">{I18n.t('MINI_PROFILE.ERROR_MESSAGE')}</div>
            <div className="info-block_status-reason_body">{transactionInfo.reason}</div>
          </div>
        </div>
      }
      {
        transactionInfo.status === 'REFUSED' &&
        <div className="mini-profile-status-reason">
          <div className="info-block">
            <div className="info-block_status-reason">{I18n.t('MINI_PROFILE.REJECTION_REASON')}</div>
            <div className="info-block_status-reason_body">{transactionInfo.reason}</div>
          </div>
        </div>
      }
      <div className="mini-profile-content mini-profile-content_transaction">
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.PLAYER')}</div>
          <div className="info-block-content">
            <div className="info-block-heading">
              {transactionInfo.playerProfile.firstName}{' '}{transactionInfo.playerProfile.lastName}
              {transactionInfo.playerProfile.kycCompleted && <i className="fa fa-check text-success margin-left-5" />}
            </div>
            <div className="info-block-description">
              {transactionInfo.playerProfile.username}
              {' - '}
              <Uuid
                uuid={transactionInfo.creatorUUID}
                uuidPrefix={uuidPrefix}
              />
            </div>
          </div>
        </div>
        <div className="info-block">
          <div className="info-block-label">{I18n.t('PAYMENT_DETAILS_MODAL.HEADER_AMOUNT')}</div>
          <div className="info-block-content">
            <div className="info-block-heading">
              {/*{transactionInfo.}*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TransactionMiniProfile.propTypes = {
  transactionInfo: PropTypes.object.isRequired,
};

export default TransactionMiniProfile;
