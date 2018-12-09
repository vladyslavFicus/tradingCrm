import React, { PureComponent } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import moment from 'moment';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { compose, graphql } from 'react-apollo';
import { clientQuery } from '../../graphql/queries/profile';
import PropTypes from '../../constants/propTypes';
import {
  methodsLabels as paymentsMethodsLabels,
  types as paymentsTypes,
} from '../../constants/payment';
import Amount from '../Amount';
import { UncontrolledTooltip } from '../Reactstrap/Uncontrolled';
import Uuid from '../Uuid';
import ModalPlayerInfo from '../ModalPlayerInfo';
// TODO
// import TransactionStatus from '../TransactionStatus';
import ShortLoader from '../ShortLoader';
import renderLabel from '../../utils/renderLabel';
import IpFlag from '../IpFlag';

class PaymentDetailModal extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    onCloseModal: PropTypes.func.isRequired,
    payment: PropTypes.object.isRequired,
    playerProfile: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    className: '',
  };

  render() {
    const {
      payment: {
        paymentId,
        paymentType,
        paymentMethod,
        creationTime,
        country,
        clientIp,
        mobile,
        userAgent,
        amount,
        currency,
      },
      playerProfile: {
        loading,
        playerProfile,
      },
      onCloseModal,
      className,
    } = this.props;

    const isWithdraw = paymentType === paymentsTypes.Withdraw;
    const profile = get(playerProfile, 'data');

    return (
      <Modal isOpen toggle={onCloseModal} className={classNames(className, 'payment-detail-modal')}>
        <ModalHeader toggle={onCloseModal}>{I18n.t('PAYMENT_DETAILS_MODAL.TITLE')}</ModalHeader>

        <ModalBody>
          <Choose>
            <When condition={loading}>
              <ShortLoader height={25} />
            </When>
            <Otherwise>
              <ModalPlayerInfo playerProfile={profile} />
              <div className="modal-body-tabs">
                <div className="modal-body-tabs__item">
                  <div className="modal-tab-label">
                    {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_TRANSACTION')}
                  </div>
                  <div className="modal-header-tabs__label">
                    <Uuid uuid={paymentId} uuidPrefix="TA" />
                  </div>
                </div>
                <div className="modal-body-tabs__item">
                  <div className="modal-tab-label">
                    {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_DATE_TIME')}
                  </div>
                  <div className="modal-header-tabs__label">
                    {moment.utc(creationTime).local().format('DD.MM.YYYY')}
                  </div>
                  <div className="font-size-11">
                    {moment.utc(creationTime).local().format('HH:mm')}
                  </div>
                </div>
                <div className="modal-body-tabs__item">
                  <div className="modal-tab-label">
                    Ip
                  </div>
                  <IpFlag id={paymentId} country={country} ip={clientIp} />
                </div>
                <div className="modal-body-tabs__item">
                  <div className="modal-tab-label">
                    {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_DEVICE')}
                  </div>
                  <div className="margin-top-5">
                    <i
                      id={`payment-detail-${paymentId}-tooltip`}
                      className={`fa font-size-20 ${mobile ? 'fa-mobile' : 'fa-desktop'}`}
                    />
                    <UncontrolledTooltip
                      placement="bottom"
                      target={`payment-detail-${paymentId}-tooltip`}
                      delay={{
                        show: 350, hide: 250,
                      }}
                    >
                      {userAgent || 'User agent not defined'}
                    </UncontrolledTooltip>
                  </div>
                </div>
                <div className="modal-body-tabs__item">
                  <div className="modal-tab-label">
                    {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_STATUS')}
                  </div>
                  -- in development --
                  {/* <TransactionStatus transaction={payment} /> */}
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
                    {isWithdraw && '-'}
                    <Amount amount={amount} currency={currency} />
                  </div>
                </div>
                <div className="modal-footer-tabs__item">
                  <div className="modal-tab-label">
                    {I18n.t('PAYMENT_DETAILS_MODAL.HEADER_PAYMENT_METHOD')}
                  </div>
                  <div className="modal-footer-tabs__amount">
                    {paymentMethod ? renderLabel(paymentMethod, paymentsMethodsLabels) : 'Manual'}
                  </div>
                </div>
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
        </ModalFooter>
      </Modal>
    );
  }
}

export default compose(
  graphql(clientQuery, {
    options: ({
      profileId: playerUUID,
    }) => ({
      variables: {
        playerUUID,
      },
    }),
    name: 'playerProfile',
  })
)(PaymentDetailModal);
