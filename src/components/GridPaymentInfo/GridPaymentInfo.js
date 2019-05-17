import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import { compose } from 'react-apollo';
import PropTypes from 'constants/propTypes';
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
      },
      onSuccess,
    });
  }

  render() {
    const {
      payment: {
        paymentId,
        createdBy,
      },
    } = this.props;

    return (
      <div id={`payment-${paymentId}`}>
        <button
          className="btn-transparent-text font-weight-700"
          onClick={this.handleOpenDetailModal}
          id={`transaction-${paymentId}`}
        >
          {shortify(paymentId, 'TA')}
        </button>
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
