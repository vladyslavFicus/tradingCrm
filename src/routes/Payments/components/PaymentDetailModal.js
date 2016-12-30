import React, { Component, PropTypes } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import GridView, { GridColumn } from 'components/GridView';
import { statusesLabels as transactionsStatusesLabels } from 'constants/transaction';
import {
  types as paymentTypes,
  statuses as paymentsStatuses,
  methodsLabels as paymentsMethodsLabels,
  statusesLabels as paymentsStatusesLabels,
} from 'constants/payment';
import Amount from 'components/Amount';
import moment from 'moment';

class PaymentDetailModal extends Component {
  render() {
    const {
      payment: {
        discriminator,
        paymentMethod,
        status,
        paymentId,
        amount,
        currency,
      },
      transactions,
      isOpen,
      onClose,
      onChangePaymentStatus,
    } = this.props;

    return <Modal isOpen={isOpen} toggle={onClose} className={this.props.className}>
      <ModalHeader toggle={onClose}>Payment details</ModalHeader>

      <ModalBody>
        <p><strong>ID</strong>: {paymentId}</p>
        <p><strong>Status</strong>: {paymentsStatusesLabels[status] || status}</p>
        <p><strong>Type</strong>: {discriminator}</p>
        <p><strong>Method</strong>: {paymentsMethodsLabels[paymentMethod] || paymentMethod}</p>
        <p><strong>Amount</strong>: <Amount currency={currency} amount={amount}/></p>

        <hr />

        <GridView dataSource={transactions} totalPages={0}>
          <GridColumn
            name="transactionId"
            header="ID"
            headerStyle={{ width: '20%' }}
            render={(data, column) => <small>{data[column.name]}</small>}
          />
          <GridColumn
            name="transactionName"
            header="Status"
            headerStyle={{ width: '20%' }}
            render={this.renderStatus}
          />
          <GridColumn
            name="transactionTime"
            header="Time"
            headerStyle={{ width: '20%' }}
            render={this.renderTransactionTime}
          />
        </GridView>
      </ModalBody>

      {discriminator === paymentTypes.Withdraw && status === paymentsStatuses.PENDING && <ModalFooter>
        <Button color="primary" onClick={(e) => onChangePaymentStatus('approve', paymentId)}>Approve</Button>{' '}
        <Button color="danger" onClick={(e) => onChangePaymentStatus('reject', paymentId)}>Reject</Button>
      </ModalFooter>}
    </Modal>;
  }

  renderStatus = (data, column) => {
    return transactionsStatusesLabels[data[column.name]] || data[column.name];
  };

  renderTransactionTime = (data, column) => {
    return moment(data[column.name]).format('DD.MM.YYYY HH:mm:ss');
  };
}

PaymentDetailModal.propTypes = {
  payment: PropTypes.shape({
    paymentId: PropTypes.string,
    transactions: PropTypes.array,
  }),
};

export default PaymentDetailModal;
