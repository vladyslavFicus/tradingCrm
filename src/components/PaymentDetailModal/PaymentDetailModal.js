import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import moment from 'moment';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import {
  methodsLabels as paymentsMethodsLabels,
  types as paymentsTypes,
  statuses as paymentStatuses,
} from '../../constants/payment';
import Amount from '../Amount';
import NoteButton from '../NoteButton';
import { UncontrolledTooltip } from '../Reactstrap/Uncontrolled';
import PermissionContent from '../PermissionContent';
import ShortLoader from '../ShortLoader';
import permissions from '../../config/permissions';
import Uuid from '../Uuid';
import ModalPlayerInfo from '../ModalPlayerInfo';
import TransactionStatus from '../TransactionStatus';
import renderLabel from '../../utils/renderLabel';
import PaymentAccount from '../PaymentAccount';
import PlayerActivityReportButton from '../PlayerActivityReportButton';
import IpFlag from '../IpFlag';

class PaymentDetailModal extends Component {
  static propTypes = {
    className: PropTypes.string,
    onCloseModal: PropTypes.func.isRequired,
    payment: PropTypes.paymentEntity.isRequired,
    playerProfile: PropTypes.userProfile,
  };
  static defaultProps = {
    className: '',
    playerProfile: null,
  };

  handleApproveClick = () => {
    alert('Implementation will be later...');
  };

  handleRejectClick = () => {
    alert('Implementation will be later...');
  };

  handleNoteClick = () => {
    alert('Implementation will be later...');
  };

  renderActions = () => {
    const {
      payment: {
        status,
        paymentType,
      },
      profile: { playerProfile: { data: playerProfile } },
    } = this.props;

    let actions = null;

    if (paymentType === paymentsTypes.Withdraw && status === paymentStatuses.PENDING) {
      actions = (
        <span>
          <PlayerActivityReportButton
            playerUUID={playerProfile.playerUUID}
            fullName={`${playerProfile.firstName} ${playerProfile.lastName}`}
            buttonProps={{
              className: 'margin-right-5',
              color: 'primary',
            }}
          />
          <PermissionContent permissions={permissions.PAYMENTS.APPROVE_WITHDRAW}>
            <Button
              color="primary"
              onClick={this.handleApproveClick}
              className="margin-right-5"
            >
              {I18n.t('COMMON.APPROVE')}
            </Button>
          </PermissionContent>
          <Button
            color="danger"
            onClick={this.handleRejectClick}
          >
            {I18n.t('COMMON.REJECT')}
          </Button>
        </span>
      );
    }

    return (
      <span className="payment-details-actions">
        {actions}
      </span>
    );
  };

  render() {
    const {
      profile,
      payment,
      onCloseModal,
      className,
    } = this.props;

    const isWithdraw = payment.paymentType === paymentsTypes.Withdraw;

    return (
      <Modal isOpen toggle={onCloseModal} className={classNames(className, 'payment-detail-modal')}>
        <ModalHeader toggle={onCloseModal}>{I18n.t('PAYMENT_DETAILS_MODAL.TITLE')}</ModalHeader>
        <ModalBody>
          <Choose>
            <When condition={profile.loading}>
              <ShortLoader />
            </When>
            <Otherwise>
              <ModalPlayerInfo playerProfile={profile.playerProfile.data} />
              <div className="modal-body-tabs">
                <div className="modal-body-tabs__item">
                  <div className="modal-tab-label">
                    {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_TRANSACTION')}
                  </div>
                  <div className="modal-header-tabs__label">
                    <Uuid uuid={payment.paymentId} uuidPrefix="TA" />
                  </div>
                </div>
                <div className="modal-body-tabs__item">
                  <div className="modal-tab-label">
                    {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_DATE_TIME')}
                  </div>
                  <div className="modal-header-tabs__label">
                    {moment.utc(payment.creationTime).local().format('DD.MM.YYYY')}
                  </div>
                  <div className="font-size-11">
                    {moment.utc(payment.creationTime).local().format('HH:mm')}
                  </div>
                </div>
                <div className="modal-body-tabs__item">
                  <div className="modal-tab-label">
                    Ip
                  </div>
                  <IpFlag id={payment.paymentId} country={payment.country} ip={payment.clientIp} />
                </div>
                <div className="modal-body-tabs__item">
                  <div className="modal-tab-label">
                    {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_DEVICE')}
                  </div>
                  <div className="margin-top-5">
                    <i
                      id={`payment-detail-${payment.paymentId}-tooltip`}
                      className={`fa font-size-20 ${payment.mobile ? 'fa-mobile' : 'fa-desktop'}`}
                    />
                    <UncontrolledTooltip
                      placement="bottom"
                      target={`payment-detail-${payment.paymentId}-tooltip`}
                      delay={{
                        show: 350, hide: 250,
                      }}
                    >
                      {payment.userAgent || 'User agent not defined'}
                    </UncontrolledTooltip>
                  </div>
                </div>
                <div className="modal-body-tabs__item">
                  <div className="modal-tab-label">
                    {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_STATUS')}
                  </div>
                  <TransactionStatus transaction={payment} />
                </div>
              </div>
              <div className="modal-footer-tabs">
                <div className="modal-footer-tabs__item">
                  <div className="modal-tab-label">
                    {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_AMOUNT')}
                  </div>
                  <div
                    className={classNames('modal-footer-tabs__amount', { 'color-danger': isWithdraw })}
                  >
                    {isWithdraw && '-'}<Amount {...payment.amount} />
                  </div>
                </div>
                <div className="modal-footer-tabs__item">
                  <div className="modal-tab-label">
                    {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_PAYMENT_METHOD')}
                  </div>
                  <div className="modal-footer-tabs__amount">
                    {payment.paymentMethod ? renderLabel(payment.paymentMethod, paymentsMethodsLabels) : 'Manual'}
                  </div>
                  {
                    !!payment.paymentAccount &&
                    <div className="font-size-14">
                      <PaymentAccount account={payment.paymentAccount} />
                    </div>
                  }
                </div>
              </div>
              <div className="text-center">
                <NoteButton
                  id="payment-detail-modal-note"
                  note={payment.note}
                  onClick={this.handleNoteClick}
                  targetEntity={payment}
                />
              </div>
            </Otherwise>
          </Choose>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={onCloseModal}
            className="mr-auto"
          >
            {I18n.t('COMMON.DEFER')}
          </Button>
          {!this.props.profile.loading && this.renderActions()}
        </ModalFooter>
      </Modal>
    );
  }
}

export default PaymentDetailModal;
