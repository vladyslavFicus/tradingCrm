import React, { Component, PropTypes } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {
  methodsLabels as paymentsMethodsLabels,
  statusesLabels as paymentsStatusesLabels,
} from 'constants/payment';
import Amount from 'components/Amount';

class PaymentDetailModal extends Component {
  render() {
    const {
      payment: {
        paymentType,
        paymentMethod,
        status,
        paymentId,
        amount,
        playerUUID,
      },
      isOpen,
      onClose,
      onChangePaymentStatus,
    } = this.props;

    return <Modal isOpen={isOpen} toggle={onClose} className={this.props.className}>
      <ModalHeader toggle={onClose}>Payment details</ModalHeader>

      <ModalBody>
        <p><strong>ID</strong>: {paymentId}</p>
        <p><strong>Status</strong>: {paymentsStatusesLabels[status] || status}</p>
        <p><strong>Type</strong>: {paymentType}</p>
        <p><strong>Method</strong>: {paymentsMethodsLabels[paymentMethod] || paymentMethod}</p>
        <p><strong>Amount</strong>: <Amount {...amount}/></p>
      </ModalBody>

      <ModalFooter>
        <Button color="primary"
                onClick={(e) => onChangePaymentStatus('approve', paymentId)}>Approve</Button>{' '}
        <Button color="danger" onClick={(e) => onChangePaymentStatus('refuse', paymentId, {
          playerUUID,
          reason: 'Bad withdraw',
          fraud: false,
        })}>Reject</Button>
      </ModalFooter>
    </Modal>;
  }
}

PaymentDetailModal.propTypes = {
  payment: PropTypes.shape({
    paymentId: PropTypes.string,
    transactions: PropTypes.array,
  }),
};

export default PaymentDetailModal;
