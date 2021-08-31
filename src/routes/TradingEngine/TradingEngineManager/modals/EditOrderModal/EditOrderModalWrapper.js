import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import I18n from 'i18n-js';
import { Modal, ModalHeader } from 'reactstrap';
import { withNotifications, withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import EditOrderModal from './EditOrderModal';
import orderQuery from './graphql/OrderQuery';
import './EditOrderModal.scss';

class EditOrderModalWrapper extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    isOpen: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      confirmActionModal: PropTypes.modalType,
    }).isRequired,
  };

  render() {
    const {
      isOpen,
      onCloseModal,
      order: { data, loading },
      match: {
        params: {
          id: accountUuid,
        },
      },
    } = this.props;

    const {
      id,
      symbol,
      volumeLots,
      direction,
    } = data?.tradingEngineOrder || {};

    return (
      <Modal className="EditOrderModal" toggle={onCloseModal} isOpen={isOpen}>
        <ModalHeader toggle={onCloseModal}>
          {I18n.t('TRADING_ENGINE.MODALS.EDIT_ORDER_MODAL.TITLE', {
            id,
            direction,
            volumeLots,
            symbol,
          })}
        </ModalHeader>
        {!loading
        && <EditOrderModal order={data?.tradingEngineOrder || {}} accountUuid={accountUuid} />}
      </Modal>
    );
  }
}

export default compose(
  withRouter,
  withNotifications,
  withModals({
    confirmActionModal: ConfirmActionModal,
  }),
  withRequests({
    order: orderQuery,
  }),
)(EditOrderModalWrapper);
