import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import classNames from 'classnames';
import I18n from 'i18n-js';
import moment from 'moment';
import { get } from 'lodash';
import { withRequests } from 'apollo';
import { getActiveBrandConfig } from 'config';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { tradingTypes, statusMapper } from 'constants/payment';
import { withPermission } from 'providers/PermissionsProvider';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import ChangeOriginalAgent from 'components/ChangeOriginalAgent';
import PaymentStatus from 'components/PaymentStatus';
import ShortLoader from 'components/ShortLoader';
import Amount from 'components/Amount';
import IpFlag from 'components/IpFlag';
import { Button } from 'components/UI';
import Uuid from 'components/Uuid';
import Permissions from 'utils/permissions';
import formatLabel from 'utils/formatLabel';
import ChangePaymentStatusForm from './components/ChangePaymentStatusForm';
import ApprovePaymentForm from './components/ApprovePaymentForm';
import RejectPaymentForm from './components/RejectPaymentForm';
import getProfileQuery from './graphql/getProfileQuery';
import './PaymentDetailsModal.scss';

class PaymentDetailsModal extends PureComponent {
  static propTypes = {
    permission: PropTypes.permission.isRequired,
    payment: PropTypes.paymentEntity.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    profile: PropTypes.shape({
      data: PropTypes.shape({
        newProfile: PropTypes.newProfile,
      }),
      loading: PropTypes.bool,
    }).isRequired,
  };

  onAcceptSuccess = () => {
    this.props.onSuccess();
    this.props.onCloseModal();
  };

  renderProfileInfoBlock = () => {
    const {
      payment: {
        playerProfile: {
          firstName,
          lastName,
          uuid,
        },
      },
    } = this.props;

    return (
      <div className="PaymentDetailsModal__block PaymentDetailsModal__one-third">
        <div className="PaymentDetailsModal__block-title">{I18n.t('COMMON.CLIENT')}</div>
        <div className="PaymentDetailsModal__block-label">{`${firstName} ${lastName}`}</div>
        <div className="PaymentDetailsModal__block-secondary">
          <Uuid
            uuid={uuid}
            uuidPrefix={uuid.indexOf('PLAYER') === -1 ? 'PL' : null}
          />
        </div>
      </div>
    );
  };

  renderChangeOriginalAgentBlock = () => {
    const { payment: { paymentId, originalAgent } } = this.props;

    return (
      <div className="PaymentDetailsModal__block PaymentDetailsModal__one-third">
        <ChangeOriginalAgent
          paymentId={paymentId}
          agentId={originalAgent ? originalAgent.uuid : ''}
        />
      </div>
    );
  };

  renderProfileBalanceBlock = () => {
    const { profile } = this.props;

    const { amount, credit } = get(profile, 'data.newProfile.data.profileView.balance') || {};
    const currency = getActiveBrandConfig().currencies.base;

    return (
      <div className="PaymentDetailsModal__block PaymentDetailsModal__one-third">
        <div className="PaymentDetailsModal__block-title">{I18n.t('COMMON.BALANCE')}</div>
        <div className="PaymentDetailsModal__block-label">
          {currency} {Number(amount).toFixed(2)}
        </div>
        <div className="PaymentDetailsModal__block-secondary">
          {I18n.t('CLIENT_PROFILE.PROFILE.HEADER.CREDIT')}: {currency} {Number(credit).toFixed(2)}
        </div>
      </div>
    );
  };

  renderTransactionInfoBlock = () => {
    const { payment: { paymentId } } = this.props;

    return (
      <div className="PaymentDetailsModal__block PaymentDetailsModal__one-fifth">
        <div className="PaymentDetailsModal__block-title">
          {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_TRANSACTION')}
        </div>
        <div className="PaymentDetailsModal__block-label">
          <Uuid uuid={paymentId} uuidPrefix="TA" />
        </div>
      </div>
    );
  };

  renderDateAndTimeBlock = () => {
    const { payment: { creationTime } } = this.props;

    return (
      <div className="PaymentDetailsModal__block PaymentDetailsModal__one-fifth">
        <div className="PaymentDetailsModal__block-title">
          {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_DATE_TIME')}
        </div>
        <div className="PaymentDetailsModal__block-label">
          {moment.utc(creationTime).local().format('DD.MM.YYYY')}
        </div>
        <div className="PaymentDetailsModal__block-secondary">
          {moment.utc(creationTime).local().format('HH:mm')}
        </div>
      </div>
    );
  };

  renderIPBlock = () => {
    const {
      payment: {
        paymentId,
        paymentMetadata: {
          clientIp,
          country,
        },
      },
    } = this.props;

    return (
      <div className="PaymentDetailsModal__block PaymentDetailsModal__one-fifth">
        <div className="PaymentDetailsModal__block-title">Ip</div>
        <div className="PaymentDetailsModal__block-ips">
          <IpFlag id={paymentId} country={country} ip={clientIp} />
        </div>
      </div>
    );
  };

  renderDeviceBlock = () => {
    const {
      payment: {
        paymentId,
        paymentMetadata,
      },
    } = this.props;

    const { mobile, userAgent } = paymentMetadata || {};

    /**
     * some payment types have uuid name without prefix like `PAYMENT`
     * and our awesome ReactStrap lib can't find element in DOM if
     * it's id name begins with digit character.
     * So we need make a crutch with adding literal prefix to id
     */
    const tooltipId = `tooltip-${paymentId}`;

    return (
      <div className="PaymentDetailsModal__block PaymentDetailsModal__one-fifth">
        <div className="PaymentDetailsModal__block-title">
          {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_DEVICE')}
        </div>
        <div className="PaymentDetailsModal__block-device-info">
          <i
            id={tooltipId}
            className={`fa ${mobile ? 'fa-mobile' : 'fa-desktop'}`}
          />
          <UncontrolledTooltip
            placement="bottom"
            target={tooltipId}
            delay={{ show: 350, hide: 250 }}
          >
            {userAgent || 'User agent not defined'}
          </UncontrolledTooltip>
        </div>
      </div>
    );
  };

  renderStatusBlock = () => {
    const {
      payment: {
        creationTime,
        withdrawStatus,
        paymentId,
        status,
      },
    } = this.props;

    return (
      <div className="PaymentDetailsModal__block PaymentDetailsModal__one-fifth">
        <div className="PaymentDetailsModal__block-title">
          {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_STATUS')}
        </div>
        <div className="PaymentDetailsModal__block-status">
          <PaymentStatus
            withdrawStatus={withdrawStatus}
            creationTime={creationTime}
            paymentId={paymentId}
            status={status}
          />
        </div>
      </div>
    );
  };

  renderAmountBlock = (isWithdraw) => {
    const { payment: { amount, currency } } = this.props;

    return (
      <div className="PaymentDetailsModal__block">
        <div className="PaymentDetailsModal__block-title PaymentDetailsModal__block-title--right">
          {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_AMOUNT')}
        </div>
        <div
          className={
            classNames('PaymentDetailsModal__block-amount', {
              'PaymentDetailsModal__block-amount--red': isWithdraw,
            })
          }
        >
          {isWithdraw && '-'}
          <Amount amount={amount} currency={currency} />
        </div>
      </div>
    );
  };

  renderPaymentMethodBlock = () => {
    const { payment: { paymentMethod } } = this.props;

    return (
      <div className="PaymentDetailsModal__block">
        <div className="PaymentDetailsModal__block-title">
          {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_PAYMENT_METHOD')}
        </div>
        <div className="PaymentDetailsModal__block-payment-status">
          <Choose>
            <When condition={paymentMethod}>
              {formatLabel(paymentMethod)}
            </When>
            <Otherwise>
              &mdash;
            </Otherwise>
          </Choose>
        </div>
      </div>
    );
  };

  render() {
    const {
      isOpen,
      profile,
      onSuccess,
      onCloseModal,
      payment: {
        status,
        paymentId,
        paymentType,
        withdrawStatus,
      },
      permission: {
        permissions: currentPermission,
      },
    } = this.props;

    const inPendingStatus = statusMapper.PENDING.includes(status);
    const isWithdraw = paymentType === tradingTypes.WITHDRAW;

    const canApprove = new Permissions(permissions.PAYMENT.APPROVE).check(currentPermission);
    const canReject = new Permissions(permissions.PAYMENT.REJECT).check(currentPermission);
    const canChangeStatus = new Permissions(permissions.PAYMENT.CHANGE_STATUS).check(currentPermission);
    const canChangeMethod = new Permissions(permissions.PAYMENT.CHANGE_METHOD).check(currentPermission);

    return (
      <Modal
        className="PaymentDetailsModal"
        toggle={onCloseModal}
        isOpen={isOpen}
      >
        <ModalHeader toggle={onCloseModal}>{I18n.t('PAYMENT_DETAILS_MODAL.TITLE')}</ModalHeader>

        <ModalBody>
          <Choose>
            <When condition={profile.loading}>
              <div className="PaymentDetailsModal__loader">
                <ShortLoader height={25} />
              </div>
            </When>
            <Otherwise>
              <div className="PaymentDetailsModal__row PaymentDetailsModal__row--with-underline">
                {this.renderProfileInfoBlock()}
                {this.renderChangeOriginalAgentBlock()}
                {this.renderProfileBalanceBlock()}
              </div>

              <div className="PaymentDetailsModal__row">
                {this.renderTransactionInfoBlock()}
                {this.renderDateAndTimeBlock()}
                {this.renderDeviceBlock()}
                {this.renderIPBlock()}
                {this.renderStatusBlock()}
              </div>

              <div className="PaymentDetailsModal__row PaymentDetailsModal__row--blue">
                {this.renderAmountBlock(isWithdraw)}
                {this.renderPaymentMethodBlock()}
              </div>

              <If condition={canChangeMethod && canChangeStatus && !inPendingStatus}>
                <div className="PaymentDetailsModal__row">
                  <ChangePaymentStatusForm
                    onSuccess={onSuccess}
                    paymentId={paymentId}
                    onCloseModal={onCloseModal}
                  />
                </div>
              </If>

              <If condition={(canApprove || canReject) && isWithdraw && inPendingStatus}>
                <div className="PaymentDetailsModal__row">
                  <If condition={canReject}>
                    <RejectPaymentForm
                      paymentId={paymentId}
                      onSuccess={this.onAcceptSuccess}
                    />
                  </If>

                  <If condition={canApprove}>
                    <ApprovePaymentForm
                      paymentId={paymentId}
                      withdrawStatus={withdrawStatus}
                      onSuccess={this.onAcceptSuccess}
                    />
                  </If>
                </div>
              </If>
            </Otherwise>
          </Choose>
        </ModalBody>

        <ModalFooter>
          <Button
            onClick={onCloseModal}
            common
          >
            {I18n.t('COMMON.DEFER')}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default compose(
  withPermission,
  withRequests({
    profile: getProfileQuery,
  }),
)(PaymentDetailsModal);
