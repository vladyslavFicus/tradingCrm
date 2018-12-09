import React from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import classNames from 'classnames';
import { shortify } from '../../../utils/uuid';
import Uuid from '../../../components/Uuid';
import Amount from '../../Amount';
import './TransactionMiniProfile.scss';
import { paymentStatusNames, paymentTypesNames } from '../constants';
import PropTypes from '../../../constants/propTypes';
import PaymentAccount from '../../../components/PaymentAccount';
import NoteIcon from '../../NoteIcon';

const TransactionMiniProfile = ({ data }) => {
  let authorUuidPrefix = null;

  if (data.createdBy.indexOf('OPERATOR') === -1) {
    authorUuidPrefix = data.createdBy.indexOf('PLAYER') === -1 ? 'PL' : null;
  }

  return (
    <div className={classNames('mini-profile transaction-mini-profile', paymentStatusNames[data.status])}>
      <div className="mini-profile-header">
        <label className="mini-profile-label">{data.status}</label>
        <div className="mini-profile-type">{I18n.t('MINI_PROFILE.TRANSACTION')}</div>
        <div className="mini-profile-title">
          <span className={classNames('transaction-status', paymentTypesNames[data.paymentType])}>
            {data.paymentType}
          </span>
          {' '}
          <span className="font-weight-700">{shortify(data.paymentId, 'TA')}</span>
          <NoteIcon type="pinned" className="mini-profile__note-icon" />
        </div>
        <div className="mini-profile-ids">
          {I18n.t('COMMON.AUTHOR_BY')}
          {' '}
          <Uuid
            uuid={data.createdBy}
            uuidPrefix={authorUuidPrefix}
          />
        </div>
        <div className="mini-profile-ids">
          {I18n.t('COMMON.DATE_ON', {
            date: moment.utc(data.creationTime).local().format('DD.MM.YYYY - HH:mm:ss'),
          })}
        </div>
      </div>
      <div className="mini-profile-content transaction-mini-profile-content">
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.PLAYER')}</div>
          <div className="info-block-content">
            <div className="info-block-heading">
              {`${data.playerProfile.firstName} ${data.playerProfile.lastName}`}
              {data.playerProfile.kycCompleted && <i className="fa fa-check text-success margin-left-5" />}
            </div>
            <div className="info-block-description">
              {data.playerProfile.username}
              {' - '}
              <Uuid
                uuid={data.createdBy}
                uuidPrefix={authorUuidPrefix}
              />
            </div>
          </div>
        </div>
        <div className="info-block">
          <div className="info-block-label">{I18n.t('PAYMENT_DETAILS_MODAL.HEADER_AMOUNT')}</div>
          <div className="info-block-content">
            <div className="info-block-heading">
              <Amount {...data.amount} />
            </div>
          </div>
        </div>
        {
          data.paymentMethod &&
          <div className="info-block">
            <div className="info-block-label">{I18n.t('PAYMENT_DETAILS_MODAL.HEADER_PAYMENT_METHOD')}</div>
            <div className="info-block-content">
              <div className="info-block-heading">
                {data.paymentMethod}
              </div>
              {
                data.paymentAccount &&
                <div className="info-block-description">
                  <PaymentAccount account={data.paymentAccount} />
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
  data: PropTypes.paymentEntity.isRequired,
};

export default TransactionMiniProfile;
