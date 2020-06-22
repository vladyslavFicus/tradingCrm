import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import Badge from 'components/Badge';
import { shortify } from 'utils/uuid';
import PaymentDetailsModal from 'modals/PaymentDetailsModal';
import Uuid from '../Uuid';

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
        <Badge
          text={I18n.t(`CONSTANTS.ACCOUNT_TYPE.${accountType}`)}
          info={accountType === 'DEMO'}
          success={accountType === 'LIVE'}
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
    paymentDetails: PaymentDetailsModal,
  }),
)(GridPaymentInfo);
