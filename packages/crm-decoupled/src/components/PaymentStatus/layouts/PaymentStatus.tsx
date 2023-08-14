import React from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { Constants } from '@crm/common';
import FailedStatusIcon from 'components/FailedStatusIcon';
import Uuid from 'components/Uuid';
import usePaymentStatus from '../hooks/usePaymentStatus';
import './PaymentStatus.scss';

type Props = {
  paymentId: string,
  status: string,
  statusChangedAt?: string,
  declineReason?: string,
  creationTime?: string,
  modifiedBy?: string,
}

const PaymentStatus = (props: Props) => {
  const {
    paymentId,
    modifiedBy = '',
    creationTime,
    declineReason,
    statusChangedAt,
  } = props;

  const { status, label } = usePaymentStatus(props.status);

  return (
    <>
      <div className={
        classNames(
          'PaymentStatus__general',
          'PaymentStatus__status', {
            'PaymentStatus__status--approved': status === Constants.Payment.statuses.APPROVED,
            'PaymentStatus__status--pending': status === Constants.Payment.statuses.PENDING,
            'PaymentStatus__status--rejected': status === Constants.Payment.statuses.REJECTED,
            'PaymentStatus__status--canceled': status === Constants.Payment.statuses.CANCELED,
            'PaymentStatus__status--failed': status === Constants.Payment.statuses.FAILED,
            'PaymentStatus__status--completed': status === Constants.Payment.statuses.COMPLETED,
          },
        )}
      >
        {I18n.t(label)}

        <If condition={!!declineReason}>
          <FailedStatusIcon id={`transaction-failure-reason-${paymentId}`}>
            {declineReason}
          </FailedStatusIcon>
        </If>
      </div>

      <Choose>
        <When condition={!!statusChangedAt}>
          <div className="PaymentStatus__additional">
            {I18n.t('COMMON.DATE_ON', {
              date: moment.utc(statusChangedAt).local().format('DD.MM.YYYY - HH:mm:ss'),
            })}
          </div>
        </When>

        <Otherwise>
          <div className="PaymentStatus__additional">
            {I18n.t('COMMON.DATE_ON', {
              date: moment.utc(creationTime).local().format('DD.MM.YYYY - HH:mm:ss'),
            })}
          </div>
        </Otherwise>
      </Choose>

      <If condition={!!modifiedBy}>
        <div className="PaymentStatus__additional">
          {I18n.t('COMMON.AUTHOR_BY')}

          <Uuid uuid={modifiedBy} />
        </div>
      </If>
    </>
  );
};

export default React.memo(PaymentStatus);
