import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { shortify } from '../../../utils/uuid';
import Uuid from '../../../components/Uuid';
import Amount from '../../Amount';
import './TransactionMiniProfile.scss';

const TransactionMiniProfile = ({ transaction }) => {
  let uuidPrefix = null;

  if (transaction.creatorUUID.indexOf('OPERATOR') === -1) {
    uuidPrefix = transaction.creatorUUID.indexOf('PLAYER') === -1 ? 'PL' : null;
  }

  return (
    <div className={`mini-profile transaction-mini-profile_${transaction.status}`}>
      <div className="mini-profile-header">
        <label className="mini-profile-label">{transaction.status}</label>
        <div className="mini-profile-type">{I18n.t('MINI_PROFILE.TRANSACTION')}</div>
        <div className="mini-profile-title">
          <span className={`transaction-status transaction-status_${transaction.paymentType}`}>
            {transaction.paymentType}
          </span>
          {' '}
          <span className="font-weight-700">{shortify(transaction.paymentId, 'TA')}</span>
          <i className="note-icon note-pinned-note" />
        </div>
        <div className="mini-profile-ids">
          {I18n.t('COMMON.AUTHOR_BY')}
          {' '}
          <Uuid
            uuid={transaction.creatorUUID}
            uuidPrefix={uuidPrefix}
          />
        </div>
        <div className="mini-profile-ids">
          {I18n.t('COMMON.DATE_ON', {
            date: moment(transaction.creationTime).format('DD.MM.YYYY - HH:mm:ss'),
          })}
        </div>
      </div>
      {
        transaction.status === 'FAILED' &&
        <div className="mini-profile-status-reason">
          <div className="info-block">
            <div className="info-block_status-reason">{I18n.t('MINI_PROFILE.ERROR_MESSAGE')}</div>
            <div className="info-block_status-reason_body">{transaction.reason}</div>
          </div>
        </div>
      }
      {
        transaction.status === 'REFUSED' &&
        <div className="mini-profile-status-reason">
          <div className="info-block">
            <div className="info-block_status-reason">{I18n.t('MINI_PROFILE.REJECTION_REASON')}</div>
            <div className="info-block_status-reason_body">{transaction.reason}</div>
          </div>
        </div>
      }
      <div className="mini-profile-content transaction-mini-profile-content">
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.PLAYER')}</div>
          <div className="info-block-content">
            <div className="info-block-heading">
              {transaction.playerProfile.firstName}{' '}{transaction.playerProfile.lastName}
              {transaction.playerProfile.kycCompleted && <i className="fa fa-check text-success margin-left-5" />}
            </div>
            <div className="info-block-description">
              {transaction.playerProfile.username}
              {' - '}
              <Uuid
                uuid={transaction.creatorUUID}
                uuidPrefix={uuidPrefix}
              />
            </div>
          </div>
        </div>
        <div className="info-block">
          <div className="info-block-label">{I18n.t('PAYMENT_DETAILS_MODAL.HEADER_AMOUNT')}</div>
          <div className="info-block-content">
            <div className="info-block-heading">
              <Amount {...transaction.amount} />
            </div>
          </div>
        </div>
        {
          transaction.paymentMethod &&
          <div className="info-block">
            <div className="info-block-label">{I18n.t('PAYMENT_DETAILS_MODAL.HEADER_PAYMENT_METHOD')}</div>
            <div className="info-block-content">
              <div className="info-block-heading">
                {transaction.paymentMethod}
              </div>
              {
                transaction.paymentAccount &&
                <div className="info-block-description">
                  <Uuid uuid={transaction.paymentAccount} uuidPartsCount={2} />
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
  transaction: PropTypes.object.isRequired,
};

export default TransactionMiniProfile;
