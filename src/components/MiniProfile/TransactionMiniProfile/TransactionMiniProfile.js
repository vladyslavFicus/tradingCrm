import React from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import classNames from 'classnames';
import { shortify } from '../../../utils/uuid';
import Uuid from '../../../components/Uuid';
import Amount from '../../Amount';
import './TransactionMiniProfile.scss';
import { statuses } from '../../../constants/payment';
import { paymentStatusNames } from '../constants';
import PropTypes from '../../../constants/propTypes';

const TransactionMiniProfile = ({ data }) => {
  let uuidPrefix = null;

  if (data.creatorUUID.indexOf('OPERATOR') === -1) {
    uuidPrefix = data.creatorUUID.indexOf('PLAYER') === -1 ? 'PL' : null;
  }

  return (
    <div className={classNames('mini-profile transaction-mini-profile', paymentStatusNames[data.status])}>
      <div className="mini-profile-header">
        <label className="mini-profile-label">{data.status}</label>
        <div className="mini-profile-type">{I18n.t('MINI_PROFILE.TRANSACTION')}</div>
        <div className="mini-profile-title">
          <span className={`transaction-status transaction-status_${data.paymentType}`}>
            {data.paymentType}
          </span>
          {' '}
          <span className="font-weight-700">{shortify(data.paymentId, 'TA')}</span>
          <i className="note-icon note-pinned-note" />
        </div>
        <div className="mini-profile-ids">
          {I18n.t('COMMON.AUTHOR_BY')}
          {' '}
          <Uuid
            uuid={data.creatorUUID}
            uuidPrefix={uuidPrefix}
          />
        </div>
        <div className="mini-profile-ids">
          {I18n.t('COMMON.DATE_ON', {
            date: moment(data.creationTime).format('DD.MM.YYYY - HH:mm:ss'),
          })}
        </div>
      </div>
      {
        data.status === statuses.FAILED &&
        <div className="mini-profile-status-reason">
          <div className="info-block">
            <div className="info-block_status-reason">{I18n.t('MINI_PROFILE.ERROR_MESSAGE')}</div>
            <div className="info-block_status-reason_body">{data.reason}</div>
          </div>
        </div>
      }
      {
        data.status === statuses.REFUSED &&
        <div className="mini-profile-status-reason">
          <div className="info-block">
            <div className="info-block_status-reason">{I18n.t('MINI_PROFILE.REJECTION_REASON')}</div>
            <div className="info-block_status-reason_body">{data.reason}</div>
          </div>
        </div>
      }
      <div className="mini-profile-content transaction-mini-profile-content">
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.PLAYER')}</div>
          <div className="info-block-content">
            <div className="info-block-heading">
              {data.playerProfile.firstName}{' '}{data.playerProfile.lastName}
              {data.playerProfile.kycCompleted && <i className="fa fa-check text-success margin-left-5" />}
            </div>
            <div className="info-block-description">
              {data.playerProfile.username}
              {' - '}
              <Uuid
                uuid={data.creatorUUID}
                uuidPrefix={uuidPrefix}
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
                  <Uuid uuid={data.paymentAccount} uuidPartsCount={2} />
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
