import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import PropTypes from 'constants/propTypes';
import {
  withdrawStatusesLabels,
  withdrawStatusesColors,
} from 'constants/payment';
import { getTradingStatusProps } from 'utils/paymentHelpers';
import FailedStatusIcon from 'components/FailedStatusIcon';
import Uuid from 'components/Uuid';

class PaymentStatus extends PureComponent {
  static propTypes = {
    paymentId: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    statusChangedAt: PropTypes.string,
    withdrawStatus: PropTypes.string,
    declineReason: PropTypes.string,
    creationTime: PropTypes.string,
    modifiedBy: PropTypes.string,
  };

  static defaultProps = {
    modifiedBy: '',
    creationTime: '',
    declineReason: '',
    withdrawStatus: '',
    statusChangedAt: '',
  };

  render() {
    const {
      status,
      paymentId,
      modifiedBy,
      creationTime,
      declineReason,
      withdrawStatus,
      statusChangedAt,
    } = this.props;

    const { color, label } = getTradingStatusProps(status);

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
        <If condition={withdrawStatus}>
          <div
            className={
              classNames(withdrawStatusesColors[withdrawStatus], 'font-size-11 text-uppercase')
            }
          >
            {I18n.t(withdrawStatusesLabels[withdrawStatus])}
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
  }
}

export default PaymentStatus;
