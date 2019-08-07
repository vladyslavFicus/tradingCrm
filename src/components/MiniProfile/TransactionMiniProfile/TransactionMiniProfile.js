import React from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import classNames from 'classnames';
import { shortify } from '../../../utils/uuid';
import Uuid from '../../Uuid';
import Amount from '../../Amount';
import PropTypes from '../../../constants/propTypes';
import { tradingTypesLabelsWithColor } from '../../../constants/payment';
import PaymentAccount from '../../PaymentAccount';
import { getTradingStatusProps } from '../../../utils/paymentHelpers';
import NoteIcon from '../../NoteIcon';
import { paymentStatusNames } from '../constants';
import './TransactionMiniProfile.scss';

const TransactionMiniProfile = ({ data }) => {
  let authorUuidPrefix = null;

  if (data.createdBy.indexOf('OPERATOR') === -1) {
    authorUuidPrefix = data.createdBy.indexOf('PLAYER') === -1 ? 'PL' : null;
  }

  return (
    <div
      className={
        classNames(
          'mini-profile transaction-mini-profile',
          paymentStatusNames[getTradingStatusProps[data.status].status],
        )}
    >
      <div className="mini-profile-header">
        <label className="mini-profile-label">{data.status}</label>
        <div className="mini-profile-type">{I18n.t('MINI_PROFILE.TRANSACTION')}</div>
        <div className="mini-profile-title">
          <span className={classNames('transaction-status', tradingTypesLabelsWithColor[data.paymentType].color)}>
            {I18n.t(tradingTypesLabelsWithColor[data.paymentType].label)}
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
          data.paymentMethod
          && (
            <div className="info-block">
              <div className="info-block-label">{I18n.t('PAYMENT_DETAILS_MODAL.HEADER_PAYMENT_METHOD')}</div>
              <div className="info-block-content">
                <div className="info-block-heading">
                  {data.paymentMethod}
                </div>
                {
                  data.paymentAccount
                && (
                  <div className="info-block-description">
                    <PaymentAccount account={data.paymentAccount} />
                  </div>
                )
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

TransactionMiniProfile.propTypes = {
  data: PropTypes.paymentEntity.isRequired,
};

export default TransactionMiniProfile;
