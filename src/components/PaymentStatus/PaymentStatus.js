import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import PropTypes from 'constants/propTypes';
import { statuses } from 'constants/payment';
import { getTradingStatusProps } from 'utils/paymentHelpers';
import FailedStatusIcon from 'components/FailedStatusIcon';
import Uuid from 'components/Uuid';
import './PaymentStatus.scss';

class PaymentStatus extends PureComponent {
  static propTypes = {
    paymentId: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    statusChangedAt: PropTypes.string,
    declineReason: PropTypes.string,
    creationTime: PropTypes.string,
    modifiedBy: PropTypes.string,
  };

  static defaultProps = {
    modifiedBy: '',
    creationTime: '',
    declineReason: '',
    statusChangedAt: '',
  };

  render() {
    const {
      paymentId,
      modifiedBy,
      creationTime,
      declineReason,
      statusChangedAt,
    } = this.props;

    const { status, label } = getTradingStatusProps(this.props.status);

    return (
      <Fragment>
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
          <If condition={declineReason}>
            <FailedStatusIcon id={`transaction-failure-reason-${paymentId}`}>
              {declineReason}
            </FailedStatusIcon>
          </If>
        </div>
        <Choose>
          <When condition={statusChangedAt}>
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
        <If condition={modifiedBy}>
          <div className="PaymentStatus__additional">
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
