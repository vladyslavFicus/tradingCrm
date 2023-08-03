import React from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { statuses } from 'constants/payment';
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
            'PaymentStatus__status--approved': status === statuses.APPROVED,
            'PaymentStatus__status--pending': status === statuses.PENDING,
            'PaymentStatus__status--rejected': status === statuses.REJECTED,
            'PaymentStatus__status--canceled': status === statuses.CANCELED,
            'PaymentStatus__status--failed': status === statuses.FAILED,
            'PaymentStatus__status--completed': status === statuses.COMPLETED,
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
