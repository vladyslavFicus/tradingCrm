import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import Badge from 'components/Badge';
import Uuid from 'components/Uuid';
import { shortify } from 'utils/uuid';
import PaymentDetailsModal from 'modals/PaymentDetailsModal';
import './GridPaymentInfo.scss';

class GridPaymentInfo extends PureComponent {
  static propTypes = {
    payment: PropTypes.paymentEntity.isRequired,
    modals: PropTypes.shape({
      paymentDetails: PropTypes.modalType,
    }).isRequired,
    onSuccess: PropTypes.func.isRequired,
  };

  handleOpenDetailModal = () => {
    const {
      payment,
      onSuccess,
      modals: { paymentDetails },
    } = this.props;

    paymentDetails.show({ payment, onSuccess });
  };

  render() {
    const {
      payment: {
        paymentId,
        createdBy,
        accountType,
      },
    } = this.props;

    return (
      <div id={`payment-${paymentId}`}>
        <div
          id={`transaction-${paymentId}`}
          className="GridPaymentInfo__transaction-id"
          onClick={this.handleOpenDetailModal}
        >
          <Badge
            text={I18n.t(`CONSTANTS.ACCOUNT_TYPE.${accountType}`)}
            info={accountType === 'DEMO'}
            success={accountType === 'LIVE'}
          >
            {shortify(paymentId, 'TA')}
          </Badge>
        </div>
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
    paymentDetails: PaymentDetailsModal,
  }),
)(GridPaymentInfo);
