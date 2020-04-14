import React, { Fragment } from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import moment from 'moment';
import FailedStatusIcon from 'components/FailedStatusIcon';
import PropTypes from 'constants/propTypes';
import { getTradingStatusProps, getWithdrawStatusProps } from 'utils/paymentHelpers';
import Uuid from 'components/Uuid';

const PaymentStatus = ({
  status,
  paymentId,
  declineReason,
  modifiedBy,
  creationTime,
  statusChangedAt,
  withdrawStatus,
}) => {
  const { color, label } = getTradingStatusProps(status);
  const withdrawStatusProps = getWithdrawStatusProps(withdrawStatus);

  return (
    <Fragment>
      <div className={classNames(color, 'font-weight-700 text-uppercase status')}>
        {I18n.t(label)}
        <If condition={declineReason}>
          <FailedStatusIcon id={`transaction-failure-reason-${paymentId}`}>
            {declineReason}
          </FailedStatusIcon>
        </If>
      </div>
      <If condition={withdrawStatusProps}>
        <div className={classNames(withdrawStatusProps.color, 'font-size-11 text-uppercase')}>
          {I18n.t(withdrawStatusProps.label)}
        </div>
      </If>
      <Choose>
        <When condition={statusChangedAt}>
          <div className="font-size-11">
            {I18n.t('COMMON.DATE_ON', {
              date: moment.utc(statusChangedAt).local().format('DD.MM.YYYY - HH:mm:ss'),
            })}
          </div>
        </When>
        <Otherwise>
          <div className="font-size-11">
            {I18n.t('COMMON.DATE_ON', {
              date: moment.utc(creationTime).local().format('DD.MM.YYYY - HH:mm:ss'),
            })}
          </div>
        </Otherwise>
      </Choose>
      <If condition={modifiedBy}>
        <div className="font-size-11">
          {I18n.t('COMMON.AUTHOR_BY')}
          {' '}
          <Uuid uuid={modifiedBy} />
        </div>
      </If>
    </Fragment>
  );
};

PaymentStatus.propTypes = {
  status: PropTypes.string.isRequired,
  paymentId: PropTypes.string.isRequired,
  statusChangedAt: PropTypes.string,
  modifiedBy: PropTypes.string,
  declineReason: PropTypes.string,
  withdrawStatus: PropTypes.string,
  creationTime: PropTypes.string,
};

PaymentStatus.defaultProps = {
  statusChangedAt: '',
  modifiedBy: '',
  declineReason: '',
  withdrawStatus: '',
  creationTime: '',
};

export default PaymentStatus;
