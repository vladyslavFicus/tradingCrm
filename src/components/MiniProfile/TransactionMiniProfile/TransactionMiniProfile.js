import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { shortify } from '../../../utils/uuid';
import Uuid from '../../../components/Uuid';
import Amount from '../../Amount';
import './TransactionMiniProfile.scss';

const TransactionMiniProfile = ({ transactionData }) => {
  let uuidPrefix = null;

  if (transactionData.creatorUUID.indexOf('OPERATOR') === -1) {
    uuidPrefix = transactionData.creatorUUID.indexOf('PLAYER') === -1 ? 'PL' : null;
  }

  return (
    <div className={`mini-profile transaction-mini-profile_${transactionData.status}`}>
      <div className="mini-profile-header">
        <label className="mini-profile-label">{transactionData.status}</label>
        <div className="mini-profile-type">{I18n.t('MINI_PROFILE.TRANSACTION')}</div>
        <div className="mini-profile-title">
          <span className={`transaction-status transaction-status_${transactionData.paymentType}`}>
            {transactionData.paymentType}
          </span>
          {' '}
          <span className="font-weight-700">{shortify(transactionData.paymentId, 'TA')}</span>
          <i className="note-icon note-pinned-note" />
        </div>
        <div className="mini-profile-ids">
          {I18n.t('COMMON.AUTHOR_BY')}
          {' '}
          <Uuid
            uuid={transactionData.creatorUUID}
            uuidPrefix={uuidPrefix}
          />
        </div>
        <div className="mini-profile-ids">
          {I18n.t('COMMON.DATE_ON', {
            date: moment(transactionData.creationTime).format('DD.MM.YYYY - HH:mm:ss'),
          })}
        </div>
      </div>
      {
        transactionData.status === 'FAILED' &&
        <div className="mini-profile-status-reason">
          <div className="info-block">
            <div className="info-block_status-reason">{I18n.t('MINI_PROFILE.ERROR_MESSAGE')}</div>
            <div className="info-block_status-reason_body">{transactionData.reason}</div>
          </div>
        </div>
      }
      {
        transactionData.status === 'REFUSED' &&
        <div className="mini-profile-status-reason">
          <div className="info-block">
            <div className="info-block_status-reason">{I18n.t('MINI_PROFILE.REJECTION_REASON')}</div>
            <div className="info-block_status-reason_body">{transactionData.reason}</div>
          </div>
        </div>
      }
      <div className="mini-profile-content transaction-mini-profile-content">
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.PLAYER')}</div>
          <div className="info-block-content">
            <div className="info-block-heading">
              {transactionData.playerProfile.firstName}{' '}{transactionData.playerProfile.lastName}
              {transactionData.playerProfile.kycCompleted && <i className="fa fa-check text-success margin-left-5" />}
            </div>
            <div className="info-block-description">
              {transactionData.playerProfile.username}
              {' - '}
              <Uuid
                uuid={transactionData.creatorUUID}
                uuidPrefix={uuidPrefix}
              />
            </div>
          </div>
        </div>
        <div className="info-block">
          <div className="info-block-label">{I18n.t('PAYMENT_DETAILS_MODAL.HEADER_AMOUNT')}</div>
          <div className="info-block-content">
            <div className="info-block-heading">
              <Amount {...transactionData.amount} />
            </div>
          </div>
        </div>
        {
          transactionData.paymentMethod &&
          <div className="info-block">
            <div className="info-block-label">{I18n.t('PAYMENT_DETAILS_MODAL.HEADER_PAYMENT_METHOD')}</div>
            <div className="info-block-content">
              <div className="info-block-heading">
                {transactionData.paymentMethod}
              </div>
              {
                transactionData.paymentAccount &&
                <div className="info-block-description">
                  <Uuid uuid={transactionData.paymentAccount} uuidPartsCount={2} />
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  );
};

TransactionMiniProfile.propTypes = {
  transactionData: PropTypes.object.isRequired,
};

export default TransactionMiniProfile;
