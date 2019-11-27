import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import PropTypes from 'constants/propTypes';
import Badge from 'components/Badge';
import { shortify } from 'utils/uuid';
import { withModals } from '../HighOrder';
import PaymentDetailModal from '../PaymentDetailModal';
import Uuid from '../Uuid';

class GridPaymentInfo extends PureComponent {
  static propTypes = {
    payment: PropTypes.paymentEntity.isRequired,
    modals: PropTypes.shape({
      paymentDetail: PropTypes.modalType,
    }).isRequired,
    onSuccess: PropTypes.func.isRequired,
  };

  handleOpenDetailModal = () => {
    const {
      modals: { paymentDetail },
      payment: {
        paymentId,
        paymentType,
        paymentMethod,
        creationTime,
        mobile,
        clientIp,
        country,
        userAgent,
        status,
        createdBy,
        amount,
        currency,
        playerProfile: { uuid },
        originalAgent,
      },
      onSuccess,
    } = this.props;

    paymentDetail.show({
      payment: {
        paymentId,
        paymentType,
        paymentMethod,
        creationTime,
        mobile,
        clientIp,
        country,
        userAgent,
        status,
        createdBy,
        amount,
        currency,
        playerProfile: { uuid },
        originalAgent,
      },
      onSuccess,
    });
  };

  render() {
    const {
      payment: {
        paymentId,
        createdBy,
        paymentType,
      },
    } = this.props;

    return (
      <div id={`payment-${paymentId}`}>
        <Badge
          text={I18n.t(`CONSTANTS.ACCOUNT_TYPE.${paymentType === 'DEMO_DEPOSIT' ? 'DEMO' : 'LIVE'}`)}
          info={paymentType === 'DEMO_DEPOSIT'}
          success={paymentType !== 'DEMO_DEPOSIT'}
        >
          <button
            type="button"
            className="btn-transparent-text font-weight-700"
            onClick={this.handleOpenDetailModal}
            id={`transaction-${paymentId}`}
          >
            {shortify(paymentId, 'TA')}
          </button>
        </Badge>
        <div className="font-size-11">
          {I18n.t('COMMON.AUTHOR_BY')}
          <Uuid uuid={createdBy || paymentId} />
        </div>
      </div>
    );
  }
}

export default compose(
  withModals({
    paymentDetail: PaymentDetailModal,
  }),
)(GridPaymentInfo);
