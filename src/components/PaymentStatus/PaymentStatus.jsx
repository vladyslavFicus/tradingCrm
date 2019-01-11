import React, { Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import moment from 'moment';
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
    creationTime,
    createdBy,
    paymentType,
    playerProfile: { uuid },
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
      </div>
      <div className="font-size-11">
        {I18n.t('COMMON.DATE_ON', {
          date: moment.utc(creationTime).local().format('DD.MM.YYYY - HH:mm:ss'),
        })}
      </div>
      <If condition={createdBy}>
        <div className="font-size-11">
          {I18n.t('COMMON.AUTHOR_BY')}
          {' '}
          <Uuid uuid={createdBy} />
        </div>
      </If>
    </Fragment>
  );
};

PaymentStatus.propTypes = {
  payment: PropTypes.shape({
    status: PropTypes.string,
    paymentId: PropTypes.string.isRequired,
    creationTime: PropTypes.string,
    createdBy: PropTypes.string,
    paymentType: PropTypes.string,
    playerProfile: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default PaymentStatus;
