import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import classNames from 'classnames';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import ChangeOriginalAgent from 'components/ChangeOriginalAgent/ChangeOriginalAgentTradingActivity';

class ChangeOriginalAgentModal extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    tradeId: PropTypes.number.isRequired,
    originalAgent: PropTypes.object,
    platformType: PropTypes.string,
    onCloseModal: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
  };

  static defaultProps = {
    className: '',
    originalAgent: null,
    platformType: '',
  };

  render() {
    const {
      className,
      tradeId,
      originalAgent,
      platformType,
      onCloseModal,
      onSuccess,
    } = this.props;

    return (
      <Modal
        isOpen
        toggle={onCloseModal}
        className={classNames(className)}
      >
        <ModalHeader toggle={onCloseModal}>
          {I18n.t('TRADING_ACTIVITY_MODAL.TITLE')}
        </ModalHeader>
        <ModalBody>
          <ChangeOriginalAgent
            tradeId={tradeId}
            originalAgent={originalAgent}
            platformType={platformType}
            onSuccess={onSuccess}
            onCloseModal={onCloseModal}
          />
        </ModalBody>
      </Modal>
    );
  }
}

export default ChangeOriginalAgentModal;
