import React, { Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import moment from 'moment';
import FailedStatusIcon from 'components/FailedStatusIcon';
import {
  statusMapper,
  tradingTypes,
} from '../../constants/payment';
import PropTypes from '../../constants/propTypes';
import { getTradingStatusProps } from '../../utils/paymentHelpers';
import Uuid from '../Uuid';
import FailedStatusContainer from '../../routes/Payments/routes/List/container/FailedStatusContainer';

const PaymentStatus = ({
  payment: {
    status,
    paymentId,
    paymentType,
    playerProfile: { uuid },
    declineReason,
    modifiedBy,
    modificationTime,
  },
}) => {
  const { color, label } = getTradingStatusProps(status);
  return (
    <Fragment>
      <div className={classNames(color, 'font-weight-700 text-uppercase status')}>
        {label}
        <If condition={paymentType === tradingTypes.DEPOSIT && statusMapper.FAILED.indexOf(status) !== -1}>
          <FailedStatusContainer
            id={`transaction-failure-reason-${paymentId}`}
            paymentId={paymentId}
            uuid={uuid}
          />
        </If>
        <If condition={statusMapper.REJECTED.indexOf(status) !== -1}>
          <FailedStatusIcon id={`transaction-failure-reason-${paymentId}`}>
            {declineReason}
          </FailedStatusIcon>
        </If>
      </div>
      <If condition={modificationTime}>
        <div className="font-size-11">
          {I18n.t('COMMON.DATE_ON', {
            date: moment.utc(modificationTime).local().format('DD.MM.YYYY - HH:mm:ss'),
          })}
        </div>
      </If>
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
  payment: PropTypes.shape({
    status: PropTypes.string,
    paymentId: PropTypes.string.isRequired,
    modificationTime: PropTypes.string,
    modifiedBy: PropTypes.string,
    paymentType: PropTypes.string,
    playerProfile: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default PaymentStatus;
